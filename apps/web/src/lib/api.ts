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

async function apiFetch<T>(path: string, options: FetchOptions = {}) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Backend API request failed: ${response.status} ${path}`);
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
  return apiFetch<ApiPostSummary[]>("/api/posts", {
    next: { revalidate: 60 },
  });
}

export async function getPost(slug: string) {
  return apiFetch<ApiPostDetail>(`/api/posts/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  });
}

export async function getTags() {
  return apiFetch<ApiTag[]>("/api/tags", {
    next: { revalidate: 60 },
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
  const page = await apiFetch<{ data: ApiArticle[]; count: number }>(
    `/api/articles${suffix}`,
  );

  return {
    data: page.data.map(toArticleListItem),
    count: page.count,
  };
}

export async function getAlgorithms() {
  return apiFetch<ApiAlgorithm[]>("/api/algorithms", {
    next: { revalidate: 60 },
  });
}

export async function getAlgorithm(id: string) {
  return apiFetch<ApiAlgorithm>(`/api/algorithms/${encodeURIComponent(id)}`, {
    next: { revalidate: 3600 },
  });
}

export async function incrementPostView(slug: string) {
  return apiFetch<ApiPostMetrics>(
    `/api/posts/${encodeURIComponent(slug)}/view`,
    {
      method: "POST",
    },
  );
}

export async function incrementPostLike(slug: string) {
  return apiFetch<ApiPostMetrics>(
    `/api/posts/${encodeURIComponent(slug)}/like`,
    {
      method: "POST",
    },
  );
}
