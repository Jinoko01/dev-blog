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

/**
 * API base URL을 반환한다.
 *
 * [클라이언트]
 *   빈 문자열("")을 반환해 /api/... (Next.js Route Handler)를 경유한다.
 *   mutation 후 Route Handler가 revalidateTag()를 호출해 캐시를 즉시 무효화한다.
 *
 * [서버 / 빌드 타임]
 *   API_BASE_URL (Spring Boot)을 직접 반환한다.
 *   빌드 타임에는 Next.js 앱 자체가 아직 실행 중이 아니므로
 *   /api/... 자기 자신을 호출하면 ECONNREFUSED가 발생한다.
 *   서버 컴포넌트의 ISR 갱신은 페이지 레벨 revalidate와
 *   클라이언트 mutation 후 revalidateTag()로 처리한다.
 */
export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:8080";
  return apiBaseUrl.replace(/\/$/, "");
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
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
    throw new ApiError(
      response.status,
      `API request failed: ${response.status} ${path}`,
    );
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

  const page = await apiFetch<{ data: ApiArticle[]; count: number }>(path, {
    next: { revalidate: 60 },
  });

  return {
    data: page.data.map(toArticleListItem),
    count: page.count,
  };
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
  return apiFetch<ApiPostMetrics>(`/posts/${encodeURIComponent(slug)}/view`, {
    method: "POST",
  });
}

export async function incrementPostLike(slug: string) {
  return apiFetch<ApiPostMetrics>(`/posts/${encodeURIComponent(slug)}/like`, {
    method: "POST",
  });
}

export async function decrementPostLike(slug: string) {
  return apiFetch<ApiPostMetrics>(`/posts/${encodeURIComponent(slug)}/like`, {
    method: "DELETE",
  });
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
