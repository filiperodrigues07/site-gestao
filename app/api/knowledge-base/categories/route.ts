import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";
import { requireApiKey } from "@/lib/knowledge-base/api";

export async function GET(request: NextRequest) {
  const unauthorized = requireApiKey(request);
  if (unauthorized) return unauthorized;

  const rows = await db.query.categories.findMany({ orderBy: asc(categories.name) });
  const data = rows.map((category) => ({ id: category.id, slug: category.slug, name: category.name }));

  return NextResponse.json({ success: true, data });
}
