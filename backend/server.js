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

// ==============================
// Movie Routes (use router)
// ==============================
const movieRoutes = require('./src/routes/movieRoutes');
app.use('/', movieRoutes);

// ==============================

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});