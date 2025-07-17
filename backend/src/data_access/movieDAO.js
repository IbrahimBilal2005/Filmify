const prisma = require('../utils/prismaClient');

// Include related models for movie queries
const movieInclude = {
  genre: true,
  director: true,
  actors: {
    include: { actor: true },
  },
};

const MovieDAO = {
    
  // Get all movies
  async getAllMovies() {
    return await prisma.movie.findMany({ include: movieInclude });
  },

  // Get a movie by slug
  async getMovieBySlug(slug) {
    return await prisma.movie.findUnique({
      where: { slug },
      include: movieInclude,
    });
  },

  // Search movies by title
  async searchMovies(query) {
    return await prisma.movie.findMany({
      where: {
        title: { contains: query, mode: 'insensitive' },
      },
      include: movieInclude,
    });
  },

  // Get movies by genre
  async getMoviesByGenre(genreId) {
    return await prisma.movie.findMany({
        where: { genreId },
        include: movieInclude,
    });
  },

  // Get all genres
  async getAllGenres() {
    return await prisma.genre.findMany({
      orderBy: { name: 'asc' }
    });
  },

};

module.exports = MovieDAO;
