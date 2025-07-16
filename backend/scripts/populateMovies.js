require('dotenv').config();
const axios = require('axios');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

const ENDPOINTS = ['popular', 'top_rated', 'now_playing', 'upcoming']; 
const PAGES_PER_ENDPOINT = 1;

const fetchAndStoreMovies = async () => {
  try {
    for (const endpoint of ENDPOINTS) {
      console.log(`🔎 Fetching from: ${endpoint.toUpperCase()}`);
      for (let page = 1; page <= PAGES_PER_ENDPOINT; page++) {
        const res = await axios.get(`${TMDB_BASE_URL}/movie/${endpoint}`, {
          params: { api_key: TMDB_API_KEY, page }
        });

        for (const movie of res.data.results) {
          const [videoRes, detailRes] = await Promise.all([
            axios.get(`${TMDB_BASE_URL}/movie/${movie.id}/videos`, {
              params: { api_key: TMDB_API_KEY }
            }),
            axios.get(`${TMDB_BASE_URL}/movie/${movie.id}`, {
              params: {
                api_key: TMDB_API_KEY,
                append_to_response: 'credits'
              }
            })
          ]);

          const trailer = videoRes.data.results.find(
            (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
          );

          const genreName = detailRes.data.genres?.[0]?.name || 'Unknown';
          const directorName =
            detailRes.data.credits?.crew?.find((p) => p.job === 'Director')?.name || 'Unknown';
          const actorNames = detailRes.data.credits?.cast
            ?.slice(0, 3)
            .map((actor) => actor.name) || [];

          const slug = slugify(movie.title);

          const genre = await prisma.genre.upsert({
            where: { name: genreName },
            update: {},
            create: { name: genreName }
          });

          const director = await prisma.director.upsert({
            where: { name: directorName },
            update: {},
            create: { name: directorName }
          });

          const movieRecord = await prisma.movie.upsert({
            where: { slug },
            update: {
              releaseYear: parseInt(movie.release_date?.split('-')[0]) || null,
              rating: movie.vote_average,
              overview: movie.overview,
              poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : null,
              trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
              genreId: genre.id,
              directorId: director.id
            },
            create: {
              title: movie.title,
              slug,
              releaseYear: parseInt(movie.release_date?.split('-')[0]) || null,
              rating: movie.vote_average,
              overview: movie.overview,
              poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : null,
              trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
              genreId: genre.id,
              directorId: director.id
            }
          });

          for (const actorName of actorNames) {
            const actor = await prisma.actor.upsert({
              where: { name: actorName },
              update: {},
              create: { name: actorName }
            });

            await prisma.movieActor.upsert({
              where: {
                movieId_actorId: {
                  movieId: movieRecord.id,
                  actorId: actor.id
                }
              },
              update: {},
              create: {
                movieId: movieRecord.id,
                actorId: actor.id
              }
            });
          }

          console.log(`✅ ${endpoint.toUpperCase()} (Page ${page}) — Added/Updated: ${movie.title}`);
        }
      }
    }

    console.log('🎉 Finished populating all movies');
  } catch (err) {
    console.error('❌ Error populating movies:', err.message || err);
  } finally {
    await prisma.$disconnect();
  }
};

fetchAndStoreMovies();
