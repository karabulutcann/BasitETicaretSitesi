"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Input } from "@/components/ui/input";
import { AlertCircle, Check, CreditCard } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CommandList } from "cmdk";
import { baseUrl } from "@/local.env";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TH1, TH2 } from "@/components/typography";
import { Card, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCartDispatcher } from "../cart";

import { NotInStockResponseUnAuth } from "../api/checkout/payment/route";

import { Cart } from "@/types/cart";

import { useState, useEffect, lazy } from "react";
import { Icons } from "@/components/icons";
import { AlertDestructive } from "@/components/alert";

import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckoutVerifyEmailRequest } from "../api/checkout/send_verify_email/route";
import { CheckStockRequest } from "../api/checkout/check_stock/route";
import updateCartUnAuth from "@/lib/update_cart";
import Payment from "./payment";
import { Locations } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const VerifyEmailDialog = lazy(() => import("./verify_email_dialog"));

export const formSchema = z.object({
  email: z
    .string({
      required_error: "* Email boş bırakılamaz",
    })
    .email({ message: "* Geçerli bir eposta girin" }),
  name: z.string({
    required_error: "* Ad boş bırakılamaz",
  }),
  surname: z.string({
    required_error: "* Soyad boş bırakılamaz",
  }),
  address: z.string({
    required_error: "* Adres boş bırakılamaz",
  }),
  city: z.string({
    required_error: "* İl boş bırakılamaz",
  }),
  district: z.string({
    required_error: "* İlçe boş bırakılamaz",
  }),
  delivery: z.enum(["yurtici", "mng"]),
  phone: z.string({
    required_error: "* Telefon numarası boş bırakılamaz",
  }),
  paymentMethod: z.enum(["creditCard", "cash"]),
});

