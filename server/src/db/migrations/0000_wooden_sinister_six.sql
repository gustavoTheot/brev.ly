CREATE TABLE "Url" (
	"id" text PRIMARY KEY NOT NULL,
	"originalUrl" text NOT NULL,
	"shortUrl" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"userCounter" integer DEFAULT 0 NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "Url_shortUrl_unique" UNIQUE("shortUrl")
);
