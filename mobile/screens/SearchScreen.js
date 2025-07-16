import React, { useState, useRef, useCallback } from 'react';
import { Image, Keyboard, View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useMovies } from '../hooks/useMovies';
import { useRecentSearches } from '../hooks/useRecentSearches';
import MovieCard from '../components/MovieCard';

const { width } = Dimensions.get('window');
const posterWidth = width / 2 - 24;

const SearchScreen = () => {
  const { movies, searchMovies, loading, error } = useMovies();
  const { recent, saveSearch, user, refreshRecent } = useRecentSearches();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);
  const navigation = useNavigation();



  // Reset search state if Search tab is pressed again
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('tabPress', () => {
        setShowResults(false);
        setQuery('');
      });
      return unsubscribe;
    }, [navigation])
  );

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.trim().length > 0) {
      setShowResults(true);
      await searchMovies(text);
    } else {
      setShowResults(false);
    }
  };

  const handleSubmit = async () => {
    if (query.trim().length > 0) {
      const matchedMovie = movies.find(m => m.title.toLowerCase().includes(query.toLowerCase()));
      
      if (matchedMovie && user) {
        await saveSearch(matchedMovie.id);
        await refreshRecent();
      }
      Keyboard.dismiss();
    }
  };

  const handleMoviePress = async (movie) => {
    if (user) {
      await saveSearch(movie.id);
      await refreshRecent();
    }
    navigation.navigate('MovieDetails', { movie });
  };

  const renderGridCard = ({ item }) => (
    <TouchableOpacity
      style={styles.posterCard}
      onPress={() => handleMoviePress(item)}
    >
      <Image source={{ uri: item.poster }} style={styles.poster} resizeMode="cover" />
      <Text style={styles.posterTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderDropdownItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleMoviePress(item)}
    >
      <Image source={{ uri: item.poster }} style={styles.dropdownPoster} resizeMode="cover" />
      <View style={styles.dropdownInfo}>
        <Text style={styles.dropdownTitle}>{item.title}</Text>
        <Text style={styles.dropdownYear}>{item.releaseYear || ''}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.searchBar}
        placeholder="Search movies..."
        placeholderTextColor="#aaa"
        value={query}
        onChangeText={handleSearch}
        onSubmitEditing={handleSubmit}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      {showResults ? (
        <View style={styles.resultsContainer}>
          {loading ? (
            <Text style={styles.loadingText}>Searching...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : movies.length === 0 ? (
            <Text style={styles.emptyText}>No results found.</Text>
          ) : (
            <FlatList
              data={movies}
              renderItem={renderDropdownItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.dropdownContent}
            />
          )}
        </View>
      ) : (
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Recently Searched: ({recent.length})</Text>
          {recent.length === 0 ? (
            <Text style={styles.emptyText}>No recent searches.</Text>
          ) : (
            <FlatList
              data={recent}
              renderItem={renderGridCard}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.gridContent}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 60,
  },
  searchBar: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 18,
    marginHorizontal: 16,
    marginBottom: 18,
  },
  resultsContainer: {
    flex: 1,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  gridContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  posterCard: {
    width: posterWidth,
    alignItems: 'center',
  },
  poster: {
    width: '100%',
    height: posterWidth * 1.5,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: '#333',
  },
  posterTitle: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  recentContainer: {
    flex: 1,
  },
  recentTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 16,
  },
  dropdownContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 40,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    backgroundColor: '#181818',
    borderRadius: 8,
    marginBottom: 2,
  },
  dropdownPoster: {
    width: 60,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#333',
    marginRight: 14,
  },
  dropdownInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  dropdownTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dropdownYear: {
    color: '#aaa',
    fontSize: 14,
  },
});

export default SearchScreen;