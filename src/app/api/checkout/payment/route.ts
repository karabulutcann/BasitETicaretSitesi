import { db } from "@/db";
import { auth } from "@/auth";
import { and, eq } from "drizzle-orm";

import {
  addressSchema,
  emailVerificationSchema,
  paymentSchema,
} from "@/db/schema";
import { array, number, object, string } from "zod";

import { checkStockAuth, checkStockUnAuth } from "@/lib/check_stock";
import {
  iyzicoStartPayment,
  IyzicoBasketItem,
  IyzicoCheckoutFormResponse,
} from "@/lib/iyzico";
import { baseUrl } from "@/local.env";
import { createId } from "@paralleldrive/cuid2";
import { CargoType } from "@/types";
import { randomBytes } from "crypto";

export interface PaymentRequestAuth {
  phone: string;
  addressId: string | undefined;
  delivery: string;
}

export interface PaymentRequestUnAuth {
  cartItems: {
    productId: string;
    productCount: number;
    size: string;
  }[];
  email: string;
  emailVerifyCode: string;
  name: string;
  surname: string;
  address: string;
  city: string;
  district: string;
  delivery: "yurtici" | "mng";
  phone: string;
  paymentMethod: "creditCard" | "cash";
}

const checkoutUnAuthSchema = object({
  phone: string({ required_error: "Phone is required" }),
  address: string({ required_error: "Address is required" }),
  city: string({ required_error: "City is required" }),
  district: string({ required_error: "District is required" }),
  delivery: string({ required_error: "Delivery is required" }),
  email: string({ required_error: "Email is required" }).email("Invalid email"),
  name: string({ required_error: "Name is required" }),
  surname: string({ required_error: "Surname is required" }),
  emailVerifyCode: string({ required_error: "Email verify code is required" }),
  cartItems: array(
    object({
      productId: string(),
      productCount: number({ required_error: "Product count is required" }),
      size: string({ required_error: "Size is required" }),
    }),
  ),
});

export interface NotInStockResponseAuth {
  code: number;
  data: {
    cartId: string;
    stock: number;
  }[];
}

export interface NotInStockResponseUnAuth {
  code: number;
  data: {
    productId: string;
    productCount: number;
    size: string;
    stock: number;
    err: string | undefined;
  }[];
}

export interface OrderItemPayment {
  productCount: number;
  size: string;
  productId: string;
  productSizeId: number;
  unitPrice: string;
}

export interface OrderPaymentData {
  orderItems: OrderItemPayment[];
  totalPrice: number;
  cargoType: CargoType;
}
export interface UserPaymentData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  isGuest: boolean;
  address: string;
  city: string;
  district: string;
  userId: string;
  addressId: string;
}
export interface PaymentData {
  token: string;
  userData: UserPaymentData;
  orderData: OrderPaymentData;
}

