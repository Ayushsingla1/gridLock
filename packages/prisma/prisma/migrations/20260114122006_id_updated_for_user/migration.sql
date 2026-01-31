-- AlterTable
ALTER TABLE "public"."User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("username");

-- DropIndex
DROP INDEX "public"."User_username_key";
