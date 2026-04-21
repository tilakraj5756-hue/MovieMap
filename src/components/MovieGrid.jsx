import MovieCard from "./MovieCard";
import Loader from "./Loader";
import { useTheme } from "../context/ThemeContext";

/**
 * MovieGrid component — renders a grid of MovieCard components
 * Demonstrates: Lists & Keys, Props, Component Composition, Conditional Rendering
 * @param {Object} props
 * @param {Array} props.movies - Array of movie objects
 * @param {boolean} props.loading - Loading state
 * @param {string|null} props.error - Error message
 * @param {Function} props.onAddToWishlist - Callback for wishlist action
 * @param {Set} props.wishlistIds - Set of movie IDs in wishlist
 */
function MovieGrid({ movies, loading, error, onAddToWishlist, wishlistIds }) {
  const { dark } = useTheme();

  // Loading state
  if (loading) {
    return <Loader />;
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 text-lg font-medium">{error}</p>
        <p className={`text-sm mt-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>
          Please try again later.
        </p>
      </div>
    );
  }

  // Empty state
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">🎬</p>
        <p className={`text-lg font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>
          No movies found
        </p>
        <p className={`text-sm mt-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>
          Try searching for something else
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onAddToWishlist={onAddToWishlist}
          isInWishlist={wishlistIds?.has(movie.id)}
        />
      ))}
    </div>
  );
}

export default MovieGrid;
