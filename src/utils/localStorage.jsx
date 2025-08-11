// utils/localStorage.js
const Storage = {
  setItem: (key, value) => {
    const val = typeof value === "object" ? JSON.stringify(value) : value;
    localStorage.setItem(key, val);
  },

  getItem: (key) => {
    const value = localStorage.getItem(key);
    if (!value) return null;

    try {
      // Try parsing only if it's JSON
      return JSON.parse(value);
    } catch {
      // Return raw string (like a token)
      return value;
    }
  },

  removeItem: (key) => localStorage.removeItem(key),

  clear: () => localStorage.clear(),
};

export default Storage;
