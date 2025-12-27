-- CreateTable
CREATE TABLE "public"."Stake" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "amountTokens" INTEGER NOT NULL,
    "userUsername" TEXT NOT NULL,
    "isClaimed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Stake_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Stake" ADD CONSTRAINT "Stake_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Stake" ADD CONSTRAINT "Stake_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "public"."User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
