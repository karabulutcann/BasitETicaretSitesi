import { db } from "@/db";
import { auth } from "../../../../auth";
import {  cartSchema } from "@/db/schema";
import { and, eq } from "drizzle-orm";
export interface DeleteFromCartData {
  cartId: string;
}

export const POST = auth(async (req) => {
  const session = req.auth;

  if (!session) {
    return new Response(JSON.stringify({ err: "unauthorized" }), {
      status: 401,
    });
  }

  try {
    const data: DeleteFromCartData = await req.json();

    await db.delete(cartSchema).where(and(eq(cartSchema.id, data.cartId), eq(cartSchema.userId, session.user?.id!)));

    return new Response("", {
      status: 200,
    });
    
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ err: "there was an error" }), {
      status: 500,
    });
  }
});
