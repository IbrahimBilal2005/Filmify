import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../api/supabaseClient';

const API_BASE = 'http://10.0.0.130:3000'; // 👈 Update if IP changes

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Get Supabase user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
    };
    fetchUser();
  }, []);

  // Fetch favorites from backend
  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      if (!user) return setFavorites([]);

      const res = await fetch(`${API_BASE}/users/${user.id}/favorites`);
      if (!res.ok) throw new Error('Failed to fetch favorites');

      const data = await res.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const isFavorite = useCallback(
    (movieId) => favorites.some(movie => movie.id === movieId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (movie) => {
      if (!user) throw new Error('User not authenticated');

      const alreadyFavorite = isFavorite(movie.id);
      try {
        if (alreadyFavorite) {
          // Send DELETE request to backend
          const res = await fetch(`${API_BASE}/users/${user.id}/favorites/${movie.id}`, {
            method: 'DELETE',
          });
          if (!res.ok && res.status !== 204) throw new Error('Failed to remove favorite');
          setFavorites(prev => prev.filter(m => m.id !== movie.id));
          return false;
        } else {
          // Send POST request to backend
          const res = await fetch(`${API_BASE}/users/${user.id}/favorites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movieId: movie.id }),
          });
          if (!res.ok) throw new Error('Failed to add favorite');
          setFavorites(prev => [...prev, movie]);
          return true;
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
        return isFavorite(movie.id); // keep previous state
      }
    },
    [user, isFavorite]
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