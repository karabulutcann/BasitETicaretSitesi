import { auth } from "@/auth";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { object, string } from "zod";
import { userSchema } from "@/db/schema";
import { compare } from "bcrypt";
import { hashPassword } from "@/lib/crypt_password";

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const changePasswordSchema = object({
    oldPassword: string({ required_error: "Old password is required" })
      .min(8, "Old password must be more than 8 characters")
      .max(32, "Old password must be less than 32 characters"),
    newPassword: string({ required_error: "Password is required" })
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    confirmPassword: string({ required_error: "Confirm password is required" })
      .min(8, "Confirm password must be more than 8 characters")
      .max(32, "Confirm password must be less than 32 characters"),
  
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const POST = auth(async (req) => {
  const session = req.auth;

  if (!session) {
    return new Response(JSON.stringify({ err: "unauthorized" }), {
      status: 401,
    });
  }

  try {
    const data: ChangePasswordRequest = await req.json();

    const result = await changePasswordSchema.safeParse({...data});

    if (!result.success) {
      return new Response(JSON.stringify({ err: result.error }), {
        status: 400,
      });
    }
    const user = await db.query.userSchema.findFirst({
      where: eq(userSchema.id, session.user?.id!),
    });
    if(!user){
      return new Response(JSON.stringify({ err: "User not found" }), {
        status: 404,
      });
    }
    if (!(await compare(result.data.oldPassword, user!.password))) {
        return new Response(JSON.stringify({ err: "Incorrect password" }), {
          status: 401,  
      });
    }

    await db.update(userSchema).set({
        password: await hashPassword(result.data.newPassword),
      }).where(eq(userSchema.id, session.user?.id!));

    return new Response(JSON.stringify({ err: "", code: 1 }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ err: "there was an error" }), {
      status: 500,
    });
  }
});
