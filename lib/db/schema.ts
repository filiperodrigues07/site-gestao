import { sqliteTable, integer, text, index } from "drizzle-orm/sqlite-core";
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

export const articles = sqliteTable(
  "articles",
  {
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
  },
  (table) => [
    index("articles_category_id_idx").on(table.categoryId),
    index("articles_author_id_idx").on(table.authorId),
    index("articles_status_idx").on(table.status),
  ]
);

export const faqs = sqliteTable(
  "faqs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => [index("faqs_category_id_idx").on(table.categoryId)]
);

export const videos = sqliteTable(
  "videos",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    sourceType: text("source_type", { enum: ["youtube", "upload"] }).notNull().default("youtube"),
    videoUrl: text("video_url"),
    storedFileName: text("stored_file_name"),
    originalFileName: text("original_file_name"),
    mimeType: text("mime_type"),
    sizeBytes: integer("size_bytes"),
    durationLabel: text("duration_label").notNull(),
    authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => [index("videos_author_id_idx").on(table.authorId)]
);

export const downloads = sqliteTable(
  "downloads",
  {
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
  },
  (table) => [index("downloads_author_id_idx").on(table.authorId)]
);

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

export const updates = sqliteTable(
  "updates",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
    storedFileName: text("stored_file_name"),
    originalFileName: text("original_file_name"),
    mimeType: text("mime_type"),
    sizeBytes: integer("size_bytes"),
    ...timestamps,
  },
  (table) => [index("updates_author_id_idx").on(table.authorId)]
);

export const instagramPosts = sqliteTable("instagram_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  caption: text("caption").notNull(),
  postUrl: text("post_url"),
  storedFileName: text("stored_file_name").notNull(),
  originalFileName: text("original_file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  ...timestamps,
});

export const portalClients = sqliteTable("portal_clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // Só dígitos (sem pontuação), normalizado no cadastro e no login.
  // .unique() já cria o índice necessário pra busca por CNPJ no login.
  cnpj: text("cnpj").notNull().unique(),
  razaoSocial: text("razao_social").notNull(),
  // CH.Cliente.CHAVE — resolvido uma vez ao cadastrar, usado pra filtrar
  // os títulos desse cliente (CHAVECLIFOR) nas consultas de contas a receber.
  chaveCliente: integer("chave_cliente").notNull(),
  passwordHash: text("password_hash").notNull(),
  // Verdadeiro sempre que a senha atual foi definida pelo admin (cadastro,
  // importação em massa ou redefinição) — força a troca no próximo login.
  mustChangePassword: integer("must_change_password", { mode: "boolean" }).notNull().default(true),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

// Configuração da integração com a API IntegradorBI do CH, editada pelo
// admin em vez de variável de ambiente — linha única (a mais recente por id).
export const chApiSettings = sqliteTable("ch_api_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  baseUrl: text("base_url").notNull(),
  token: text("token").notNull(),
  chaveEmpresa: text("chave_empresa").notNull(),
  cnpjEstrutura: text("cnpj_estrutura").notNull(),
  chaveContaBancaria: text("chave_conta_bancaria").notNull(),
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
  updates: many(updates),
}));

export const videosRelations = relations(videos, ({ one }) => ({
  author: one(users, { fields: [videos.authorId], references: [users.id] }),
}));

export const downloadsRelations = relations(downloads, ({ one }) => ({
  author: one(users, { fields: [downloads.authorId], references: [users.id] }),
}));

export const updatesRelations = relations(updates, ({ one }) => ({
  author: one(users, { fields: [updates.authorId], references: [users.id] }),
}));

export type Category = typeof categories.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type FAQ = typeof faqs.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type Download = typeof downloads.$inferSelect;
export type User = typeof users.$inferSelect;
export type Promotion = typeof promotions.$inferSelect;
export type Update = typeof updates.$inferSelect;
export type InstagramPost = typeof instagramPosts.$inferSelect;
export type PortalClient = typeof portalClients.$inferSelect;
export type ChApiSettings = typeof chApiSettings.$inferSelect;
