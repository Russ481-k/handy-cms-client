// Authentication service for JWT token management

import { api } from "@/lib/api-client";
import { User } from "@/types/api";

// Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Constants
const TOKEN_KEY = "token";
const USER_KEY = "user";

// Helper functions
export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const setUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// API functions
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await api.private.login(credentials);

    if (!response.data) {
      throw new Error(response.message || "Login failed");
    }

    // Store auth data
    setAuthToken(response.data.token);
    setUser(response.data.user);

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = (): void => {
  removeAuthToken();
  // Redirect to login page can be handled by the component
};

export function getAuthHeader() {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};
