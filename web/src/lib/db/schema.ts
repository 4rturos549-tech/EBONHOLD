/**
 * Schema de la base de datos `ebonhold_web` (Drizzle ORM, MySQL).
 *
 * Esta base de datos vive en la MISMA instancia MySQL que las del server
 * (`acore_auth`, `acore_world`, `acore_characters`). Aqui guardamos solo
 * lo que necesita la web: noticias, sesiones, foro, donaciones, etc.
 *
 * Para datos del juego (cuentas, personajes, realms) consultamos directamente
 * las DBs `acore_*` desde aqui (ver `queries/realms.ts`).
 */
import {
  mysqlTable,
  varchar,
  int,
  bigint,
  text,
  timestamp,
  boolean,
  mysqlEnum,
  index,
} from "drizzle-orm/mysql-core";

/* ============================================================
   Noticias
   ============================================================ */
export const news = mysqlTable(
  "news",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 128 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    excerpt: varchar("excerpt", { length: 500 }),
    body: text("body").notNull(),
    coverImage: varchar("cover_image", { length: 500 }),
    authorAccountId: int("author_account_id"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
    isPublished: boolean("is_published").notNull().default(false),
  },
  (t) => [
    index("idx_news_published").on(t.isPublished, t.publishedAt),
    index("idx_news_slug").on(t.slug),
  ],
);

/* ============================================================
   Sesiones de usuario (login en la web)
   ============================================================ */
export const sessions = mysqlTable(
  "sessions",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    accountId: int("account_id").notNull(),
    accountName: varchar("account_name", { length: 32 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    userAgent: varchar("user_agent", { length: 500 }),
    ip: varchar("ip", { length: 45 }),
  },
  (t) => [
    index("idx_sessions_account").on(t.accountId),
    index("idx_sessions_expires").on(t.expiresAt),
  ],
);

/* ============================================================
   Foro
   ============================================================ */
export const forumCategories = mysqlTable("forum_categories", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  description: varchar("description", { length: 500 }),
  position: int("position").notNull().default(0),
  isLocked: boolean("is_locked").notNull().default(false),
});

export const forumThreads = mysqlTable(
  "forum_threads",
  {
    id: int("id").autoincrement().primaryKey(),
    categoryId: int("category_id").notNull(),
    authorAccountId: int("author_account_id").notNull(),
    authorName: varchar("author_name", { length: 32 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body").notNull(),
    isPinned: boolean("is_pinned").notNull().default(false),
    isLocked: boolean("is_locked").notNull().default(false),
    viewCount: int("view_count").notNull().default(0),
    replyCount: int("reply_count").notNull().default(0),
    lastReplyAt: timestamp("last_reply_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("idx_threads_category").on(t.categoryId, t.lastReplyAt),
    index("idx_threads_pinned").on(t.isPinned),
  ],
);

export const forumPosts = mysqlTable(
  "forum_posts",
  {
    id: int("id").autoincrement().primaryKey(),
    threadId: int("thread_id").notNull(),
    authorAccountId: int("author_account_id").notNull(),
    authorName: varchar("author_name", { length: 32 }).notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (t) => [index("idx_posts_thread").on(t.threadId, t.createdAt)],
);

/* ============================================================
   Donaciones (cosmeticas, sin pay-to-win)
   ============================================================ */
export const donations = mysqlTable(
  "donations",
  {
    id: int("id").autoincrement().primaryKey(),
    accountId: int("account_id"),
    amountCents: int("amount_cents").notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("EUR"),
    provider: mysqlEnum("provider", ["stripe", "paypal", "kofi"]).notNull(),
    providerTxId: varchar("provider_tx_id", { length: 128 }).notNull().unique(),
    status: mysqlEnum("status", ["pending", "completed", "refunded", "failed"])
      .notNull()
      .default("pending"),
    rewardCode: varchar("reward_code", { length: 64 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at"),
  },
  (t) => [
    index("idx_donations_account").on(t.accountId),
    index("idx_donations_status").on(t.status),
  ],
);

/* ============================================================
   Tickets de soporte
   ============================================================ */
export const tickets = mysqlTable(
  "tickets",
  {
    id: int("id").autoincrement().primaryKey(),
    accountId: int("account_id").notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    body: text("body").notNull(),
    status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"])
      .notNull()
      .default("open"),
    assignedTo: int("assigned_to"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  },
  (t) => [
    index("idx_tickets_account").on(t.accountId),
    index("idx_tickets_status").on(t.status),
  ],
);

/* ============================================================
   Snapshot de stats del server (poblamos cada N minutos via cron)
   ============================================================ */
export const realmStats = mysqlTable(
  "realm_stats",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    realmId: int("realm_id").notNull(),
    playersOnline: int("players_online").notNull(),
    allianceCount: int("alliance_count").notNull().default(0),
    hordeCount: int("horde_count").notNull().default(0),
    capturedAt: timestamp("captured_at").notNull().defaultNow(),
  },
  (t) => [index("idx_realm_stats").on(t.realmId, t.capturedAt)],
);

/* Tipos exportados para uso en queries */
export type News = typeof news.$inferSelect;
export type NewNews = typeof news.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type ForumThread = typeof forumThreads.$inferSelect;
export type Donation = typeof donations.$inferSelect;
