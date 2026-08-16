import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { portalClients } from "@/lib/db/schema";
import { verifySessionToken } from "./session";
import { PORTAL_SESSION_COOKIE } from "./portal-session";

export const verifyPortalSession = cache(async () => {
  const token = (await cookies()).get(PORTAL_SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) redirect("/area-cliente/login");
  return session;
});

export const getCurrentPortalClient = cache(async () => {
  const session = await verifyPortalSession();
  const clientId = Number(session.sub);
  const client = Number.isFinite(clientId)
    ? await db.query.portalClients.findFirst({ where: eq(portalClients.id, clientId) })
    : undefined;
  if (!client || !client.isActive) redirect("/area-cliente/login");
  return client;
});
