-- DropForeignKey
ALTER TABLE "UserFavoriteMovie" DROP CONSTRAINT "UserFavoriteMovie_movieId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavoriteMovie" DROP CONSTRAINT "UserFavoriteMovie_userId_fkey";

-- CreateTable
CREATE TABLE "UserRecentSearchMovie" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "searchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRecentSearchMovie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserRecentSearchMovie_userId_searchedAt_idx" ON "UserRecentSearchMovie"("userId", "searchedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "UserRecentSearchMovie_userId_movieId_key" ON "UserRecentSearchMovie"("userId", "movieId");

-- AddForeignKey
ALTER TABLE "UserFavoriteMovie" ADD CONSTRAINT "UserFavoriteMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteMovie" ADD CONSTRAINT "UserFavoriteMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecentSearchMovie" ADD CONSTRAINT "UserRecentSearchMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRecentSearchMovie" ADD CONSTRAINT "UserRecentSearchMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
