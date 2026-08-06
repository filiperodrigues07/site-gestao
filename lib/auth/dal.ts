import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { verifySessionToken, SESSION_COOKIE } from "./session";

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
