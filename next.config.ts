import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  images: {
    dangerouslyAllowSVG: true,
  },
  experimental: {
    // O proxy (middleware) protege /api/admin/**, incluindo os uploads de
    // downloads/imagens — sem isso, o Next trunca o corpo da requisição em
    // 10MB antes mesmo de chegar na validação da rota.
    proxyClientMaxBodySize: "500mb",
  },
};

export default nextConfig;
