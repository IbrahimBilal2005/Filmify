-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "overview" TEXT,
ADD COLUMN     "poster" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "releaseYear" TEXT,
ADD COLUMN     "trailerUrl" TEXT,
ALTER COLUMN "genre" DROP NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavoriteMovie" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,

    CONSTRAINT "UserFavoriteMovie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavoriteMovie_userId_movieId_key" ON "UserFavoriteMovie"("userId", "movieId");

-- AddForeignKey
ALTER TABLE "UserFavoriteMovie" ADD CONSTRAINT "UserFavoriteMovie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteMovie" ADD CONSTRAINT "UserFavoriteMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
