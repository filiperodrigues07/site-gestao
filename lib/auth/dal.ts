import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { verifySessionToken, SESSION_COOKIE } from "./session";
import { hasPermission, type AdminSection } from "./permissions";

export const verifySession = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/admin/login");
  return session;
});

export const getCurrentUser = cache(async () => {
  const session = await verifySession();
  const userId = Number(session.sub);
  const user = Number.isFinite(userId)
    ? await db.query.users.findFirst({ where: eq(users.id, userId) })
    : undefined;
  if (!user) redirect("/admin/login");
  return user;
});

export async function requirePermission(section: AdminSection) {
  const user = await getCurrentUser();
  if (!hasPermission(user, section)) redirect("/admin");
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user.isAdmin) redirect("/admin");
  return user;
}

/**
 * Same lookup as getCurrentUser, but for Route Handlers that need to return a
 * JSON error response instead of redirecting (e.g. file upload endpoints).
 */
export async function getUserForApi() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const userId = session ? Number(session.sub) : NaN;
  if (!Number.isFinite(userId)) return null;
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  return user ?? null;
}
