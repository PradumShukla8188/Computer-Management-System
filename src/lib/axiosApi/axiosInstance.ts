import axios from "axios";
import Cookies from "js-cookie";

// Client-safe cookie reading (avoids SSR error)
const getToken = () => {
  if (typeof window === "undefined") return null;
  return Cookies.get("token");
};

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || "/",
  //   withCredentials: false,
});

// Add Interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    console.error("API Error:", error?.response || error);
    if (error?.response?.status === 401) {
      console.warn("Unauthorized → logging out");

      // Clear token from cookies
      Cookies.remove("token");

      // Redirect to signin
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  },
);
