import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getWishlist, removeFromWishlist, updateWishlistNote } from "../services/firestore";
import { getImageUrl } from "../services/tmdb";
import Loader from "../components/Loader";

/**
 * WishlistPage — shows user's saved movies with CRUD actions
 * Demonstrates: useEffect, useCallback, CRUD operations, conditional rendering
 */
function WishlistPage() {
  const { dark } = useTheme();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState("");

  // Load wishlist from Firestore (Read)
  useEffect(() => {
    if (!user) return;

    const loadWishlist = async () => {
      try {
        setLoading(true);
        const items = await getWishlist(user.uid);
        setWishlist(items);
      } catch (err) {
        console.error("Load wishlist error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user]);

  // Remove from wishlist (Delete)
  const handleRemove = useCallback(
    async (movieId) => {
      try {
        await removeFromWishlist(user.uid, movieId);
        setWishlist((prev) => prev.filter((item) => item.movieId !== movieId));
      } catch (err) {
        console.error("Remove error:", err);
      }
    },
    [user]
  );

  // Start editing a note
  const startEditNote = useCallback((movieId, currentNote) => {
    setEditingNote(movieId);
    setNoteText(currentNote || "");
  }, []);

  // Save note (Update)
  const saveNote = useCallback(
    async (movieId) => {
      try {
        await updateWishlistNote(user.uid, movieId, noteText);
        setWishlist((prev) =>
          prev.map((item) =>
            item.movieId === movieId ? { ...item, note: noteText } : item
          )
        );
        setEditingNote(null);
        setNoteText("");
      } catch (err) {
        console.error("Update note error:", err);
      }
    },
    [user, noteText]
  );

  if (loading) {
    return <Loader text="Loading your wishlist..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
            ❤️ My Wishlist
          </span>
        </h1>
        <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🎬</p>
          <p className={`text-lg font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Your wishlist is empty
          </p>
          <p className={`text-sm mt-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>
            Start adding movies from the home page!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
                dark ? "bg-gray-900" : "bg-white shadow-gray-200"
              }`}
            >
              {/* Poster */}
              <div className="relative">
                <img
                  src={getImageUrl(item.posterPath) || ""}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />
                <span className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-1 rounded-lg">
                  ⭐ {item.voteAverage?.toFixed(1)}
                </span>
              </div>

              <div className="p-4">
                <h3 className={`font-bold text-base mb-2 line-clamp-1 ${dark ? "text-white" : "text-gray-900"}`}>
                  {item.title}
                </h3>

                {/* Personal Note (Update CRUD) */}
                {editingNote === item.movieId ? (
                  <div className="mb-3">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add a personal note..."
                      rows={2}
                      className={`w-full px-3 py-2 rounded-lg border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                        dark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200 text-gray-900"
                      }`}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => saveNote(item.movieId)}
                        className="flex-1 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNote(null)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg ${
                          dark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    {item.note ? (
                      <p className={`text-xs italic mb-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                        📝 {item.note}
                      </p>
                    ) : null}
                    <button
                      onClick={() => startEditNote(item.movieId, item.note)}
                      className={`text-xs font-medium transition-colors ${
                        dark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                      }`}
                    >
                      {item.note ? "Edit Note" : "+ Add Note"}
                    </button>
                  </div>
                )}

                {/* Remove Button (Delete CRUD) */}
                <button
                  onClick={() => handleRemove(item.movieId)}
                  className="w-full py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors active:scale-95"
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
