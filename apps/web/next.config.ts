import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // [bundle-barrel-imports] Transforms barrel imports into direct imports at build time.
    // lucide-react has 1,583+ re-exports — naive imports add ~200-800ms cold-start cost.
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uzsgwbfhiofnnodlhafc.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