export const POST = auth(async (req) => {
  const session = req.auth;
  try {
    if (!session) {
      const result = checkoutUnAuthSchema.safeParse(await req.json());

      if (!result.success) {
        console.log(result.error.errors);
        return new Response(JSON.stringify({ errs: result.error.errors }), {
          status: 400,
        });
      }

      const data = result.data;

      const verifyEmail = await db.query.emailVerificationSchema.findFirst({
        where: and(
          eq(emailVerificationSchema.email, data.email),
          eq(emailVerificationSchema.verifyCode, data.emailVerifyCode),
        ),
      });

      if (!verifyEmail) {
        return new Response(
          JSON.stringify({ err: "Geçersiz doğrulama kodu" }),
          {
            status: 401,
          },
        );
      }

      if (
        new Date().getTime() - new Date(verifyEmail.createdAt).getTime() >
        15 * 60 * 1000
      ) {
        return Response.json(
          { err: "Geçerlilik süresi doldu.", code: 0 },
          { status: 403 },
        );
      }

      await db
        .delete(emailVerificationSchema)
        .where(eq(emailVerificationSchema.id, verifyEmail.id));

      let basketItems: IyzicoBasketItem[] = [];
      let orderItems: OrderItemPayment[] = [];

      let notInStocks: {
        productId: string | null;
        productCount: number;
        size: string;
        stock: number;
        err: string | undefined;
      }[] = [];

      const totalPrice = await checkStockUnAuth(
        data.cartItems,
        notInStocks,
        basketItems,
        orderItems,
      );

      if (notInStocks.length > 0) {
        return new Response(
          JSON.stringify({ code: 255, data: [...notInStocks] }),
          {
            status: 255,
          },
        );
      }
      const generatedUserId = createId();
      console.log(totalPrice);
      const iyzicoResult = await iyzicoStartPayment({
        locale: "tr",
        conversationId: randomBytes(8).toString("hex"),
        price: totalPrice.toString(),
        paidPrice: totalPrice.toString(),
        currency: "TRY",
        basketId: "B67832",
        paymentGroup: "PRODUCT",
        basketItems: basketItems,
        enabledInstallments: [2, 4],
        buyer: {
          id: generatedUserId,
          name: data.name,
          surname: data.surname,
          identityNumber: "12345678910",
          email: data.email,
          gsmNumber: data.phone,
          city: data.city,
          country: "Turkey",
          ip: "237.84.2.178",
          registrationAddress: "adres",
        },
        billingAddress: {
          contactName: data.name + " " + data.surname,
          city: data.city,
          country: "Turkey",
          address: data.address + " " + data.district,
        },
        shippingAddress: {
          contactName: data.name + " " + data.surname,
          city: data.city,
          country: "Turkey",
          address: data.address + " " + data.district,
        },
        callbackUrl: baseUrl + "/api/checkout",
        paymentSource: "WEB",
      });
      if (!iyzicoResult) {
        return new Response(
          JSON.stringify({
            code: 500,
            err: "iyzicoya istek gönderirken hata oluştu",
          }),
          {
            status: 500,
          },
        );
      }
      const iyzicoData: IyzicoCheckoutFormResponse = await iyzicoResult.json();

      console.log(iyzicoData);

      if (iyzicoData.status !== "success") {
        return new Response(JSON.stringify({ code: 501, err: "iyzico hata" }), {
          status: 501,
        });
      }

      await db.insert(paymentSchema).values({
        token: iyzicoData.token,
        userData: JSON.stringify({
          name: data.name,
          surname: data.surname,
          email: data.email,
          phone: data.phone,
          isGuest: true,
          address: data.address,
          district: data.district,
          city: data.city,
          userId: generatedUserId,
        }),
        orderData: JSON.stringify({
          orderItems: orderItems,
          cargoType: "mng",
          totalPrice: totalPrice,
        }),
      });

      return new Response(
        JSON.stringify({
          code: 200,
          checkoutFormContent: iyzicoData.checkoutFormContent,
        }),
        { status: 200 },
      );
    } else {
      const data: PaymentRequestAuth = await req.json();

      let notInStocks: {
        cartId: string;
        stock: number;
      }[] = [];

      let [basketItems, totalPrice] = await checkStockAuth(
        notInStocks,
        session.user?.id!,
      );
      if (notInStocks.length > 0) {
        return new Response(
          JSON.stringify({ code: 255, data: [...notInStocks] }),
          {
            status: 255,
          },
        );
      }

      const addressWithUser = await db.query.addressSchema.findFirst({
        where: and(
          eq(addressSchema.userId, session.user?.id!),
          eq(addressSchema.id, data.addressId!),
        ),
        with: {
          user: true,
        },
      });

      const iyzicoResult = await iyzicoStartPayment({
        locale: "tr",
        conversationId: randomBytes(8).toString("hex"),
        price: totalPrice.toString(),
        paidPrice: totalPrice.toString(),
        currency: "TRY",
        basketId: "B67832",
        paymentGroup: "PRODUCT",
        basketItems: basketItems,
        enabledInstallments: [1,2, 4],
        buyer: {
          id: session.user?.id!,
          name: addressWithUser?.user.name!.split(" ")[0]!,
          surname: addressWithUser?.user.name!.split(" ")[1]!,
          identityNumber: "12345678910",
          email: session.user?.email!,
          gsmNumber: data.phone,
          city: addressWithUser?.city!,
          country: "Turkey",
          ip: "237.84.2.178",
          registrationAddress: "adres",
        },
        billingAddress: {
          contactName: addressWithUser?.user.name!,
          city: addressWithUser?.city!,
          country: "Turkey",
          address: addressWithUser?.address + " " + addressWithUser?.district,
        },
        shippingAddress: {
          contactName: addressWithUser?.user.name!,
          city: addressWithUser?.city!,
          country: "Turkey",
          address: addressWithUser?.address + " " + addressWithUser?.district,
        },
        callbackUrl: baseUrl + "/api/checkout",
        paymentSource: "WEB",
      });
      if (!iyzicoResult) {
        return new Response(
          JSON.stringify({
            code: 500,
            err: "iyzicoya istek gönderirken hata oluştu",
          }),
          {
            status: 500,
          },
        );
      }
      const iyzicoData: IyzicoCheckoutFormResponse = await iyzicoResult.json();
      console.log(iyzicoData);
      if (iyzicoData.status !== "success") {
        
        return new Response(JSON.stringify({ code: 501, err: "iyzico hata" }), {
          status: 501,
        });
      }

      await db.insert(paymentSchema).values({
        token: iyzicoData.token,
        userData: JSON.stringify({
          phone: data.phone,
          userId: session.user?.id,
          addressId: data.addressId,
          isGuest:false,
        } as UserPaymentData),
        orderData: JSON.stringify({
          orderItems: [],
          cargoType: "mng",
          totalPrice: totalPrice,
        }),
      });

      return new Response(
        JSON.stringify({
          code: 200,
          checkoutFormContent: iyzicoData.checkoutFormContent,
        }),
        { status: 200 },
      );
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ err: "there was an error" }), {
      status: 500,
    });
  }
});
