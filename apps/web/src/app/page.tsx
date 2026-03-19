import { getAllPosts } from "@/lib/mdx";
import { HomeClient } from "@/components/home-client";

export default function Home() {
  const posts = getAllPosts();

  return (
    <HomeClient posts={posts} />
  );
}
