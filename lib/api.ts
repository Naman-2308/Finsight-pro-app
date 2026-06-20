import axios from "axios";
import { router } from "expo-router";
import { getToken, clearAuth } from "./auth";
import { clearCachedAIAdvice } from "./aiCache";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      // Auth routes (login, register) return 401 for bad credentials — those
      // screens handle their own errors. Only redirect for expired session tokens
      // on protected routes, not during the login/register flow itself.
      const url: string = error?.config?.url || "";
      const isAuthRoute = url.includes("/auth/");

      if (!isAuthRoute) {
        await clearAuth();
        await clearCachedAIAdvice();
        router.replace("/login");
        return Promise.reject(new Error("Session expired. Please sign in again."));
      }
    }

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    return Promise.reject(new Error(message));
  }
);