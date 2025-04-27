export const TOKEN_KEY = "auth_token";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token =
    localStorage.getItem(TOKEN_KEY) ||
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${TOKEN_KEY}=`))
      ?.split("=")[1];
  if (!token) {
    console.warn("저장된 토큰이 없습니다");
    return null;
  }
  return token.trim();
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  if (!token) {
    console.warn("빈 토큰을 저장하려고 시도했습니다");
    return;
  }
  const trimmedToken = token.trim();
  localStorage.setItem(TOKEN_KEY, trimmedToken);
  // 쿠키에 토큰 저장 (30일 유효)
  document.cookie = `${TOKEN_KEY}=${trimmedToken}; path=/; max-age=${
    30 * 24 * 60 * 60
  }`;
};

export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  // 쿠키에서 토큰 삭제
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};

export function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export const getAuthHeaderOrThrow = (): { Authorization: string } => {
  const token = getToken();
  if (!token || !isAuthenticated()) {
    throw new Error("No valid authentication token found");
  }
  return { Authorization: `Bearer ${token}` };
};
