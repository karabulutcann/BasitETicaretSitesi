"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import * as React from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";

import { AlertCircle, Router } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

function AlertDestructive() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Hata</AlertTitle>
      <AlertDescription>
        Kullanıcı bilgileri hatalı ya da böyle bir kullanıcı yok
      </AlertDescription>
    </Alert>
  );
}

export default function AuthenticationPage() {
  const router = useRouter();
  const session = useSession();

  if (session.status === "authenticated") {
    router.push("/");
  }

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<number>(0);
  const [currentImage, setCurrentImage] = React.useState<number>(0);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => {
        console.log( (prev + 1) % 6 )
        return (prev + 1) % 6
      });
     
    }, 600); 

    return () => clearInterval(timer);
  }, []);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);

    signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    }).then((r) => {
      if (r?.error) {
        setStatus(400);
      } else {
        localStorage.setItem("cart","[]");
        router.push("/");
      }

      setIsLoading(false);
    });
  }

  return (
    <div className=" container flex items-center justify-center h-screen">

      {
        Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className={"absolute top-0 left-0 h-screen w-full -z-10 overflow-x-hidden   " + (currentImage == index ? "opacity-100" : "opacity-0")}>
             <Image src={`/gridgreen${index}.png`} alt="header photo" quality={100} fill className="mt-24 object-cover lg:object-contain "/>
            </div>
        ))
      }
            

      <div className=" w-full space-y-6  max-w-sm">
        <div className="flex flex-col space-y-2 ">
          <h1 className="text-2xl tracking-tight font-bold">Giriş Yap</h1>
          <p className="text-sm text-muted-foreground"></p>
        </div>
        {status == 400 && <div className="bg-background rounded-md"><AlertDestructive /></div>}
        <div className={cn("grid gap-6", "")}>
          <form onSubmit={onSubmit} action="POST">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Email"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  className=""
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  name="password"
                  id="password"
                  placeholder="Şifre"
                  type="password"
                  autoCapitalize="none"
                  autoComplete=""
                  autoCorrect="off"
                  className=" tracking-wide"
                  disabled={isLoading}
                />
              </div>

              <Button
                disabled={isLoading}
                variant="default"
                className={
                  "  py-6 mt-8 " +
                  (status == 0
                    ? " "
                    : status == 200
                      ? " bg-lime-500"
                      : "bg-destructive font-medium")
                }
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Giriş Yap
              </Button>
            </div>
          </form>
          <div className="relative">
            <div className="relative flex items-center text-xs uppercase">
              <span className="w-full border-t " />
              <span className=" px-4 flex-none">Üye Olmak İçin</span>
              <span className="w-full border-t" />
            </div>
          </div>
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            className="py-6"
          >
            <Link href="/auth/signup" className="w-full flex justify-center">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Kayıt Ol
            </Link>
          </Button>
        </div>
        <p className="px-8 text-center text-sm ">
          Giriş Yaparak{" "}
          <Link
            href="/kvkk_ve_gizlilik"
            className="underline underline-offset-4 hover:text-primary"
          >
            Gizlilik Sözleşmesini
          </Link>{" "}
          kabul etmiş olursunuz .
        </p>
      </div>
    </div>
  );
}
