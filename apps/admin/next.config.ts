import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@dev-blog/mdx-renderer"],
};

export default nextConfig;
