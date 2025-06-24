import { TH1, TH2 } from "@/components/typography";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { userSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import TelephoneForm from "./telephone";
import PasswordForm from "./password";
import ButtonSignOut from "./buttonsignout";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  try {
    const user = await db.query.userSchema.findFirst({
      where: eq(userSchema.id, session.user?.id!),
      with: {
        password: false,
      }
    });

    if (!user) {
      throw new Error("1");
    }
    return (
      <div className="">
        <TH1 className="px-12">Hesap</TH1>
        <hr className="my-4" />
        <div className="pt-6 px-16">
          <div>
            <TH2>Kullanıcı Bilgileri</TH2>
          </div>
          <div className="p-4">
            <div className="font-medium">Email</div>
            <div>{user.email}</div>
          </div>
          {/* <div className="p-4">
            <TelephoneForm  phoneNumber={user.phone}/>
          </div> */}
          <div className="p-4">
            <div className="font-semibold text-xl pb-4">Şifre Değiştirme</div>
            <PasswordForm />
          </div>
          <div className="p-4 pt-12">
            <div className="font-semibold text-xl pb-1">Çıkış Yap</div>
            <div className="pb-4">
            hesaptan çıkış yapın
            </div>
          <ButtonSignOut></ButtonSignOut>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    throw new Error("Beklenmedik bir hata oluştu", { cause: 1 });
  }
}
