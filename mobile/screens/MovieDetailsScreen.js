import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useMovies } from '../hooks/useMovies';

const { width } = Dimensions.get('window');

const MovieDetailsScreen = ({ route }) => {
  const { movie: initialMovie, slug } = route.params;
  const { getMovieBySlug, loading, error } = useMovies();
  const [movie, setMovie] = useState(initialMovie || null);

  useEffect(() => {
    if (!movie && slug) {
      (async () => {
        const fetchedMovie = await getMovieBySlug(slug);
        setMovie(fetchedMovie);
      })();
    }
  }, [movie, slug, getMovieBySlug]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>Movie not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Poster */}
      {movie.poster ? (
        <Image source={{ uri: movie.poster }} style={styles.poster} />
      ) : null}

      {/* Title */}
      <Text style={styles.title}>{movie.title}</Text>

      {/* Metadata */}
        <View style={styles.metadata}>
        {movie.genre?.name && (
            <Text style={styles.metaText}>
            <Text>🎬 Genre: </Text>
            <Text style={styles.metaValue}>{movie.genre.name}</Text>
            </Text>
        )}
        {movie.releaseYear && (
            <Text style={styles.metaText}>
            <Text>📅 Year: </Text>
            <Text style={styles.metaValue}>{movie.releaseYear}</Text>
            </Text>
        )}
        {movie.rating && (
            <Text style={styles.metaText}>
            <Text>⭐ Rating: </Text>
            <Text style={styles.metaValue}>{movie.rating.toFixed(1)}</Text>
            </Text>
        )}
        {movie.director?.name && (
            <Text style={styles.metaText}>
            <Text>🎥 Director: </Text>
            <Text style={styles.metaValue}>{movie.director.name}</Text>
            </Text>
        )}
        {movie.actors?.length > 0 && (
            <Text style={styles.metaText}>
            <Text>👥 Cast: </Text>
            <Text style={styles.metaValue}>
                {movie.actors.map(a => a.actor?.name).join(', ')}
            </Text>
            </Text>
        )}
        {movie.overview && (
            <Text style={styles.metaText}>
            <Text>📝 Overview: </Text>
            <Text style={styles.metaValue}>{movie.overview}</Text>
            </Text>
        )}
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    flex: 1,
  },
  content: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  poster: {
    width: width - 40,
    height: (width - 40) * 1.5,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    marginBottom: 25,
  },
  metadata: {
    marginBottom: 25,
  },
  metaText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
  },
  metaValue: {
    color: '#eee',
    fontWeight: '600',
  },
  loading: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MovieDetailsScreen;