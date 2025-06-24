"use client";

import { Button } from "@/components/ui/button";
import { Trash, X } from "lucide-react";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Cart } from "@/types/cart";
import { useSession } from "next-auth/react";
import { Icons } from "@/components/icons";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { calculatePrice } from "@/components/price";
import { Product } from "@/types/product";
import { defaultCartDispatchAction, useCartDispatcher } from "@/app/cart";


export interface checkoutItem {
  id: string;
  productCount: number;
  size: string;
  error: number | undefined;
  errorData: any;
  product: Product;
}

export default function CheckoutItem({
  checkoutItem,
  index,
}: {
  checkoutItem:checkoutItem
  index:number
}) {
  const cartDispatch = useCartDispatcher();
  return (
    <div className="py-4 flex w-full " >
      <div className={"basis-2/12"+ " " + (checkoutItem.productCount === 0 ? "opacity-40" : "")}>
        <AspectRatio className="" ratio={1}>
          <Image
            src={checkoutItem.product.imageUrls[0]}
            fill
            quality={1}
            alt={checkoutItem.product.name}
            className="object-cover  non-selectable"
          />
        </AspectRatio>
      </div>

      <div className={"basis-10/12 pl-4 flex flex-col justify-between"}>
        <div className={""+ " " + (checkoutItem.productCount === 0 ? "opacity-40" : "")}>
          <h2 className={"font- max-md:text-sm "}>{checkoutItem.product.name}</h2>
          <div
            className={
              "pb-1 text-sm text-white/50 font-medium break-words"
            }
          >
            {checkoutItem.product.description?.slice(0, 64)}...
          </div>
          <div className="flex py-1 text-sm">
            <div className="pr-4">
              Adet : {checkoutItem.productCount}
            </div>

            <div className=" flex items-center text-sm">
              Beden : {checkoutItem.size}
            </div>
          </div>
          <div>
            <div className={"justify-between pr-4 text-sm flex items-center " + " " + (checkoutItem.product.discount !== 0 ? "line-through text-destructive" : "")}>
              {calculatePrice(checkoutItem.product.price)}
            </div>
            {checkoutItem.product.discount !== 0 && <div className="  justify-between pr-4 text-sm flex items-center">
              {calculatePrice(checkoutItem.product.discountedPrice!)}
            </div>}
          </div>

        </div>
        {checkoutItem.productCount === 0 && (
        <div className="flex items-center justify-between">
          <div className="py-2 px-1 text-sm text-red-500 font-medium backdrop-blur w-full">
            * {checkoutItem.size} bedeni stokta kalmadı
          </div>
          <Button className="flex text-sm items-center" variant="ghost" onClick={() => cartDispatch({ type: "deleteNotInStock", value: { ...defaultCartDispatchAction.value } })}>
             Kaldır<X></X>
          </Button>
        </div>
      )}
              {checkoutItem.error === 245 && (
        <div className="py-2 px-1 text-sm text-red-500 font-medium backdrop-blur w-full">
          * Stok yeterli değil. Eski stok : {checkoutItem.errorData?.oldStock} / Yeni stok : {checkoutItem.errorData?.newStock}
        </div>
      )}
      </div>
    </div>
  );
}
