import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getMovieDetails, getImageUrl, getPlatformInfo } from "../services/tmdb";
import { addToWishlist, isInWishlist, addReview, getReviews, updateReview, deleteReview } from "../services/firestore";
import ReviewForm from "../components/ReviewForm";
import Loader from "../components/Loader";

/**
 * MovieDetailPage — full movie details with reviews CRUD
 * Demonstrates: useRef (scroll), useMemo (avg rating), useEffect, useCallback, CRUD
 */
function MovieDetailPage() {
  const { dark } = useTheme();
  const { user } = useAuth();
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const reviewSectionRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);

  // Fetch movie details
  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovieDetails(id, mediaType);
        setMovie(data);
      } catch (err) {
        setError("Failed to load movie details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMovie();
  }, [id, mediaType]);

  // Check wishlist status
  useEffect(() => {
    if (user && id) {
      isInWishlist(user.uid, parseInt(id)).then(setInWishlist).catch(console.error);
    }
  }, [user, id]);

  // Load reviews
  useEffect(() => {
    if (id) {
      getReviews(parseInt(id)).then(setReviews).catch(console.error);
    }
  }, [id]);

  // useMemo — compute average user rating
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const platformInfo = useMemo(() => {
    return id ? getPlatformInfo(parseInt(id)) : null;
  }, [id]);

  // Scroll to reviews section using useRef
  const scrollToReviews = useCallback(() => {
    reviewSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Add to wishlist
  const handleAddToWishlist = useCallback(async () => {
    if (!user) {
      alert("Please login to add to wishlist!");
      return;
    }
    try {
      // Ensure ID is an integer as Firestore might struggle with mixed types in keys
      const movieId = parseInt(id);
      await addToWishlist(user.uid, { ...movie, id: movieId, media_type: mediaType });
      setInWishlist(true);
      alert("Added to wishlist!");
    } catch (err) {
      console.error("Wishlist Error:", err);
      alert("Failed to add to wishlist: " + err.message);
    }
  }, [user, movie, id, mediaType]);

  // Add review (Create)
  const handleAddReview = useCallback(async (reviewData) => {
    if (!user) {
      alert("Please login to add a review!");
      return;
    }
    try {
      const movieId = parseInt(id);
      const reviewId = await addReview(user.uid, user.displayName, movieId, reviewData);
      setReviews((prev) => [
        ...prev,
        { id: reviewId, userId: user.uid, userName: user.displayName || "Anonymous", movieId, ...reviewData, createdAt: { seconds: Date.now() / 1000 } },
      ]);
      alert("Review posted successfully!");
    } catch (err) {
      console.error("Review Error:", err);
      alert("Failed to post review: " + err.message);
    }
  }, [user, id]);

  // Update review
  const handleUpdateReview = useCallback(async (reviewData) => {
    if (!editingReview) return;
    try {
      await updateReview(editingReview.id, reviewData);
      setReviews((prev) =>
        prev.map((r) => (r.id === editingReview.id ? { ...r, ...reviewData } : r))
      );
      setEditingReview(null);
      alert("Review updated!");
    } catch (err) {
      console.error("Update Review Error:", err);
      alert("Failed to update review: " + err.message);
    }
  }, [editingReview]);

  // Delete review
  const handleDeleteReview = useCallback(async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      alert("Review deleted.");
    } catch (err) {
      console.error("Delete Review Error:", err);
      alert("Failed to delete review: " + err.message);
    }
  }, []);

  if (loading) return <Loader text="Loading movie details..." />;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!movie) return null;

  const backdropUrl = getImageUrl(movie.backdrop_path, "original");
  const posterUrl = getImageUrl(movie.poster_path, "w500");

  return (
    <div className="min-h-screen">
      {/* Backdrop Hero */}
      {backdropUrl && (
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
          <img src={backdropUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm hover:bg-black/70 transition-colors"
          >
            ← Back
          </button>
        </div>
      )}

      {/* Movie Info */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <div className="grid md:grid-cols-[250px_1fr] gap-6 sm:gap-8">
          {/* Poster */}
          {posterUrl && (
            <img src={posterUrl} alt={movie.title || movie.name} className="w-48 md:w-full rounded-xl shadow-2xl mx-auto md:mx-0" />
          )}

          {/* Details */}
          <div className="pt-4">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              {movie.title || movie.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-yellow-400 font-semibold">⭐ {movie.vote_average?.toFixed(1)}</span>
              {averageRating && (
                <span className="text-green-400 text-sm">👥 User: {averageRating}/10</span>
              )}
              <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                {movie.release_date || movie.first_air_date || ""}
              </span>
              {movie.runtime && (
                <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
            </div>

            {/* Genres */}
            {movie.genres && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((g) => (
                  <span key={g.id} className={`text-xs px-3 py-1 rounded-full ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className={`text-sm leading-relaxed mb-6 ${dark ? "text-gray-300" : "text-gray-600"}`}>
              {movie.overview || "No description available."}
            </p>

            {/* Platform Info */}
            {platformInfo && (
              <div className={`rounded-xl p-4 mb-6 ${dark ? "bg-gray-900/50" : "bg-gray-50"}`}>
                <h3 className={`text-sm font-semibold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>Where to Watch</h3>
                {platformInfo.free.length > 0 && (
                  <p className="text-green-400 text-sm">🆓 Free: {platformInfo.free.join(", ")}</p>
                )}
                {platformInfo.paid.length > 0 && (
                  <p className="text-blue-400 text-sm">💎 Paid: {platformInfo.paid.join(", ")}</p>
                )}
                <p className="text-purple-400 text-sm">📺 Quality: {platformInfo.quality}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={handleAddToWishlist}
                disabled={inWishlist}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  inWishlist
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 active:scale-95"
                }`}
              >
                {inWishlist ? "✓ In Wishlist" : "❤️ Add to Wishlist"}
              </button>
              <button
                onClick={scrollToReviews}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  dark ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                💬 Reviews ({reviews.length})
              </button>
            </div>

            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div className="mb-8">
                <h3 className={`text-lg font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>Top Cast</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {movie.credits.cast.slice(0, 8).map((actor) => (
                    <div key={actor.id} className="flex-shrink-0 text-center w-20">
                      <div className={`w-16 h-16 rounded-full mx-auto mb-1 overflow-hidden ${dark ? "bg-gray-800" : "bg-gray-200"}`}>
                        {actor.profile_path ? (
                          <img src={getImageUrl(actor.profile_path, "w200")} alt={actor.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">👤</div>
                        )}
                      </div>
                      <p className={`text-xs font-medium line-clamp-1 ${dark ? "text-gray-300" : "text-gray-700"}`}>{actor.name}</p>
                      <p className={`text-xs line-clamp-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div ref={reviewSectionRef} className="mt-12 pb-12">
          <h2 className={`text-2xl font-bold mb-6 ${dark ? "text-white" : "text-gray-900"}`}>
            💬 User Reviews
          </h2>

          {/* Review Form */}
          {user ? (
            editingReview ? (
              <div className="mb-6">
                <ReviewForm
                  onSubmit={handleUpdateReview}
                  initialData={editingReview}
                  onCancel={() => setEditingReview(null)}
                  isEditing
                />
              </div>
            ) : (
              <div className="mb-6">
                <ReviewForm onSubmit={handleAddReview} />
              </div>
            )
          ) : (
            <p className={`mb-6 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
              Please <a href="/login" className="text-red-500 underline">login</a> to write a review.
            </p>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className={`text-center py-8 ${dark ? "text-gray-500" : "text-gray-400"}`}>
              No reviews yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className={`rounded-xl p-4 ${dark ? "bg-gray-900/50" : "bg-gray-50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${dark ? "text-white" : "text-gray-900"}`}>
                        {review.userName || "Anonymous"}
                      </span>
                      <span className="text-yellow-400 text-sm">
                        {"★".repeat(Math.min(review.rating, 10))} {review.rating}/10
                      </span>
                    </div>
                    {user && user.uid === review.userId && (
                      <div className="flex gap-2">
                        <button onClick={() => setEditingReview(review)} className="text-xs text-blue-400 hover:text-blue-300">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteReview(review.id)} className="text-xs text-red-400 hover:text-red-300">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetailPage;
