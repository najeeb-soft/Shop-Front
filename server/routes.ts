import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up auth first
  await setupAuth(app);
  registerAuthRoutes(app);

  // Seed products
  await storage.seedProducts();

  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  app.post(api.orders.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub; // From Replit Auth
      const order = await storage.createOrder(userId, input.items);
      res.status(201).json(order);
    } catch (error) {
       if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.orders.list.path, isAuthenticated, async (req, res) => {
    const userId = (req.user as any).claims.sub;
    const orders = await storage.getOrders(userId);
    res.json(orders);
  });

  return httpServer;
}
