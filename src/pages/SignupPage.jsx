import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

/**
 * SignupPage — registration form with validation
 * Demonstrates: Controlled components, useRef, form validation, error handling
 */
function SignupPage() {
  const { dark } = useTheme();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const nameRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      nameRef.current?.focus();
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signup(email, password, name);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Signup failed. Please try again.");
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
              Create Account
            </span>
          </h1>
          <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Join MovieMap to save your favorites
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm" id="signup-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`}>
              Display Name
            </label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                dark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
              }`}
              id="signup-name"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                dark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
              }`}
              id="signup-email"
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
              id="signup-password"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${dark ? "text-gray-300" : "text-gray-700"}`}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                dark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
              }`}
              id="signup-confirm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-lg hover:from-red-700 hover:to-rose-700 disabled:opacity-50 transition-all active:scale-[0.98]"
            id="signup-submit"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className={`text-center text-sm mt-6 ${dark ? "text-gray-400" : "text-gray-500"}`}>
          Already have an account?{" "}
          <Link to="/login" className="text-red-500 hover:text-red-400 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
