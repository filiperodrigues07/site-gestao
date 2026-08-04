import path from "node:path";
import fs from "node:fs";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const DB_PATH = process.env.DATABASE_URL ?? path.join(process.cwd(), "storage", "data", "gestao.db");
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

declare global {
  var __gestaoSqlite: Database.Database | undefined;
}

const sqlite = globalThis.__gestaoSqlite ?? new Database(DB_PATH);
if (process.env.NODE_ENV !== "production") globalThis.__gestaoSqlite = sqlite;

sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
