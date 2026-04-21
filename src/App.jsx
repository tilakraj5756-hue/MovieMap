import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";

// React.lazy — code splitting for pages (Lazy Loading)
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const MovieDetailPage = lazy(() => import("./pages/MovieDetailPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

/**
 * App component — Router hub with lazy-loaded pages
 * Demonstrates: React.lazy, Suspense, React Router, Protected Routes
 */
function App() {
  const { dark } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        dark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Navigation */}
      <Navbar />

      {/* Suspense wraps lazy-loaded routes with fallback loader */}
      <Suspense fallback={<Loader text="Loading page..." />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes — require authentication */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movie/:mediaType/:id"
            element={
              <ProtectedRoute>
                <MovieDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Fallback for undefined routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;