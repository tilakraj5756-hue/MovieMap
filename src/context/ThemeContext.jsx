import { createContext, useContext, useState, useEffect } from "react";

// Create the Theme Context
const ThemeContext = createContext(null);

/**
 * Custom hook to access theme context
 * @returns {Object} Theme context value
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

/**
 * ThemeProvider component — provides dark/light mode state globally
 * Demonstrates: Context API, localStorage persistence, lifting state up
 */
export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("moviemap-theme");
    return saved ? saved === "dark" : true; // Default to dark mode
  });

  // Persist theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("moviemap-theme", dark ? "dark" : "light");
    // Also update the document class for global styling
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const toggleTheme = () => setDark((prev) => !prev);

  const value = {
    dark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
