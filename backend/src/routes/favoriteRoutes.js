const express = require('express');
const router = express.Router();
const FavoriteController = require('../controllers/favoriteController');


router.get('/users/:id/favorites', FavoriteController.getFavorites);
router.post('/users/:id/favorites', FavoriteController.addFavorite);
router.delete('/users/:id/favorites/:movieId', FavoriteController.deleteFavorite);

module.exports = router;