import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./graphql";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Setup authentication routes
  setupAuth(app);

  // Setup GraphQL server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  app.use(
    "/api/graphql",
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({
        user: req.user,
        storage,
        isAuthenticated: req.isAuthenticated(),
      }),
    })
  );

  // User management APIs
  app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // @ts-ignore - we know user exists if isAuthenticated()
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const users = await storage.getAllUsers();
      // Don't send password to client
      const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // @ts-ignore - we know user exists if isAuthenticated()
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const newUser = await storage.createUser(req.body);
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // @ts-ignore - we know user exists if isAuthenticated()
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const userId = parseInt(req.params.id);
    
    try {
      const updatedUser = await storage.updateUser(userId, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  
  // Endpoint específico para alternar a autorização de um usuário
  app.patch("/api/users/:id/authorize", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // @ts-ignore - we know user exists if isAuthenticated()
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const userId = parseInt(req.params.id);
    const { authorized } = req.body;
    
    if (typeof authorized !== 'boolean') {
      return res.status(400).json({ message: "Invalid request body" });
    }
    
    try {
      const updatedUser = await storage.updateUser(userId, { authorized });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // @ts-ignore - we know user exists if isAuthenticated()
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const userId = parseInt(req.params.id);
    
    try {
      await storage.deleteUser(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  return httpServer;
}
