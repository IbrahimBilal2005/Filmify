const RecentSearchService = require('../services/recentSearchService');

const RecentSearchController = {
  async add(req, res) {
    const { userId, movieId } = req.body;
    if (!userId || !movieId) return res.status(400).json({ error: 'Missing userId or movieId' });

    try {
      const result = await RecentSearchService.addSearch(userId, movieId);
      res.json(result);
    } catch (err) {
      console.error('POST /recent-search error:', err);
      res.status(500).json({ error: 'Failed to save search', details: err.message });
    }
  },

  async get(req, res) {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'Missing userId param' });

    try {
      const results = await RecentSearchService.getSearches(userId);
      const movies = results.map((r) => r.movie);
      res.json(movies);
    } catch (err) {
      console.error('GET /recent-search error:', err);
      res.status(500).json({ error: 'Failed to fetch searches', details: err.message });
    }
  }
};

module.exports = RecentSearchController;
