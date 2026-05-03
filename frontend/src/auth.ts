/**
 * Auth store: register, login, persistent JWT in AsyncStorage.
 * Designed to be safe even when offline / API errors.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = process.env.EXPO_PUBLIC_BACKEND_URL || "";
const TOKEN_KEY = "ia_match_auth_token_v1";
const USER_KEY = "ia_match_auth_user_v1";
const DEMO_AUTH = !API;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  is_premium: boolean;
};

async function postJson(path: string, body: any, token?: string | null): Promise<any> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["X-Auth-Token"] = token;
  const res = await fetch(`${API}/api${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = json?.detail || `Erreur ${res.status}`;
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return json;
}

async function patchJson(path: string, body: any, token: string): Promise<any> {
  const res = await fetch(`${API}/api${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "X-Auth-Token": token },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = json?.detail || `Erreur ${res.status}`;
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return json;
}

async function deleteJson(path: string, token: string): Promise<any> {
  const res = await fetch(`${API}/api${path}`, {
    method: "DELETE",
    headers: { "X-Auth-Token": token },
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
    if (DEMO_AUTH) {
      if (!acceptTerms) throw new Error("Tu dois accepter les CGU et la Politique de confidentialité");
      if (!email.trim() || password.length < 6) throw new Error("Email et mot de passe requis pour la démo bêta");
      const user = { id: `demo-${Date.now()}`, email: email.trim(), name: name.trim() || email.split("@")[0], is_premium: true };
      await AsyncStorage.setItem(TOKEN_KEY, `demo-token-${Date.now()}`);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    }
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
    if (DEMO_AUTH) {
      if (!email.trim() || !password.trim()) throw new Error("Email et mot de passe requis pour la démo bêta");
      const user = { id: "demo-beta", email: email.trim(), name: email.split("@")[0] || "Beta testeur", is_premium: true };
      await AsyncStorage.setItem(TOKEN_KEY, `demo-token-${Date.now()}`);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    }
    const r = await postJson("/auth/login", { email, password });
    await AsyncStorage.setItem(TOKEN_KEY, r.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(r.user));
    return r.user;
  },
  async logout(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  },
  async updateProfile(name: string): Promise<AuthUser> {
    if (DEMO_AUTH) {
      const current = await auth.getUser();
      const user = { id: current?.id || "demo-beta", email: current?.email || "beta@ia-match.local", name, is_premium: true };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    }
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("Pas connecté");
    const u = await patchJson("/auth/me", { name }, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
    return u;
  },
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("Pas connecté");
    await postJson("/auth/password/change", { current_password: currentPassword, new_password: newPassword }, token);
  },
  async deleteAccount(): Promise<void> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("Pas connecté");
    await deleteJson("/auth/account", token);
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  },
  async requestPasswordReset(email: string): Promise<{ ok: boolean; reset_link?: string }> {
    return postJson("/auth/password/reset", { email });
  },
  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    await postJson("/auth/password/reset/confirm", { token, new_password: newPassword });
  },
  async requestEmailVerify(): Promise<{ ok: boolean; verify_link?: string; already?: boolean }> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("Pas connecté");
    return postJson("/auth/email/verify", {}, token);
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
