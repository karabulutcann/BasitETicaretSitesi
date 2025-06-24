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

import { Input } from "@/components/ui/input";
import { Building2, CreditCard, Home, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { baseUrl } from "@/local.env";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { TH1, TH2, TH3 } from "@/components/typography";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { defaultCartDispatchAction, useCartDispatcher } from "../cart";

import { Address, User } from "@/db/schema";

import AddAddress from "../../components/add_address";
import {
  NotInStockResponseAuth,
  PaymentRequestAuth,
} from "../api/checkout/payment/route";
import { AlertDestructive } from "@/components/alert";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";
import { Locations } from "@/types";
import Payment from "./payment";

const formSchema = z.object({
  addressId: z.string({
    required_error: "* Adres seçin",
  }),
  delivery: z.enum(["yurtici", "mng"], {
    required_error: "* Teslimat sürümü seçin",
  }),
  phone: z
    .string({
      required_error: "* Lütfen telefon numarası girin",
    })
    .min(1, {
      message: "* Lütfen telefon numarası girin",
    }),
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
  const [status, setStatus] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [addressStatus, setAddressStatus] = useState<number>(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [stockStatus, setStockStatus] = useState<number>(0);
  const [checkoutFormContent, setCheckoutFormContent] = useState<
    string | undefined
  >(undefined);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const dispatch = useCartDispatcher();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      delivery: "yurtici",
    },
  });

  useEffect(() => {
    setIsLoading(true);
    fetch(baseUrl + "/api/address/get_address")
      .then((r) => {
        setAddressStatus(r.status);
        if (r.ok) {
          return r.json();
        }
      })
      .then((r) => {
        setIsLoading(false);
        setAddresses(r);
        console.log(r);
      });
    fetch(baseUrl + "/api/checkout/check_stock", {
      method: "POST",
    })
      .then((r) => {
        setStockStatus(r.status);
        setIsLoading(false);
        if (r.ok) {
          return r.json();
        }
      })
      .then((r: NotInStockResponseAuth) => {
        if (r.code === 255) {
          r.data.map((item) => {
            if (item.stock === 0) {
              dispatch({
                type: "updateNotInStock",
                value: {
                  ...defaultCartDispatchAction.value,
                  cartId: item.cartId,
                  stock: item.stock,
                },
              });
            } else {
              dispatch({
                type: "updateMaxStock",
                value: {
                  ...defaultCartDispatchAction.value,
                  cartId: item.cartId,
                  stock: item.stock,
                },
              });
            }
          });
        }
      });
  }, []);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    fetch(baseUrl + "/api/checkout/payment", {
      method: "POST",
      body: JSON.stringify(values as PaymentRequestAuth),
    })
      .then((r) => {
        setStatus(r.status);
        if (r.ok) {
          return r.json();
        }
      })
      .then((r) => {
        if (r !== undefined) {
          if (r.code === 255) {
            setIsLoading(false);
            (r as NotInStockResponseAuth).data.map((item) => {
              if (item.stock === 0) {
                dispatch({
                  type: "updateNotInStock",
                  value: {
                    ...defaultCartDispatchAction.value,
                    cartId: item.cartId,
                    stock: item.stock,
                  },
                });
              } else {
                dispatch({
                  type: "updateMaxStock",
                  value: {
                    ...defaultCartDispatchAction.value,
                    cartId: item.cartId,
                    stock: item.stock,
                  },
                });
              }
            });
          } else if (r.code === 200) {
            setIsPaymentOpen(true);
            setIsLoading(false);
            setCheckoutFormContent(r.checkoutFormContent);
          }
        }
      });
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grow gap-4 grid grid-cols-2 max-w-lg px-12 w-full"
        >
          <div className="py-6">
            <TH2>Ödeme</TH2>
          </div>
          {stockStatus === 255 && (
            <div className="col-span-2 pb-4">
              <AlertDestructive
                errHeader="Hata"
                errDescription="* Ürünlerde yeterli stok yok ya da stok bitmiş bu yüzden kart bilgileri güncellendi"
              />
            </div>
          )}
          {addressStatus === 500 && (
            <div className="col-span-2 pb-4">
              <AlertDestructive
                errHeader="Hata"
                errDescription="* Adres bilgileri alınırken bir hata oluştu lütfen tekrar deneyiniz"
              />
            </div>
          )}
          <div className="col-span-2">
            <TH3>İletişim Bilgileri</TH3>
          </div>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Telefon Numarası</FormLabel>
                <FormControl>
                  <Input placeholder="+90 555 555 55" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <div className="col-span-2 pt-12 flex justify-between">
            <TH3>Teslimat Adresi</TH3>{" "}
            <AddAddress
              buttonClassName="col-span-2"
              isClient={true}
              cities={cities}
              callbackFn={(address) => {
                setAddresses([...addresses, address]);
              }}
            ></AddAddress>
          </div>
          <FormField
            control={form.control}
            name="addressId"
            render={({ field }) => (
              <FormItem className="col-span-2 pt-4">
                <FormControl>
                  {isLoading ? (
                    <div className="flex justify-center">
                      <Icons.spinner className=" h-8 w-8 animate-spin" />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="flex justify-center">
                      <AddAddress
                        buttonClassName="col-span-2"
                        isClient={true}
                        cities={cities}
                        callbackFn={(address) => {
                          setAddresses([...addresses, address]);
                        }}
                      ></AddAddress>
                    </div>
                  ) : (
                    <RadioGroup
                      className="col-span-2"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      {addresses.map((a, i) => {
                        return (
                          <Label htmlFor={"address_r" + i} key={i}>
                            <Card>
                              <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex flex-row items-center">
                                  {a.addressType === "home" && (
                                    <Home className="h-4 w-4 mr-3" />
                                  )}
                                  {a.addressType === "work" && (
                                    <Building2 className="h-4 w-4 mr-3" />
                                  )}
                                  {a.addressType === "other" && (
                                    <MapPin className="h-4 w-4 mr-3" />
                                  )}
                                  <div>{a.addressName}</div>
                                </div>
                                <RadioGroupItem
                                  value={a.id}
                                  id={"address_r" + i}
                                ></RadioGroupItem>
                              </CardHeader>
                              <CardContent>
                                {a.address}
                                <div className="mt-2">
                                  {a.city}/{a.district}
                                </div>
                              </CardContent>
                            </Card>
                          </Label>
                        );
                      })}
                    </RadioGroup>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-2 pt-12">
            <TH3>Kargo</TH3>
          </div>
          <FormField
            control={form.control}
            name="delivery"
            render={({ field }) => (
              <FormItem className="col-span-2 pt-4">
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
          <div className="col-span-2 flex flex-col">
            {status === 500 && (
              <AlertDestructive
                errHeader="Hata"
                errDescription="Sunucuda bir hata oluştu"
              />
            )}
            {status === 255 && (
              <AlertDestructive
                errHeader="Hata"
                errDescription="Ürünlerde yeterli stok olmadığından kart bilgileri güncellendi"
              />
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
      <Payment
        checkoutFormContent={checkoutFormContent}
        isOpen={isPaymentOpen}
        setIsOpen={setIsPaymentOpen}
      />
    </>
  );
}
