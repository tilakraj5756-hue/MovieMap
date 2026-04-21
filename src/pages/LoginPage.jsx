import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

/**
 * LoginPage — email/password + Google login
 * Demonstrates: Controlled components, useRef, conditional rendering, error handling
 */
function LoginPage() {
  const { dark } = useTheme();
  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      emailRef.current?.focus();
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Incorrect email or password.");
      } else {
        setError("Login failed. Please try again.");
      }
      emailRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await googleSignIn();
      navigate("/");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className={`w-full max-w-md rounded-2xl p-8 shadow-2xl ${
        dark ? "bg-gray-900/80 shadow-black/50" : "bg-white shadow-gray-200"
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h1>
          <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Login to access your watchlist and reviews
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm" id="login-error">
            {error}
          </div>
        )}

        {/* Login Form (controlled) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`}>
              Email
            </label>
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                dark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
              }`}
              id="login-email"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                dark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
              }`}
              id="login-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-lg hover:from-red-700 hover:to-rose-700 disabled:opacity-50 transition-all active:scale-[0.98]"
            id="login-submit"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className={`flex-1 h-px ${dark ? "bg-gray-700" : "bg-gray-200"}`}></div>
          <span className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>OR</span>
          <div className={`flex-1 h-px ${dark ? "bg-gray-700" : "bg-gray-200"}`}></div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full py-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
            dark
              ? "bg-gray-800 text-white border border-gray-700 hover:bg-gray-700"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          id="google-signin"
        >
          <span className="text-lg">🔵</span>
          Sign in with Google
        </button>

        {/* Signup Link */}
        <p className={`text-center text-sm mt-6 ${dark ? "text-gray-400" : "text-gray-500"}`}>
          Don't have an account?{" "}
          <Link to="/signup" className="text-red-500 hover:text-red-400 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
