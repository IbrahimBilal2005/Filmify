const prisma = require('../utils/prismaClient');

const movieInclude = {
  genre: true,
  director: true,
  actors: {
    include: { actor: true },
  },
};

const FavoriteDAO = {
  async getFavoritesByUserId(userId) {
    // Remove parseInt validation - accept UUID strings
    if (!userId) throw new Error('Invalid userId');

    return await prisma.userFavoriteMovie.findMany({
      where: { userId: userId }, // Use userId directly (string/UUID)
      include: { movie: { include: movieInclude } },
    });
  },

  async upsertFavorite(userId, movieId) {
    return await prisma.userFavoriteMovie.upsert({
      where: { userId_movieId: { userId, movieId } },
      update: {},
      create: { userId, movieId },
    });
  },

  async deleteFavorite(userId, movieId) {
    // Delete the favorite record for this user and movie
    return await prisma.userFavoriteMovie.delete({
      where: { userId_movieId: { userId, movieId } },
    });
  },
};

module.exports = FavoriteDAO;