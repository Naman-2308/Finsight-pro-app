import axios from "axios";
import { getToken } from "@/lib/auth";

export const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
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
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    return Promise.reject(new Error(message));
  }
);