import { CheckStockRequest } from "@/app/api/checkout/check_stock/route";
import { db } from "@/db";
import { cartSchema, productSizeSchema } from "@/db/schema";
import { Product } from "@/types/product";
import { and, eq, or } from "drizzle-orm";
import { IyzicoBasketItem } from "./iyzico";
import { OrderItemPayment } from "@/app/api/checkout/payment/route";

function getPrice(product: Product): string {
  return product.discount! > 0 ? product.discountedPrice! : product.price!;
}

function queryBuilder(data: CheckStockRequest, index: number): any {
  if (index + 1 === data.length) {
    return and(
      eq(productSizeSchema.productId, data[index].productId),
      eq(productSizeSchema.size, data[index].size),
    );
  } else {
    return or(
      and(
        eq(productSizeSchema.productId, data[index].productId),
        eq(productSizeSchema.size, data[index].size),
      ),
      queryBuilder(data, index + 1),
    );
  }
}
export async function checkStockUnAuth(
  data: CheckStockRequest,
  notInStocks: {
    productId: string | null;
    productCount: number;
    size: string;
    stock: number;
    err: string | undefined;
  }[],
  basketItems: IyzicoBasketItem[] = [],
  orderItems: OrderItemPayment[] = [],
): Promise<number> {
  let totalPrice: number = 0;
  const sizes = await db.query.productSizeSchema.findMany({
    where: queryBuilder(data, 0),
    with: {
      product: {
        with: {
          categoryToProduct: {
            with: {
              category: true,
            },
          },
        },
      },
    },
  });

  sizes.map((size) => {
    data.map((c) => {
      if (c.productId === size.productId && c.size === size.size) {
        if (!size) {
          notInStocks.push({
            ...c,
            stock: -1,
            err: "productSize not found",
          });
        } else if (size.stock < c.productCount) {
          notInStocks.push({
            ...c,
            stock: size.stock,
            err: undefined,
          });
        } else {
          totalPrice =
            totalPrice + parseInt(getPrice(size.product)) * c.productCount;

          orderItems.push({
            productCount: c.productCount,
            size: c.size,
            productId: size.product.id,
            productSizeId: size.id,
            unitPrice: getPrice(size.product),
          });

          // iyzico da basketItems da count değişkeni olmadığından count değeri kadar listeye ekliyorum
          Array.from({ length: c.productCount }).map((_, i) => {
            basketItems.push({
              id: size.product.id,
              price: getPrice(size.product),
              name: size.product.name,
              itemType: "PHYSICAL",
              category1: size.product.categoryToProduct[0].category.name,
              subTotalPrice: undefined,
              createdDate: undefined,
            });
          });
        }
      }
    });
  });
  return totalPrice;
}

export async function checkStockAuth(
  notInStocks: {
    cartId: string;
    stock: number;
  }[],
  userId: string,
): Promise<[IyzicoBasketItem[], number]> {
  let totalPrice = 0;
  let basketItems: IyzicoBasketItem[] = [];

  //TODO burada bütün productSizeları çekiyor sadece aynı size olanları çek
  const cart = await db.query.cartSchema.findMany({
    where: and(eq(cartSchema.userId, userId)),
    with: {
      product: {
        with: {
          //TODO bu işe yaramıyor cartShema yı değişken olarak almıyor
          // productSize: {
          //   where: (productSize, { eq }) => eq(productSize.size,cartSchema.size),
          // },
          productSize: true,
          categoryToProduct: {
            with: {
              category: true,
            },
          },
        },
      },
    },
  });

  cart.forEach((c) => {
    c.product.productSize.some((pSize) => {
      if (pSize.size === c.size) {
        if (pSize.stock < c.productCount) {
          notInStocks.push({
            cartId: c.id,
            stock: c.product.productSize[0].stock,
          });
        } else {
          // iyzico da basketItems da count değişkeni olmadığından count değeri kadar listeye ekliyorum
          Array.from({ length: c.productCount }).map((_, i) => {
            basketItems.push({
              id: c.product.id,
              price: getPrice(c.product),
              name: c.product.name,
              itemType: "PHYSICAL",
              category1: c.product.categoryToProduct[0].category.name,
              subTotalPrice: undefined,
              createdDate: undefined,
            });
          });

          totalPrice =
            totalPrice + parseFloat(getPrice(c.product)) * c.productCount;
        }
        return true;
      }
    });
  });

  if (notInStocks.length > 0) {
    notInStocks.map((item) => {
      if (item.stock === 0) {
        db.delete(cartSchema).where(eq(cartSchema.id, item.cartId));
      } else {
        db.update(cartSchema)
          .set({
            productCount: item.stock,
          })
          .where(and(eq(cartSchema.id, item.cartId)));
      }
    });
  }
  return [basketItems, totalPrice];
}
