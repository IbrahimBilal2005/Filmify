import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../api/supabaseClient';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    };
    fetchUser();
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      if (!user) return setFavorites([]);

      const { data, error } = await supabase
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
        setFavorites([]);
      } else {
        const moviesList = data.map(entry => entry.movie).filter(Boolean);
        setFavorites(moviesList);
      }
    } catch (error) {
      console.error('Error in fetchFavorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const isFavorite = useCallback(
    (movieId) => favorites.some(movie => movie.id === movieId),
    [favorites]
  );

  const addToFavorites = useCallback(async (movie) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('UserFavoriteMovie')
        .insert([{ userId: user.id, movieId: movie.id }]);

      if (error) throw error;

      setFavorites(prev => [...prev, movie]);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  }, [user]);

  const removeFromFavorites = useCallback(async (movieId) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('UserFavoriteMovie')
        .delete()
        .eq('userId', user.id)
        .eq('movieId', movieId);

      if (error) throw error;

      setFavorites(prev => prev.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }, [user]);

  const toggleFavorite = useCallback(
    async (movie) => {
      const movieId = movie.id;
      if (isFavorite(movieId)) {
        await removeFromFavorites(movieId);
        return false;
      } else {
        await addToFavorites(movie);
        return true;
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites]
  );

  useEffect(() => {
    if (user) fetchFavorites();
  }, [fetchFavorites, user]);

  return {
    favorites,
    loading,
    user,
    isFavorite,
    toggleFavorite,
    refreshFavorites: fetchFavorites,
  };
};
