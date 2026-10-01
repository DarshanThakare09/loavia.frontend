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

// Flags to prevent multiple concurrent refresh calls
let isRefreshingCustomer = false;
let isRefreshingAdmin = false;
let customerFailedQueue: any[] = [];
let adminFailedQueue: any[] = [];

const processQueue = (queue: any[], error: any) => {
  queue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  queue.length = 0;
};

// Response Interceptor — handles token refresh and account suspension
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const errorMsg = error.response?.data?.message || "";

    // ── 1. Account Suspension ──────────────────────────────────────────────
    // Handle 403 with "suspended" message for the customer storefront only.
    if (
      (status === 403 && errorMsg.toLowerCase().includes("suspended")) ||
      (status === 400 && errorMsg.toLowerCase().includes("suspended"))
    ) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth?suspended=true";
      }
      return Promise.reject(error);
    }

    // ── 2. Admin 401 — silent refresh via admin_refresh_token ──────────────
    // Only trigger for admin routes on a genuine 401 (access token expired).
    // Never trigger for the refresh endpoint itself (would create infinite loop).
    const isAdminRoute =
      typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
    const isAdminRefreshCall = originalRequest?.url?.includes("/auth/admin-refresh");

    if (status === 401 && isAdminRoute && !isAdminRefreshCall && !originalRequest._adminRetry) {
      if (isRefreshingAdmin) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          adminFailedQueue.push({ resolve, reject });
        })
          .then(() => {
            originalRequest._adminRetry = true;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._adminRetry = true;
      isRefreshingAdmin = true;

      try {
        await axios.post(
          `${API_BASE_URL}/auth/admin-refresh`,
          {},
          { withCredentials: true }
        );

        processQueue(adminFailedQueue, null);
        isRefreshingAdmin = false;

        // Retry the original request with the new cookie
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(adminFailedQueue, refreshError);
        isRefreshingAdmin = false;

        // Admin refresh failed — the session has genuinely expired.
        // Clear admin auth state and redirect to admin login once.
        if (typeof window !== "undefined") {
          try {
            const { useAdminAuthStore } = await import("@/store/adminAuthStore");
            useAdminAuthStore.getState().logout();
          } catch {
            /* ignore import errors */
          }
          if (!window.location.pathname.startsWith("/admin/login")) {
            window.location.href = "/admin/login?session_expired=true";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    // ── 3. Customer 401 — silent refresh via refresh_token ─────────────────
    const isCustomerRefreshCall = originalRequest?.url?.includes("/auth/refresh");

    if (status === 401 && !isAdminRoute && !isCustomerRefreshCall && !originalRequest._retry) {
      if (isRefreshingCustomer) {
        return new Promise((resolve, reject) => {
          customerFailedQueue.push({ resolve, reject });
        })
          .then(() => {
            originalRequest._retry = true;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshingCustomer = true;

      try {
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        processQueue(customerFailedQueue, null);
        isRefreshingCustomer = false;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(customerFailedQueue, refreshError);
        isRefreshingCustomer = false;

        // Customer refresh failed — only redirect if was actually authenticated
        if (typeof window !== "undefined") {
          const wasAuthenticated = useAuthStore.getState().isAuthenticated;
          useAuthStore.getState().logout();
          if (wasAuthenticated && !window.location.pathname.startsWith("/auth")) {
            window.location.href = "/auth?session_expired=true";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    // ── 4. IMPORTANT: Do NOT force logout on every 403 ─────────────────────
    // A 403 on an admin route means "authenticated but not authorized for this
    // specific resource/action" — it does NOT mean the session is expired.
    // Only 401 (token missing/expired) should trigger the refresh/logout flow.
    // Returning reject here lets the calling code handle 403 properly.

    return Promise.reject(error);
  }
);
