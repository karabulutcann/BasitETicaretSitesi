ALTER TABLE "payment" ADD COLUMN "is_success" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_token_unique" UNIQUE("token");