require('dotenv').config();
const axios = require('axios');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const fetchByGenre = async () => {
  try {
    for (const genre of GENRES) {
      console.log(`🎬 Fetching Genre: ${genre.name}`);
      for (let page = 1; page <= 10; page++) {
        const res = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
          params: {
            api_key: TMDB_API_KEY,
            with_genres: genre.id,
            page,
          },
        });

        for (const movie of res.data.results) {
          const [videoRes, detailRes] = await Promise.all([
            axios.get(`${TMDB_BASE_URL}/movie/${movie.id}/videos`, {
              params: { api_key: TMDB_API_KEY },
            }),
            axios.get(`${TMDB_BASE_URL}/movie/${movie.id}`, {
              params: { api_key: TMDB_API_KEY, append_to_response: 'credits' },
            }),
          ]);

          const trailer = videoRes.data.results.find(
            (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
          );

          const directorName =
            detailRes.data.credits?.crew?.find((p) => p.job === 'Director')?.name || 'Unknown';
          const actorNames =
            detailRes.data.credits?.cast?.slice(0, 3).map((actor) => actor.name) || [];

          const slug = slugify(movie.title);

          const genreRecord = await prisma.genre.upsert({
            where: { name: genre.name },
            update: {},
            create: { name: genre.name },
          });

          const director = await prisma.director.upsert({
            where: { name: directorName },
            update: {},
            create: { name: directorName },
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
              genreId: genreRecord.id,
              directorId: director.id,
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
              genreId: genreRecord.id,
              directorId: director.id,
            },
          });

          for (const actorName of actorNames) {
            const actor = await prisma.actor.upsert({
              where: { name: actorName },
              update: {},
              create: { name: actorName },
            });

            await prisma.movieActor.upsert({
              where: {
                movieId_actorId: {
                  movieId: movieRecord.id,
                  actorId: actor.id,
                },
              },
              update: {},
              create: {
                movieId: movieRecord.id,
                actorId: actor.id,
              },
            });
          }

          console.log(`✅ Added/Updated: ${movie.title}`);
        }
      }
    }

    console.log('🎉 Finished populating movies by genre');
  } catch (err) {
    console.error('❌ Error:', err.message || err);
  } finally {
    await prisma.$disconnect();
  }
};

fetchByGenre();
