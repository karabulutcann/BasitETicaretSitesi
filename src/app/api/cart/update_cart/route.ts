import { NextRequest } from "next/server";
import { auth } from "../../../../auth";
import { AddToCartRequest } from "../add_to_cart/route";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { cartSchema } from "@/db/schema";

export interface UpdateCartData {
  cartId: string;
  productId: string;
  size: string;
  countToAdd: number;
}

export const POST = auth(async (req) => {
  const session = req.auth;

  if (!session) {
    return new Response(JSON.stringify({ err: "unauthorized" }), {
      status: 401,
    });
  }

  try {
    const data: UpdateCartData = await req.json();


    const prevCard = await db.query.cartSchema.findFirst({
      where: and(eq(cartSchema.userId, session.user?.id!), eq(cartSchema.id, data.cartId)),
      with: {
        product: {
          with: {
            productSize: {
              where: eq(cartSchema.size, data.size),
            },
          },
        },
      },
    })

    if (prevCard === undefined) {
      return new Response(JSON.stringify({ err: "Cart not found" ,code: 400}), {
        status: 400,
      });
    }

    let countToUpdate = prevCard?.productCount! + data.countToAdd;

    if (countToUpdate === 0) {
      
      await db.delete(cartSchema).where(and(eq(cartSchema.id, data.cartId), eq(cartSchema.userId, session.user?.id!)));
    
      return new Response(JSON.stringify({code: 200}), {
        status: 200,
      });

    } else {
      const currentStock = prevCard.product?.productSize[0].stock!

      if (currentStock === 0) {
        await db.delete(cartSchema).where(and(eq(cartSchema.id, data.cartId), eq(cartSchema.userId, session.user?.id!)));
        return new Response(JSON.stringify({ err: "not in stock" ,code: 246}), {
          status: 246,
        });
      }

      if (currentStock < countToUpdate) {
       return new Response(JSON.stringify({code:245,stock:currentStock}), {
         status: 245,
       })
      }

      await db.update(cartSchema).set({
        productCount: countToUpdate,
      }).where(eq(cartSchema.id, data.cartId));

      return new Response(JSON.stringify(countToUpdate), {
        status: 200,
      });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ err: "there was an error" }), {
      status: 500,
    });
  }
});
