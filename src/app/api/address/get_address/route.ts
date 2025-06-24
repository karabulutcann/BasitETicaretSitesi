import { db } from "@/db";
import { auth } from "../../../../auth";
import { addressSchema } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";

export const GET = auth(async (req) => {
  const session = req.auth;

  if (!session) {
    return new Response(JSON.stringify({ err: "unauthorized" }), {
      status: 401,
    });
  }

  try {
    return new Response(
      JSON.stringify(
        await db.query.addressSchema.findMany({
          where: and(eq(addressSchema.userId, session.user?.id!)),
        }),
      ),
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ err: "there was an error" }), {
      status: 500,
    });
  }
});
