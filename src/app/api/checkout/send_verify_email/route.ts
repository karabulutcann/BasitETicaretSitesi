import { sendVerifyEmail } from "@/email/send_verify_email";
import { db } from "@/db";
import { emailVerificationSchema } from "@/db/schema";
import { randomInt } from "crypto";

export interface CheckoutVerifyEmailRequest {
  email: string;
  name: string;
  surname: string;
}

export async function POST(req: Request) {
  try {
    const data: CheckoutVerifyEmailRequest = await req.json();

    if (!data.email || !data.name || !data.surname) {
      return new Response(
        JSON.stringify({ errs: "Gerekli alanları doldurun." }),
        { status: 400 },
      );
    }

    const verifyData = await db
      .insert(emailVerificationSchema)
      .values({
        email: data.email,
        name: data.name + " " + data.surname,
        password: "",
      })
      .onConflictDoUpdate({
        target: emailVerificationSchema.email,
        set: {
          password: "",
          name: "",
          verifyCode: randomInt(100000, 1000000).toString(),
          createdAt: new Date(),
        },
      })
      .returning();

    sendVerifyEmail(
      verifyData[0].verifyCode,
      data.name + " " + data.surname,
      data.email,
    );
    return Response.json({}, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json(
      { err: "Beklenmedik bir hata oluştu.", code: 0 },
      { status: 500 },
    );
  }
}
