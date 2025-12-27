/*
  Warnings:

  - You are about to drop the column `amountTokens` on the `Stake` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Stake" DROP COLUMN "amountTokens",
ADD COLUMN     "noTokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "yesTokens" INTEGER NOT NULL DEFAULT 0;
