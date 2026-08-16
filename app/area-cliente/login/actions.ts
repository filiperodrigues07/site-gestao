"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { portalClients } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, SESSION_TTL_SECONDS } from "@/lib/auth/session";
import { PORTAL_SESSION_COOKIE } from "@/lib/auth/portal-session";
import { rateLimit } from "@/lib/rate-limit";
import { normalizeCnpj } from "@/lib/portal/cnpj";

export type PortalLoginState = { error: string } | undefined;

export async function portalLoginAction(
  _prevState: PortalLoginState,
  formData: FormData
): Promise<PortalLoginState> {
  const { success, retryAfterSeconds } = await rateLimit("portal-login", {
    limit: 5,
    windowMs: 5 * 60 * 1000,
  });
  if (!success) {
    return { error: `Muitas tentativas. Tente novamente em ${retryAfterSeconds}s.` };
  }

  const cnpj = normalizeCnpj(String(formData.get("cnpj") ?? ""));
  const password = String(formData.get("password") ?? "");

  const client = await db.query.portalClients.findFirst({ where: eq(portalClients.cnpj, cnpj) });
  if (!client || !client.isActive || !verifyPassword(password, client.passwordHash)) {
    return { error: "CNPJ ou senha inválidos" };
  }

  const token = await createSessionToken(client.id);
  (await cookies()).set(PORTAL_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  redirect("/area-cliente");
}
