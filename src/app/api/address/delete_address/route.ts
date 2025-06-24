import { db } from "@/db";
import { auth } from "../../../../auth";
import {  addressSchema } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from 'next/navigation'

export interface DeleteAddressData {
  addressId: number;
}

export const POST = auth(async (req) => {
  const session = req.auth;

  if (!session) {
    return new Response(JSON.stringify({ err: "unauthorized" }), {
      status: 401,
    });
  }

  try {
    const formData = await req.formData();
    
    await db
      .delete(addressSchema)
      .where(
        and(
          eq(addressSchema.userId, session.user?.id!),
          eq(addressSchema.id, formData.get("addressId")?.valueOf()! as string),
        ),
      );
      
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ err: "there was an error" }), {
      status: 500,
    });
  }finally{
    redirect("/user/addresses");
  }
});
