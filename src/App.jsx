import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [dark, setDark] = useState(true);
  const [filter, setFilter] = useState("all");

  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Load Trending on Start
  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://api.themoviedb.org/3/trending/all/day?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }`
      );

      setMovies(res.data.results || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Search
  const searchMovies = async () => {
    if (!query.trim()) {
      fetchTrending();
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=${
          import.meta.env.VITE_TMDB_API_KEY
        }&query=${encodeURIComponent(query)}`
      );

      setMovies(res.data.results || []);
    } catch (error) {
      console.log(error);
      alert("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = (movie) => {
    if (!wishlist.find((item) => item.id === movie.id)) {
      setWishlist([...wishlist, movie]);
    }
  };

  const removeWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const getPlatformInfo = (id) => {
    const qualities = ["HD", "Full HD", "4K"];

    return {
      free: ["YouTube", "JioCinema"],
      paid: ["Netflix", "Prime Video", "Disney+"],
      quality: qualities[id % 3],
    };
  };

  return (
    <div
      className={`min-h-screen p-6 transition duration-300 ${
        dark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Navbar */}
      <div className="flex justify-between items-center mb-6">
       <div>
  <h1 className="text-4xl font-bold text-red-500">
    MovieMap 🎬
  </h1>

  <p className="text-sm text-gray-400 mt-1">
    Find where to watch movies & shows
  </p>
</div>

        <button
          onClick={() => setDark(!dark)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Wishlist Count */}
      <p className="text-center mb-8 font-semibold">
        Wishlist Items: {wishlist.length}
      </p>

      {/* Search */}
      <div className="flex gap-3 max-w-2xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search movies or shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchMovies()}
          className={`flex-1 px-5 py-3 rounded-lg border border-gray-500 ${
            dark
              ? "bg-gray-900 text-white placeholder-gray-400"
              : "bg-white text-black placeholder-gray-500"
          }`}
        />

        <button
          onClick={searchMovies}
          className="bg-red-600 text-white px-6 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-white ${
            filter === "all" ? "bg-red-700" : "bg-red-600"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("movie")}
          className={`px-4 py-2 rounded-lg text-white ${
            filter === "movie" ? "bg-red-700" : "bg-red-600"
          }`}
        >
          Movies
        </button>

        <button
          onClick={() => setFilter("tv")}
          className={`px-4 py-2 rounded-lg text-white ${
            filter === "tv" ? "bg-red-700" : "bg-red-600"
          }`}
        >
          TV Shows
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center mb-6 text-lg">Loading...</p>
      )}

      {/* Trending/Search Results */}
      <h2 className="text-2xl font-bold text-red-500 mb-6">
        {query ? "Search Results" : "Trending Today"}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {movies
          .filter(
            (item) =>
              item.media_type !== "person" &&
              item.poster_path &&
              (filter === "all" || item.media_type === filter)
          )
          .map((item) => {
            const info = getPlatformInfo(item.id);

            return (
              <div
                key={item.id}
                className="bg-gray-900 text-white rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-300"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt=""
                  onClick={() => setSelected(item)}
                  className="w-full h-72 object-cover cursor-pointer"
                />

                <div className="p-4">
                  <h2 className="font-bold text-lg">
                    {item.title || item.name}
                  </h2>

                  <p className="text-yellow-400 text-sm mt-2">
                    ⭐ {item.vote_average?.toFixed(1)}
                  </p>

                  <p className="text-green-400 text-sm mt-2">
                    Free: {info.free.join(", ")}
                  </p>

                  <p className="text-blue-400 text-sm">
                    Paid: {info.paid.join(", ")}
                  </p>

                  <p className="text-purple-400 text-sm">
                    Quality: {info.quality}
                  </p>

                  <button
                    onClick={() => addToWishlist(item)}
                    className="mt-3 w-full bg-red-600 py-2 rounded-lg hover:bg-red-700"
                  >
                    ❤️ Add to Wishlist
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Wishlist */}
      <h2 className="text-3xl font-bold text-red-500 mb-6">
        My Wishlist
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 text-white rounded-xl overflow-hidden"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt=""
              className="w-full h-52 object-cover"
            />

            <div className="p-3">
              <h3 className="font-bold text-sm">
                {item.title || item.name}
              </h3>

              <button
                onClick={() => removeWishlist(item.id)}
                className="mt-2 w-full bg-red-600 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-gray-900 text-white rounded-2xl max-w-3xl w-full grid md:grid-cols-2 overflow-hidden">
            <img
              src={`https://image.tmdb.org/t/p/w500${selected.poster_path}`}
              alt=""
              className="w-full h-full object-cover"
            />

            <div className="p-6">
              <h2 className="text-3xl font-bold mb-4">
                {selected.title || selected.name}
              </h2>

              <p className="text-yellow-400 mb-2">
                ⭐ {selected.vote_average?.toFixed(1)}
              </p>

              <p className="text-gray-300 mb-4">
                {selected.overview || "No description available."}
              </p>

              <p className="mb-6">
                Release Date:{" "}
                {selected.release_date ||
                  selected.first_air_date ||
                  "Not Available"}
              </p>

              <button
                onClick={() => setSelected(null)}
                className="bg-red-600 px-5 py-2 rounded-lg hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;