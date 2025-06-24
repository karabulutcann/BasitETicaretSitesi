import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { Pool } from "pg";
import { eq } from "drizzle-orm";

const pool = new Pool({
  connectionString:
    process.env.DB_CONNECTION_STRING,
});

export const db = drizzle(pool, {
  schema,
});

// const detail = {
//   description: [
//     {
//       tag: "div",
//       className: "",
//       children: [
//         {
//           tag: "text",
//           text: "Çubuklu Polo Yaka T-shirt - Lacivert, ağır gramajlı %100 yıkamalı pamuktan üretilmiş olup, dayanıklılık ve uzun ömürlülük sağlamak amacıyla baskıda özel mürekkep ve teknoloji kullanılmıştır. Snake Oversize Basic T-Shirt - Antrasit, %80 pamuk ve %20 polyester karışımından oluşan geniş kalıp bir üründür. Ürünlerimiz ilk aşamadan itibaren çevreye ve ekolojik dengeye duyarlı üretimi benimseyen sertifikalara sahiptir.",
//         },
//       ],
//     },
//   ],
//   materialAndCare: [
//     {
//       tag: "div",
//       className: "",
//       children: [
//         {
//           tag: "text",
//           text: "ANA KUMAŞ",
//         },
//         {
//           tag: "br",
//         },
//         {
//           tag: "text",
//           text: "58% polyester",
//         },
//         {
//           tag: "br",
//         },
//         {
//           tag: "text",
//           text: "42% pamuk",
//         },
//         {
//           tag: "br",
//         },
//         {
//           tag: "text",
//           text: "İKİNCİL TEKSTİL",
//         },
//         {
//           tag: "br",
//         },
//         {
//           tag: "text",
//           text: "97% pamuk",
//         },
//         {
//           tag: "br",
//         },
//         {
//           tag: "text",
//           text: "3% elastan",
//         },
//       ],
//     },
//   ],
//   exchangeAndReturn:[
//     {
//       tag: "text",
//       text: "Siparişler genellikle 1 iş günü içinde kargoya verilir. Hafta içi 16:00’ya kadar verilen siparişler aynı gün kargoya verilir. Sipariş takibi e-posta ile gönderilen takip linkinden yapılabilir. Satın alınan ürünler 14 gün içinde ücretsiz iade veya değişim yapılabilir.",
//     }
//   ]
// };

// const test = async () => {
//   const products = await db.query.productSchema.findMany();
//   products.map(async (p) => {
//     console.log();
//     await db
//       .update(schema.productSchema)
//       .set({
//         detail: JSON.stringify(detail),
//       })
//       .where(eq(schema.productSchema.id, p.id));
//   });
// };

// test();
