"use client";
import { Button } from "@/components/ui/button";

import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useContext } from "react";

import { TH1, TH2 } from "@/components/typography";
import { CartContext } from "../cart";
import CheckoutItem from "../../components/checkout_item";
import { useRouter } from "next/navigation";

export default function OrderDetailMobile() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const cart = useContext(CartContext);

  if (cart.cartItems.length === 0) {
    const router = useRouter();
    router.push("/");
  }

  return (
    <>
      <div className="bg-zinc-700 md:hidden">
        <div className="px-4  pt-12">
          <TH2>Sipariş Detayı</TH2>
          <div className="font-medium tex-lg pt-4">
            Ürün ({cart.cartItems.length})
          </div>
        </div>
        <div
          className={cn(
            "grid xl:grid-cols-2 px-6 pt-4 overflow-hidden",
            isDetailOpen ? "" : "h-48",
          )}
        >
          {cart!.cartItems.map((c, i) => {
            return <CheckoutItem key={i} checkoutItem={c} index={i}></CheckoutItem>;
          })}
        </div>
        <Button
          onClick={() => {
            setIsDetailOpen(!isDetailOpen);
          }}
          className="w-full"
          variant="ghost"
        >
          {" "}
          {isDetailOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>
    </>
  )
}