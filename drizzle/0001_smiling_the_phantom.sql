DO $$ BEGIN
 CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'non_binary', 'other', 'prefer_not_to_say');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gender" "gender";