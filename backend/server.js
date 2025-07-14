const express = require('express');
const app = express();
const PORT = 3000;

require('dotenv').config();
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

app.use(express.json());

// 🔧 Slugify for clean URLs
function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

// Helper to include full movie details
const movieInclude = {
  genre: true,
  director: true,
  actors: {
    include: { actor: true }
  }
};

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
  console.log('✅ /movies/search route loaded');

  const rawQuery = req.query.query;
  const query = rawQuery?.toString().trim();

  console.log('🔍 Incoming search query:', query);

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    const results = await prisma.movie.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive'
        }
      },
      include: {
        genre: true,
        director: true,
        actors: {
          include: { actor: true }
        }
      }
    });

    console.log(`🎬 Found ${results.length} result(s) for "${query}"`);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(results);
  } catch (error) {
    console.error('❌ GET /movies/search error:', error);
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});

// Get a movie by slug
app.get('/movies/:slug', async (req, res) => {
  try {
    const movie = await prisma.movie.findUnique({
      where: { slug: req.params.slug },
      include: movieInclude
    });

    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    console.error('GET /movies/:slug error:', error);
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});





// ==============================
// Favorites
// ==============================

// Get user's favorite movies
app.get('/users/:id/favorites', async (req, res) => {
  try {
    const favorites = await prisma.userFavoriteMovie.findMany({
      where: { userId: parseInt(req.params.id) },
      include: {
        movie: {
          include: movieInclude
        }
      }
    });

    const movies = favorites.map(f => f.movie);
    res.json(movies);
  } catch (error) {
    console.error('GET /users/:id/favorites error:', error);
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});

// Add movie to user favorites
app.post('/users/:id/favorites', async (req, res) => {
  const { movieId } = req.body;
  const userId = parseInt(req.params.id);

  if (!movieId) return res.status(400).json({ error: 'Missing movieId in body' });

  try {
    const fav = await prisma.userFavoriteMovie.upsert({
      where: {
        userId_movieId: { userId, movieId }
      },
      update: {},
      create: { userId, movieId }
    });

    res.status(201).json(fav);
  } catch (error) {
    console.error('POST /users/:id/favorites error:', error);
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});

// ==============================

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
