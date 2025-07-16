const FavoriteService = require('../services/favoriteService');

const FavoriteController = {
  async getFavorites(req, res) {
    try {
      const userId = req.params.id; // Don't parse as int - keep as string
      const movies = await FavoriteService.getUserFavorites(userId);
      res.json(movies);
    } catch (error) {
      console.error('GET /users/:id/favorites error:', error);
      res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
  },

  async addFavorite(req, res) {
    try {
      const userId = req.params.id; // Don't parse as int - keep as string
      const { movieId } = req.body;

      if (!movieId) return res.status(400).json({ error: 'Missing movieId in body' });

      const fav = await FavoriteService.addOrUpdateFavorite(userId, movieId);
      res.status(201).json(fav);
    } catch (error) {
      console.error('POST /users/:id/favorites error:', error);
      res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
  },

    async deleteFavorite(req, res) {
    try {
        const userId = req.params.id;
        const movieId = parseInt(req.params.movieId, 10);
        if (!movieId) return res.status(400).json({ error: 'Missing movieId in params' });
        await FavoriteService.deleteFavorite(userId, movieId);
        res.status(204).send();
    } catch (error) {
        console.error('DELETE /users/:id/favorites/:movieId error:', error);
        res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
    },

};

module.exports = FavoriteController;