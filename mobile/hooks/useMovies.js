import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://10.0.0.130:3000'; // Update if IP changes

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all movies
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/movies`);
      if (!res.ok) throw new Error('Failed to fetch movies');
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      setError(err.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search movies by title
  const searchMovies = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/movies/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to search movies');
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      setError(err.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const [genres, setGenres] = useState([]);

  const getAllGenres = useCallback(async () => {
    try {
        const res = await fetch(`${API_BASE}/genres`);
        if (!res.ok) throw new Error('Failed to fetch genres');
        const data = await res.json();
        setGenres(data);
    } catch (err) {
        console.error(err);
    }
  }, []);

  const getMoviesByGenre = useCallback(async (genreId) => {
    setLoading(true);
    setError(null);
    try {
        const res = await fetch(`${API_BASE}/movies/genre/${genreId}`);
        if (!res.ok) throw new Error('Failed to fetch movies by genre');
        const data = await res.json();
        setMovies(data);
    } catch (err) {
        setError(err.message);
        setMovies([]);
    } finally {
        setLoading(false);
    }
  }, []);

  // Get a movie by slug
  const getMovieBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/movies/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch movie');
      const data = await res.json();
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return {
    movies,
    genres,
    loading,
    error,
    fetchMovies,
    searchMovies,
    getMovieBySlug,
    getAllGenres,
    getMoviesByGenre,
  };
};
