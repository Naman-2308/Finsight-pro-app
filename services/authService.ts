import { api } from "@/lib/api";

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export async function loginUser(payload: LoginPayload) {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function registerUser(payload: SignupPayload) {
  const response = await api.post<AuthResponse>("/auth/register", payload);
  return response.data;
}