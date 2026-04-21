import { useState, useEffect, useRef } from "react";

/**
 * Custom debounce hook — delays updating a value until after a wait period
 * Demonstrates: useEffect with cleanup, useRef, custom hooks
 * @param {*} value - The value to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {*} The debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef(null);

  useEffect(() => {
    // Clear previous timer using ref
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup on unmount or value change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
