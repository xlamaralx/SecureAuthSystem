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
      
      // Check if user is authorized (unless they're an admin)
      if (user.role !== "admin" && !user.authorized) {
        return res.status(403).json({ 
          message: "Your account is pending approval. Please contact an administrator.",
          notAuthorized: true
        });
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
  
  // API para listar todos os usuários (apenas para admins)
  app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });
    
    try {
      const users = await storage.getAllUsers();
      // Remove as senhas antes de enviar
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  // API para atualizar um usuário
  app.put("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const userId = parseInt(req.params.id);
    
    // Apenas admins podem editar outros usuários
    if (req.user.role !== "admin" && req.user.id !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    try {
      // Se não for admin, remova campos sensíveis que o usuário não deve alterar
      let dataToUpdate = req.body;
      if (req.user.role !== "admin") {
        const { role, authorized, ...safeData } = dataToUpdate;
        dataToUpdate = safeData;
      }
      
      const updatedUser = await storage.updateUser(userId, dataToUpdate);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove senha antes de enviar
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  // API para excluir um usuário (apenas para admins)
  app.delete("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });
    
    const userId = parseInt(req.params.id);
    
    // Não permitir que um admin exclua a si mesmo
    if (req.user.id === userId) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }
    
    try {
      await storage.deleteUser(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  
  // API para criar um usuário (apenas para admins)
  app.post("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });
    
    try {
      const existingUser = await storage.getUserByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const user = await storage.createUser(req.body);
      
      // Remove senha antes de enviar
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });
}
