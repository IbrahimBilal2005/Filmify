const MovieService = require('../services/movieService');

const MovieController = {
  async getAllMovies(req, res) {
    try {
      const movies = await MovieService.getAllMovies();
      res.json(movies);
    } catch (error) {
      console.error('GET /movies error:', error);
      res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
  },

  async getMovieBySlug(req, res) {
    try {
      const movie = await MovieService.getMovieBySlug(req.params.slug);
      if (!movie) return res.status(404).json({ error: 'Movie not found' });
      res.json(movie);
    } catch (error) {
      console.error('GET /movies/:slug error:', error);
      res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
  },

  async searchMovies(req, res) {
    const query = req.query.query?.toString().trim();
    if (!query) return res.status(400).json({ error: 'Missing query parameter' });
    try {
      const results = await MovieService.searchMovies(query);
      if (results.length === 0) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json(results);
    } catch (error) {
      console.error('GET /movies/search error:', error);
      res.status(500).json({ error: 'Something went wrong', details: error.message });
    }
  },
};

module.exports = MovieController;
