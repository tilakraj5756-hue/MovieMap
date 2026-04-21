import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

/**
 * Navbar component — responsive navigation with auth controls and theme toggle
 * Demonstrates: Props, useCallback, conditional rendering, Context consumption
 */
function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }, [logout, navigate]);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${
        dark
          ? "bg-gray-950/80 border-gray-800"
          : "bg-white/80 border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <span className="text-2xl">🎬</span>
            <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">
              MovieMap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-red-500 ${
                dark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Home
            </Link>

            {user && (
              <>
                <Link
                  to="/wishlist"
                  className={`text-sm font-medium transition-colors hover:text-red-500 ${
                    dark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Wishlist
                </Link>
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition-colors hover:text-red-500 ${
                    dark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Profile
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                dark
                  ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
              aria-label="Toggle theme"
              id="theme-toggle"
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm ${
                    dark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {user.displayName || user.email?.split("@")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  id="logout-btn"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    dark
                      ? "text-gray-300 hover:text-white hover:bg-gray-800"
                      : "text-gray-600 hover:text-black hover:bg-gray-100"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg"
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            <span className={`text-2xl ${dark ? "text-white" : "text-black"}`}>
              {menuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className={`md:hidden pb-4 border-t ${
              dark ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col gap-2 pt-4">
              <Link
                to="/"
                onClick={closeMenu}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  dark ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Home
              </Link>

              {user && (
                <>
                  <Link
                    to="/wishlist"
                    onClick={closeMenu}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      dark ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      dark ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Profile
                  </Link>
                </>
              )}

              <div className="flex items-center gap-2 px-3 pt-2">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg ${
                    dark ? "bg-gray-800 text-yellow-400" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {dark ? "☀️" : "🌙"}
                </button>

                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className={`flex-1 text-center px-4 py-2 text-sm rounded-lg ${
                        dark ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
                      }`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeMenu}
                      className="flex-1 text-center px-4 py-2 text-sm text-white bg-red-600 rounded-lg"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
