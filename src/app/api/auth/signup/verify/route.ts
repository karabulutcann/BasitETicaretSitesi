import { db } from "@/db";
import { emailVerificationSchema, userSchema } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";


export interface VerifyRequest  {
  verifyCode: string;
  email: string;
}

export async function POST( req:Request) {
  const data :VerifyRequest= await req.json();

  console.log(data);

  if (data.verifyCode === "" || data.verifyCode === null || data.email === "" || data.email === null) {
    return Response.json({ err: "Geçersiz token.", code: 0 }, { status: 400 });
  }

  try {

    const user = await db.query.userSchema.findFirst({
      where: eq(userSchema.email, data.email)
    });

    if (user !== undefined && !user.isGuest) {
      return Response.json({ err: "Bu email adresi zaten kayıtlı.", code: 13 }, { status: 402 });
    }

    const verifyData = await db.query.emailVerificationSchema.findFirst({
      where: and(eq(emailVerificationSchema.email, data.email), eq(emailVerificationSchema.verifyCode, data.verifyCode))
    });

    if (verifyData === undefined) {
      return Response.json({ err: "Geçersiz token.", code: 0 }, { status: 401 });
    }

    // 15 dakika içinde geçerliliği süresi doldu
    if(new Date().getTime() - new Date(verifyData.createdAt).getTime() > 15 * 60 * 1000){
      return Response.json({ err: "Geçerlilik süresi doldu.", code: 0 }, { status: 403 });
    }

    await db.insert(userSchema).values({
      name: verifyData.name,
      email: verifyData.email,
      password: verifyData.password,
      phone: "",
      isGuest:false
    }).onConflictDoUpdate({
      target: userSchema.email,
      set:{
        password: verifyData.password,
        isGuest:false,
        name: verifyData.name,
      }
    })

    await db.delete(emailVerificationSchema).where(eq(emailVerificationSchema.id, verifyData.id));
    cookies().delete("userDataToken");
    return Response.json({ err: "", code: 1 }, { status: 200 });

  } catch (err) {
    console.log(err)
    return Response.json({ err: "Geçersiz token.", code: 0 }, { status: 500 });
  }

}