"use client";

import { Button } from "@/components/ui/button";
import { Trash, X } from "lucide-react";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import {
  defaultCartDispatchAction,
  deleteCartDispatch,
  localUpdateAddCartDispatch,
  localDeleteCartDispatch,
  updateCartDispatch,
  useCartDispatcher,
  localUpdateSubCartDispatch,
} from "../app/cart";
import { Cart } from "@/types/cart";
import { useSession } from "next-auth/react";
import { Icons } from "@/components/icons";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { calculatePrice } from "@/components/price";

export default function CartItem({
  index,
  cartItem,
  isInCart = false,
}: {
  index: number;
  cartItem: Cart;
  isInCart: boolean;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchStatus, setStatus] = useState<number>(0);

  const { data: session, status } = useSession();
  const cartDispatch = useCartDispatcher();

  return (
    <div>
      <div
        className={
          "py-6 flex w-full "
        }
      >
        <div className={"basis-3/12" + " " + (cartItem.productCount === 0 ? "opacity-40" : "")}>
          <AspectRatio className="" ratio={1}>
            <Image
              src={cartItem.product.imageUrls[0]}
              fill
              quality={1}
              alt={cartItem.product.name}
              className="object-cover  non-selectable"
            />
          </AspectRatio>
        </div>

        <div className="basis-9/12 pl-4 flex flex-col justify-between">
          <div className={"" + (cartItem.productCount === 0 ? "opacity-40" : "")}>
            <div className="">
              <h2 className={"font- max-md:text-sm "}>{cartItem.product.name}</h2>
              <div
                className={
                  "pb-1 text-sm text-zinc-500 font-medium break-words  " +
                  (isInCart ? "" : " hidden ")
                }
              >
                {cartItem.product.description?.slice(0, 64) + "..."}
              </div>
              <div className="sm:flex py-1 ">
                {cartItem.product.discount === 0 ? (
                  <div className="pr-4">
                    {calculatePrice(parseFloat(cartItem.product?.price))}
                  </div>
                ) : (
                  <div className=" pr-4 text-sm flex items-center">
                    <div className="text-white/50 line-through pr-2">
                      {calculatePrice(parseFloat(cartItem.product?.price))}
                    </div>
                    <div>{calculatePrice(parseFloat(cartItem.product?.discountedPrice!))}</div>
                  </div>
                )}

                <div className=" flex items-center text-sm">
                  Beden : {cartItem.size}
                </div>
              </div>
            </div>

            <div className="flex py-2 items-center justify-between">
              <div className="flex items-center">
                <div className="pr-1 font-medium text-sm flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={
                      isLoading ||
                      cartItem.isMaxStock ||
                      cartItem.productCount === 0
                    }
                    className="ml-2 h-6 w-6 "
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLoading(true);
                      if (status === "unauthenticated") {
                        localUpdateAddCartDispatch(
                          cartDispatch,
                          index,
                          (status: number) => {
                            setStatus(status);
                            setIsLoading(false);
                          },
                        )
                      } else if (status === "authenticated") {
                        updateCartDispatch(
                          cartDispatch,
                          cartItem,
                          index,
                          1,
                          (errCode: number | undefined) => {
                            if (errCode !== undefined) setStatus(errCode);
                            setIsLoading(false);
                          },
                        );
                      }
                    }}
                  >
                    {isLoading ? (
                      <Icons.spinner className=" h-4 w-4 animate-spin" />
                    ) : (
                      <Plus></Plus>
                    )}
                  </Button>
                  <div className=" w-10 h-6   bg-transparent flex items-center justify-center">
                    {cartItem.productCount}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={isLoading || cartItem.productCount === 0}
                    className="h-6 w-6 "
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLoading(true);
                      if (status === "unauthenticated") {
                        localUpdateSubCartDispatch(
                          cartDispatch,
                          index,
                          (status: number) => {
                            setStatus(status);
                            setIsLoading(false);
                          },
                        )
                      } else if (status === "authenticated") {
                        updateCartDispatch(
                          cartDispatch,
                          cartItem,
                          index,
                          -1,
                          (errCode: number | undefined) => {
                            if (errCode !== undefined) setStatus(errCode);

                            setIsLoading(false);
                          },
                        );
                      }
                    }}
                  >
                    {isLoading ? (
                      <Icons.spinner className=" h-4 w-4 animate-spin" />
                    ) : (
                      <Minus></Minus>
                    )}
                  </Button>
                </div>
              </div>
              <div className=" pr-4">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isLoading}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    if (status === "unauthenticated") {
                      localDeleteCartDispatch(
                        cartDispatch,
                        index,
                        (status: number) => {
                          setStatus(status);
                          setIsLoading(false);
                        },
                      )
                    } else if (status === "authenticated") {
                      if (cartItem.productCount === 0) {
                        setStatus(0);
                        setIsLoading(false);
                        cartDispatch({
                          type: "deleteNotInStock",
                          value: {
                            ...defaultCartDispatchAction.value,
                            cartIndex: index,
                          },
                        });
                        return;
                      }
                      deleteCartDispatch(cartDispatch, cartItem.id, index, () => {
                        setIsLoading(false);
                      });
                    }
                  }}
                >
                  <Trash></Trash>
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
      {cartItem.productCount !== 0 && cartItem.isMaxStock && cartItem.error === undefined && (
        <div className="py-2 px-1 text-sm text-red-500 font-medium backdrop-blur w-full">
          * Sepete Daha fazla ekleyemezsin
        </div>
      )}
      {cartItem.error === 245 && (
        <div className="py-2 px-1 text-sm text-red-500 font-medium backdrop-blur w-full">
          * Stok yeterli değil. Eski stok : {cartItem.errorData?.oldStock} / Yeni stok : {cartItem.errorData?.newStock}
        </div>
      )}
      {cartItem.productCount === 0 && (
        <div className="flex items-center justify-between">
          <div className="py-2 px-1 text-sm text-red-500 font-medium backdrop-blur w-full">
            * {cartItem.size} bedeni stokta kalmadı
          </div>
          <Button className="flex text-sm items-center" variant="ghost" onClick={() => cartDispatch({ type: "deleteNotInStock", value: { ...defaultCartDispatchAction.value, cartIndex: index } })}>
             Kaldır<X></X>
          </Button>
        </div>
      )}
    </div>
  );
}
