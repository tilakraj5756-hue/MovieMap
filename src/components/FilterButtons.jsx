import { useTheme } from "../context/ThemeContext";

/**
 * FilterButtons component — filter movies by type
 * Demonstrates: Props, Lifting state up, Conditional rendering
 * @param {Object} props
 * @param {string} props.activeFilter - Currently active filter
 * @param {Function} props.onFilterChange - Callback when filter changes
 */
function FilterButtons({ activeFilter, onFilterChange }) {
  const { dark } = useTheme();

  const filters = [
    { key: "all", label: "All", icon: "🎯" },
    { key: "movie", label: "Movies", icon: "🎬" },
    { key: "tv", label: "TV Shows", icon: "📺" },
  ];

  return (
    <div className="flex justify-center gap-3 flex-wrap">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${
            activeFilter === f.key
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30"
              : dark
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          id={`filter-${f.key}`}
        >
          {f.icon} {f.label}
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;
