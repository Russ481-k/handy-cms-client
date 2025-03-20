// Authentication service for JWT token management

// Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    uuid: string;
    username: string;
    name: string;
    email: string;
    role: string;
  };
}

// Constants
const TOKEN_KEY = "token";
const USER_KEY = "user";

// Helper functions
export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export const setUser = (user: AuthResponse["user"]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getUser = (): AuthResponse["user"] | null => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
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
    // Replace with your actual API endpoint
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

export function getAuthHeader(): HeadersInit {
  const token = getAuthToken();
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

// 인증이 필요한 API 호출을 위한 헬퍼 함수
export function getAuthHeaderOrThrow(): HeadersInit {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}
