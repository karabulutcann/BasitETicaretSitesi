import { db } from "@/db";
import { ProductSize, productSizeSchema } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";

export interface GetAllProductSizesRequest {
  productId: string;
}
export interface GetAllProductSizesResponse {
  productSizes: ProductSize[];
}

export async function POST(req: Request) {
  try {
    const data: GetAllProductSizesRequest = await req.json();

    let productSizes = await db.query.productSizeSchema.findMany({
      where: and(
        eq(productSizeSchema.productId, data.productId),
      ),
      orderBy: [asc(productSizeSchema.priority)],
    });
    if (!productSizes) {
      return new Response(JSON.stringify({ err: "product size not found" }), {
        status: 400,
      });
    }
    return new Response(
      JSON.stringify({
        productSizes: productSizes,
      } as GetAllProductSizesResponse),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ err: "something went wrong" }), {
      status: 500,
    });
  }
}
