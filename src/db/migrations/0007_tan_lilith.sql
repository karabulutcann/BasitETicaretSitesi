ALTER TABLE "order" ALTER COLUMN "card_last_numbers" SET DATA TYPE varchar(4);--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "card_type" varchar(32);