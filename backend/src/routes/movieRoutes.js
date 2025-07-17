const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/movieController');

router.get('/genres', MovieController.getAllGenres);
router.get('/movies/genre/:id', MovieController.getMoviesByGenre);
router.get('/movies/search', MovieController.searchMovies);
router.get('/movies/:slug', MovieController.getMovieBySlug);
router.get('/movies', MovieController.getAllMovies);

module.exports = router;
