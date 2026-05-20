import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.neohealthcard.com:9100",
  // baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:9155",
});

/* ================= REQUEST ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Token = token;  // legacy routes use req.header('Token')
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 🔐 Unauthorized / Token expired
    if (status === 401) {
      toast.error("Session expired. Please login again");

      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }

    // ⛔ Forbidden
    else if (status === 403) {
      toast.error("You are not authorized to perform this action");
    }

    // 💥 Server error
    else if (status >= 500) {
      toast.error("Server error. Please try again later");
    }

    return Promise.reject(error);
  }
);

export default api;
