import { hashPassword } from "@/lib/crypt_password";
import { db } from "@/db";
import {  emailVerificationSchema, userSchema } from "@/db/schema";
import jwt from "jsonwebtoken";

interface UserData {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

import { object, string } from "zod";
import { eq } from "drizzle-orm";
import { sendVerifyEmail } from "@/email/send_verify_email";
import { cookies } from "next/headers";
import { randomInt } from "crypto";

const signUpSchema = object({
  name: string({ required_error: "Name is required" }),
  surname: string({ required_error: "Surname is required" }),
  email: string({ required_error: "Email is required" })
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  confirmPassword: string({ required_error: "Confirm password is required" })
    .min(8, "Confirm password must be more than 8 characters")
    .max(32, "Confirm password must be less than 32 characters"),

}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function POST(req: Request) {
  const data: UserData = await req.json();
  let result = signUpSchema.safeParse({
    name: data.name,
    surname: data.surname,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword
  })

  if (!result.success) {
    return Response.json({ err: result.error.errors[0].message, code: 0 }, { status: 400 });
  }

  try {
    const user = await db.query.userSchema.findFirst({
      where: eq(userSchema.email, result.data.email)
    })

    if (user !== undefined && !user.isGuest) {
      return Response.json({ err: "Bu email adresi zaten kayıtlı.", code: 13 }, { status: 401 });
    }

    const verifyData = await db.insert(emailVerificationSchema).values({
      email: data.email,
      name: data.name + " " + data.surname,
      password: await hashPassword(data.password),
    }).onConflictDoUpdate({
      target: emailVerificationSchema.email,
      set:{
        password: await hashPassword(data.password),
        name: data.name + " " + data.surname,
        verifyCode: randomInt(100000,1000000).toString(),
        createdAt: new Date()
      }
    }).returning();


    const userDataToken = jwt.sign({ ...result.data ,verifyEmailId: verifyData[0].id}, process.env.JWT_SECRET!, {
      expiresIn: '15m',
    })

    sendVerifyEmail(verifyData[0].verifyCode, result.data.name + " " + result.data.surname, result.data.email);
    
    cookies().set("userDataToken", userDataToken, {
      maxAge: 15 * 60,
    })
    return Response.json({ token: userDataToken }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ err: "Beklenmedik bir hata oluştu.", code: 0 }, { status: 500 });
  }
}
