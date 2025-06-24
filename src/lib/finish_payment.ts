import {
  OrderPaymentData,
  UserPaymentData,
} from "@/app/api/checkout/payment/route";
import { db } from "@/db";
import {
  addressSchema,
  cartSchema,
  orderDetailSchema,
  orderSchema,
  paymentSchemaType,
  productSizeSchema,
  userSchema,
} from "@/db/schema";
import { cargoPrice } from "@/local.env";
import { createId } from "@paralleldrive/cuid2";
import { randomBytes } from "crypto";
import { eq, sql } from "drizzle-orm";

export default async function finish_payment(
  paymentData: paymentSchemaType,
  cartLastDigits: string,
  cartType: string,
):Promise<{email:string,orderNumber:string}> {

  let orderNumber: string = "";
  let email: string = "";

  const userData = paymentData.userData as UserPaymentData;

  const orderData = paymentData.orderData as OrderPaymentData;

  if (userData.isGuest) {
    email = userData.email;
    const guestUser = await db
      .insert(userSchema)
      .values({
        id: userData.userId,
        name: userData.name.trim() + " " + userData.name.trim(),
        email: userData.email.trim()!,
        phone: userData.phone.trim(),
        password: createId(),
        isGuest: true,
      })
      .onConflictDoUpdate({
        target: userSchema.email,
        set: {
          name: userData.name.trim() + " " + userData.surname?.trim(),
          phone: userData.phone.trim(),
        },
      })
      .returning();

    const guestAddress = await db
      .insert(addressSchema)
      .values({
        addressName: "Adres-" + randomBytes(2).toString("hex"),
        addressType: "home",
        city: userData.city.trim(),
        district: userData.district.trim(),
        address: userData.address.trim(),
        userId: guestUser[0].id,
      })
      .returning();

    const order = await db
      .insert(orderSchema)
      .values({
        userId: guestUser[0].id,
        addressId: guestAddress[0].id,
        status: "hazırlanıyor",
        cargoPrice: cargoPrice.toString(),
        //TODO : düzelt
        cargoType: "mng",
        cardLastNumbers: cartLastDigits,
        cardType: cartType,
        billUrl: "",
        totalPrice: orderData.totalPrice.toString(),
        email: userData.email.trim()!,
      })
      .returning();

    orderNumber = order[0].orderNumber;

    await db.insert(orderDetailSchema).values(
      orderData.orderItems.map((item) => ({
        orderId: order[0].id,
        productId: item.productId,
        productCount: item.productCount,
        size: item.size,
      })),
    );

    orderData.orderItems.map(async (item) => {
      await db
        .update(productSizeSchema)
        .set({
          stock: sql`${productSizeSchema.stock} - ${item.productCount}`,
        })
        .where(eq(productSizeSchema.id, item.productSizeId));
    });
  } else {
    const user = await db
      .update(userSchema)
      .set({
        phone: userData.phone.trim(),
      })
      .where(eq(userSchema.id, userData.userId))
      .returning();

    email = user[0].email!;

    const order = await db
      .insert(orderSchema)
      .values({
        userId: userData.userId,
        status: "hazırlanıyor",
        totalPrice: orderData.totalPrice.toString(),
        cargoPrice: cargoPrice.toString(),
        cargoType: "mng",
        billUrl: "",
        cardLastNumbers: cartLastDigits,
        cardType: cartType,
        addressId: userData.addressId,
        email: user[0].email!,
      })
      .returning();
    orderNumber = order[0].orderNumber;

    const cart = await db
      .delete(cartSchema)
      .where(eq(cartSchema.userId, user[0].id))
      .returning();

    await db.insert(orderDetailSchema).values(
      cart.map((item) => ({
        orderId: order[0].id,
        productId: item.productId,
        productCount: item.productCount,
        size: item.size,
      })),
    );

    orderData.orderItems.map(async (item) => {
      await db
        .update(productSizeSchema)
        .set({
          stock: sql`${productSizeSchema.stock} - ${item.productCount}`,
        })
        .where(eq(productSizeSchema.id, item.productSizeId));
    });
  }
  
  return {
    email,
    orderNumber
  }
}
