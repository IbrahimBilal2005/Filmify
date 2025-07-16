/*
  Warnings:

  - You are about to drop the column `userId` on the `UserFavoriteMovie` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserRecentSearchMovie` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[authUserId,movieId]` on the table `UserFavoriteMovie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[authUserId,movieId]` on the table `UserRecentSearchMovie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authUserId` to the `UserFavoriteMovie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authUserId` to the `UserRecentSearchMovie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserFavoriteMovie" DROP CONSTRAINT "UserFavoriteMovie_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserRecentSearchMovie" DROP CONSTRAINT "UserRecentSearchMovie_userId_fkey";

-- DropIndex
DROP INDEX "UserFavoriteMovie_userId_movieId_key";

-- DropIndex
DROP INDEX "UserRecentSearchMovie_userId_movieId_key";

-- DropIndex
DROP INDEX "UserRecentSearchMovie_userId_searchedAt_idx";

-- AlterTable
ALTER TABLE "UserFavoriteMovie" DROP COLUMN "userId",
ADD COLUMN     "authUserId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "UserRecentSearchMovie" DROP COLUMN "userId",
ADD COLUMN     "authUserId" UUID NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE INDEX "UserFavoriteMovie_authUserId_idx" ON "UserFavoriteMovie"("authUserId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteMovie_authUserId_movieId_key" ON "UserFavoriteMovie"("authUserId", "movieId");

-- CreateIndex
CREATE INDEX "UserRecentSearchMovie_authUserId_searchedAt_idx" ON "UserRecentSearchMovie"("authUserId", "searchedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "UserRecentSearchMovie_authUserId_movieId_key" ON "UserRecentSearchMovie"("authUserId", "movieId");
