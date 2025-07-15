import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { supabase } from '../api/supabaseClient';

const { width } = Dimensions.get('window');
const posterWidth = width / 2 - 24;

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const fetchUserAndFavorites = async () => {
    try {
      const { data, error: userError } = await supabase.auth.getSession();
      const user = data?.session?.user;

      if (userError || !user) {
        console.warn('Could not fetch user:', userError?.message);
        Alert.alert('Error', 'Please log in to view favorites');
        setLoading(false);
        return;
      }

      setUser(user);

      const { data: favData, error } = await supabase
        .from('UserFavoriteMovie')
        .select(`
          movie:movieId (
            id, 
            title, 
            poster, 
            overview, 
            trailerUrl, 
            genre:genreId(name), 
            director:directorId(name), 
            rating, 
            releaseYear,
            actors:MovieActor(actor:actorId(name))
          )
        `)
        .eq('userId', user.id);

      if (error) {
        console.error('Fetch favorites error:', error.message);
        Alert.alert('Error', 'Failed to load favorites');
      } else {
        const moviesList = favData.map(entry => entry.movie).filter(Boolean);
        setFavorites(moviesList);
      }
    } catch (error) {
      console.error('Error in fetchUserAndFavorites:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserAndFavorites();
  }, []);

  const handleFavoriteChange = (movieId, isNowFavorite) => {
    setFavorites(prev =>
      isNowFavorite ? prev : prev.filter(movie => movie.id !== movieId)
    );
  };

  const goToMovieCard = (movie) => {
    navigation.navigate('MovieDetails', { movie });
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserAndFavorites();
    }, [])
  );

  const renderMovieTile = ({ item }) => (
    <TouchableOpacity
      style={styles.posterCard}
      onPress={() => goToMovieCard(item)}
    >
      <Image
        source={{ uri: item.poster }}
        style={styles.poster}
        resizeMode="cover"
      />
      <Text style={styles.posterTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💔</Text>
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptySubtitle}>
          Start adding movies to your favorites to see them here!
        </Text>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.goBackButtonText}>Browse Movies</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderMovieTile}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  goBackButton: {
    backgroundColor: '#1f1f1f',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  goBackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  gridContent: {
    paddingHorizontal: 12,
    paddingTop: 40,
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
});

export default FavoritesScreen;