export default function FormUnAuth({
  cities,
  isFast,
  productId,
  size,
}: {
  isFast: boolean;
  productId: string;
  size: string;
  cities: Locations[];
}) {
  const [city, setCity] = useState<string>("");
  const [status, setStatus] = useState<number>(0);
  const [stockStatus, setStockStatus] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [checkoutFormContent, setCheckoutFormContent] = useState<
    string | undefined
  >(undefined);
  const [formValues, setFormValues] = useState<z.infer<typeof formSchema>>();
  const dispatch = useCartDispatcher();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      delivery: "yurtici",
      paymentMethod: "creditCard",
    },
  });

  useEffect(() => {
    setIsLoading(true);
    const cartItems: Cart[] = JSON.parse(localStorage.getItem("cart")!);
    fetch(baseUrl + "/api/checkout/check_stock", {
      method: "POST",
      body: JSON.stringify(
        cartItems.map((c) => ({
          productId: c.product.id,
          productCount: c.productCount,
          size: c.size,
        })) as CheckStockRequest,
      ),
    })
      .then((r) => {
        setIsLoading(false);
        if (r.ok) {
          setStockStatus(r.status);
          return r.json();
        }
        setStockStatus(r.status);
      })
      .then((r: NotInStockResponseUnAuth) => {
        if (r !== undefined) {
          if (r.code === 255) {
            updateCartUnAuth(dispatch, r);
            setStockStatus(r.code);
            setIsLoading(false);
          }
        }
      });
  }, []);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setFormValues(values);
    fetch(baseUrl + "/api/checkout/send_verify_email", {
      method: "POST",
      body: JSON.stringify({
        email: values.email,
        name: values.name,
        surname: values.surname,
      } as CheckoutVerifyEmailRequest),
    }).then((r) => {
      if (r.ok) {
        setIsOpen(true);
      }
      setIsLoading(false);
      setStatus(r.status);
    });
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full gap-4 grid grid-cols-2 max-w-lg px-12"
        >
          <div className="py-6">
            <TH2>Ödeme</TH2>
          </div>
          {stockStatus === 255 && (
            <div className="col-span-2 pb-4">
              <Alert variant="warning" className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Hata</AlertTitle>
                <AlertDescription>* Bazı ürünlerde yeterli stok olmadığından kart bilgileri güncellendi</AlertDescription>
              </Alert>
            </div>
          )}

          <div className="col-span-2">
            <TH2>İletişim Bilgileri</TH2>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="email"
                    type="email"
                    placeholder="örnek@örnek.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Telefon Numarası</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="tel"
                    type="tel"
                    placeholder="+90 555 555 55"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-2 pt-12">
            <TH2>Teslimat Adresi</TH2>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Ad</FormLabel>
                <FormControl>
                  <Input autoComplete="name" placeholder="Ad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="surname"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Soyad</FormLabel>
                <FormControl>
                  <Input placeholder="Soyad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şehir</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "h-12 mt-6 flex w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? cities.find((c) => c.city === field.value)?.city
                            : "İl seçin"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[223px] p-0">
                      <Command>
                        <CommandInput placeholder="İl ara..." className="h-9" />
                        <ScrollArea className="h-[300px]">
                          <CommandList>
                            <CommandEmpty>İl Bulunamadı</CommandEmpty>
                            <CommandGroup>
                              {cities.map((c) => (
                                <CommandItem
                                  value={c.city}
                                  key={c.city}
                                  onSelect={() => {
                                    form.setValue("city", c.city);
                                    setCity(c.city);
                                  }}
                                >
                                  {c.city}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      c.city === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </ScrollArea>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>İlçe</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "h-12 mt-6 flex w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? cities
                                .find((c) => c.city === city)
                                ?.districts.find(
                                  (d) => d.district === field.value,
                                )?.district
                            : "İlçe seçin"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[223px] p-0 ">
                      <Command>
                        <CommandInput
                          placeholder="İlçe Ara..."
                          className="h-9"
                        />

                        <ScrollArea className="h-[300px]">
                          <CommandList>
                            <CommandEmpty>İl Seçin</CommandEmpty>
                            <CommandGroup>
                              {cities
                                .find((c) => c.city === city)
                                ?.districts.map((d) => (
                                  <CommandItem
                                    value={d.district}
                                    key={d.district}
                                    onSelect={() => {
                                      form.setValue("district", d.district!);
                                    }}
                                  >
                                    {d.district}
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        d.district === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </ScrollArea>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Açık Adres</FormLabel>
                <FormControl>
                  <Textarea autoComplete="address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delivery"
            render={({ field }) => (
              <FormItem className="col-span-2 pt-8">
                <FormLabel>
                  {" "}
                  <TH2>Kargo</TH2>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    className="col-span-2"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <Label htmlFor="cargo_r1">
                      <Card>
                        <CardHeader className="flex justify-between flex-row">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-3" />
                            <div className="font-medium ">Yurt İçi kargo</div>
                          </div>
                          <RadioGroupItem
                            value="yurtici"
                            id="cargo_r1"
                          ></RadioGroupItem>
                        </CardHeader>
                      </Card>
                    </Label>
                    <Label htmlFor="cargo_r2">
                      <Card>
                        <CardHeader className="flex justify-between flex-row">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-3" />
                            <div className="font-medium ">Mng Kargo</div>
                          </div>
                          <RadioGroupItem
                            value="mng"
                            id="cargo_r2"
                          ></RadioGroupItem>
                        </CardHeader>
                      </Card>
                    </Label>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="col-span-2 pt-8">
                <FormLabel>
                  {" "}
                  <TH2>Ödeme Yöntemi</TH2>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    className="col-span-2"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <Label htmlFor="payment_r1" className="group/card">
                      <Card>
                        <CardHeader className="flex justify-between flex-row">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-3" />
                            <div className="font-medium ">
                              Kredi Kartı İle Ödeme
                            </div>
                          </div>
                          <RadioGroupItem value="creditCard" id="payment_r1" />
                        </CardHeader>
                      </Card>
                    </Label>
                    <Label htmlFor="payment_r2">
                      <Card>
                        <CardHeader className="flex justify-between flex-row">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-3" />
                            <div className="font-medium ">Kapıda Ödeme</div>
                          </div>
                          <RadioGroupItem
                            value="cash"
                            id="payment_r2"
                          ></RadioGroupItem>
                        </CardHeader>
                      </Card>
                    </Label>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-2 flex flex-col py-4">
            {status === 500 && (
              <AlertDestructive
                errHeader="Hata"
                errDescription="Sunucuda bir hata oluştu"
              />
            )}
            {status === 400 && (
              <AlertDestructive
                errHeader="Hata"
                errDescription="Girdiğiniz bilgiler kontrol edin"
              />
            )}
            {status === 255 && (
              <div className="col-span-2 pb-4">
                <AlertDestructive
                  errHeader="Hata"
                  errDescription="* Ürünlerde yeterli stok yok ya da stok bitmiş bu yüzden kart bilgileri güncellendi"
                />
              </div>
            )}
            <Button type="submit" disabled={isLoading} className={"py-6 mt-2"}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Siparişi Tamamla
            </Button>
          </div>
        </form>
      </Form>
      <VerifyEmailDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        formValues={formValues!}
        dispatch={dispatch}
        setStockStatus={setStatus}
        setCheckoutFormContent={setCheckoutFormContent}
        setIsPaymentOpen={setIsPaymentOpen}
      />
      <Payment
        checkoutFormContent={checkoutFormContent}
        isOpen={isPaymentOpen}
        setIsOpen={setIsPaymentOpen}
      />
    </>
  );
}
