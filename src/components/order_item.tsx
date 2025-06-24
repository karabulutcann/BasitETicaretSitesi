"use client";

import { Button } from "@/components/ui/button";
import { Trash, X } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { calculatePrice } from "@/components/price";
import { Product } from "@/types/product";
import { defaultCartDispatchAction, useCartDispatcher } from "@/app/cart";

export interface orderItem {
  id: string;
  productCount: number;
  size: string;
  product: Product;
}

export default function OrderItem({
  orderItem,
}: {
  orderItem: orderItem;
}) {
  const cartDispatch = useCartDispatcher();
  return (
    <div className="py-4 flex w-full ">
      <div
        className={
          "basis-2/12" +
          " " +
          (orderItem.productCount === 0 ? "opacity-40" : "")
        }
      >
        <AspectRatio className="" ratio={1}>
          <Image
            src={orderItem.product.imageUrls[0]}
            fill
            quality={1}
            alt={orderItem.product.name}
            className="object-cover  non-selectable"
          />
        </AspectRatio>
      </div>

      <div className={"basis-10/12 pl-4 flex flex-col justify-between"}>
        <div
          className={
            "" + " " + (orderItem.productCount === 0 ? "opacity-40" : "")
          }
        >
          <h2 className={"font- max-md:text-sm "}>{orderItem.product.name}</h2>
          <div className={"pb-1 text-sm text-white/50 font-medium break-words"}>
            {orderItem.product.description?.slice(0, 64)}...
          </div>
          <div className="flex py-1 text-sm">
            <div className="pr-4">Adet : {orderItem.productCount}</div>

            <div className=" flex items-center text-sm">
              Beden : {orderItem.size}
            </div>
          </div>
          <div>
            <div
              className={
                "justify-between pr-4 text-sm flex items-center " +
                " " +
                (orderItem.product.discount !== 0
                  ? "line-through text-destructive"
                  : "")
              }
            >
              {calculatePrice(orderItem.product.price)}
            </div>
            {orderItem.product.discount !== 0 && (
              <div className="  justify-between pr-4 text-sm flex items-center">
                {calculatePrice(orderItem.product.discountedPrice!)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
