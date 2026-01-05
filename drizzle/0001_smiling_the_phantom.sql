CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'non_binary', 'other', 'prefer_not_to_say');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gender" "gender";