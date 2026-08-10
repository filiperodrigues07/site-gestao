import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
  updatedAt: text("updated_at").notNull().default(sql`(current_timestamp)`),
};

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  iconKey: text("icon_key").notNull(),
  ...timestamps,
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
  permissions: text("permissions", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  ...timestamps,
});

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default(sql`'[]'`),
  status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
  ...timestamps,
});

export const faqs = sqliteTable("faqs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  ...timestamps,
});

export const videos = sqliteTable("videos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoUrl: text("video_url").notNull(),
  durationLabel: text("duration_label").notNull(),
  authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
  ...timestamps,
});

export const downloads = sqliteTable("downloads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fileType: text("file_type", {
    enum: ["PDF", "XLSX", "DOCX", "ZIP", "RAR", "EXE", "MSI"],
  }).notNull(),
  storedFileName: text("stored_file_name").notNull(),
  originalFileName: text("original_file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
  ...timestamps,
});

export const promotions = sqliteTable("promotions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  linkUrl: text("link_url"),
  storedFileName: text("stored_file_name").notNull(),
  originalFileName: text("original_file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  ...timestamps,
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  articles: many(articles),
  faqs: many(faqs),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  category: one(categories, { fields: [articles.categoryId], references: [categories.id] }),
  author: one(users, { fields: [articles.authorId], references: [users.id] }),
}));

export const faqsRelations = relations(faqs, ({ one }) => ({
  category: one(categories, { fields: [faqs.categoryId], references: [categories.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  articles: many(articles),
  videos: many(videos),
  downloads: many(downloads),
}));

export const videosRelations = relations(videos, ({ one }) => ({
  author: one(users, { fields: [videos.authorId], references: [users.id] }),
}));

export const downloadsRelations = relations(downloads, ({ one }) => ({
  author: one(users, { fields: [downloads.authorId], references: [users.id] }),
}));

export type Category = typeof categories.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type FAQ = typeof faqs.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type Download = typeof downloads.$inferSelect;
export type User = typeof users.$inferSelect;
export type Promotion = typeof promotions.$inferSelect;
