/*
  Warnings:

  - The primary key for the `Stake` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Stake` table. All the data in the column will be lost.
  - You are about to drop the column `userUsername` on the `Stake` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[matchId,userId]` on the table `Stake` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Stake` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Stake" DROP CONSTRAINT "Stake_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Stake" DROP CONSTRAINT "Stake_userUsername_fkey";

-- AlterTable
ALTER TABLE "public"."Stake" DROP CONSTRAINT "Stake_pkey",
DROP COLUMN "id",
DROP COLUMN "userUsername",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stake_matchId_userId_key" ON "public"."Stake"("matchId", "userId");

-- AddForeignKey
ALTER TABLE "public"."Stake" ADD CONSTRAINT "Stake_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "public"."Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Stake" ADD CONSTRAINT "Stake_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
