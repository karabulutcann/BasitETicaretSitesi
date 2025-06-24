DO $$ BEGIN
 CREATE TYPE "public"."address_type" AS ENUM('home', 'work', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."order_status" AS ENUM('hazırlanıyor', 'kargoya verildi', 'yola çıktı', 'teslim edildi');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "addresses" (
	"cuid" text PRIMARY KEY NOT NULL,
	"address_name" varchar(32) NOT NULL,
	"address_type" "address_type" NOT NULL,
	"city" varchar(128) NOT NULL,
	"district" varchar(128) NOT NULL,
	"address" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cart" (
	"cuid" text PRIMARY KEY NOT NULL,
	"product_count" integer NOT NULL,
	"size" text NOT NULL,
	"product_id" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"link" varchar(512) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category_to_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer,
	"sub_category_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category_to_product" (
	"category_id" integer NOT NULL,
	"product_id" text NOT NULL,
	CONSTRAINT "category_to_product_category_id_product_id_pk" PRIMARY KEY("category_id","product_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_detail" (
	"cuid" text PRIMARY KEY NOT NULL,
	"product_count" integer NOT NULL,
	"size" text NOT NULL,
	"product_id" text NOT NULL,
	"order_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"cuid" text PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"order_number" varchar(12) NOT NULL,
	"total_price" numeric NOT NULL,
	"status" "order_status" NOT NULL,
	"cargo_type" varchar(64) NOT NULL,
	"cargo_price" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"on_the_way_at" timestamp,
	"delivered_at" timestamp,
	"bill_url" varchar(512),
	"address_id" text NOT NULL,
	"card_last_numbers" integer,
	"user_id" text NOT NULL,
	CONSTRAINT "order_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"cuid" text PRIMARY KEY NOT NULL,
	"name" varchar(1024) NOT NULL,
	"link" varchar(512) NOT NULL,
	"description" text,
	"price" numeric NOT NULL,
	"discount" integer DEFAULT 0,
	"discounted_price" numeric DEFAULT '0',
	"image_urls" json NOT NULL,
	"detail" json,
	"size_chart_id" integer,
	CONSTRAINT "product_link_unique" UNIQUE("link")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_size" (
	"id" serial PRIMARY KEY NOT NULL,
	"size" text NOT NULL,
	"stock" integer NOT NULL,
	"priority" integer,
	"product_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "size_chart" (
	"id" serial PRIMARY KEY NOT NULL,
	"chart" json,
	"size_chart_image" varchar,
	"guidance" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"cuid" text PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"email" varchar(256),
	"phone" varchar(16) NOT NULL,
	"password" varchar(60) NOT NULL,
	"is_guest" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_cuid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("cuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cart" ADD CONSTRAINT "cart_product_id_product_cuid_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("cuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_users_cuid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("cuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category_to_category" ADD CONSTRAINT "category_to_category_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category_to_category" ADD CONSTRAINT "category_to_category_sub_category_id_category_id_fk" FOREIGN KEY ("sub_category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category_to_product" ADD CONSTRAINT "category_to_product_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category_to_product" ADD CONSTRAINT "category_to_product_product_id_product_cuid_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("cuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_detail" ADD CONSTRAINT "order_detail_product_id_product_cuid_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("cuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_detail" ADD CONSTRAINT "order_detail_order_id_order_cuid_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("cuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_address_id_addresses_cuid_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("cuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_user_id_users_cuid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("cuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_size_chart_id_size_chart_id_fk" FOREIGN KEY ("size_chart_id") REFERENCES "public"."size_chart"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_size" ADD CONSTRAINT "product_size_product_id_product_cuid_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("cuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
