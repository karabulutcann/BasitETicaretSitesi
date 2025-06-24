CREATE TABLE IF NOT EXISTS "email_verification" (
	"cuid" text PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"name" varchar(64) NOT NULL,
	"password" varchar(60) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"verify_code" varchar(6) NOT NULL
);
