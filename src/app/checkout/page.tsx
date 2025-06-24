import dynamic from "next/dynamic";
import { auth } from "../../auth";
import OrderDetailMobile from "./order_detail_mobile";
import OrderDetail from "./order_detail";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { productSchema, productSizeSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import cities from "@/../public/locations.json"
import { Locations } from "@/types";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    isFast: boolean,
    productId: string,
    size: string,
  }
}) {
  const session = await auth();
  let Form: React.ComponentType<{ isFast: boolean, productId: string, size: string,cities:Locations[] }>;
  let product = searchParams.isFast ? await db.query.productSchema.findFirst({
    where: eq(productSchema.id, searchParams.productId),
    with: {
      productSize: {
        where: eq(productSizeSchema.size, searchParams.size)
      }
    }
  }) : undefined;

  if (session === null) {
    Form = dynamic(() => import("./form_un_auth"));
  } else {
    Form = dynamic(() => import("./form_auth"));
  }

  if (searchParams.isFast && !product) {
    return (<div className=" flex w-full items-center justify-center text-xl py-32">
      <div className="flex flex-col items-center">
        <div>
          Aradığınız ürün bulunamadı.
        </div>
        <Button variant="link" className="pt-6">
          <Link
            href="/"
            className="flex items-center"
          >
            Ana sayfaya git <ArrowUpRight></ArrowUpRight>
          </Link>
        </Button>
      </div>
    </div>)
  }

  return (
    <div className=" md:grid md:grid-cols-2 ">

      <OrderDetailMobile></OrderDetailMobile>
      <div className=" flex flex-col items-end">
        <Form isFast={searchParams.isFast} productId={searchParams.productId} size={searchParams.size} cities={cities as Locations[]}></Form>
      </div>
      <OrderDetail></OrderDetail>
    </div>
  );
}

