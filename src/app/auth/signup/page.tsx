"use client";

import Link from "next/link";

import * as React from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";


import { AlertCircle, Router } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { AlertDestructive } from "@/components/alert";

function AlertDestructiveAlreadyExists() {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Hata</AlertTitle>
      <AlertDescription>
        Bu email ile önceden hesap açılmış
      </AlertDescription>
    </Alert>
  )
}

const formSchema = z
  .object({
    name: z
      .string({
        required_error: "İsim Alanı zorunlu",
      })
      .min(1, "İsim Alanı zorunlu"),
    surname: z
      .string({
        required_error: "Soyad Alanı zorunlu",
      })
      .min(1, "Soyad Alanı zorunlu"),
    email: z
      .string({
        required_error: "Email Alanı zorunlu",
      })
      .email("Geçerli bir eposta girin"),
    password: z
      .string({
        required_error: "Şifre Alanı zorunlu",
      })
      .min(8, "Şifre en az 8 uzunluğunda olmalı"),
    confirmPassword: z.string({
      required_error: "Şifre Alanı zorunlu",
    }),

    //TODO sözleşme ve newsletter kısmı çalışmıyor checkboxa tıklansa bile tıklanmamış sayıyıyo
    // yüksek ihtimalle zod un çalışması için checkboxta id olması lazım
    newsletter: z.boolean().default(false).optional(),
    policy: z.boolean().default(false).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler uyuşmuyor",
    path: ["confirmPassword"],
  });

export default function AuthenticationPage() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<number>(0);
  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(values),
    }).then((r) => {
      if (r.ok) {
        router.push("/auth/signup/verify_email");
      }else{
        setIsLoading(false);
        setStatus(r.status);
      }

    });

  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  return (
    <div className="pb-16 container relative flex flex-col items-center justify-center pt-[90px]">
      <div className="sm:w-[400px] py-6">
        <div className=" flex w-full flex-col justify-center py-4 ">
          <h1 className="text-2xl tracking-tight font-bold">Hesap Oluştur</h1>
          {
            status === 401 && <AlertDestructiveAlreadyExists />
          }
          {status === 500 && <AlertDestructive errHeader="Hata" errDescription="Hesap oluşturulurken sunucuda bir hata oluştu" />}
        </div>

        <div className={"grid gap-6  "}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} action="POST">
              <div className="grid gap-6 grid-cols-2 items-start">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-0 ">
                      <FormLabel>İsim</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="İsim"
                          autoCapitalize="none"
                          autoComplete=""
                          autoCorrect="off"
                          className=""
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="pt-0 mt-0" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem className="grid gap-0 ">
                      <FormLabel>Soyad</FormLabel>
                      <FormControl>
                        <Input
                          id="surname"
                          placeholder="Soyad"
                          type="text"
                          autoCapitalize="none"
                          autoComplete=""
                          autoCorrect="off"
                          disabled={isLoading}
                          className=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-0 col-span-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-0">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="Email"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            className=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-0 col-span-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-1">
                        <FormLabel>Şifre</FormLabel>
                        <FormControl>
                          <Input
                            id="password"
                            placeholder="Şifre"
                            type="password"
                            autoCapitalize="none"
                            autoComplete=""
                            autoCorrect="off"
                            disabled={isLoading}
                            className=" "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-0 col-span-2">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="grid gap-1">
                        <FormLabel>Şifreyi Onayla</FormLabel>
                        <FormControl>
                          <Input
                            id="confirmPassword"
                            placeholder="Şifreyi onayla"
                            type="password"
                            autoCapitalize="none"
                            autoComplete=""
                            autoCorrect="off"
                            disabled={isLoading}
                            className=""
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-0 col-span-2">
                  <FormField
                    control={form.control}
                    name="newsletter"
                    render={({ field }) => (
                      <FormItem className="px-1 flex items-center">
                        <FormControl>
                          <Checkbox></Checkbox>
                        </FormControl>
                        <FormLabel className="text-xs pl-2">
                          Aydınlatma Metninde belirtilen ilkeler nezdinde
                          Elektronik Ticaret İletisi almak istiyorum.
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-0 col-span-2">
                  <FormField
                    control={form.control}
                    name="policy"
                    render={({ field }) => (
                      <FormItem className="px-1">
                        <div className="flex items-center">
                          <FormControl>
                            <Checkbox></Checkbox>
                          </FormControl>
                          <FormLabel className="text-xs pl-2">
                            <Link
                              href="/uyelik_sozlesmesi"
                              className="font-bold underline"
                            >
                              Üyelik Sözleşmesini
                            </Link>{" "}
                            ve{" "}
                            <Link
                              href="/uyelik_sozlesmesi"
                              className="font-bold underline"
                            >
                              KVKK Aydınlatma
                            </Link>{" "}
                            Metnini okudum, kabul ediyorum.
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={
                    "col-span-2 py-6  " +
                    (status == 0
                      ? " "
                      : status == 200
                        ? " bg-lime-500"
                        : "bg-destructive")
                  }
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Üye ol
                </Button>
              </div>
            </form>
          </Form>
          <div className="relative">
            <div className="relative flex items-center text-xs uppercase">
              <span className="w-full border-t " />
              <span className=" px-4 flex-none">Zaten Üye Misin ?</span>
              <span className="w-full border-t" />
            </div>
          </div>
          <Button
            variant="outline"
            type="button"
            className="py-6"
            disabled={isLoading}
          >
            <Link href="/auth/signin" className="w-full">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Giriş Yap
            </Link>
          </Button>
        </div>

        <p className="px-8 text-center text-sm py-4">
          Üye olarak{" "}
          <Link
            href="/kvkk_ve_gizlilik"
            className="underline underline-offset-4"
          >
            Gizlilik Sözleşmesini
          </Link>{" "}
          kabul etmiş olursunuz .
        </p>
      </div>
    </div>
  );
}
