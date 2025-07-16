const FavoriteDAO = require('../data_access/favoriteDAO');

const FavoriteService = {
  async getUserFavorites(userId) {
    const favorites = await FavoriteDAO.getFavoritesByUserId(userId);
    return favorites.map(f => f.movie);
  },

  async addOrUpdateFavorite(userId, movieId) {
    return await FavoriteDAO.upsertFavorite(userId, movieId);
  },

  async deleteFavorite(userId, movieId) {
    return await FavoriteDAO.deleteFavorite(userId, movieId);
  },
};

module.exports = FavoriteService;
