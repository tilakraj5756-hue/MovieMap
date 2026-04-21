import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useMovies } from "../hooks/useMovies";
import { useDebounce } from "../hooks/useDebounce";
import { addToWishlist, getWishlist } from "../services/firestore";
import SearchBar from "../components/SearchBar";
import FilterButtons from "../components/FilterButtons";
import MovieGrid from "../components/MovieGrid";

/**
 * HomePage — main landing page with trending movies and search
 * Demonstrates: useMemo, useCallback, useEffect, lifting state up, custom hooks
 */
function HomePage() {
  const { dark } = useTheme();
  const { user } = useAuth();
  const { movies, loading, error, fetchTrending, search } = useMovies();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const debouncedQuery = useDebounce(query, 600);

  // Fetch trending on mount
  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  // Auto-search on debounced query change
  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery);
    }
  }, [debouncedQuery, search]);

  // Load user's wishlist IDs for button state
  useEffect(() => {
    if (user) {
      getWishlist(user.uid).then((items) => {
        setWishlistIds(new Set(items.map((item) => item.movieId)));
      }).catch(console.error);
    } else {
      setWishlistIds(new Set());
    }
  }, [user]);

  // useMemo — filter movies by type (avoids recalculating on every render)
  const filteredMovies = useMemo(() => {
    return movies.filter(
      (item) =>
        item.media_type !== "person" &&
        item.poster_path &&
        (filter === "all" || item.media_type === filter)
    );
  }, [movies, filter]);

  // useCallback — memoized search handler
  const handleSearch = useCallback(() => {
    search(query);
  }, [query, search]);

  // useCallback — memoized wishlist handler
  const handleAddToWishlist = useCallback(
    async (movie) => {
      if (!user) {
        alert("Please login to add movies to your wishlist!");
        return;
      }
      try {
        await addToWishlist(user.uid, movie);
        setWishlistIds((prev) => new Set([...prev, movie.id]));
        alert(`"${movie.title || movie.name}" added to wishlist!`);
      } catch (err) {
        console.error("Add to wishlist error:", err);
        alert("Failed to add to wishlist: " + err.message);
      }
    },
    [user]
  );

  // useCallback — memoized filter handler
  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 bg-clip-text text-transparent">
            Discover Movies & Shows
          </span>
        </h1>
        <p className={`text-sm sm:text-base ${dark ? "text-gray-400" : "text-gray-500"}`}>
          Find where to watch your favorite content
        </p>
      </div>

      {/* Search Bar (state lifted up via props) */}
      <div className="mb-6">
        <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} />
      </div>

      {/* Filter Buttons (state lifted up via props) */}
      <div className="mb-8">
        <FilterButtons activeFilter={filter} onFilterChange={handleFilterChange} />
      </div>

      {/* Section Title */}
      <h2 className={`text-xl sm:text-2xl font-bold mb-6 ${dark ? "text-white" : "text-gray-900"}`}>
        {query ? (
          <>
            Results for{" "}
            <span className="text-red-500">"{query}"</span>
          </>
        ) : (
          <span className="bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
            🔥 Trending Today
          </span>
        )}
      </h2>

      {/* Movie Grid */}
      <MovieGrid
        movies={filteredMovies}
        loading={loading}
        error={error}
        onAddToWishlist={handleAddToWishlist}
        wishlistIds={wishlistIds}
      />
    </div>
  );
}

export default HomePage;
