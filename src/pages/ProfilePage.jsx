import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getWishlist } from "../services/firestore";
import Loader from "../components/Loader";

/**
 * ProfilePage — user dashboard with stats and profile editing
 * Demonstrates: useEffect, useState, controlled components, conditional rendering
 */
function ProfilePage() {
  const { dark } = useTheme();
  const { user, updateUserProfile, logout } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Load user stats
  useEffect(() => {
    if (!user) return;

    setDisplayName(user.displayName || "");

    const loadStats = async () => {
      try {
        const wishlist = await getWishlist(user.uid);
        setWishlistCount(wishlist.length);
      } catch (err) {
        console.error("Load stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  // Save profile changes (controlled form)
  const handleSave = useCallback(async () => {
    if (!displayName.trim()) return;

    setSaving(true);
    try {
      await updateUserProfile({ displayName: displayName.trim() });
      setEditing(false);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to update profile.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }, [displayName, updateUserProfile]);

  if (loading) {
    return <Loader text="Loading profile..." />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
        <span className="bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
          👤 My Profile
        </span>
      </h1>

      {/* Success/Error Message */}
      {message && (
        <div className={`mb-6 p-3 rounded-lg text-sm text-center ${
          message.includes("success")
            ? "bg-green-500/10 border border-green-500/30 text-green-400"
            : "bg-red-500/10 border border-red-500/30 text-red-400"
        }`}>
          {message}
        </div>
      )}

      {/* Profile Card */}
      <div className={`rounded-2xl p-6 sm:p-8 shadow-xl mb-6 ${
        dark ? "bg-gray-900/80" : "bg-white shadow-gray-200"
      }`}>
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-4 ${
            dark ? "bg-gray-800" : "bg-gray-100"
          }`}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              "👤"
            )}
          </div>

          {editing ? (
            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
                className={`w-full px-4 py-2 rounded-lg border text-sm text-center focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
                  dark
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
                id="profile-name-input"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setDisplayName(user.displayName || "");
                  }}
                  className={`px-5 py-2 text-sm font-medium rounded-lg ${
                    dark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>
                {user?.displayName || "User"}
              </h2>
              <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                {user?.email}
              </p>
              <button
                onClick={() => setEditing(true)}
                className="mt-2 text-xs text-red-500 hover:text-red-400 font-medium"
                id="edit-profile-btn"
              >
                ✏️ Edit Name
              </button>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-xl p-4 text-center ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
            <p className="text-3xl font-bold text-red-500">{wishlistCount}</p>
            <p className={`text-sm mt-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>
              Wishlist Items
            </p>
          </div>
          <div className={`rounded-xl p-4 text-center ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
            <p className="text-3xl font-bold text-yellow-500">⭐</p>
            <p className={`text-sm mt-1 ${dark ? "text-gray-400" : "text-gray-500"}`}>
              Movie Fan
            </p>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className={`rounded-2xl p-6 shadow-xl ${
        dark ? "bg-gray-900/80" : "bg-white shadow-gray-200"
      }`}>
        <h3 className={`font-semibold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>
          Account Details
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>Email</span>
            <span className={`text-sm font-medium ${dark ? "text-white" : "text-gray-900"}`}>
              {user?.email}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>Provider</span>
            <span className={`text-sm font-medium ${dark ? "text-white" : "text-gray-900"}`}>
              {user?.providerData?.[0]?.providerId === "google.com" ? "Google" : "Email/Password"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>Member Since</span>
            <span className={`text-sm font-medium ${dark ? "text-white" : "text-gray-900"}`}>
              {user?.metadata?.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
