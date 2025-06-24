import { Cart } from "@/types/cart";
import { auth } from "../../../../auth";
import { db } from "@/db";
import {  cartSchema,  productSizeSchema } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { currentStock } from "@/lib/current_stock";

export interface AddToCartRequest {
  productId: string;
  productSize: string;
}
export interface AddToCartResponse{
  cartItem: Cart ;
  hasOldCart: boolean;
}

export const POST = auth(async (req) => {
  try {
    const session = req.auth

  if (!session) {
    return new Response(JSON.stringify({ err: "unauthorized" }), {
      status: 401,
    });
  }

  const data: AddToCartRequest = await req.json();

  console.log(data);
  if (data.productSize === "") {
    return new Response(JSON.stringify({ err: "size is not selected" }), {
      status: 400,
    });
  }

  let prevCard = await db.query.cartSchema.findFirst({
    where: and(
      eq(cartSchema.userId, session.user?.id!),
      eq(cartSchema.size, data.productSize),
      eq(cartSchema.productId, data.productId)),
    with: {
      product: {
        with: {
          productSize: {
            where: eq(productSizeSchema.size, data.productSize)
          }
        }
      }
    }
  })

  let cartItem : Cart | undefined = undefined ;
  let isMaxStock = false;

  if (prevCard === undefined) {

    const product = await currentStock(data.productId, data.productSize);
    const stock = product?.productSize[0]?.stock!;
    if ( stock === 0) {
      return new Response(JSON.stringify({ err: "not in stock" }), {
        status: 246,
      });
    }

    let tempItem = await db.insert(cartSchema).values({
      size: data.productSize,
      productCount: 1,
      productId: data.productId,
      userId: session.user?.id!,
    }).onConflictDoNothing().returning();

    cartItem = {
      id: tempItem[0].id,
      size: tempItem[0].size,
      productCount: tempItem[0].productCount,
      isMaxStock: false,
      product: product,
      error: undefined,
      errorData: undefined
    }

  } else {

    const stock = prevCard.product?.productSize[0]?.stock!;

    prevCard.productCount = prevCard.productCount! + 1

    if (stock === 0) {
      await db.delete(cartSchema).where(and(eq(cartSchema.id, prevCard.id), eq(cartSchema.userId, session.user?.id!)));
      return new Response(JSON.stringify({ err: "not in stock" }), {
        status: 246,
      });
    } else if (stock < prevCard.productCount) {
      isMaxStock = true;
      prevCard.productCount = stock;
    }

    await db.update(cartSchema).set({
      productCount: prevCard.productCount,
    }).where(
      eq(cartSchema.id, prevCard.id))

    cartItem = {
      id: prevCard.id,
      size: prevCard.size,
      productCount: prevCard.productCount,
      isMaxStock: isMaxStock,	
      product: prevCard.product,
      error: undefined,
      errorData: undefined
    }
  }

  if (isMaxStock) {
    return new Response(JSON.stringify({ err: "cant add more" }), {
      status:245
    })
  }

  return new Response(JSON.stringify({ cartItem ,hasOldCart: !!prevCard} as AddToCartResponse), {
    status: 200,
  });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ err: "something went wrong" }), {
      status: 500,
    });
  }
})
