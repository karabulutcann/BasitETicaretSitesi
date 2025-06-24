"use client";

import Link from "next/link";
import  { calculatePrice } from "@/components/price";
import { Product } from "@/types/product";
import ProductCartImages from "./product_cart_images";

export default function ProductCart(params: { product: Product }) {
  return (
    <div className="my-3 relative">
      {params.product.discount !== 0 && (
        <div className="absolute top-0 right-0 bg-black z-20 px-2 m-1 py-1 text-sm">
          %{params.product.discount} indirim
        </div>
      )}
      <Link
        className=""
        href={"/product/" + params.product.link + "/" + params.product.id}
      >
        <div className="flex w-full h-full">
         <ProductCartImages urls={params.product.imageUrls} productName={params.product.name}/>
        </div>
        <div className=" items-center  pt-3 px-2.5 sm:px-0 text-[14px]">
          <h2 className={"font-medium max-md:text-sm "}>
            {params.product.name}
          </h2>
          <div
            className={
              "pb-1 text-sm tracking-tighter text-zinc-500 font-medium break-words  "
            }
          >
            {params.product.description?.slice(0, 40) + "..."}
          </div>
          {params.product.discount === 0 ? (
            <div className={"font-medium flex  items-center "}>
              {calculatePrice(parseFloat(params.product?.price))}
            </div>
          ) : (
            <div className=" flex justify-between pr-6">
              <div className="flex items-center ">
                <span className={"font-medium  pr-4"}>
                  {calculatePrice(parseFloat(params.product?.discountedPrice!))}
                </span>
                <span
                  className={
                    "font-medium text-destructive line-through flex items-center pt-1"
                  }
                >
                  {calculatePrice(parseFloat(params.product?.price))}
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
