import { db } from "@/db";
import { eq } from "drizzle-orm";
import { paymentSchema } from "@/db/schema";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import {
  iyzicoRetrievePayment,
  IyzicoRetrievePaymentResponse,
} from "@/lib/iyzico";
import finish_payment from "@/lib/finish_payment";

export async function POST(req: Request) {
  const result = await req.text();
  const data = result.split("=");

  if (
    result === undefined ||
    data.length !== 2 ||
    data[0] !== "token" ||
    data[1] === ""
  ) {
    return new Response(
      JSON.stringify({}),
      {
        status: 400,
      },
    );
  }

  const retrieveResponse = await iyzicoRetrievePayment({
    locale: "tr",
    conversationId: randomBytes(8).toString("hex"),
    token: data[1],
  });

  if (!retrieveResponse.ok) {
    return new Response(JSON.stringify({ errs: "iyzico sunucu hatası" }), {
      status: 500,
    });
  }

  const retrieveData: IyzicoRetrievePaymentResponse =
    await retrieveResponse.json();

  console.log(retrieveData);

  if (retrieveData.paymentStatus !== "SUCCESS") {
    redirect("/checkout/detail/failure?err="+retrieveData.errorCode);
  }

  const paymentData = await db.query.paymentSchema.findFirst({
    where: eq(paymentSchema.token, data[1]),
  });

  if (!paymentData) {
    return new Response(JSON.stringify({ errs: "Geçersiz token." }), {
      status: 400,
    });
  }

  if (paymentData?.isSuccess) {
    return new Response(JSON.stringify({}), {
      status: 200,
    });
  }

  var orderNumber: string = "";
  var email: string = "";

  try {
    const finishPaymentResponse = await finish_payment(paymentData,retrieveData.lastFourDigits,retrieveData.cardAssociation);

    orderNumber = finishPaymentResponse.orderNumber;
    email = finishPaymentResponse.email;

    await db
      .update(paymentSchema)
      .set({ isSuccess: true })
      .where(eq(paymentSchema.token, data[1]));

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ err: "there was an error" }), {
      status: 500,
    });
  }
  redirect(`/checkout/detail/success?orderNumber=${orderNumber}&email=${email}`);
}
