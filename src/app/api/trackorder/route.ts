import { db } from "@/db";
import { orderSchema } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
    const data: any = await req.json();
    const email = data.email;
    const orderNumber = data.orderNumber;
    try {
        const order = await db.query.orderSchema.findFirst({
            where: and(
                eq(orderSchema.email, email),
                eq(orderSchema.orderNumber, orderNumber),
            ),
        });
        if (!order) {
            return new Response(JSON.stringify({ err: "Bu email'a ait sipariş numarası bulunamadı" }), { status: 404 });
        }
        return new Response(JSON.stringify(order), { status: 200 });
    }
    catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ err: "Böyle bir sipariş numarası bulunamadı" }), { status: 500 });
    }
}