import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  transpilePackages: ["@dev-blog/mdx-renderer"],
};

export default nextConfig;
