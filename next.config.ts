import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// CSP sem nonce, de propósito: nonce exige renderização dinâmica em todas as
// páginas (desativa a geração estática usada em /solucoes/[slug] e outras),
// o que pioraria bastante o desempenho. 'unsafe-inline' em script/style é o
// trade-off documentado pela própria Next.js para quem não usa nonce —
// ainda assim bloqueia scripts externos injetados, framing e form-hijacking.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self' data:;
  connect-src 'self';
  frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    // O proxy (middleware) protege /api/admin/**, incluindo os uploads de
    // downloads/imagens — sem isso, o Next trunca o corpo da requisição em
    // 10MB antes mesmo de chegar na validação da rota.
    proxyClientMaxBodySize: "500mb",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
        ],
      },
    ];
  },
};

export default nextConfig;
