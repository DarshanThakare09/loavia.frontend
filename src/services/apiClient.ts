import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to inject guest session ID
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      let guestSessionId = localStorage.getItem("loavia_guest_session_id");
      if (!guestSessionId) {
        guestSessionId = crypto.randomUUID 
          ? crypto.randomUUID() 
          : Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        localStorage.setItem("loavia_guest_session_id", guestSessionId);
      }
      config.headers["x-session-id"] = guestSessionId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// A flag to prevent multiple concurrent refresh calls
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor for handling Token Refresh (RTR) and Suspensions
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Handle Account Suspension
    // When backend returns 403 with user suspended details, or 400 with suspension message
    const errorMsg = error.response?.data?.message || "";
    if (
      (error.response?.status === 403 && errorMsg.toLowerCase().includes("suspended")) ||
      (error.response?.status === 400 && errorMsg.toLowerCase().includes("suspended"))
    ) {
      // Force instant logout on the client side
      useAuthStore.getState().logout();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth?suspended=true";
      }
      return Promise.reject(error);
    }

    // 2. Handle Token Expiry & Automatic Refresh (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we are already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint to rotate cookies on the backend
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        processQueue(null);
        isRefreshing = false;
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Refresh token failed/expired/revoked -> Force logout
        const wasAuthenticated = useAuthStore.getState().isAuthenticated;
        useAuthStore.getState().logout();
        if (typeof window !== "undefined" && wasAuthenticated && !window.location.pathname.startsWith("/auth")) {
          window.location.href = "/auth?session_expired=true";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
