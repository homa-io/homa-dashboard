/**
 * Safe localStorage wrapper with error handling
 * Handles private browsing mode and quota exceeded errors
 */

export const safeStorage = {
  /**
   * Safely set an item in localStorage
   * @param key - The storage key
   * @param value - The value to store (will be JSON stringified)
   * @returns true if successful, false if failed
   */
  setItem: (key: string, value: unknown): boolean => {
    try {
      if (typeof window === "undefined") return false;
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      // Handle private browsing mode, quota exceeded, etc.
      if (error instanceof Error) {
        if (
          error.name === "QuotaExceededError" ||
          error.name === "SecurityError" ||
          error.name === "NotSupportedError"
        ) {
          console.warn(`Storage error for key "${key}":`, error.message);
          return false;
        }
      }
      console.error("Unexpected storage error:", error);
      return false;
    }
  },

  /**
   * Safely get an item from localStorage
   * @param key - The storage key
   * @returns The parsed value or null if not found/error
   */
  getItem: <T = unknown>(key: string): T | null => {
    try {
      if (typeof window === "undefined") return null;
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.warn(`Invalid JSON in storage key "${key}", clearing it.`);
        safeStorage.removeItem(key);
        return null;
      }
      if (error instanceof Error) {
        if (error.name === "SecurityError") {
          console.warn("Storage access denied (possibly private browsing)");
          return null;
        }
      }
      console.error("Unexpected storage retrieval error:", error);
      return null;
    }
  },

  /**
   * Safely remove an item from localStorage
   * @param key - The storage key
   * @returns true if successful, false if failed
   */
  removeItem: (key: string): boolean => {
    try {
      if (typeof window === "undefined") return false;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "SecurityError") {
          console.warn("Storage access denied (possibly private browsing)");
          return false;
        }
      }
      console.error("Unexpected storage removal error:", error);
      return false;
    }
  },

  /**
   * Safely clear all items from localStorage
   * @returns true if successful, false if failed
   */
  clear: (): boolean => {
    try {
      if (typeof window === "undefined") return false;
      localStorage.clear();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "SecurityError") {
          console.warn("Storage access denied (possibly private browsing)");
          return false;
        }
      }
      console.error("Unexpected storage clear error:", error);
      return false;
    }
  },
};
