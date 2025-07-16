const express = require('express');
const app = express();
const PORT = 3000;

require('dotenv').config();
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

app.use(express.json());

// Helper for full movie data
const movieInclude = {
  genre: true,
  director: true,
  actors: {
    include: { actor: true },
  },
};

// ==============================
// DAO Layer
// ==============================

const FavoriteDAO = {
  async getFavoritesByUserId(userId) {
    // Remove parseInt validation - accept UUID strings
    if (!userId) throw new Error('Invalid userId');

    return prisma.userFavoriteMovie.findMany({
      where: { userId: userId }, // Use userId directly (string/UUID)
      include: {
        movie: {
          include: {
            genre: true,
            director: true,
            actors: {
              include: {
                actor: true
              }
            }
          }
        }
      }
    });
  },

  async upsertFavorite(userId, movieId) {
    return prisma.userFavoriteMovie.upsert({
      where: {
        userId_movieId: { userId, movieId },
      },
      update: {},
      create: { userId, movieId },
    });
  },
};

// ==============================
// Service Layer
// ==============================

const FavoriteService = {
  async getUserFavorites(userId) {
    const favorites = await FavoriteDAO.getFavoritesByUserId(userId);
    return favorites.map((f) => f.movie);
  },

  async addOrUpdateFavorite(userId, movieId) {
    return FavoriteDAO.upsertFavorite(userId, movieId);
  },
};

// ==============================
// Favorite Routes (use router)
// ==============================
const favoriteRoutes = require('./src/routes/favoriteRoutes');
app.use('/', favoriteRoutes);

// ==============================
// Movies
// ==============================

// Get all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({ include: movieInclude });
    res.json(movies);
  } catch (error) {
    console.error('GET /movies error:', error);
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});

// Search movies by title
app.get('/movies/search', async (req, res) => {
  const query = req.query.query?.toString().trim();
  if (!query) return res.status(400).json({ error: 'Missing query parameter' });

  try {
    const results = await prisma.movie.findMany({
      where: {
        title: { contains: query, mode: 'insensitive' },
      },
      include: movieInclude,
    });

    if (results.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(results);
  } catch (error) {
    console.error('GET /movies/search error:', error);
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});

// Get a movie by slug
app.get('/movies/:slug', async (req, res) => {
  try {
    const movie = await prisma.movie.findUnique({
      where: { slug: req.params.slug },
      include: movieInclude,
    });

    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    console.error('GET /movies/:slug error:', error);
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});

// ==============================

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});