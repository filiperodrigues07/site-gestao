import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { PORTAL_SESSION_COOKIE } from "@/lib/auth/portal-session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Área do cliente tem sessão/cookie totalmente separados do admin.
  if (pathname.startsWith("/area-cliente") || pathname.startsWith("/api/area-cliente")) {
    if (pathname === "/area-cliente/login") return NextResponse.next();

    const portalToken = request.cookies.get(PORTAL_SESSION_COOKIE)?.value;
    const portalSession = portalToken ? await verifySessionToken(portalToken) : null;
    if (!portalSession) {
      return NextResponse.redirect(new URL("/area-cliente/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/admin/login" || pathname === "/admin/trocar-senha") return NextResponse.next();

  // Upload de imagem de artigo aceita X-API-Key (sistemas externos, ex.:
  // RT HELPDESK) como alternativa à sessão — mesma chave usada pelas rotas
  // /api/knowledge-base/*. Libera só esse endpoint específico, não o resto
  // de /api/admin/*, que continua exigindo sessão normalmente.
  if (pathname === "/api/admin/article-images") {
    const apiKey = request.headers.get("x-api-key");
    if (apiKey && process.env.KB_API_KEY && apiKey === process.env.KB_API_KEY) {
      return NextResponse.next();
    }
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/area-cliente/:path*", "/api/area-cliente/:path*"],
};
