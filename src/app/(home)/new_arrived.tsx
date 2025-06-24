import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { chillax } from "@/app/fonts";
import { TH1, TH2, TP } from "@/components/typography";
import { db } from "@/db";
import ProductCart from "../../components/product_cart";
import { Product } from "@/types/product";

// snap-x snap-mandatory overflow-x-auto  flex scroll2 pb-6

export default async function NewArrived({header}: {header: string}) {
  let products: Product[] = [];
  try {
    products = await db.query.productSchema.findMany();
  } catch (error) {
    console.log(error);
  }

  return (
    <div className=" flex flex-col justify-center w-full  ">
      <div className="pb-2 sm:pb-6 px-4 xl:px-8 xl:pb-8">
        <h2 className="text-3xl lg:text-4xl xl:text-5xl">{header}</h2>
      </div>

      <div className=" lg:pl-4  gap-x-1  snap-x snap-mandatory overflow-x-auto  flex scroll2">
        {products.map((p, i) => {
          return (
            <div
              className=" relative w-[80%] sm:w-[40%] lg:w-[31%] 2xl:w-[28%] snap-center flex-none h-full"
              key={i}
            >
              <ProductCart product={p}></ProductCart>
            </div>
          );
        })}
        <Button
          className=" relative w-[80%] sm:w-[40%] mt-4  lg:w-[31%] 2xl:w-[28%] rounded-none snap-center flex-none h-full"
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

<Link
  href={"/product/"}
  className="m-2 relative w-[90%] md:w-[40%] lg:w-[31%] snap-center flex-none "
>
  <AspectRatio ratio={1} className="">
    <Image
      className="object-cover"
      src="/hoodie/boxy-fit-kapusonlu-sweatshirt/1.jpg"
      alt="hoodie"
      fill
    ></Image>
  </AspectRatio>
  <div className=" pt-3 px-2.5 sm:px-0">
    <div className={" " + chillax.className}>
      <TP>Boxy Fit Kapusonlu Sweatşlık</TP>
    </div>
    <div className={" " + chillax.className}>
      <TP>1.500,00 ₺</TP>
    </div>
  </div>
</Link>;
