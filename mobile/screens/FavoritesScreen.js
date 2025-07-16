import React, { useCallback } from 'react';
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
import { useFavorites } from '../hooks/useFavorites'; // Import your existing hook

const { width } = Dimensions.get('window');
const posterWidth = width / 2 - 24;

const FavoritesScreen = () => {
  const navigation = useNavigation();

    const { 
    favorites, 
    loading, 
    user, 
    refreshFavorites 
  } = useFavorites();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshFavorites();
    } catch (error) {
      console.error('Error refreshing favorites:', error);
      Alert.alert('Error', 'Failed to refresh favorites');
    } finally {
      setRefreshing(false);
    }
  }, [refreshFavorites]);

  const goToMovieCard = (movie) => {
    navigation.navigate('MovieDetails', { movie });
  };

  // Refresh favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (user) {
        refreshFavorites();
      }
    }, [user, refreshFavorites])
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

  // Show loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔐</Text>
        <Text style={styles.emptyTitle}>Please Log In</Text>
        <Text style={styles.emptySubtitle}>
          You need to be logged in to view your favorites
        </Text>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.navigate('Login')} // Adjust navigation as needed
        >
          <Text style={styles.goBackButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show empty state if no favorites
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