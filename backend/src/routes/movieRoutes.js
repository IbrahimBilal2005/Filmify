const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/movieController');

router.get('/movies', MovieController.getAllMovies);
router.get('/movies/search', MovieController.searchMovies);
router.get('/movies/:slug', MovieController.getMovieBySlug);

module.exports = router;
