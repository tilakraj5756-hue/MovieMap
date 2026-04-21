import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * SearchBar component — controlled input with auto-focus
 * Demonstrates: Controlled components, useRef, lifting state up via props
 * @param {Object} props
 * @param {string} props.value - Current search query
 * @param {Function} props.onChange - Callback when input changes
 * @param {Function} props.onSearch - Callback when search is triggered
 */
function SearchBar({ value, onChange, onSearch }) {
  const { dark } = useTheme();
  const inputRef = useRef(null);

  // Auto-focus on mount using useRef
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex gap-3 max-w-2xl mx-auto">
      <div className="relative flex-1">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search movies or TV shows..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full pl-11 pr-5 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
            dark
              ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-red-500"
              : "bg-white border-gray-300 text-black placeholder-gray-400 focus:border-red-500"
          }`}
          id="search-input"
          aria-label="Search movies"
        />
      </div>

      <button
        onClick={onSearch}
        className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all font-medium active:scale-95 shadow-lg shadow-red-500/20"
        id="search-btn"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
