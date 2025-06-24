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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { AlertDestructive, AlertSuccess } from "@/components/alert";

const formSchema = z
  .object({
    oldPassword: z.string({ required_error: "* Eski şifre boş bırakılamaz" }),
    newPassword: z.string({ required_error: "* Yeni şifre boş bırakılamaz" }),
    confirmPassword: z.string({
      required_error: "* Yeni şifre onaylanması boş bırakılamaz",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "* Girdiğini şifre yeni şifre ile eşleşmiyor",
    path: ["confirmPassword"],
  });

export default function PasswordForm() {
  const [status, setStatus] = useState<number>(0);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch("/api/auth/change_password", {
      method: "POST",
      body: JSON.stringify(values),
    }).then((r) => {
      setStatus(r.status);
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-lg"
      >
        {status === 200 && (
            <AlertSuccess
              successHeader="Başarılı"
              successDescription="Şifreniz başarıyla değiştirildi"
            />
        )}
        {status === 400 && (
          <AlertDestructive
            errHeader="Hata"
            errDescription="Girilen bilgiler hatalı"
          />
        )}
        {status === 401 && (
          <AlertDestructive
            errHeader="Hata"
            errDescription="Mevcut şifre yanlış"
          />
        )}
        {status === 404 && (
          <AlertDestructive
            errHeader="Hata"
            errDescription="Kullanıcı bulunamadı"
          />
        )}
        {status === 500 && (
          <AlertDestructive
            errHeader="Hata"
            errDescription="Sunucuda bir hata oluştu"
          />
        )}
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Mevcut Şifreniz</FormLabel>
              <FormControl>
                <Input
                  autoComplete="password"
                  type="password"
                  placeholder="Mevcut Şifre"
                  {...field}
                />
              </FormControl>
              <FormDescription>Mevcut şifrenizi giriniz</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Yeni Şifreniz</FormLabel>
              <FormControl>
                <Input
                  autoComplete="new-password"
                  type="password"
                  placeholder="Yeni Şifre"
                  {...field}
                />
              </FormControl>
              <FormDescription>Yeni şifrenizi giriniz</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                Şifreyi Tekrar Giriniz
              </FormLabel>
              <FormControl>
                <Input
                  autoComplete="new-password"
                  type="password"
                  placeholder="Şifreyi tekrar giriniz"
                  {...field}
                />
              </FormControl>
              <FormDescription>Yeni şifrenizi tekrar giriniz</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="py-6 px-10"
        >
          Şifreyi Değiştir
        </Button>
      </form>
    </Form>
  );
}
