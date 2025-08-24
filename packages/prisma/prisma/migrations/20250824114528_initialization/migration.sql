-- CreateEnum
CREATE TYPE "public"."GameType" AS ENUM ('SP', 'MP');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('Completed', 'Scheduled', 'Pending');

-- CreateTable
CREATE TABLE "public"."User" (
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Match" (
    "id" TEXT NOT NULL,
    "user1_Id" TEXT NOT NULL,
    "user2_Id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."Status" NOT NULL DEFAULT 'Pending',
    "ExpiresAt" TIMESTAMP(3) NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Game" (
    "id" TEXT NOT NULL,
    "GameName" TEXT NOT NULL,
    "GameDescription" TEXT NOT NULL,
    "GameImage" TEXT NOT NULL,
    "GameLink" TEXT NOT NULL,
    "GameType" "public"."GameType" NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Game_GameName_key" ON "public"."Game"("GameName");

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_user1_Id_fkey" FOREIGN KEY ("user1_Id") REFERENCES "public"."User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_user2_Id_fkey" FOREIGN KEY ("user2_Id") REFERENCES "public"."User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
