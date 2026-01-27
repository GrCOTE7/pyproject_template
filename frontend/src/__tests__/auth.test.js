import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  authFetch,
  clearTokens,
  getTokens,
  hasValidSession,
  login,
  setTokens,
} from "../auth";

const base64Url = (obj) =>
  Buffer.from(JSON.stringify(obj))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const buildToken = (payload) => {
  const header = base64Url({ alg: "HS256", typ: "JWT" });
  const body = base64Url(payload);
  return `${header}.${body}.sig`;
};

describe("auth helpers", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("login stores tokens on success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          access_token: "access",
          refresh_token: "refresh",
        }),
    });
    globalThis.fetch = fetchMock;

    const data = await login("alice", "secret");

    expect(data.access_token).toBe("access");
    expect(getTokens()).toEqual({
      accessToken: "access",
      refreshToken: "refresh",
    });
  });

  it("login throws on error", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ detail: "Invalid credentials" }),
    });

    await expect(login("alice", "wrong")).rejects.toThrow(
      "Invalid credentials",
    );
  });

  it("hasValidSession returns true with valid access token", () => {
    const exp = Math.floor(Date.now() / 1000) + 60;
    const token = buildToken({ exp });
    setTokens({ access_token: token, refresh_token: "refresh" });

    expect(hasValidSession()).toBe(true);
  });

  it("hasValidSession returns true with only refresh token", () => {
    setTokens({ access_token: "", refresh_token: "refresh" });

    expect(hasValidSession()).toBe(true);
  });

  it("authFetch adds Authorization header", async () => {
    const exp = Math.floor(Date.now() / 1000) + 60;
    const token = buildToken({ exp });
    setTokens({ access_token: token, refresh_token: "refresh" });

    const fetchMock = vi.fn().mockResolvedValue({ status: 200 });
    globalThis.fetch = fetchMock;

    await authFetch("/api/hello");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.get("Authorization")).toBe(`Bearer ${token}`);
  });

  it("clearTokens removes stored tokens", () => {
    setTokens({ access_token: "access", refresh_token: "refresh" });
    clearTokens();

    expect(getTokens()).toEqual({ accessToken: null, refreshToken: null });
  });
});
