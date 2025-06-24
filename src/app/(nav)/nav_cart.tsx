"use client";
import {
  ArrowRight,
  ArrowUpRight,
  PartyPopper,
  ShoppingBag,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheetNav";

import { Button } from "@/components/ui/button";
import CartItem from "../../components/cart_item";

import {
  IsOpenContext,
  IsOpenDispatchContext,
  CartContext,
  CartDispatchContext,
  setCartDispatch,
  localSetCartDispatch,
} from "../cart";

import { useContext, useEffect, useState } from "react";

import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useSession } from "next-auth/react";
import { calculatePrice } from "@/components/price";
import { cargoFreeThreshold } from "@/local.env";
import { Icons } from "@/components/icons";

export default function NavCart() {
  const carts = useContext(CartContext);
  const cartDispatch = useContext(CartDispatchContext);
  const isOpen = useContext(IsOpenContext);
  const isOpenDispacher = useContext(IsOpenDispatchContext);
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      setCartDispatch(cartDispatch);
      setIsLoading(false);
    } else if (session.status === "unauthenticated") {
      localSetCartDispatch(cartDispatch);
      setIsLoading(false);
    }
  }, [session]);

  return (
    <Sheet open={isOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="ml-1 x"
          size="icon"
          onClick={() => {
            isOpenDispacher();
          }}
        >
          <ShoppingBag className="mix-blend-difference"></ShoppingBag>
        </Button>
      </SheetTrigger>
      <SheetContent
        className=" px-0 pt-8 border-0 sm:w-[450px]"
        dispatcher={isOpenDispacher}
      >
        <SheetHeader className="p-4 ">
          <SheetTitle className="text-lg font-medium left-6 top-6 absolute">
            Sepetim
          </SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="px-8 h-full flex items-center justify-center ">
            Sepet Yükleniyor <Icons.spinner className="animate-spin ml-2" />
          </div>
        ) : (
          <>
            {carts!.error ? (
              <div className="px-8 h-full flex items-center justify-center flex-col">
                <span className="text-xl font-medium ">
                  {" "}
                  Sunucuda Bir Hata Oluştu
                </span>
              </div>
            ) : carts!.cartItems.length === 0 ? (
              <div className="px-8 h-full flex items-center justify-center flex-col">
                <span className="text-xl font-medium "> Sepette Ürün Yok</span>
                <Button variant="link">
                  <Link
                    className="w-full flex"
                    href="/products/tum-urunler/a0"
                    onClick={() => {
                      isOpenDispacher();
                    }}
                  >
                    Alışverişe Başla <ArrowUpRight></ArrowUpRight>
                  </Link>
                </Button>
              </div>
            ) : (
              <div className=" pb-[60px]">
                <div className="px-2 text-center text-sm font-medium py-4">
                  {carts.totalPrice < cargoFreeThreshold ? (
                    <div className="pb-2 ">
                      Ücretsiz Kargo için{" "}
                      {calculatePrice(cargoFreeThreshold - carts.totalPrice)}{" "}
                      ürün daha ekleyin
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-base pb-2">
                      <PartyPopper className="mr-2 "></PartyPopper> Kargon
                      Ücretsiz
                    </div>
                  )}
                  <div className="mx-2">
                    <Progress
                      value={
                        carts.totalPrice > cargoFreeThreshold
                          ? 100
                          : parseFloat(
                              (
                                carts.totalPrice /
                                (cargoFreeThreshold / 100)
                              ).toFixed(2),
                            )
                      }
                    />
                  </div>
                </div>
                <div className="overflow-scroll h-screen pb-[350px] scroll2 px-4">
                  {carts!.cartItems.map((c, i) => {
                    if (c !== undefined) {
                      return (
                        <CartItem
                          key={i}
                          index={i}
                          cartItem={c}
                          isInCart={false}
                        ></CartItem>
                      );
                    }
                  })}
                </div>
              </div>
            )}

            {carts!.cartItems.length === 0 ? (
              ""
            ) : (
              <div className={" bottom-0 left-0 w-full absolute"}>
                <Button
                  variant="secondary"
                  className="py-8 w-full"
                  onClick={() => {
                    isOpenDispacher();
                  }}
                >
                  <Link
                    className="w-full flex items-center justify-between"
                    href="/cart"
                  >
                    Sepete git
                    <ArrowUpRight className="pl-1 h-8 w-8"></ArrowUpRight>{" "}
                  </Link>
                </Button>
                <Button
                  variant="default"
                  className=" w-full   py-7  px-4 rounded-none"
                  onClick={() => {
                    isOpenDispacher();
                  }}
                >
                  <Link
                    href="/checkout"
                    className="w-full  items-center flex justify-between"
                  >
                    <div className=" ">
                      Toplam :
                      <span className="px-2">
                        {" "}
                        {calculatePrice(carts.totalPrice)}{" "}
                      </span>
                    </div>
                    <div className="flex items-center text-center">
                      <div className="">ödemeye geç</div>{" "}
                      <ArrowRight className="pl-1 h-6 w-6"></ArrowRight>
                    </div>
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
