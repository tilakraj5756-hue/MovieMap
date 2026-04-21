import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBfv75DW-8i5Fz97yld2UTyL4yxlCi9V8",
  authDomain: "moviemap-e0772.firebaseapp.com",
  projectId: "moviemap-e0772",
  storageBucket: "moviemap-e0772.firebasestorage.app",
  messagingSenderId: "323749231666",
  appId: "1:323749231666:web:cb18a899fd9323663d502b",
  measurementId: "G-CZHVQBSZC0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth instance
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Firestore instance
export const db = getFirestore(app);

export default app;
