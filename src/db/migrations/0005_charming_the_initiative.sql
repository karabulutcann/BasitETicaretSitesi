CREATE TABLE IF NOT EXISTS "payment" (
	"cuid" text PRIMARY KEY NOT NULL,
	"token" varchar(64) NOT NULL,
	"user_data" json NOT NULL,
	"order_data" json NOT NULL
);
