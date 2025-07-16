/*
  Warnings:

  - You are about to drop the column `authUserId` on the `UserFavoriteMovie` table. All the data in the column will be lost.
  - You are about to drop the `UserRecentSearchMovie` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,movieId]` on the table `UserFavoriteMovie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `UserFavoriteMovie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserFavoriteMovie" DROP CONSTRAINT "UserFavoriteMovie_movieId_fkey";

-- DropForeignKey
ALTER TABLE "UserRecentSearchMovie" DROP CONSTRAINT "UserRecentSearchMovie_movieId_fkey";

-- DropIndex
DROP INDEX "UserFavoriteMovie_authUserId_idx";

-- DropIndex
DROP INDEX "UserFavoriteMovie_authUserId_movieId_key";

-- AlterTable
ALTER TABLE "UserFavoriteMovie" DROP COLUMN "authUserId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserRecentSearchMovie";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRecentSearch" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "searchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRecentSearch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "UserRecentSearch_userId_idx" ON "UserRecentSearch"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRecentSearch_userId_movieId_key" ON "UserRecentSearch"("userId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteMovie_userId_movieId_key" ON "UserFavoriteMovie"("userId", "movieId");

-- AddForeignKey
ALTER TABLE "UserRecentSearch" ADD CONSTRAINT "UserRecentSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecentSearch" ADD CONSTRAINT "UserRecentSearch_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteMovie" ADD CONSTRAINT "UserFavoriteMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteMovie" ADD CONSTRAINT "UserFavoriteMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
