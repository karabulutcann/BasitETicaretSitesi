import { db } from "@/db";
import { paymentSchema } from "@/db/schema";
import finish_payment from "@/lib/finish_payment";
import {
  iyzicoRetrievePayment,
  IyzicoRetrievePaymentResponse,
} from "@/lib/iyzico";
import { createHash, randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

interface IyzicoWebhookRequest {
  iyziPaymentId: number;
  iyziEventTime: number;
  iyziEventType: string;
  iyziReferenceCode: string;
  token: string;
  paymentConversationId: string;
  merchantId: number;
  status: string;
}

export async function POST(req: Request) {
  const headerList = headers();
  const data: IyzicoWebhookRequest = await req.json();
  const shasum = createHash("sha1");
  shasum.update(
    process.env.IYZICO_SECRET_KEY + data.iyziEventType + data.token,
  );
  // if (headerList.get("X-IYZ-SIGNATURE") !== shasum.digest("base64")) {
  //   return new Response(JSON.stringify({ err: "unauthorized" }), {
  //     status: 401,
  //   });
  // }
  try {
    const retrieveResponse = await iyzicoRetrievePayment({
      locale: "tr",
      conversationId: randomBytes(8).toString("hex"),
      token: data.token,
    });

    if (!retrieveResponse.ok) {
      return new Response(JSON.stringify({}), {
        status: 500,
      });
    }

    const retrieveData: IyzicoRetrievePaymentResponse =
      await retrieveResponse.json();
      
    const paymentData = await db
      .delete(paymentSchema)
      .where(eq(paymentSchema.token, data.token))
      .returning();
   
    if (retrieveData.paymentStatus !== "SUCCESS") {
      return new Response(JSON.stringify({}), {
        status: 200,
      });
    }
   
    if (paymentData.length === 0) {
      return new Response(JSON.stringify({}), {
        status: 400,
      });
    }

    if (paymentData[0].isSuccess) {
      return new Response(JSON.stringify({}), {
        status: 200,
      });
    }

    await finish_payment(paymentData[0],retrieveData.lastFourDigits,retrieveData.cardAssociation);

    await db
      .update(paymentSchema)
      .set({ isSuccess: true })
      .where(eq(paymentSchema.token, data.token));

  } catch (err) {

    console.error(err);
    return new Response(JSON.stringify({}), {
      status: 500,
    });

  }

  return new Response(JSON.stringify({}), {
    status: 200,
  });
}
