import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Otimização de imports para evitar barrel files (Vercel Best Practice)
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
