-- AlterEnum
ALTER TYPE "public"."Status" ADD VALUE 'rejected';

-- AlterTable
ALTER TABLE "public"."Match" ADD COLUMN     "winnerId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "public"."User"("username") ON DELETE SET NULL ON UPDATE CASCADE;
