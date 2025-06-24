"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, PartyPopper } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import CartItem from "../../components/cart_item";
import { CartContext } from "../cart";
import { Progress } from "@/components/ui/progress";
import { calculateKDV, calculatePrice } from "@/components/price";
import { cargoFreeThreshold, cargoPrice } from "@/local.env";

export default function Page() {
  const cart = React.useContext(CartContext);

  return (
    <div className=" flex justify-center pt-[90px]">
      <div className="max-w-6xl flex flex-col md:flex-row lg:justify-center w-full px-4">
        <div className=" md:basis-7/12">
          <div className=" flex justify-between py-8  sm:px-6 ">
            <h1 className={"uppercase font-semibold text-2xl  "}>SEPETİM</h1>
            <div className="text-xl font-medium">
              {cart!.cartItems.length} Ürün
            </div>
          </div>
          {cart.error === 500 ? <div className="px-8 h-full py-52 flex items-center justify-center flex-col">
            <span className="text-xl font-medium "> Sunucuda bir hata oluştu </span>
          </div>
          :(
            cart!.cartItems.length === 0 ? (
              <div className="px-8 h-full py-52 flex items-center justify-center flex-col">
                <span className="text-xl font-medium "> Sepette Ürün Yok</span>
                <Button variant="link">
                  <Link className="w-full flex" href="/products/tisort">
                    Alışverişe Başla <ArrowUpRight></ArrowUpRight>
                  </Link>
                </Button>
              </div>
            ) : (
              <div>
                <div className=""></div>
                {cart!.cartItems.map((c, i) => {
                  return (
                    <CartItem
                      key={i}
                      index={i}
                      isInCart={true}
                      cartItem={c}
                    ></CartItem>
                  );
                })}
              </div>
            )
          )}
        </div>

        <div
          className={
            "  grow h-full md:basis-5/12 pb-8  w-full px-4 " +
            (cart!.cartItems.length === 0 || cart.error !== undefined ? "max-md:hidden" : "")
          }
        >
          <div className={"uppercase font-semibold text-2xl py-8 "}>
            SİPARİŞ ÖZETİ
          </div>
          <div className=" text-center text-sm font-medium pt-6 pb-12 ">
            {cart.totalPrice < cargoFreeThreshold ? (
              <div className="pb-2 ">
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
                className={cart.totalPrice < cargoFreeThreshold ? "bg-zinc-300" : ""}
              />
            </div>
          </div>
          <hr className=" pb-4" />
          <div className="px-4 flex justify-between pb-4 font-medium">
            <div>Ara toplam</div>
            <div className="">{calculatePrice(cart.totalPrice)}</div>
          </div>
          <div className="px-4 flex justify-between pb-4">
            <div className="font-medium">Kargo</div>
            {cart.totalPrice < 1000 ? (
              <div className="font-semibold  ">{calculatePrice(cargoPrice)}</div>
            ) : (
              <div className="font-medium ">
                <span className="line-through pr-2 text-sm text-zinc-500">
                  {calculatePrice(cargoPrice)}
                </span>{" "}
                Ücretsiz
              </div>
            )}
          </div>
          <div className="px-4 flex justify-between pb-4">
            {/* TODO : kdv kısmını gerçek değerler ile hesapla */}
            <div className="font-medium">Toplam (KDV)</div>
            <div className=" font-medium">
              {calculateKDV(cart.totalPrice)}
            </div>
          </div>
          <hr className="border-1 " />
          <div className="px-2 flex justify-between py-4 text-lg  font-medium">
            <div>Toplam</div>
            <div className="text-base">
              {calculatePrice(
                cart.totalPrice + (cart.totalPrice < cargoFreeThreshold ? cargoPrice : 0),
              )}{" "}
            </div>
          </div>
          <hr className="border-1 " />
          <Button variant="secondary" className="w-full px-6 py-8 mt-4">
            <Link href="/checkout" className=" w-full flex justify-between ">
              <div className="font-medium items-center flex ">
                Toplam{"  "} 
                {calculatePrice(
                  cart.totalPrice + (cart.totalPrice < cargoFreeThreshold ? cargoPrice : 0),
                )}
              </div>
              <div className="flex items-center text-center">
                <div className="uppercase font-medium text-sm">
                  ödemeye geç
                </div>{" "}
                <ArrowRight className="pl-1 h-6 w-6"></ArrowRight>
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
