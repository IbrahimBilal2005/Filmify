const RecentSearchDAO = require('../data_access/recentSearchDAO');

const RecentSearchService = {
  addSearch: (userId, movieId) => RecentSearchDAO.addRecentSearch(userId, movieId),
  getSearches: (userId) => RecentSearchDAO.getRecentSearches(userId)
};

module.exports = RecentSearchService;
