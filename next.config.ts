import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  images: {
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
