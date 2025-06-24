import { Cart } from "@/types/cart";
import { auth } from "../../../../auth";
import { db } from "@/db";
import {  cartSchema,  productSizeSchema, productSchema } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { currentStock } from "@/lib/current_stock";
import { Product } from "@/types/product";

export interface HaveStockRequest {
  productId: string;
  size: string;
}
export interface HaveStockResponse {
  stock: number
product:Product
}


export async function POST(req : Request) {
  try {
    
  const data: HaveStockRequest = await req.json();
  
  let productSize = await db.query.productSizeSchema.findFirst({
    where: and(eq(productSizeSchema.productId, data.productId), eq(productSizeSchema.size, data.size)),
    with: {
      product:true
    }
  })
  if(!productSize){
    return new Response(JSON.stringify({ err: "product not found" }), {
      status: 500,
    });
  }
  return new Response(JSON.stringify({ stock:productSize!.stock,product:productSize!.product} as HaveStockResponse), {
    status: 200,
  });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ err: "something went wrong" }), {
      status: 500,
    });
  }
  
}
