import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { User } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends User {}
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Set usernameField to 'email' to match our schema
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }
          
          // Check password
          const isValid = await storage.comparePasswords(password, user.password);
          if (!isValid) {
            return done(null, false, { message: "Invalid email or password" });
          }
          
          // Check if user is authorized (not needed for admin users)
          if (user.role !== "admin" && !user.authorized) {
            return done(null, false, { message: "Your account is pending approval. Please contact an administrator." });
          }
  
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", async (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info.message || "Authentication failed" });
      }
      
      try {
        // Generate 2FA code
        const code = await storage.generateTwoFactorCode(user.email);
        
        // In a real app, we'd send the code via email here
        console.log(`2FA Code for ${user.email}: ${code}`);
        
        // Don't log the user in yet, wait for 2FA verification
        return res.status(200).json({ 
          message: "2FA code sent to your email",
          email: user.email,
          requiresTwoFactor: true
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  });

  app.post("/api/verify-2fa", async (req, res, next) => {
    const { email, code } = req.body;
    
    try {
      const isValid = await storage.verifyTwoFactorCode(email, code);
      
      if (!isValid) {
        return res.status(401).json({ message: "Invalid or expired verification code" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      // Log the user in
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(200).json(user);
      });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { email, password, name, role } = req.body;
      
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const user = await storage.createUser({
        email,
        password,
        name,
        role: role || "user", // Default to user role
      });
      
      // Don't include password in response
      const { password: _, ...userWithoutPassword } = user;
      
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/forgot-password", async (req, res) => {
    const { email } = req.body;
    
    try {
      const token = await storage.generateResetToken(email);
      
      if (!token) {
        // Don't reveal that the user doesn't exist
        return res.status(200).json({ message: "If your email is registered, you will receive a password reset link" });
      }
      
      // In a real app, we'd send the reset link via email here
      console.log(`Password reset token for ${email}: ${token}`);
      
      return res.status(200).json({ message: "If your email is registered, you will receive a password reset link" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to process request" });
    }
  });

  app.post("/api/reset-password", async (req, res) => {
    const { token, password } = req.body;
    
    try {
      const user = await storage.verifyResetToken(token);
      
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      
      await storage.changePassword(user.id, password);
      
      return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to reset password" });
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...user } = req.user as User;
    res.json(user);
  });
}
