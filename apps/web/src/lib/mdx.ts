import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "contents/posts");

export type PostMetadata = {
  title: string;
  date: string;
  description: string;
  tags: string[];
  slug: string;
};

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    meta: data as Omit<PostMetadata, "slug">,
    content,
  };
}

export function getAllPosts(): PostMetadata[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => {
      const { meta, slug: realSlug } = getPostBySlug(slug);
      return { ...meta, slug: realSlug } as PostMetadata;
    })
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
