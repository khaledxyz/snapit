CREATE TABLE "urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"short_code" text NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"password" text DEFAULT '' NOT NULL,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "urls_short_code_unique" UNIQUE("short_code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text DEFAULT '' NOT NULL,
	"email" text NOT NULL,
	"password" text DEFAULT '' NOT NULL,
	"providers" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;