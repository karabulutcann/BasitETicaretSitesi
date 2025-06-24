
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { chillax } from "@/app/fonts";
import { TH1, TH2, TP } from "@/components/typography";
import { db } from "@/db";
import ProductCart from "@/components/product_cart";
import { Product } from "@/types/product";

export default async function Featured() {
    
  let products : Product[] = [];
 try{
   products = await db.query.productSchema.findMany();
 }catch(error){
  console.log(error);
 }


    return (
        <div className="py-12 flex flex-col justify-center w-full ">
            <div className="py-6 px-4">
            <TH1>
                Öne Çıkanlar
            </TH1>
            </div>
           
            <div className="  md:grid md:grid-cols-2 lg:grid-cols-3 lg:pl-4  md:gap-x-1  max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto  max-md:flex max-md:scroll2 max-md:pb-6">
        {products.map((p, i) => {
          return (
            <div className="m-2 max-md:relative max-md:w-[90%] max-md:md:w-[40%] max-md:lg:w-[31%] max-md:snap-center max-md:flex-none max-md:h-full" key={i}>
              <ProductCart product={p} ></ProductCart>
            </div>
          );
        })}
        <Button
          className="m-2 relative w-[90%] md:w-[40%] lg:w-[31%] snap-center flex-none h-full md:hidden"
          variant="ghost"
        >
          <AspectRatio ratio={1} className="">
            <Link
              href={"/products/tisort"}
              className="flex-col flex items-center justify-center h-full w-full"
            >
              <ArrowRight></ArrowRight>
              Tümünü gör
            </Link>
          </AspectRatio>
        </Button>
      </div>
        </div>
    );
}
