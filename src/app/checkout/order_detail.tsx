"use client";
import  { useContext, useEffect } from "react";

import { TH1, TH2 } from "@/components/typography";
import { CartContext } from "../cart";
import CheckoutItem from "../../components/checkout_item";
import { calculatePrice as calculatePrice } from "@/components/price";
import {  PartyPopper } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cargoFreeThreshold, cargoPrice } from "@/local.env";
import { useRouter } from "next/navigation";

export default function OrderDetail() {
    const cart = useContext(CartContext);
    if(cart.cartItems.length === 0) {
      const router = useRouter();
      router.push("/");
    }
    
    return (
      <div className="bg-zinc-700  hidden md:block top-0 right-0 w-full sticky h-screen overflow-y-scroll scroll2">
        <div className="max-w-2xl">
          <div className="px-4  items-center pt-6 flex ">
            <TH2>Sipariş Detayı</TH2>
            <div className="font-medium text-xl py-6 px-2">
              Ürün ({cart.cartItems.length})
            </div>
          </div>
          <div className="grid gap-6 px-6 pt-4 ">
            {cart!.cartItems.map((c, i) => {
              return <CheckoutItem key={i} checkoutItem={c} index={i}></CheckoutItem>;
            })}
          </div>
          <div className="pb-16 px-6">
          <div className={"font-semibold text-2xl pt-8 "}>
            Sipariş Özeti
          </div>
          <div className=" text-center text-sm font-medium py-4 tracking-wide">
            {cart.totalPrice < cargoFreeThreshold ? (
              <div className="pb-4">
                Ücretsiz Kargo için {(cargoFreeThreshold - cart.totalPrice).toFixed(2)} TL
                ürün daha ekleyin
              </div>
            ) : (
              <div className="flex items-center justify-center text-base pb-2">
                <PartyPopper className="mr-2 "></PartyPopper> Kargon Ücretsiz
              </div>
            )}
            <div className="px-2">
              <Progress
                value={
                  cart.totalPrice > cargoFreeThreshold
                    ? 100
                    : parseFloat((cart.totalPrice / (cargoFreeThreshold/100)).toFixed(2))
                }
                
              />
            </div>
          </div>
          <hr className=" pb-4 border-white/50" />
          <div className="px-4 flex justify-between pb-4 font-medium">
            <div>Ara toplam</div>
            <div className="">{calculatePrice(cart.totalPrice)}</div>
          </div>
          <div className="px-4 flex justify-between pb-4 font-medium">
            <div className="">Kargo</div>
            {cart.totalPrice < cargoFreeThreshold ? (
              <div className="  ">{calculatePrice(cargoPrice)}</div>
            ) : (
              <div className=" ">
                <span className="line-through pr-2 text-sm text-zinc-500">
                 {calculatePrice(cargoPrice!)}
                </span>{" "}
                Ücretsiz
              </div>
            )}
          </div>
          <div className="px-4 flex justify-between pb-4">
            {/* TODO : kdv kısmını gerçek değerler ile hesapla */}
            <div className="font-medium">Toplam (KDV)</div>
            <div className=" font-medium">
              {calculatePrice((cart.totalPrice * 20) / 100)}
            </div>
          </div>
          <hr className="border-1 border-white/50" />
          <div className="px-2 flex justify-between py-4 text-lg  font-medium">
            <div>Toplam</div>
            <div className="text-base">
              {calculatePrice(
                cart.totalPrice + (cart.totalPrice < 1000 ? 50 : 0),
              )}{" "}
            </div>
          </div>
          </div>
        </div>
      </div>
    )
}