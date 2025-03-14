// Authentication service for JWT token management
import { User } from "./auth-utils";

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
const TOKEN_KEY = "cms_auth_token";
const USER_KEY = "cms_user";

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
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data: AuthResponse = await response.json();

    // Store auth data
    setAuthToken(data.token);
    setUser(data.user);

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = (): void => {
  removeAuthToken();
  // Redirect to login page can be handled by the component
};

// API request helper with authentication
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(url, {
    ...options,
    headers,
  });
};

// Add middleware request interceptor
if (typeof window !== "undefined") {
  const originalFetch = window.fetch;
  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    const token = getAuthToken();
    if (token && init?.headers !== undefined) {
      const headers = new Headers(init.headers);
      headers.set("Authorization", `Bearer ${token}`);
      init.headers = headers;
    }
    return originalFetch.call(window, input, init);
  };
}
