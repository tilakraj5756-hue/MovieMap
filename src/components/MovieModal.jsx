import { useEffect, useRef, useCallback } from "react";
import { getImageUrl } from "../services/tmdb";
import { useTheme } from "../context/ThemeContext";

/**
 * MovieModal component — detail popup for a movie/show
 * Demonstrates: useRef (focus trap), useEffect with cleanup (ESC key), Props
 * @param {Object} props
 * @param {Object} props.movie - Movie data
 * @param {Function} props.onClose - Close callback
 */
function MovieModal({ movie, onClose }) {
  const { dark } = useTheme();
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Focus the close button when modal opens (useRef)
  useEffect(() => {
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, []);

  // ESC key handler with cleanup (useEffect)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  // Click outside to close
  const handleBackdropClick = useCallback(
    (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    },
    [onClose]
  );

  if (!movie) return null;

  const posterUrl = getImageUrl(movie.poster_path, "w500");

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 z-50 animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      id="movie-modal"
    >
      <div
        ref={modalRef}
        className={`relative rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto grid md:grid-cols-2 animate-scaleIn ${
          dark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Poster */}
        {posterUrl && (
          <img
            src={posterUrl}
            alt={movie.title || movie.name}
            className="w-full h-64 md:h-full object-cover"
          />
        )}

        {/* Details */}
        <div className="p-6 flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            {movie.title || movie.name}
          </h2>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-yellow-400 font-semibold">
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>
            <span
              className={`text-sm px-2 py-0.5 rounded-full uppercase font-medium ${
                movie.media_type === "tv"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {movie.media_type === "tv" ? "TV Show" : "Movie"}
            </span>
          </div>

          <p
            className={`text-sm leading-relaxed mb-4 flex-1 ${
              dark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {movie.overview || "No description available."}
          </p>

          <div
            className={`text-sm mb-6 ${
              dark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <p>
              <span className="font-medium">Release Date:</span>{" "}
              {movie.release_date || movie.first_air_date || "Not Available"}
            </p>
            {movie.original_language && (
              <p className="mt-1">
                <span className="font-medium">Language:</span>{" "}
                {movie.original_language.toUpperCase()}
              </p>
            )}
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white px-5 py-3 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all font-medium active:scale-95"
            id="modal-close-btn"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
