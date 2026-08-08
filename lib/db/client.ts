import path from "node:path";
import fs from "node:fs";
import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const DB_PATH = process.env.DATABASE_URL ?? path.join(process.cwd(), "storage", "data", "gestao.db");

declare global {
  var __gestaoSqlite: Database.Database | undefined;
}

type DrizzleDb = BetterSQLite3Database<typeof schema>;

let drizzleInstance: DrizzleDb | undefined;

function getDb(): DrizzleDb {
  if (!drizzleInstance) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

    const sqlite = globalThis.__gestaoSqlite ?? new Database(DB_PATH);
    if (process.env.NODE_ENV !== "production") globalThis.__gestaoSqlite = sqlite;

    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");

    drizzleInstance = drizzle(sqlite, { schema });
  }
  return drizzleInstance;
}

// Proxy defers opening the SQLite connection until `db` is actually used,
// so simply importing this module (e.g. during Next's build-time page-data
// collection) never touches the filesystem.
export const db: DrizzleDb = new Proxy({} as DrizzleDb, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
