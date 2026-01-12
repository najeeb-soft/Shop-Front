import { products, orders, orderItems, type Product, type Order, type OrderItem } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { authStorage } from "./replit_integrations/auth/storage";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createOrder(userId: string, items: { productId: number; quantity: number }[]): Promise<Order>;
  getOrders(userId: string): Promise<Order[]>;
  seedProducts(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createOrder(userId: string, items: { productId: number; quantity: number }[]): Promise<Order> {
    // simple transaction logic
    let total = 0;
    const productMap = new Map<number, Product>();
    
    // Fetch products to get prices
    for (const item of items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        productMap.set(item.productId, product);
        total += Number(product.price) * item.quantity;
      }
    }

    const [order] = await db.insert(orders).values({
      userId,
      total: total.toFixed(2),
      status: "completed", // Auto-complete for now
    }).returning();

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (product) {
        await db.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }
    }

    return order;
  }

  async getOrders(userId: string): Promise<Order[]> {
    return await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      with: {
        items: {
          with: {
            product: true
          }
        }
      },
      orderBy: [desc(orders.createdAt)]
    });
  }

  async seedProducts(): Promise<void> {
    const existing = await this.getProducts();
    if (existing.length === 0) {
      await db.insert(products).values([
        { 
          name: "Wireless Headphones", 
          description: "Premium noise cancelling headphones", 
          price: "199.99",
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
        },
        { 
          name: "Smart Watch", 
          description: "Fitness tracker and smart notifications", 
          price: "149.99",
          imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
        },
        { 
          name: "Mechanical Keyboard", 
          description: "Clicky mechanical keyboard for typing", 
          price: "89.99",
          imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=800&q=80"
        },
        { 
          name: "Laptop Stand", 
          description: "Ergonomic aluminum laptop stand", 
          price: "49.99",
          imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80"
        }
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
