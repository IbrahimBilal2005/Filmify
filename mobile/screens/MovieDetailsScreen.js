import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const MovieDetailsScreen = ({ route }) => {
  const { movie } = route.params;

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
          <Text style={styles.metaText}>🎬 Genre: <Text style={styles.metaValue}>{movie.genre.name}</Text></Text>
        )}
        {movie.releaseYear && (
          <Text style={styles.metaText}>📅 Year: <Text style={styles.metaValue}>{movie.releaseYear}</Text></Text>
        )}
        {movie.rating && (
          <Text style={styles.metaText}>⭐ Rating: <Text style={styles.metaValue}>{movie.rating.toFixed(1)}</Text></Text>
        )}
        {movie.director?.name && (
          <Text style={styles.metaText}>🎥 Director: <Text style={styles.metaValue}>{movie.director.name}</Text></Text>
        )}
        {movie.actors?.length > 0 && (
          <Text style={styles.metaText}>👥 Cast: <Text style={styles.metaValue}>{movie.actors.map(a => a.actor?.name).join(', ')}</Text></Text>
        )}
        {movie.overview && (
          <Text style={styles.metaText}>📝 Overview: <Text style={styles.metaValue}>{movie.overview}</Text></Text>
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
    paddingTop: 60, // ⬅️ Match vertical spacing
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
});

export default MovieDetailsScreen;
