export const API_CONFIG = {
  baseURL:
    import.meta.env.VITE_API_URL ||
    (typeof window !== "undefined" &&
    window.location.hostname === "redesocial-frontend.onrender.com"
      ? "https://api-redesocial-1.onrender.com/api"
      : "http://localhost:3000/api")
};
