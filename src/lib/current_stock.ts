import { db } from "@/db";
import {  productSizeSchema, productSchema } from "@/db/schema";
import { and, eq } from "drizzle-orm";


export async function currentStock(productId: string, size: string) {
    try {
      const product = await db.query.productSchema.findFirst({
        where: and(eq(productSchema.id, productId)), 
        with:{
          productSize: {
            where: eq(productSizeSchema.size, size)
          }
        }
      });
  
      if (!product) {
        throw new Error("Product not found", { cause: 1 });
      }
      return product;
    } catch (error) {
      throw error;
    }
  }