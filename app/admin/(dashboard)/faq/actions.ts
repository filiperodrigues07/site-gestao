"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { db } from "@/lib/db/client";
import { faqs } from "@/lib/db/schema";
import { faqSchema, type FAQFormValues } from "@/lib/validations/admin/faq-schema";

export async function createFAQ(values: FAQFormValues) {
  await verifySession();
  const parsed = faqSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  await db.insert(faqs).values(parsed.data);

  revalidatePath("/base-de-conhecimento");
  revalidatePath("/admin/faq");
  redirect("/admin/faq");
}

export async function updateFAQ(id: number, values: FAQFormValues) {
  await verifySession();
  const parsed = faqSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos" };

  await db.update(faqs).set(parsed.data).where(eq(faqs.id, id));

  revalidatePath("/base-de-conhecimento");
  revalidatePath("/admin/faq");
  redirect("/admin/faq");
}

export async function deleteFAQ(id: number) {
  await verifySession();
  await db.delete(faqs).where(eq(faqs.id, id));

  revalidatePath("/base-de-conhecimento");
  revalidatePath("/admin/faq");
  return {};
}
