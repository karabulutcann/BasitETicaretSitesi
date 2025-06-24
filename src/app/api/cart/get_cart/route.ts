import { auth } from "../../../../auth";
import { db } from "@/db";
import { cartSchema } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GET = auth(async (req) => {
  const session = req.auth;

  if (!session) {
    console.log("response in get cart unauth");
    return new Response(JSON.stringify({ err: "unauthorized",code: 401 }), {
      status: 401,
    });
  }
  try {
    const cart = await db.query.cartSchema.findMany({
      where: eq(cartSchema.userId, session.user?.id!),
      with: {
        product: true,
      },
    });
    return new Response(JSON.stringify(cart), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ err: "there was an error",code: 500 }), {
      status: 500,
    });
  }
});
