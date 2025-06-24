"use client";

import { useState } from "react";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";


import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TH1, TH2, TH3 } from "@/components/typography";
import { baseUrl } from "@/local.env";
import { AlertDestructive } from "@/components/alert";



const formSchema = z.object({
  email: z
    .string({
      required_error: "Email Alanı zorunlu",
    })
    .email("Geçerli bir eposta girin"),
  orderNumber: z
    .string({
      required_error: "Sipariş numarası zorunlu",
    })
    .regex(/^[0-9]+$/, {
      message: "Sipariş numarası sadece rakam içerebilir",
    })
    .length(12, {
      message: "Sipariş numarası 12 karakter uzunluğunda olmalı",
    }),
});
export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(0);
  const router = useRouter();
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    fetch(baseUrl + "/api/trackorder", {
      method: "POST",
      body: JSON.stringify(values),
    }).then((r) => {
      setIsLoading(false);
      if (r.ok) {
        router.push(
          `/trackorder/order_detail?orderNumber=${values.orderNumber}&email=${values.email}`,
        );
      } else {
        setIsLoading(false);
        setStatus(r.status);
      }
    });
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  return (
    <div className="container max-w-lg mx-auto pt-[120px]">
      <Card>
        <CardHeader>
          <TH2>Sipariş Takip</TH2>
        </CardHeader>
        {status === 404 && (
          <div className="px-6">
            <AlertDestructive
              errHeader="Hata"
              errDescription="Bu email'a ait böyle bir sipariş numarası bulunamadı"
            />
          </div>
        )}
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} action="POST">
              <div className="gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="py-3">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="Email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          className=""
                          type="email"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Siparişi oluştururken girdiğiniz email
                      </FormDescription>
                      <FormMessage className="pt-0 mt-0" />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="orderNumber"
                  render={({ field }) => (
                    <FormItem className="py-3">
                      <FormLabel>Sipariş numarası</FormLabel>
                      <FormControl>
                        <Input
                          id="orderNumber"
                          placeholder="Sipariş numarası"
                          autoCapitalize="none"
                          autoComplete=""
                          autoCorrect="off"
                          className=""
                          type="number"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Girdiğiniz email'a gönderilen sipariş numarası
                      </FormDescription>
                      <FormMessage className="pt-0 mt-0" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={
                    "w-full py-6 my-6 " +
                    (status == 0 ? " " : status == 200 ? "" : "bg-destructive")
                  }
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Siparişi Görüntüle
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
