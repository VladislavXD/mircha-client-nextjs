import Cookies from "js-cookie";

/**
 * Проверяет наличие авторизации пользователя.
 * Проверяет NextAuth сессию или custom token.
 */
export function isAuthenticated(): boolean {
  // Проверяем NextAuth session
  const nextAuthSession =
    Cookies.get("next-auth.session-token") ||
    Cookies.get("__Secure-next-auth.session-token");

  // Проверяем custom token
  const customToken =
    Cookies.get("token") ||
    (typeof window !== "undefined" && localStorage.getItem("token"));

  return !!(nextAuthSession || customToken);
}

/**
 * Получает токен авторизации из cookies или localStorage.
 */
export function getAuthToken(): string | null {
  // Проверяем custom token
  const token = Cookies.get("session");

  if (token) {
    console.log("🔑 getAuthToken: Found token in cookies");

    return token;
  }

  // Проверяем localStorage
  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      console.log("🔑 getAuthToken: Found token in localStorage");

      return storedToken;
    }
  }

  // Проверяем NextAuth session
  const nextAuthSession =
    Cookies.get("next-auth.session-token") ||
    Cookies.get("__Secure-next-auth.session-token");

  if (nextAuthSession) {
    console.log("🔑 getAuthToken: Found NextAuth session token");

    return nextAuthSession;
  }

  console.warn("🔑 getAuthToken: No token found!");

  return null;
}

/**
 * Выполняет выход из системы, очищая все токены и сессии.
 */
export function logout(): void {
  // Удаляем custom token
  Cookies.remove("token");
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }

  // Удаляем NextAuth session
  Cookies.remove("next-auth.session-token");
  Cookies.remove("__Secure-next-auth.session-token");

  // Перенаправляем на страницу авторизации
  if (typeof window !== "undefined") {
    window.location.href = "/auth";
  }
}
