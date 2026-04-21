import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * ReviewForm component — controlled form for adding/editing reviews
 * Demonstrates: Controlled components, useRef, Props, conditional rendering
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback with { rating, text }
 * @param {Object} [props.initialData] - Pre-fill data for editing
 * @param {Function} [props.onCancel] - Cancel callback for edit mode
 * @param {boolean} [props.isEditing] - Whether in edit mode
 */
function ReviewForm({ onSubmit, initialData, onCancel, isEditing = false }) {
  const { dark } = useTheme();
  const textRef = useRef(null);
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [text, setText] = useState(initialData?.text || "");
  const [submitting, setSubmitting] = useState(false);

  // Focus textarea on mount / edit mode
  useEffect(() => {
    if (textRef.current) {
      textRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({ rating, text: text.trim() });
      if (!isEditing) {
        setRating(5);
        setText("");
      }
    } catch (err) {
      console.error("Review submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`rounded-xl p-4 ${dark ? "bg-gray-800/50" : "bg-gray-50"}`}>
      <h4 className={`font-semibold mb-3 ${dark ? "text-white" : "text-gray-900"}`}>
        {isEditing ? "Edit Review" : "Write a Review"}
      </h4>

      {/* Rating Selector (controlled) */}
      <div className="flex items-center gap-1 mb-3">
        <span className={`text-sm mr-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>Rating:</span>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-lg transition-transform hover:scale-125 ${
              star <= rating ? "text-yellow-400" : dark ? "text-gray-600" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
        <span className={`ml-2 text-sm font-medium ${dark ? "text-yellow-400" : "text-yellow-600"}`}>
          {rating}/10
        </span>
      </div>

      {/* Review Text (controlled) */}
      <textarea
        ref={textRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your thoughts about this movie..."
        rows={3}
        className={`w-full px-4 py-3 rounded-lg border text-sm resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
          dark
            ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
            : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
        }`}
        id="review-text"
      />

      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          disabled={!text.trim() || submitting}
          className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-lg hover:from-red-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          id="review-submit-btn"
        >
          {submitting ? "Submitting..." : isEditing ? "Update" : "Post Review"}
        </button>

        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
              dark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ReviewForm;
