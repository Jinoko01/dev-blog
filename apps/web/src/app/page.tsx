import { getAllPosts } from "@/lib/mdx";
import * as React from "react";
import { HomeClient } from "@/components/home-client";

export default function Home() {
  const posts = getAllPosts();

  return (
    <HomeClient posts={posts} />
  );
}
