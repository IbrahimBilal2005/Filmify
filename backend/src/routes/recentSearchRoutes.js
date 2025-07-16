const express = require('express'); 
const router = express.Router(); 
const RecentSearchController = require('../controllers/recentSearchController');  

router.post('/users/:userId/recent-search', RecentSearchController.add); 
router.get('/users/:userId/recent-search', RecentSearchController.get);  

module.exports = router;