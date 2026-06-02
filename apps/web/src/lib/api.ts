type FetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

export type ApiPostSummary = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  thumbnail_url?: string | null;
  published: boolean;
  created_at: string;
  tags?: string[];
  views?: number;
  likes?: number;
};

export type ApiPostsResponse = {
  posts: ApiPostSummary[];
  total_visitors: number;
};

export type ApiPostDetail = ApiPostSummary & {
  content?: string | null;
  relatedPosts?: ApiPostSummary[];
};

export type ApiArticle = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  thumbnail_url?: string | null;
  created_at: string;
  views?: number;
  likes?: number;
  tags?: string[];
};

export type ArticleListItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string | null;
  createdAt: string;
  views: number;
  likes: number;
  tags: string[];
};

export type ApiAlgorithm = {
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

export type ApiTag = {
  id: string;
  name: string;
};

export type ApiPostMetrics = {
  slug: string;
  views: number;
  likes: number;
};

export type ArticleQuery = {
  search?: string;
  tag?: string;
  sort?: "latest" | "popular";
  page?: number;
};

type CacheEntry<T> = { data: T; expiry: number };
const articleCache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 60_000;

function getCached<T>(key: string): T | null {
  const entry = articleCache.get(key) as CacheEntry<T> | undefined;
  if (entry && entry.expiry > Date.now()) {
    return entry.data;
  }
  return null;
}

function setCached<T>(key: string, data: T): void {
  articleCache.set(key, { data, expiry: Date.now() + CACHE_TTL_MS });
}

export function getApiBaseUrl() {
  // 클라이언트: 상대 경로로 Route Handler 경유 (revalidateTag 동작)
  if (typeof window !== "undefined") return "";
  // 서버/빌드 타임: Spring Boot 직접 호출 (순환 참조 방지)
  return (process.env.API_BASE_URL ?? "http://localhost:8080").replace(/\/$/, "");
}

async function apiFetch<T>(path: string, options: FetchOptions = {}) {
  const response = await fetch(`${getApiBaseUrl()}/api${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${path}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function toPostMetadata(post: ApiPostSummary) {
  return {
    title: post.title,
    date: post.created_at,
    description: post.description || "",
    tags: post.tags || [],
    slug: post.slug,
    thumbnailUrl: post.thumbnail_url || null,
    views: post.views || 0,
    likes: post.likes || 0,
  };
}

export function toArticleListItem(article: ApiArticle): ArticleListItem {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    description: article.description || "",
    thumbnailUrl: article.thumbnail_url || null,
    createdAt: article.created_at,
    views: article.views || 0,
    likes: article.likes || 0,
    tags: article.tags || [],
  };
}

export async function getPosts() {
  return apiFetch<ApiPostsResponse>("/posts", {
    next: { revalidate: 600 },
  });
}

export async function getPost(slug: string) {
  return apiFetch<ApiPostDetail>(`/posts/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
}

export async function getTags() {
  return apiFetch<ApiTag[]>("/tags", {
    next: { revalidate: 600 },
  });
}

export async function getArticles(query: ArticleQuery) {
  const params = new URLSearchParams();
  if (query.search) {
    params.set("search", query.search);
  }
  if (query.tag) {
    params.set("tag", query.tag);
  }
  if (query.sort) {
    params.set("sort", query.sort);
  }
  if (query.page) {
    params.set("page", String(query.page));
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";
  const path = `/articles${suffix}`;

  type ArticlesResult = { data: ArticleListItem[]; count: number };
  const cached = getCached<ArticlesResult>(path);
  if (cached) {
    return cached;
  }

  const page = await apiFetch<{ data: ApiArticle[]; count: number }>(path, {
    next: { revalidate: 60 },
  });

  const result: ArticlesResult = {
    data: page.data.map(toArticleListItem),
    count: page.count,
  };

  setCached(path, result);
  return result;
}

export async function getAlgorithms() {
  return apiFetch<ApiAlgorithm[]>("/algorithms", {
    next: { revalidate: 600 },
  });
}

export async function getAlgorithm(id: string) {
  return apiFetch<ApiAlgorithm>(`/algorithms/${encodeURIComponent(id)}`, {
    next: { revalidate: 3600 },
  });
}

export async function incrementPostView(slug: string) {
  return apiFetch<ApiPostMetrics>(
    `/posts/${encodeURIComponent(slug)}/view`,
    {
      method: "POST",
    },
  );
}

export async function incrementPostLike(slug: string) {
  return apiFetch<ApiPostMetrics>(
    `/posts/${encodeURIComponent(slug)}/like`,
    {
      method: "POST",
    },
  );
}

export async function decrementPostLike(slug: string) {
  return apiFetch<ApiPostMetrics>(
    `/posts/${encodeURIComponent(slug)}/like`,
    {
      method: "DELETE",
    },
  );
}

export async function recordVisit(sessionId: string): Promise<void> {
  await apiFetch<void>("/visits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
}

export type ApiStats = {
  post_count: number;
  algorithm_count: number;
};

export async function getStats() {
  return apiFetch<ApiStats>("/stats", {
    next: { revalidate: 60 },
  });
}
