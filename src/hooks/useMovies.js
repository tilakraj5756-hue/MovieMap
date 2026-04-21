import { useState, useCallback } from "react";
import { fetchTrending as fetchTrendingAPI, searchMovies as searchMoviesAPI } from "../services/tmdb";

/**
 * Custom hook for managing movie data fetching
 * Demonstrates: Custom hooks, useState, useCallback
 * @returns {Object} movies state and fetch functions
 */
export function useMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch trending movies — memoized with useCallback
  const fetchTrending = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await fetchTrendingAPI();
      setMovies(results);
    } catch (err) {
      setError("Failed to load trending movies. Please try again.");
      console.error("Trending fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search movies — memoized with useCallback
  const search = useCallback(async (query) => {
    if (!query.trim()) {
      // If empty query, show trending
      try {
        setLoading(true);
        setError(null);
        const results = await fetchTrendingAPI();
        setMovies(results);
      } catch (err) {
        setError("Failed to load movies.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await searchMoviesAPI(query);
      setMovies(results);
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    movies,
    loading,
    error,
    fetchTrending,
    search,
  };
}
