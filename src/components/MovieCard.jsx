import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl, getPlatformInfo } from "../services/tmdb";
import { useTheme } from "../context/ThemeContext";

/**
 * MovieCard component — displays a single movie/show card
 * Demonstrates: React.memo, Props, useCallback, conditional rendering, component composition
 * @param {Object} props
 * @param {Object} props.movie - Movie data from TMDB
 * @param {Function} props.onAddToWishlist - Callback to add to wishlist
 * @param {boolean} props.isInWishlist - Whether movie is already in wishlist
 */
function MovieCard({ movie, onAddToWishlist, isInWishlist }) {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const info = getPlatformInfo(movie.id);

  const handleClick = useCallback(() => {
    const mediaType = movie.media_type || "movie";
    navigate(`/movie/${mediaType}/${movie.id}`);
  }, [movie.id, movie.media_type, navigate]);

  const handleWishlist = useCallback(
    (e) => {
      e.stopPropagation();
      if (onAddToWishlist) {
        onAddToWishlist(movie);
      }
    },
    [movie, onAddToWishlist]
  );

  const posterUrl = getImageUrl(movie.poster_path);

  if (!posterUrl) return null;

  return (
    <div
      className={`group rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-red-500/20 hover:shadow-2xl cursor-pointer ${
        dark ? "bg-gray-900" : "bg-white shadow-gray-200"
      }`}
      onClick={handleClick}
      id={`movie-card-${movie.id}`}
    >
      {/* Poster Image */}
      <div className="relative overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.title || movie.name}
          className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-lg">
          ⭐ {movie.vote_average?.toFixed(1)}
        </div>

        {/* Media Type Badge */}
        <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-lg uppercase">
          {movie.media_type === "tv" ? "TV" : "Movie"}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <p className="text-white text-xs line-clamp-3">
            {movie.overview || "No description available."}
          </p>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3
          className={`font-bold text-sm sm:text-base line-clamp-1 mb-2 ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          {movie.title || movie.name}
        </h3>

        {/* Platform Info */}
        {info.free.length > 0 && (
          <p className="text-green-400 text-xs mt-1">
            🆓 {info.free.join(", ")}
          </p>
        )}
        {info.paid.length > 0 && (
          <p className="text-blue-400 text-xs">
            💎 {info.paid.join(", ")}
          </p>
        )}
        <p className="text-purple-400 text-xs">
          📺 {info.quality}
        </p>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          disabled={isInWishlist}
          className={`mt-3 w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isInWishlist
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 active:scale-95"
          }`}
          id={`wishlist-btn-${movie.id}`}
        >
          {isInWishlist ? "✓ In Wishlist" : "❤️ Add to Wishlist"}
        </button>
      </div>
    </div>
  );
}

// React.memo for performance optimization — prevents re-render if props haven't changed
export default memo(MovieCard);
