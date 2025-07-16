/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `userId` on the `UserFavoriteMovie` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `UserRecentSearch` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "UserFavoriteMovie" DROP CONSTRAINT "UserFavoriteMovie_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserRecentSearch" DROP CONSTRAINT "UserRecentSearch_userId_fkey";

-- AlterTable
ALTER TABLE "UserFavoriteMovie" DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "UserRecentSearch" DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteMovie_userId_movieId_key" ON "UserFavoriteMovie"("userId", "movieId");

-- CreateIndex
CREATE INDEX "UserRecentSearch_userId_idx" ON "UserRecentSearch"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRecentSearch_userId_movieId_key" ON "UserRecentSearch"("userId", "movieId");
