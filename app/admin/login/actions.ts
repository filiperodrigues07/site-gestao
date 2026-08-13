"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/auth/session";
import { rateLimit } from "@/lib/rate-limit";

export type LoginState = { error: string } | undefined;

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const { success, retryAfterSeconds } = await rateLimit("login", {
    limit: 5,
    windowMs: 5 * 60 * 1000,
  });
  if (!success) {
    return { error: `Muitas tentativas. Tente novamente em ${retryAfterSeconds}s.` };
  }

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const user = await db.query.users.findFirst({ where: eq(users.username, username) });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Usuário ou senha inválidos" };
  }

  const token = await createSessionToken(user.id);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  redirect("/admin");
}
