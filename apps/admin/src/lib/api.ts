type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type AdminPost = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail_url: string;
  published: boolean;
  created_at: string;
  tags: string[];
};

export type AdminAlgorithm = {
  id: string;
  title: string;
  platform: string;
  difficulty: string;
  language: string;
  description: string;
  code: string;
  tags: string[];
  published: boolean;
  created_at: string;
};

type ApiPost = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  content?: string | null;
  thumbnailUrl?: string | null;
  published: boolean;
  createdAt: string;
  tags?: string[];
};

type ApiAlgorithm = {
  id: string;
  title: string;
  platform?: string | null;
  difficulty?: string | null;
  language: string;
  description?: string | null;
  code: string;
  tags?: string[];
  published: boolean;
  createdAt: string;
};

type PostPayload = {
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail_url: string;
  published: boolean;
  tags: string[];
};

type AlgorithmPayload = {
  title: string;
  platform: string;
  difficulty: string;
  language: string;
  description: string;
  code: string;
  tags: string[];
  published: boolean;
};

type SignedUploadResponse = {
  signedUrl: string;
  token: string;
  path: string;
};

export function getApiBaseUrl() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL in .env.",
    );
  }

  return apiBaseUrl.replace(/\/$/, "");
}

export function getAdminToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("devblog_admin_token");
}

export function setAdminToken(token: string) {
  localStorage.setItem("devblog_admin_token", token);
}

export function clearAdminToken() {
  localStorage.removeItem("devblog_admin_token");
}

async function apiFetch<T>(
  path: string,
  options: RequestInit & { method?: HttpMethod } = {},
) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      body?.message || body?.error || `${response.status} ${path}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

async function adminFetch<T>(
  path: string,
  options: RequestInit & { method?: HttpMethod } = {},
) {
  const token = getAdminToken();
  if (!token) {
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
    throw new Error("Admin login is required.");
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    clearAdminToken();
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      body?.message || body?.error || `${response.status} ${path}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function toAdminPost(post: ApiPost): AdminPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    description: post.description || "",
    content: post.content || "",
    thumbnail_url: post.thumbnailUrl || "",
    published: post.published,
    created_at: post.createdAt,
    tags: post.tags || [],
  };
}

function toAdminAlgorithm(algo: ApiAlgorithm): AdminAlgorithm {
  return {
    id: algo.id,
    title: algo.title,
    platform: algo.platform || "",
    difficulty: algo.difficulty || "",
    language: algo.language || "typescript",
    description: algo.description || "",
    code: algo.code || "",
    tags: algo.tags || [],
    published: algo.published,
    created_at: algo.createdAt,
  };
}

function toPostRequest(payload: PostPayload) {
  return {
    title: payload.title,
    slug: payload.slug,
    description: payload.description,
    content: payload.content,
    thumbnailUrl: payload.thumbnail_url,
    published: payload.published,
    tags: payload.tags,
  };
}

export async function login(username: string, password: string) {
  const result = await apiFetch<{ token: string }>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  setAdminToken(result.token);
}

export async function getPosts() {
  const posts = await apiFetch<ApiPost[]>("/api/posts");
  return posts.map(toAdminPost);
}

export async function getPostForAdmin(id: string) {
  const posts = await getPosts();
  const post = posts.find((item) => item.id === id);
  if (!post) {
    throw new Error("Post not found in the public backend API.");
  }

  const detail = await apiFetch<ApiPost>(
    `/api/posts/${encodeURIComponent(post.slug)}`,
  );
  return toAdminPost(detail);
}

export async function createPost(payload: PostPayload) {
  const post = await adminFetch<ApiPost>("/api/admin/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toPostRequest(payload)),
  });
  return toAdminPost(post);
}

export async function updatePost(id: string, payload: PostPayload) {
  const post = await adminFetch<ApiPost>(`/api/admin/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toPostRequest(payload)),
  });
  return toAdminPost(post);
}

export async function togglePostPublish(id: string) {
  const post = await adminFetch<ApiPost>(`/api/admin/posts/${id}/publish`, {
    method: "PATCH",
  });
  return toAdminPost(post);
}

export async function deletePost(id: string) {
  await adminFetch<void>(`/api/admin/posts/${id}`, {
    method: "DELETE",
  });
}

export async function getAlgorithms() {
  const algos = await apiFetch<ApiAlgorithm[]>("/api/algorithms");
  return algos.map(toAdminAlgorithm);
}

export async function getAlgorithm(id: string) {
  const algo = await apiFetch<ApiAlgorithm>(`/api/algorithms/${id}`);
  return toAdminAlgorithm(algo);
}

export async function createAlgorithm(payload: AlgorithmPayload) {
  const algo = await adminFetch<ApiAlgorithm>("/api/admin/algorithms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return toAdminAlgorithm(algo);
}

export async function updateAlgorithm(id: string, payload: AlgorithmPayload) {
  const algo = await adminFetch<ApiAlgorithm>(`/api/admin/algorithms/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return toAdminAlgorithm(algo);
}

export async function toggleAlgorithmPublish(id: string) {
  const algo = await adminFetch<ApiAlgorithm>(
    `/api/admin/algorithms/${id}/publish`,
    { method: "PATCH" },
  );
  return toAdminAlgorithm(algo);
}

export async function deleteAlgorithm(id: string) {
  await adminFetch<void>(`/api/admin/algorithms/${id}`, {
    method: "DELETE",
  });
}

export async function createSignedUploadUrl(filename: string) {
  return adminFetch<SignedUploadResponse>("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename }),
  });
}

export function getPublicUrlFromSignedUploadUrl(
  signedUrl: string,
  path: string,
) {
  const url = new URL(signedUrl);
  return `${url.origin}/storage/v1/object/public/blog-images/${path}`;
}
