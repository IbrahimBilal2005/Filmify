const prisma = require('../utils/prismaClient');

const RecentSearchDAO = {
  async addRecentSearch(userId, movieId) {
    return await prisma.userRecentSearch.upsert({
      where: { userId_movieId: { userId, movieId } },
      update: { searchedAt: new Date() },
      create: { userId, movieId }
    });
  },

  async getRecentSearches(userId, limit = 5) {
    return await prisma.userRecentSearch.findMany({
      where: { userId },
      orderBy: { searchedAt: 'desc' },
      take: limit,
      include: {
        movie: {
          include: {
            genre: true,
            director: true
          }
        }
      }
    });
  }
};

module.exports = RecentSearchDAO;
