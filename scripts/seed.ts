import { eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { categories, articles, faqs, videos, downloads, users } from "@/lib/db/schema";
import { kbCategories } from "@/data/knowledge-base/categories";
import { kbArticles } from "@/data/knowledge-base/articles";
import { faqs as kbFaqs } from "@/data/knowledge-base/faqs";
import { kbVideos } from "@/data/knowledge-base/videos";

async function seed() {
  const bootstrapUsername = process.env.ADMIN_USERNAME;
  const bootstrapPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (bootstrapUsername && bootstrapPasswordHash) {
    await db
      .insert(users)
      .values({
        name: "Administrador",
        username: bootstrapUsername,
        passwordHash: bootstrapPasswordHash,
        isAdmin: true,
      })
      .onConflictDoNothing({ target: users.username });
  } else {
    console.warn(
      "[seed] ADMIN_USERNAME/ADMIN_PASSWORD_HASH não definidos — pulando bootstrap de usuário."
    );
  }

  for (const category of kbCategories) {
    await db
      .insert(categories)
      .values({
        slug: category.slug,
        name: category.name,
        description: category.description,
        iconKey: category.iconKey,
      })
      .onConflictDoNothing({ target: categories.slug });
  }

  const categoryRows = await db.query.categories.findMany();
  const categoryIdBySlug = new Map(categoryRows.map((c) => [c.slug, c.id]));

  for (const article of kbArticles) {
    const categoryId = categoryIdBySlug.get(article.categorySlug);
    if (!categoryId) {
      console.warn(`[seed] Categoria "${article.categorySlug}" não encontrada para o artigo "${article.slug}" — pulando.`);
      continue;
    }
    await db
      .insert(articles)
      .values({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        categoryId,
        tags: article.tags,
        status: "published",
        updatedAt: article.updatedAt,
      })
      .onConflictDoNothing({ target: articles.slug });
  }

  const bootstrapUser = bootstrapUsername
    ? await db.query.users.findFirst({ where: eq(users.username, bootstrapUsername) })
    : undefined;

  if (bootstrapUser) {
    await db
      .update(articles)
      .set({ authorId: bootstrapUser.id })
      .where(isNull(articles.authorId));
    if (!bootstrapUser.isAdmin) {
      await db.update(users).set({ isAdmin: true }).where(eq(users.id, bootstrapUser.id));
    }
  }

  for (const faq of kbFaqs) {
    const existingFaq = await db.query.faqs.findFirst({ where: eq(faqs.question, faq.question) });
    if (existingFaq) continue;
    const categoryId = faq.categorySlug ? categoryIdBySlug.get(faq.categorySlug) : undefined;
    await db.insert(faqs).values({
      question: faq.question,
      answer: faq.answer,
      categoryId: categoryId ?? null,
    });
  }

  for (const video of kbVideos) {
    const existingVideo = await db.query.videos.findFirst({ where: eq(videos.title, video.title) });
    if (existingVideo) continue;
    await db.insert(videos).values({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      durationLabel: video.durationLabel,
      authorId: bootstrapUser?.id,
    });
  }

  if (bootstrapUser) {
    await db
      .update(videos)
      .set({ authorId: bootstrapUser.id })
      .where(isNull(videos.authorId));
    await db
      .update(downloads)
      .set({ authorId: bootstrapUser.id })
      .where(isNull(downloads.authorId));
  }

  console.info("[seed] Concluído.");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[seed] Falhou:", error);
    process.exit(1);
  });
