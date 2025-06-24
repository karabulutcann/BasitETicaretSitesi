"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { VerifyRequest } from "@/app/api/auth/signup/verify/route";
import { useState, useEffect } from "react";
import { Icons } from "@/components/icons";
import { AlertDestructive } from "@/components/alert";
import Link from "next/link";
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Doğrulama kodu 6 karakterden oluşmalıdır.",
  }),
});

export default function FormVerify({
  userData,
}: {
  userData: {
    email: string;
    name: string;
    surname: string;
    password: string;
  };
}) {
  const [status, setStatus] = useState<number>(0);
  const [resendStatus, setResendStatus] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClickable, setIsClickable] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30); // Initial countdown time in seconds
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 1) {
          clearInterval(timer); // Clear the interval when the countdown is done
          setIsClickable(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Update every second

    return () => clearInterval(timer); // Clean up the interval when the component unmounts
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    fetch("/api/auth/signup/verify", {
      method: "POST",
      body: JSON.stringify({
        verifyCode: data.pin,
        email: userData.email! as string,
      } as VerifyRequest),
    }).then((r) => {
      if (r.ok) {
        signIn("credentials", {
          email: userData.email!,
          password: userData.password!,
          redirect: false,
        }).then((r) => {
          if (r?.error) {
            setStatus(400);
          } else {
            localStorage.setItem("cart","[]");
            router.push("/");
          }
        });
      }
      setIsLoading(false);
      setStatus(r.status);
    });
  }

  return (
    <div className="h-screen flex justify-center items-center pb-32 ">
      <div className="max-w-lg px-12">
        <div className="text-2xl font-semibold pb-12 text-start">
          Hesap Doğrulama
        </div>
        {status === 400 && (
          <AlertDestructive
            errHeader="Hata"
            errDescription="Geçersiz doğrulama isteği"
          ></AlertDestructive>
        )}
        {status === 401 && (
          <AlertDestructive
            errHeader="Hata"
            errDescription="Hesap doğrulama kodu hatalı"
          ></AlertDestructive>
        )}
        {status === 402 && (
          <AlertDestructive
            errHeader="Hata"
            errDescription="Bu email adresi zaten kayıtlı"
          ></AlertDestructive>
        )}
        {status === 403 && (
          <AlertDestructive
            errHeader="Hata"
            errDescription="Doğrulama süresi doldu"
          ></AlertDestructive>
        )}
        {status === 500 && (
          <AlertDestructive
            errHeader="Hata"
            errDescription="Sunucuda bir hata oluştu"
          ></AlertDestructive>
        )}
        {resendStatus === 500 && (
          <AlertDestructive
            errHeader="Hata"
            errDescription="Kod tekrar gönderilirken sunucuda bir hata oluştu"
          ></AlertDestructive>
        )}
        {resendStatus === 400 && (
          <AlertDestructive
            errHeader="Hata"
            errDescription="Kod tekrar gönderilemedi geçersiz token"
          ></AlertDestructive>
        )}
        {status === 200 ? (
          <div>
            <div className="text-xl font-medium">
              Hesap başarıyla doğrulandı. Giriş yapılıyor...
            </div>
          </div>
        ) : (
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" space-y-12"
              >
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email doğrulama kodu</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription className="pt-6">
                        Emailinize gönderdiğimiz 6 haneli doğrulama kodunu
                        giriniz. Eğer kod gelmediyse kodu tekrar gönder butonuna
                        tıklayınız.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  variant={"secondary"}
                  disabled={isLoading}
                  className={"w-full py-6 "}
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Doğrula
                </Button>
              </form>
            </Form>
            <Button
              disabled={isLoading || !isClickable}
              variant="outline"
              className={"w-full py-6 mt-6"}
              onClick={() => {
                setIsLoading(true);
                fetch("/api/auth/signup/send_verify_email", {
                  method: "POST",
                }).then((r) => {
                  setIsLoading(false);
                  setResendStatus(r.status);
                });
              }}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isClickable ? "Kodu tekrar gönder" : "kodu tekrar göndermek için "+ timeRemaining + " saniye bekleyiniz"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
