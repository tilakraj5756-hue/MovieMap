import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// ========================
// WISHLIST CRUD Operations
// ========================

/**
 * Add a movie to user's wishlist (Create)
 * @param {string} userId - Firebase user ID
 * @param {Object} movie - Movie object from TMDB
 * @returns {Promise<string>} Document ID
 */
export const addToWishlist = async (userId, movie) => {
  const docRef = doc(db, "wishlists", `${userId}_${movie.id}`);
  await setDoc(docRef, {
    userId,
    movieId: movie.id,
    title: movie.title || movie.name,
    posterPath: movie.poster_path,
    mediaType: movie.media_type || "movie",
    voteAverage: movie.vote_average,
    overview: movie.overview || "",
    note: "",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Get user's wishlist (Read)
 * @param {string} userId - Firebase user ID
 * @returns {Promise<Array>} Array of wishlist items
 */
export const getWishlist = async (userId) => {
  const q = query(
    collection(db, "wishlists"),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Update a wishlist item's note (Update)
 * @param {string} userId - Firebase user ID
 * @param {number} movieId - TMDB movie ID
 * @param {string} note - Personal note
 */
export const updateWishlistNote = async (userId, movieId, note) => {
  const docRef = doc(db, "wishlists", `${userId}_${movieId}`);
  await updateDoc(docRef, {
    note,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Remove a movie from wishlist (Delete)
 * @param {string} userId - Firebase user ID
 * @param {number} movieId - TMDB movie ID
 */
export const removeFromWishlist = async (userId, movieId) => {
  const docRef = doc(db, "wishlists", `${userId}_${movieId}`);
  await deleteDoc(docRef);
};

/**
 * Check if a movie is in user's wishlist
 * @param {string} userId - Firebase user ID
 * @param {number} movieId - TMDB movie ID
 * @returns {Promise<boolean>}
 */
export const isInWishlist = async (userId, movieId) => {
  const docRef = doc(db, "wishlists", `${userId}_${movieId}`);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};

// ========================
// REVIEWS CRUD Operations
// ========================

/**
 * Add a review for a movie (Create)
 * @param {string} userId - Firebase user ID
 * @param {string} userName - Display name of user
 * @param {number} movieId - TMDB movie ID
 * @param {Object} reviewData - { rating, text }
 * @returns {Promise<string>} Document ID
 */
export const addReview = async (userId, userName, movieId, reviewData) => {
  const docRef = await addDoc(collection(db, "reviews"), {
    userId,
    userName: userName || "Anonymous",
    movieId,
    rating: reviewData.rating,
    text: reviewData.text,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Get all reviews for a movie (Read)
 * @param {number} movieId - TMDB movie ID
 * @returns {Promise<Array>} Array of reviews
 */
export const getReviews = async (movieId) => {
  const q = query(
    collection(db, "reviews"),
    where("movieId", "==", movieId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Update an existing review (Update)
 * @param {string} reviewId - Firestore document ID
 * @param {Object} data - { rating, text }
 */
export const updateReview = async (reviewId, data) => {
  const docRef = doc(db, "reviews", reviewId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a review (Delete)
 * @param {string} reviewId - Firestore document ID
 */
export const deleteReview = async (reviewId) => {
  const docRef = doc(db, "reviews", reviewId);
  await deleteDoc(docRef);
};
