const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('access_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  const json = await res.json()

  if (!res.ok || !json.status) {
    throw new ApiError(res.status, json.message ?? '요청 실패')
  }

  return json.data
}

// ─── Auth ────────────────────────────────────────────────────

export const api = {
  auth: {
    loginGoogle: (id_token: string) =>
      request<{ access_token: string }>('/auth/login/google', {
        method: 'POST',
        body: JSON.stringify({ id_token }),
      }),
    me: () =>
      request<{
        user_id: string
        email: string
        username: string
        display_name: string | null
        avatar_url: string | null
        bio: string | null
      }>('/auth/me'),
    updateMe: (body: { username?: string; display_name?: string; bio?: string }) =>
      request<{
        user_id: string
        email: string
        username: string
        display_name: string | null
        avatar_url: string | null
        bio: string | null
      }>('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
  },

  // ─── Stills ──────────────────────────────────────────────

  stills: {
    feed: (params?: { limit?: number; offset?: number }) => {
      const q = new URLSearchParams()
      if (params?.limit) q.set('limit', String(params.limit))
      if (params?.offset) q.set('offset', String(params.offset))
      return request<StillsResponse>(`/feed?${q}`)
    },
    mine: (params?: { limit?: number; offset?: number }) => {
      const q = new URLSearchParams()
      if (params?.limit) q.set('limit', String(params.limit))
      if (params?.offset) q.set('offset', String(params.offset))
      return request<StillsResponse>(`/stills/mine?${q}`)
    },
    get: (slug: string) => request<StillResponse>(`/s/${slug}`),
    userStills: (username: string) =>
      request<StillsResponse>(`/u/${username}`),
    create: (body: { image_keys: string[]; caption?: string }) =>
      request<StillResponse>('/stills', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    delete: (still_id: string) =>
      request<{ still_id: string }>(`/stills/${still_id}`, {
        method: 'DELETE',
      }),
  },

  // ─── Images ──────────────────────────────────────────────

  images: {
    upload: async (file: File): Promise<UploadImageResponse> => {
      const token = localStorage.getItem('access_token')
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${API_URL}/images/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      })
      const json = await res.json()
      if (!res.ok || !json.status) throw new ApiError(res.status, json.message ?? '업로드 실패')
      return json.data
    },
  },
}

// ─── Types ───────────────────────────────────────────────────

export interface ImageResponse {
  image_id: string
  image_url: string
  width: number | null
  height: number | null
  position: number
}

export interface StillResponse {
  still_id: string
  slug: string
  user_id: string
  username: string
  display_name: string | null
  caption: string | null
  images: ImageResponse[]
  published_at: string
}

export interface StillsResponse {
  stills: StillResponse[]
  total: number
}

export interface UploadImageResponse {
  image_key: string
  image_url: string
  width: number | null
  height: number | null
}
