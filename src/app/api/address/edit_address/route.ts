import { db } from "@/db";
import { auth } from "../../../../auth";
import {   addressSchema, addressTypeEnumType } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export interface EditAddressData {
    id: string;
    addressName: string;
    addressType: addressTypeEnumType;
    city: string;
    district: string;
    address: string;
}


export const POST = auth(async (req) => {
  const session = req.auth;

  if (!session) {
    console.log("response in update cart unauth");
    return new Response(JSON.stringify({ err: "unauthorized" }), {
      status: 401,
    });
  }

  try {
    const data: EditAddressData = await req.json();

   const address =  await db.update(addressSchema).set({
      addressName: data.addressName,
      addressType: data.addressType,
      city: data.city,
      district: data.district,
      address: data.address,
    }).where(and(eq(addressSchema.id, data.id), eq(addressSchema.userId, session.user?.id!))).returning();

    return new Response(JSON.stringify(address[0]), {
      status: 200,
    });
    
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ err: "there was an error" }), {
      status: 500,
    });
  }
});
