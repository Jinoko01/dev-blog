"use cache";

import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import * as api from "./api";

export async function getPosts() {
  cacheLife({ revalidate: 60 });
  cacheTag("posts");
  return api.getPosts();
}

export async function getPost(slug: string) {
  cacheLife({ revalidate: 60 });
  cacheTag("posts", `post-${slug}`);
  try {
    return await api.getPost(slug);
  } catch (error) {
    if (error instanceof api.ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getTags() {
  cacheLife({ revalidate: 60 });
  cacheTag("tags");
  return api.getTags();
}

export async function getArticles(query: api.ArticleQuery) {
  cacheLife({ revalidate: 60 });
  cacheTag("articles");
  return api.getArticles(query);
}

export async function getAlgorithms() {
  cacheLife({ revalidate: 60 });
  cacheTag("algorithms");
  return api.getAlgorithms();
}

export async function getAlgorithm(id: string) {
  cacheLife({ revalidate: 3600 });
  cacheTag("algorithms", `algorithm-${id}`);
  try {
    return await api.getAlgorithm(id);
  } catch (error) {
    if (error instanceof api.ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getStats() {
  cacheLife({ revalidate: 60 });
  cacheTag("stats");
  return api.getStats();
}
