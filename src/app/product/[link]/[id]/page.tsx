export const dynamic = "force-static";

import Stats from "@/app/(home)/stats";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { productSchema } from "@/db/schema";
import type { Metadata } from "next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { calculatePrice } from "@/components/price";
import { ProductDetail } from "@/types/product";
import { formatDetail } from "@/lib/format_detail";

import dynamicLoader from "next/dynamic";
const Form = dynamicLoader(() => import("./form"));
const ProductImageSlider = dynamicLoader(() => import("./image_slider"));

export async function generateStaticParams() {
  const products = await db.query.productSchema.findMany();

  return products.map((p) => {
    return { id: p.id.toString() };
  });
}

export async function generateMetadata({
  params,
}: {
  params: { id: string; link: string };
}): Promise<Metadata> {
  const product = await db.query.productSchema.findFirst({
    where: eq(productSchema.id, params.id),
    with: {
      productSize: true,
    },
  });
  if (!product) {
    throw new Error("1");
  }
  return {
    title: product?.name,
    description: product?.description,
  };
}

const getCachedProduct = unstable_cache(
  async (id: string) => {
    return await db.query.productSchema.findFirst({
      where: eq(productSchema.id, id),
      with: {
        sizeChart: true,
      },
    });
  },
  ["product-detail-main"],
  {
    tags: ["product-detail-main"],
  },
);

export default async function Page({ params }: { params: { id: string } }) {
  const product = await getCachedProduct(params.id);
  if (!product) {
    throw new Error("1");
  }

  return (
    <div className={"pt-6 "}>
      <div className="md:flex max-w-7xl w-full md:container mx-auto md:pr-12">
        <div className="flex flex-col md:flex-col-reverse md:basis-7/12 lg:basis-8/12 justify-end lg:px-8 max-md:h-screen">
          <ProductImageSlider
            imageUrls={product?.imageUrls as string[]}
            productName={product?.name!}
          ></ProductImageSlider>

          <div className="p-4 md:hidden basis-1/12">
            <h1 className={" font-semibold pb-1  "}>{product?.name}</h1>
            <h2 className={" text-white/75 text-xs "}>
              {product?.description}
            </h2>
            {product.discount === 0 ? (
              <div
                className={
                  "font-medium text-lg pt-4 flex  items-center max-sm:pb-4"
                }
              >
                {calculatePrice(parseFloat(product?.price))}
              </div>
            ) : (
              <div className="max-sm:pb-4 pt-4 flex justify-between pr-6">
                <div className="flex items-center ">
                  <span className={"font-medium pr-4 "}>
                    {calculatePrice(parseFloat(product?.discountedPrice!))}
                  </span>
                  <span
                    className={
                      "font-medium text-destructive line-through flex items-center pt-1 text-sm"
                    }
                  >
                    {calculatePrice(parseFloat(product?.price))}
                  </span>
                </div>
                <div className="pt-1">%{product.discount}</div>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 md:px-4 md:basis-5/12 lg:basis-4/12  w-full">
          <div className="hidden md:block sm:pb-6 ">
            <h1 className={"text-xl lg:text-2xl font-medium pb-2 "}>
              {product?.name}
            </h1>
            <h2 className={"pb-2 text-sm text-white/75"}>
              {product?.description}
            </h2>
            {product.discount === 0 ? (
              <div
                className={
                  "font-medium text-lg pt-4 flex  items-center max-sm:pb-4"
                }
              >
                {calculatePrice(parseFloat(product?.price))}
              </div>
            ) : (
              <div className="max-sm:pb-4 pt-4 flex justify-between pr-6">
                <div className="flex items-center ">
                  <span className={"font-medium text-lg pr-4"}>
                    {calculatePrice(parseFloat(product?.discountedPrice!))}
                  </span>
                  <span
                    className={
                      "font-medium text-destructive line-through flex items-center pt-1"
                    }
                  >
                    {calculatePrice(parseFloat(product?.price))}
                  </span>
                </div>
                <div className="pt-1">%{product.discount}</div>
              </div>
            )}
          </div>
          <Form product={product} sizeChart={product?.sizeChart!}></Form>
          <div className=" border-t ">
            <Accordion
              type="single"
              collapsible
              className=" w-full px-2 "
              defaultValue="item-1"
            >
              <AccordionItem value="item-1" className="px-2">
                <AccordionTrigger>
                  <h2 className={" "}>Ürün Açıklaması</h2>
                </AccordionTrigger>
                <AccordionContent className={" text-xs md:text-sm"}>
                { formatDetail((product?.detail as ProductDetail).description)}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="px-2 ">
                <AccordionTrigger>
                  <h2 className={" "}>Malzeme ve Bakım</h2>
                </AccordionTrigger>
                <AccordionContent className={"text-xs md:text-sm  "}>
                {formatDetail((product?.detail as ProductDetail).materialAndCare)}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="px-2">
                <AccordionTrigger>
                  <h2 className={" "}>Değişim ve İade</h2>
                </AccordionTrigger>
                <AccordionContent className={"text-xs md:text-sm"}>
                {formatDetail((product?.detail as ProductDetail).exchangeAndReturn)}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
