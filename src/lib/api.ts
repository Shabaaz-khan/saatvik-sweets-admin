import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function setToken(token: string) {
  localStorage.setItem("admin_token", token);
}

export function clearToken() {
  localStorage.removeItem("admin_token");
}

export const RAZORPAY_ENDPOINT = `${API_BASE}/razorpay`;