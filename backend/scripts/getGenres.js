require('dotenv').config();
const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const fetchGenres = async () => {
  try {
    const res = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
      params: {
        api_key: TMDB_API_KEY,
      },
    });

    console.log('🎬 TMDB Genres:\n', res.data.genres);
  } catch (err) {
    console.error('❌ Error fetching genres:', err.message);
  }
};

fetchGenres();
