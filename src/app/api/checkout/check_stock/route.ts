import { auth } from "../../../../auth";
import { checkStockAuth, checkStockUnAuth } from "@/lib/check_stock";


export type CheckStockRequest = {
  productId: string;
  productCount: number;
  size: string;
}[];

export interface NotInStockResponseAuth {
  code: number,
  data: {
    cartId: string;
    stock: number;
  }[]
}

export interface NotInStockResponseUnAuth {
  code: number,
  data: {
    productId: string;
    productCount: number;
    size: string;
    stock: number;
    err: string | undefined;
  }[]
}

export const POST = auth(async (req) => {
  const session = req.auth;

  try {

    if (!session) {
      const data: CheckStockRequest = await req.json();

      let notInStocks: {
        productId: string;
        productCount: number;
        size: string;
        stock: number;
        err: string | undefined;
      }[] = [];

      await checkStockUnAuth(data, notInStocks);

      if (notInStocks.length > 0) {
        return new Response(JSON.stringify({ code: 255, data: [...notInStocks] }), {
          status: 255,
        });
      }

      return new Response(JSON.stringify({ code: 200, data: [] }), {
        status: 200,
      });

    } else {
      
      const notInStocks: {
        cartId: string;
        stock: number;
      }[] = [];
      
      await checkStockAuth( notInStocks, session.user?.id!);
      
      if (notInStocks.length > 0) {
        return new Response(JSON.stringify({ code: 255, data: [...notInStocks] }), {
          status: 255,
        });
      }

      return new Response(JSON.stringify({ code: 200, data: [] }), {
        status: 200,
      });

    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ err: "there was an error", code: 500 }), {
      status: 500,
    });
  }
});


