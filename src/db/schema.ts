import { createId } from "@paralleldrive/cuid2";
import { randomInt } from "crypto";
import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  serial,
  text,
  varchar,
  decimal,
  integer,
  primaryKey,
  json,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const addressTypeEnum = pgEnum("address_type", [
  "home",
  "work",
  "other",
]);

export type addressTypeEnumType = "home" | "work" | "other";

export const orderStatusEnum = pgEnum("order_status", [
  "hazırlanıyor",
  "kargoya verildi",
  "yola çıktı",
  "teslim edildi",
]);

export type orderStatusEnumType = "hazırlanıyor" | "kargoya verildi" | "yola çıktı"| "teslim edildi";

export const userSchema = pgTable("users", {
  id: text("cuid")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar("name", { length: 64 }).notNull(),
  email: varchar("email", { length: 256 }).unique(),
  phone: varchar("phone", { length: 16 }).notNull(),
  password: varchar("password", { length: 60 }).notNull(),
  isGuest: boolean("is_guest").notNull().default(false),
  isStuff: boolean("is_stuff").notNull().default(false),
});

export const emailVerificationSchema = pgTable("email_verification", {
  id: text("cuid")
    .$defaultFn(() => createId())
    .primaryKey(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  name: varchar("name", { length: 64 }).notNull(),
  password: varchar("password", { length: 60 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  verifyCode: varchar("verify_code", { length: 6 }).$defaultFn(() => randomInt(100000,1000000).toString()).notNull(),
});

export const addressSchema = pgTable("addresses", {
  id: text("cuid")
  .$defaultFn(() => createId())
  .primaryKey(),
  addressName: varchar("address_name", { length: 32 }).notNull(),
  addressType: addressTypeEnum("address_type").notNull(),
  city: varchar("city", { length: 128 }).notNull(),
  district: varchar("district", { length: 128 }).notNull(),
  address: text("address").notNull(),
  userId: text("user_id").references(() => userSchema.id).notNull(),
});

export const addressRelations = relations(addressSchema, ({ many, one }) => ({
  user: one(userSchema, {
    fields: [addressSchema.userId],
    references: [userSchema.id],
  }),
}));

export const paymentSchema = pgTable("payment", {
  id: text("cuid")
  .$defaultFn(() => createId())
  .primaryKey(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  userData: json("user_data").notNull(),
  orderData: json("order_data").notNull(),
  isSuccess: boolean("is_success").notNull().default(false),
})

export type paymentSchemaType = typeof paymentSchema.$inferSelect;

export const orderSchema = pgTable("order", {
  id: text("cuid")
  .$defaultFn(() => createId())
  .primaryKey(),
  email: varchar("email", { length: 256 }).notNull(),
  orderNumber: varchar("order_number", { length: 12 }).$defaultFn(() => randomInt(100000000000,1000000000000).toString()).notNull().unique(),
  totalPrice: decimal("total_price").notNull(),
  status: orderStatusEnum("status").notNull(),
  cargoType: varchar("cargo_type", { length: 64 }).notNull(),
  cargoPrice: decimal("cargo_price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  hasBeenShippedAt: timestamp("has_been_shipped_at"),
  onTheWayAt: timestamp("on_the_way_at"),
  deliveredAt: timestamp("delivered_at"),
  billUrl: varchar("bill_url", { length: 512 }),
  addressId: text("address_id").references(() => addressSchema.id).notNull(),
  cardLastNumbers:varchar("card_last_numbers", { length: 4 }),
  cardType:varchar("card_type", { length: 32 }),
  userId: text("user_id").references(() => userSchema.id).notNull(),
});

export const orderRelations = relations(orderSchema, ({ one, many }) => ({
  address: one(addressSchema, {
    references: [addressSchema.id],
    fields: [orderSchema.addressId],
  }),
  user: one(userSchema, {
    fields: [orderSchema.userId],
    references: [userSchema.id],
  }),
  orderDetail: many(orderDetailSchema),
}));

export const orderDetailSchema = pgTable("order_detail", {
  id: text("cuid")
  .$defaultFn(() => createId())
  .primaryKey(),
  productCount: integer("product_count").notNull(),
  size: text("size").notNull(),
  productId: text("product_id").references(() => productSchema.id, {onDelete: "cascade"}).notNull(),
  orderId: text("order_id").references(() => orderSchema.id, {onDelete: "cascade"}).notNull(),
});

export const orderDetailRelations = relations(orderDetailSchema, ({ one }) => ({
  product: one(productSchema, {
    fields: [orderDetailSchema.productId],
    references: [productSchema.id],
  }),
  order: one(orderSchema, {
    fields: [orderDetailSchema.orderId],
    references: [orderSchema.id],
  }),
}));

export const cartSchema = pgTable("cart", {
  id: text("cuid")
  .$defaultFn(() => createId())
  .primaryKey(),
  productCount: integer("product_count").notNull(),
  size: text("size").notNull(),
  productId: text("product_id")
    .references(() => productSchema.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => userSchema.id, { onDelete: "cascade" })
    .notNull(),
});

export const cartRelations = relations(cartSchema, ({ one }) => ({
  product: one(productSchema, {
    fields: [cartSchema.productId],
    references: [productSchema.id],
  }),
  user: one(userSchema, {
    fields: [cartSchema.userId],
    references: [userSchema.id],
  }),
}));

export const categorySchema = pgTable("category", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  link: varchar("link", { length: 512 }).notNull(),
});

export const categoryRelations = relations(categorySchema, ({ many }) => ({
  categoryToProduct: many(categoryToProduct),
  category: many(categoryToCategorySchema, {
    relationName: "category",
  }),
  subCategory: many(categoryToCategorySchema, {
    relationName: "subCategory",
  }),
}));

export const categoryToCategorySchema = pgTable("category_to_category", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categorySchema.id),
  subCategoryId: integer("sub_category_id").references(() => categorySchema.id),
});

export const categoryToCategoryRelations = relations(
  categoryToCategorySchema,
  ({ one }) => ({
    category: one(categorySchema, {
      fields: [categoryToCategorySchema.categoryId],
      references: [categorySchema.id],
      relationName: "category",
    }),
    subCategory: one(categorySchema, {
      fields: [categoryToCategorySchema.subCategoryId],
      references: [categorySchema.id],
      relationName: "subCategory",
    }),
  }),
);

export const productSchema = pgTable("product", {
  id: text("cuid")
  .$defaultFn(() => createId())
  .primaryKey(),
  name: varchar("name", { length: 1024 }).notNull(),
  link: varchar("link", { length: 512 }).unique().notNull(),
  description: text("description"),
  price: decimal("price").notNull(),
  discount: integer("discount").default(0),
  discountedPrice: decimal("discounted_price").default("0"),
  imageUrls: json("image_urls").notNull(),
  detail: json("detail"),
  sizeChartId : integer("size_chart_id").references(() => sizeChartSchema.id),
});

export const productRelations = relations(productSchema, ({ many,one }) => ({
  productSize: many(productSizeSchema),
  cart: many(cartSchema),
  orderDetail: many(orderDetailSchema),
  categoryToProduct: many(categoryToProduct),
  sizeChart: one(sizeChartSchema, {
    fields: [productSchema.sizeChartId],
    references: [sizeChartSchema.id],
    relationName: "subCategory",
  }),
}));

export const productSizeSchema = pgTable("product_size", {
  id: serial("id").primaryKey(),
  size: text("size").notNull(),
  stock: integer("stock").notNull(),
  priority: integer("priority").notNull(),
  productId: text("product_id")
    .references(() => productSchema.id, { onDelete: "cascade" })
    .notNull(),
});

export const productSizeRelations = relations(productSizeSchema, ({ one }) => ({
  product: one(productSchema, {
    fields: [productSizeSchema.productId],
    references: [productSchema.id],
  }),
}));

export const sizeChartSchema = pgTable("size_chart",{
  id: serial("id").primaryKey(),
  chart: json("chart"),
  sizeChartImage: varchar("size_chart_image"),
  guidance:json("guidance")
});

export const sizeChartRelation = relations(sizeChartSchema,({many})=>({
  product:many(productSchema)
}))

export const categoryToProduct = pgTable(
  "category_to_product",
  {
    categoryId: integer("category_id")
      .notNull()
      .references(() => categorySchema.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => productSchema.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.categoryId, t.productId] }),
  }),
);

export const categoryToProductRelations = relations(
  categoryToProduct,
  ({ one }) => ({
    category: one(categorySchema, {
      fields: [categoryToProduct.categoryId],
      references: [categorySchema.id],
    }),
    product: one(productSchema, {
      fields: [categoryToProduct.productId],
      references: [productSchema.id],
    }),
  }),
);

export type User = typeof userSchema.$inferSelect; // return type when queried
export type NewUser = typeof userSchema.$inferInsert; // insert type

export type ProductSize = typeof productSizeSchema.$inferSelect;

export type Product = typeof productSchema.$inferSelect;
export type Address = typeof addressSchema.$inferSelect;

type SizeChartType = typeof sizeChartSchema.$inferSelect;

export interface Chart {
  size: string,
  A: number,
  B: number,
  C: number,
  D: number,
  E: number
}

export interface SizeChart extends SizeChartType {
  guidance : {
    header:string,
    text:string,
  }|unknown,
  chart:Chart[]|unknown
}
