import { authRequestFn, uploadImageFn } from "./server-fns";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

// ─── Public (unauthenticated) request ───────────────────────

async function publicRequest<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  const json = await res.json();

  if (!res.ok || !json.status) {
    throw new ApiError(res.status, json.message ?? "요청 실패");
  }

  return json.data;
}

// ─── Authenticated request (via server function) ────────────

async function authedRequest<T>(path: string, method?: string, body?: unknown): Promise<T> {
  return authRequestFn({
    data: {
      path,
      method,
      body: body ? JSON.stringify(body) : undefined,
    },
  }) as Promise<T>;
}

// ─── API ────────────────────────────────────────────────────

export const api = {
  auth: {
    me: () =>
      authedRequest<{
        user_id: string;
        email: string;
        username: string;
        display_name: string | null;
        avatar_url: string | null;
        bio: string | null;
      }>("/auth/me"),
    updateMe: (body: { username?: string; display_name?: string; bio?: string }) =>
      authedRequest<{
        user_id: string;
        email: string;
        username: string;
        display_name: string | null;
        avatar_url: string | null;
        bio: string | null;
      }>("/auth/me", "PUT", body),
  },

  stills: {
    feed: (params?: { limit?: number; offset?: number }) => {
      const q = new URLSearchParams();
      if (params?.limit) q.set("limit", String(params.limit));
      if (params?.offset) q.set("offset", String(params.offset));
      return publicRequest<StillsResponse>(`/feed?${q}`);
    },
    mine: (params?: { limit?: number; offset?: number }) => {
      const q = new URLSearchParams();
      if (params?.limit) q.set("limit", String(params.limit));
      if (params?.offset) q.set("offset", String(params.offset));
      return authedRequest<StillsResponse>(`/stills/mine?${q}`);
    },
    get: (slug: string) => publicRequest<StillResponse>(`/s/${slug}`),
    userStills: (username: string) => publicRequest<StillsResponse>(`/u/${username}`),
    create: (body: { image_keys: string[]; caption?: string }) =>
      authedRequest<StillResponse>("/stills", "POST", body),
    delete: (still_id: string) =>
      authedRequest<{ still_id: string }>(`/stills/${still_id}`, "DELETE"),
  },

  images: {
    upload: async (file: File): Promise<UploadImageResponse> => {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const fileBase64 = btoa(binary);

      return uploadImageFn({
        data: { fileBase64, fileName: file.name, fileType: file.type },
      }) as Promise<UploadImageResponse>;
    },
  },
};

// ─── Types ──────────────────────────────────────────────────

export interface ImageResponse {
  image_id: string;
  image_url: string;
  width: number | null;
  height: number | null;
  position: number;
}

export interface StillResponse {
  still_id: string;
  slug: string;
  user_id: string;
  username: string;
  display_name: string | null;
  caption: string | null;
  images: ImageResponse[];
  published_at: string;
}

export interface StillsResponse {
  stills: StillResponse[];
  total: number;
}

export interface UploadImageResponse {
  image_key: string;
  image_url: string;
  width: number | null;
  height: number | null;
}
