export const dynamic = 'force-static'

import { revalidateTag, unstable_cache } from "next/cache";
import { db } from "@/db";
import {
  categorySchema,
 productSchema,
} from "@/db/schema";
import { eq, not } from "drizzle-orm";
import { TH1 } from "@/components/typography";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCart from "@/components/product_cart";
import { Product } from "@/types/product";

export async function generateStaticParams() {
  const categories = await db.query.categorySchema.findMany({});

  let categoryId = categories.map((c) => {
    return { id: c.id.toString() };
  });
 
  categoryId.push({ id: "a0" }, { id: "a1" });
  return categoryId;
}

const getCachedCategoryWithProducts = unstable_cache(
  async (categoryId: string) => {
    if (categoryId === "a0") {
      const products = await db.query.productSchema.findMany({});
      const categories = await db.query.categorySchema.findMany({});

      return {
        id: 0,
        name: "Tüm Ürünler",
        link: "tum-urunler",
        products: products,
        subCategories: categories,
      };
    }

    if (categoryId === "a1") {
      const products = await db.query.productSchema.findMany({
        where: not(eq(productSchema.discount, 0)),
      });
      const categories = await db.query.categorySchema.findMany({});

      return {
        id: 0,
        name: "İndirimde",
        link: "indirimde",
        products: products,
        subCategories: categories,
      };
    }

    const parsedId: number | typeof NaN = parseFloat(categoryId);

    if (Number.isNaN(parsedId)) notFound();

    const categoryWithProducts = await db.query.categorySchema.findFirst({
      where: eq(categorySchema.id, parsedId),
      with: {
        categoryToProduct: {
          with: {
            product: true,
          },
        },
        category: {
          with: {
            subCategory: true,
          },
        },
      },
    });
    if (!categoryWithProducts) return undefined;

    return {
      id: categoryWithProducts?.id,
      name: categoryWithProducts?.name,
      link: categoryWithProducts?.link,
      products: categoryWithProducts?.categoryToProduct.map((c) => c.product),
      subCategories: categoryWithProducts?.category.map((c) => c.subCategory),
    };
  },
  ["category-with-products-main"],
  {
    tags: ["category-with-products-main"],
  },
);

export default async function Page({ params }: { params: { id: string } }) {
  if (!params.id) notFound();
  
  let categoryWithProducts: any;
  try {
    categoryWithProducts = await getCachedCategoryWithProducts(params.id);
  } catch (error) {
    throw new Error("Beklenmedik bir hata oluştu", { cause: 1 });
  }

  if (
    categoryWithProducts === undefined ||
    categoryWithProducts.products === undefined ||
    categoryWithProducts.products.length === 0
  ) {
    notFound();
  }

  return (
    <div className="pt-6">
      <div className="md:px-8">
      <div className="px-3 md:pt-4">
        <h1 className="text-3xl md:text-5xl">{categoryWithProducts?.name}</h1>
      </div>

      <div className=" sm:block flex overflow-x-auto no-scrollbar px-2 py-4">
        {(
          categoryWithProducts as {
            subCategories: { name: string; link: string; id: number }[];
          }
        ).subCategories?.map((c, i) => {
          return (
            <Link href={`/products/${c?.link}/${c?.id}`} key={i}>
              <Button variant="ghost" className="text-xs underline">
                {c?.name}
              </Button>
            </Link>
          );
        })}
      </div>
      </div>
      <div className="grid lg:grid-cols-3 2xl:grid-cols-4 gap-x-1 grid-cols-2 m-1">
        {(
          categoryWithProducts as {
            products: Product[];
          }
        ).products?.map((p: Product, i) => {
          return (
            <div key={i}>
              <ProductCart product={p}></ProductCart>
            </div>
          );
        })}
      </div>
    </div>
  );
}
