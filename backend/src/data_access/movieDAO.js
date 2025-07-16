const prisma = require('../utils/prismaClient');

const movieInclude = {
  genre: true,
  director: true,
  actors: {
    include: { actor: true },
  },
};

const MovieDAO = {
  async getAllMovies() {
    return await prisma.movie.findMany({ include: movieInclude });
  },

  async getMovieBySlug(slug) {
    return await prisma.movie.findUnique({
      where: { slug },
      include: movieInclude,
    });
  },

  async searchMovies(query) {
    return await prisma.movie.findMany({
      where: {
        title: { contains: query, mode: 'insensitive' },
      },
      include: movieInclude,
    });
  },
};

module.exports = MovieDAO;
