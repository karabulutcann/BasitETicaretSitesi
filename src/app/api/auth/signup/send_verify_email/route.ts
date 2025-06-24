import { sendVerifyEmail } from "@/email/send_verify_email";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { emailVerificationSchema } from "@/db/schema";
import { hashPassword } from "@/lib/crypt_password";
import { randomInt } from "crypto";

export async function POST(req: Request) {
  try {
    const userDataToken = cookies().get("userDataToken")?.value;

    if (!userDataToken) {
      return Response.json(
        { err: "Geçersiz token.", code: 0 },
        { status: 400 },
      );
    }
    
    const userData = jwt.verify(userDataToken, process.env.JWT_SECRET!) as {
      email: string;
      name: string;
      surname: string;
      password: string;
      verifyEmailId: string;
    };

    const verifyData = await db
      .update(emailVerificationSchema)
      .set({
        verifyCode: randomInt(100000, 1000000).toString(),
        createdAt: new Date(),
      })
      .where(
        and(
          eq(emailVerificationSchema.id, userData.verifyEmailId),
          eq(emailVerificationSchema.email, userData.email),
        ),
      )
      .returning();

    sendVerifyEmail(
      verifyData[0].verifyCode,
      userData.name + " " + userData.surname,
      userData.email,
    );
    return Response.json({ err: "", code: 1 }, { status: 200 });
  } catch (err) {
    return Response.json(
      { err: "Beklenmedik bir hata oluştu.", code: 0 },
      { status: 500 },
    );
  }
}
