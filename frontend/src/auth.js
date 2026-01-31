// Indique si l'on est en local (localhost ou 127.0.0.1)
export const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
// Vérifie si l'utilisateur courant est admin (superuser ou rôle admin)
export function isAdminUser() {
  const { accessToken } = getTokens();
  if (!accessToken) return false;
  try {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    return (
      !!payload?.is_superuser ||
      (Array.isArray(payload?.roles) && payload.roles.includes("admin"))
    );
  } catch {
    return false;
  }
}
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const getAuthBaseUrl = () => {
  // Définir URL explicite en prod pour éviter err routage/CORS
  const configured = import.meta.env.VITE_AUTH_BASE_URL;
  if (!configured) return "";
  return configured.endsWith("/") ? configured.slice(0, -1) : configured;
};

const base64UrlDecode = (value) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  return atob(padded);
};

const parseJwt = (token) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    return null;
  }
};

const isTokenExpired = (token, leewaySeconds = 30) => {
  const payload = parseJwt(token);
  if (!payload?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp - leewaySeconds <= now;
};

export const getTokens = () => ({
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
});

export const setTokens = ({ access_token, refresh_token }) => {
  if (access_token) localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  if (refresh_token) localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const login = async (username, password) => {
  const response = await fetch(`${getAuthBaseUrl()}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  setTokens(data);
  return data;
};

export const refreshAccessToken = async () => {
  const { refreshToken } = getTokens();
  if (!refreshToken) throw new Error("Missing refresh token");

  const response = await fetch(`${getAuthBaseUrl()}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Refresh failed");
  }

  setTokens(data);
  return data;
};

export const authFetch = async (input, init = {}) => {
  const tokens = getTokens();

  if (!tokens.accessToken || isTokenExpired(tokens.accessToken)) {
    try {
      await refreshAccessToken();
    } catch (err) {
      clearTokens();
      throw err;
    }
  }

  const { accessToken } = getTokens();
  const headers = new Headers(init.headers || {});
  headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(input, { ...init, headers });
  if (response.status !== 401) return response;

  try {
    await refreshAccessToken();
  } catch (err) {
    clearTokens();
    throw err;
  }
  const retryHeaders = new Headers(init.headers || {});
  retryHeaders.set("Authorization", `Bearer ${getTokens().accessToken}`);
  const retryResponse = await fetch(input, { ...init, headers: retryHeaders });
  if (retryResponse.status === 401) {
    clearTokens();
    throw new Error("Session expirée");
  }
  return retryResponse;
};

export const hasValidSession = () => {
  const { accessToken, refreshToken } = getTokens();
  if (accessToken && !isTokenExpired(accessToken)) return true;
  return Boolean(refreshToken);
};
