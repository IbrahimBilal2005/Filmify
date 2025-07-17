const MovieDAO = require('../data_access/movieDAO');

const MovieService = {
  async getAllMovies() {
    return await MovieDAO.getAllMovies();
  },

  async getMovieBySlug(slug) {
    return await MovieDAO.getMovieBySlug(slug);
  },

  async searchMovies(query) {
    return await MovieDAO.searchMovies(query);
  },

  async getAllGenres() {
    return await MovieDAO.getAllGenres();
  },

  async getMoviesByGenre(genreId) {
    return await MovieDAO.getMoviesByGenre(genreId);
  },
};

module.exports = MovieService;
