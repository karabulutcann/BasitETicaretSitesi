import { TH1, TH4 } from "@/components/typography";

import { Button } from "@/components/ui/button";
import {
  Building2,
  Check,
  House,
  MapPin,
  ScrollText,
} from "lucide-react";
import { Mastercard } from "@medusajs/icons";

import * as React from "react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import { calculatePrice as calculatePrice } from "@/components/price";
import { db } from "@/db";
import { orderSchema } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import OrderItem from "../../../components/order_item";

const dateFormat = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "full",
});

export default async function Page({
  searchParams,
}: {
  searchParams: { orderNumber: string; email: string };
}) {
  try {
    const order = await db.query.orderSchema.findFirst({
      where: and(
        eq(orderSchema.orderNumber, searchParams.orderNumber),
        eq(orderSchema.email, searchParams.email),
      ),
      with: {
        address: true,
        orderDetail: {
          with: {
            product: true,
          },
        },
      },
    });
    if (!order) {
    }
    return (
      <div className="container mx-auto max-w-[1280px] px-12 pt-[80px]">
        <TH1 className="px-3 md:px-6">Sipariş Detayı</TH1>

        <hr className="my-4" />
        <div className="px-3 sm:px-6 ">
          <div className="flex justify-between items-center py-6">
            <div className="">
              <div className="text-xl font-medium">
                Sipariş No: {order?.orderNumber.toString()}
              </div>
              <Button variant="ghost" className="mt-2">
                <ScrollText className="mr-3" />
                Faturayı Görüntüle{" "}
              </Button>
            </div>
            <div className="text-right">
              <div className="text-xl font-medium">
                {dateFormat.format(order?.createdAt)}
              </div>
              <div className="text-xl font-medium">
                {calculatePrice(order?.totalPrice!)} : Toplam Tutar{" "}
              </div>
            </div>
          </div>
          <div className="md:flex pb-6 gap-x-3 md:gap-x-6">
            <div className="grid gap-y-3 basis-1/2 md:gap-y-6 gap-x-6">
              <Card>
                <CardHeader>
                  <TH4>Teslimat Adresi</TH4>
                </CardHeader>
                <hr />
                <CardContent className="pt-4">
                  <div className="px-2">
                    <div className="flex justify-between">
                      <div className="font-medium flex items-center ">
                        {" "}
                        {order?.address?.addressType === "home" && (
                          <House className="mr-2 h-[20px]" />
                        )}
                        {order?.address?.addressType === "work" && (
                          <Building2 className="mr-2 h-[20px]" />
                        )}
                        {order?.address?.addressType === "other" && (
                          <MapPin className="mr-2 h-[20px]" />
                        )}
                        {order?.address?.addressName}
                      </div>
                    </div>
                    <div className="pt-2 text-sm">
                      {order?.address?.address}
                    </div>
                    <div className=" text-sm">
                      {order?.address?.city} / {order?.address?.district}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="sm:flex items-center justify-between">
                    <TH4>Ödeme Yöntemi</TH4>
                    <div className="font-semibold max-md:pt-2">
                      Toplam : {calculatePrice(order?.totalPrice!)}
                    </div>
                  </div>
                </CardHeader>
                <hr />
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex text-sm">
                        <Mastercard className="mr-3" /> Mastercard
                      </div>
                      <div>**** **** **** {order?.cardLastNumbers}</div>
                    </div>
                    <div className="text-end grid gap-y-1">
                      <div>
                        <span className="font-medium ml-1">Ara Toplam:</span>{" "}
                        {calculatePrice(order?.totalPrice!)}{" "}
                      </div>
                      <div>
                        <span className="font-medium ml-1">KDV:</span>{" "}
                        {calculatePrice(
                          (parseFloat(order?.totalPrice!) * 20) / 100,
                        )}{" "}
                      </div>
                      <div>
                        <span className="font-medium ml-1">Kargo:</span>{" "}
                        {calculatePrice(120)}{" "}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="basis-1/2 mt-4">
              <CardHeader>
                {" "}
                <div className="flex items-center justify-between">
                  <TH4>Sipariş Durumu</TH4>{" "}
                  <div
                    className={
                      " font-medium rounded-xl text-sm lg:text-base px-2 inline-flex bg-cyan-700"
                    }
                  >
                    {order?.status}
                  </div>
                </div>{" "}
              </CardHeader>
              <hr />
              <CardContent className="py-4 flex grow flex-col justify-between">
                <div className="px-2 flex ">
                  <div className="flex items-center flex-col ">
                    <div className="p-1 rounded-full bg-zinc-200 my-2">
                      <Check className="text-black h-3 w-3"></Check>
                    </div>
                    <span className="h-12 border" />
                  </div>
                  <div className="p-1 px-2">
                    <div className="font-medium">Sipariş Hazırlanıyor</div>
                    <div className="text-sm">
                      tarih: {dateFormat.format(order?.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="px-2 flex ">
                  <div className="flex items-center flex-col ">
                    <div
                      className={
                        " rounded-full my-2 " +
                        " " +
                        (order?.status === "kargoya verildi" ||
                        order?.status === "yola çıktı" ||
                        order?.status === "teslim edildi"
                          ? "bg-zinc-200 p-1 "
                          : "w-[16px] h-[16px] mx-[2px] border ")
                      }
                    >
                      <Check
                        className={
                          "text-black h-3 w-3" +
                          (order?.status === "kargoya verildi" ||
                          order?.status === "yola çıktı" ||
                          order?.status === "teslim edildi"
                            ? ""
                            : " hidden")
                        }
                      ></Check>
                    </div>
                    <span
                      className={
                        "h-12 border" +
                        " " +
                        (order?.status === "yola çıktı" ||
                        order?.status === "teslim edildi"
                          ? ""
                          : "border-dashed")
                      }
                    />
                  </div>
                  <div
                    className={
                      "p-1 px-2 " +
                      " " +
                      (order?.status === "kargoya verildi" ||
                      order?.status === "yola çıktı" ||
                      order?.status === "teslim edildi"
                        ? ""
                        : "text-white/50")
                    }
                  >
                    <div className="font-medium">Kargoya verildi</div>
                    <div className="text-sm">
                      tarih: {order?.hasBeenShippedAt === null ? "-" : dateFormat.format(order?.hasBeenShippedAt!)}
                    </div>
                  </div>
                </div>
                <div className="px-2 flex ">
                  <div className="flex items-center flex-col ">
                    <div
                      className={
                        " rounded-full my-2 " +
                        " " +
                        (order?.status === "yola çıktı" ||
                        order?.status === "teslim edildi"
                          ? "bg-zinc-200 p-1 "
                          : "w-[16px] h-[16px] mx-[2px] border ")
                      }
                    >
                      <Check
                        className={
                          "text-black h-3 w-3" +
                          (order?.status === "yola çıktı" ||
                          order?.status === "teslim edildi"
                            ? ""
                            : " hidden")
                        }
                      ></Check>
                    </div>
                    <span
                      className={
                        "h-12 border" +
                        " " +
                        (order?.status === "teslim edildi"
                          ? ""
                          : "border-dashed")
                      }
                    />
                  </div>
                  <div
                    className={
                      "p-1 px-2 " +
                      " " +
                      (order?.status === "yola çıktı" ||
                      order?.status === "teslim edildi"
                        ? ""
                        : "text-white/50")
                    }
                  >
                    <div className="font-medium">Yola Çıktı</div>
                    <div className="text-sm">
                      tarih: {order?.onTheWayAt === null ? "-" : dateFormat.format(order?.onTheWayAt!)}
                    </div>
                  </div>
                </div>
                <div className="px-2 flex ">
                  <div className="flex items-center flex-col ">
                    <div
                      className={
                        " rounded-full my-2 " +
                        " " +
                        (order?.status === "teslim edildi"
                          ? "bg-zinc-200 p-1 "
                          : "w-[16px] h-[16px] mx-[2px] border ")
                      }
                    >
                      <Check
                        className={
                          "text-black h-3 w-3" +
                          (order?.status === "teslim edildi" ? "" : " hidden")
                        }
                      ></Check>
                    </div>
                  </div>
                  <div
                    className={
                      "p-1 px-2 " +
                      " " +
                      (order?.status === "teslim edildi" ? "" : "text-white/50")
                    }
                  >
                    <div className="font-medium">Teslim edildi</div>
                    <div className="text-sm">
                      tarih: {order?.deliveredAt === null ? "-":dateFormat.format(order?.deliveredAt!)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <TH4>Ürünler</TH4>
          <hr className="my-3" />
          <div className="grid  md:grid-cols-2 gap-6">
            {order?.orderDetail?.map((o, i) => {
              return <OrderItem key={i} orderItem={o}></OrderItem>;
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
  }
}
