import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "./session";

const API_URL = process.env.VITE_API_URL ?? "http://localhost:8080";

// ─── Login ──────────────────────────────────────────────────

export const loginWithGoogleFn = createServerFn({ method: "POST" })
  .inputValidator((data: { credential: string }) => data)
  .handler(async ({ data }) => {
    const res = await fetch(`${API_URL}/auth/login/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: data.credential }),
    });
    const json = await res.json();
    if (!res.ok || !json.status) {
      throw new Error(json.message ?? "로그인 실패");
    }

    const session = await useAppSession();
    await session.update({ token: json.data.access_token });

    return { success: true };
  });

// ─── Logout ─────────────────────────────────────────────────

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useAppSession();
  await session.clear();
  return { success: true };
});

// ─── Auth Check ─────────────────────────────────────────────

export const getAuthFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useAppSession();
  return { isLoggedIn: !!session.data.token };
});

// ─── Authenticated API Proxy ────────────────────────────────

export const authRequestFn = createServerFn({ method: "POST" })
  .inputValidator((data: { path: string; method?: string; body?: string }) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const token = session.data.token;
    if (!token) throw new Error("인증이 필요합니다");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const res = await fetch(`${API_URL}${data.path}`, {
      method: data.method ?? "GET",
      headers,
      body: data.body ?? undefined,
    });
    const json = await res.json();
    if (!res.ok || !json.status) {
      throw new Error(json.message ?? "요청 실패");
    }

    return json.data;
  });

// ─── Image Upload Proxy ─────────────────────────────────────

export const uploadImageFn = createServerFn({ method: "POST" })
  .inputValidator((data: { fileBase64: string; fileName: string; fileType: string }) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const token = session.data.token;
    if (!token) throw new Error("인증이 필요합니다");

    const buffer = Buffer.from(data.fileBase64, "base64");
    const blob = new Blob([buffer], { type: data.fileType });

    const form = new FormData();
    form.append("file", blob, data.fileName);

    const res = await fetch(`${API_URL}/images/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const json = await res.json();
    if (!res.ok || !json.status) {
      throw new Error(json.message ?? "업로드 실패");
    }

    return json.data;
  });
