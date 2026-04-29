/**
 * Auth store: register, login, persistent JWT in AsyncStorage.
 * Designed to be safe even when offline / API errors.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = process.env.EXPO_PUBLIC_BACKEND_URL || "";
const TOKEN_KEY = "ia_match_auth_token_v1";
const USER_KEY = "ia_match_auth_user_v1";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  is_premium: boolean;
};

async function postJson(path: string, body: any): Promise<any> {
  const res = await fetch(`${API}/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = json?.detail || `Erreur ${res.status}`;
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return json;
}

export const auth = {
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
  async getUser(): Promise<AuthUser | null> {
    const v = await AsyncStorage.getItem(USER_KEY);
    return v ? JSON.parse(v) : null;
  },
  async register(email: string, password: string, name: string, acceptTerms: boolean): Promise<AuthUser> {
    const r = await postJson("/auth/register", {
      email,
      password,
      name,
      accept_terms: acceptTerms,
    });
    await AsyncStorage.setItem(TOKEN_KEY, r.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(r.user));
    return r.user;
  },
  async login(email: string, password: string): Promise<AuthUser> {
    const r = await postJson("/auth/login", { email, password });
    await AsyncStorage.setItem(TOKEN_KEY, r.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(r.user));
    return r.user;
  },
  async logout(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  },
};

// Cookie / tracking consent
const CONSENT_KEY = "ia_match_consent_v1";
export type ConsentValue = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  acceptedAt: number;
};

export const consent = {
  async get(): Promise<ConsentValue | null> {
    const v = await AsyncStorage.getItem(CONSENT_KEY);
    return v ? JSON.parse(v) : null;
  },
  async set(v: ConsentValue) {
    await AsyncStorage.setItem(CONSENT_KEY, JSON.stringify(v));
  },
  async clear() {
    await AsyncStorage.removeItem(CONSENT_KEY);
  },
};
