import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

/**
 * Get the full image URL for a TMDB poster/backdrop
 * @param {string} path - The image path from TMDB
 * @param {string} size - Image size (w200, w300, w500, original)
 * @returns {string} Full image URL
 */
export const getImageUrl = (path, size = "w500") => {
  if (!path) return null;
  return `${IMG_BASE}/${size}${path}`;
};

/**
 * Fetch trending movies and TV shows
 * @param {string} timeWindow - "day" or "week"
 * @returns {Promise<Array>} Array of trending items
 */
export const fetchTrending = async (timeWindow = "day") => {
  const res = await axios.get(
    `${BASE_URL}/trending/all/${timeWindow}?api_key=${API_KEY}`
  );
  return res.data.results || [];
};

/**
 * Search for movies and TV shows
 * @param {string} query - Search query string
 * @returns {Promise<Array>} Array of search results
 */
export const searchMovies = async (query) => {
  if (!query.trim()) return [];
  const res = await axios.get(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  return res.data.results || [];
};

/**
 * Get detailed information about a specific movie or TV show
 * @param {number} id - TMDB ID
 * @param {string} mediaType - "movie" or "tv"
 * @returns {Promise<Object>} Detailed info
 */
export const getMovieDetails = async (id, mediaType = "movie") => {
  const res = await axios.get(
    `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&append_to_response=credits,similar`
  );
  return res.data;
};

/**
 * Get platform/streaming availability info (simulated)
 * @param {number} id - Movie/show ID
 * @returns {Object} Platform info with free, paid, and quality
 */
export const getPlatformInfo = (id) => {
  const freeOptions = [
    ["YouTube"],
    ["JioCinema"],
    ["MX Player"],
    ["YouTube", "JioCinema"],
    [],
  ];
  const paidOptions = [
    ["Netflix"],
    ["Prime Video"],
    ["Disney+"],
    ["Hotstar"],
    ["Netflix", "Prime Video"],
    ["Prime Video", "Hotstar"],
    ["Netflix", "Disney+"],
  ];
  const qualities = ["HD", "Full HD", "4K"];

  return {
    free: freeOptions[id % freeOptions.length],
    paid: paidOptions[id % paidOptions.length],
    quality: qualities[id % qualities.length],
  };
};
