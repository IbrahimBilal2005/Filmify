import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { useFavorites } from '../hooks/useFavorites';

const { height, width } = Dimensions.get('window');

const getYouTubeEmbedUrl = (url, isVisible) => {
  const match = url?.match(/v=([^&]+)/);
  return match
    ? `https://www.youtube.com/embed/${match[1]}?autoplay=${isVisible ? 1 : 0}&mute=${isVisible ? 0 : 1}&playsinline=1&controls=0&showinfo=0`
    : null;
};

const MovieCard = ({ movie, isVisible, onFavoriteChange }) => {
  const navigation = useNavigation();
  const [actionLoading, setActionLoading] = useState(false);
  const { isFavorite, toggleFavorite, user } = useFavorites();

  const trailerEmbedUrl = getYouTubeEmbedUrl(movie.trailerUrl, isVisible);
  const movieIsFavorite = isFavorite(movie.id);

  const goToDetails = () => {
    navigation.navigate('MovieDetails', { movie });
  };

  const handleToggleFavorite = async () => {
    if (!user || actionLoading) return;
    setActionLoading(true);

    try {
      const isNowFavorite = await toggleFavorite(movie);
      onFavoriteChange?.(movie.id, isNowFavorite);
    } catch (error) {
      console.error('Toggle favorite error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ScrollView style={styles.card} contentContainerStyle={styles.content}>
      <View style={styles.inner}>
        {trailerEmbedUrl ? (
          <WebView
            source={{ uri: trailerEmbedUrl }}
            style={styles.video}
            javaScriptEnabled
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            key={isVisible ? 'playing' : 'paused'}
          />
        ) : (
          <View style={[styles.video, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: '#666' }}>No Trailer Available</Text>
          </View>
        )}

        <Text style={styles.title}>{movie.title}</Text>

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
                {movie.actors.map((a) => a.actor?.name).join(', ')}
              </Text>
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, actionLoading && styles.buttonDisabled]}
            onPress={handleToggleFavorite}
            disabled={actionLoading}
          >
            <Text style={styles.buttonText}>
              {actionLoading
                ? '⏳ Loading...'
                : movieIsFavorite
                  ? '💔 Remove Favorite'
                  : '❤️ Add to Favorites'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToDetails}>
            <Text style={styles.buttonText}>ℹ️ Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    height,
    width,
    backgroundColor: '#111',
  },
  content: {
    paddingTop: 50,
    paddingBottom: 40,
  },
  inner: {
    paddingHorizontal: 20,
  },
  video: {
    width: '100%',
    height: height * 0.4,
    borderRadius: 10,
    backgroundColor: '#000',
    marginBottom: 15,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    marginBottom: 20,
  },
  metadata: {
    marginBottom: 25,
  },
  metaText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 5,
  },
  metaValue: {
    color: '#eee',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#1f1f1f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonDisabled: {
    backgroundColor: '#333',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MovieCard;