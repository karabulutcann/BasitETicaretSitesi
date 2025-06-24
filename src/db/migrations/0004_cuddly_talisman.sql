ALTER TABLE "product_size" ALTER COLUMN "priority" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_stuff" boolean DEFAULT false NOT NULL;