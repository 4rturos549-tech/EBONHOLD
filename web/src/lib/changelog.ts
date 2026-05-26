import fs from "node:fs/promises";
import path from "node:path";

export type ChangelogEntry = {
  slug: string;
  date: string;
  title: string;
  content: string;
};

/**
 * Carpeta donde el script `sync-content` deposita los devlogs.
 * Vive dentro de /web/content/desarrollo y se regenera en cada `npm run dev` y `npm run build`.
 */
const CONTENT_DIR = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  "content",
  "desarrollo",
);

export async function getChangelogEntries(): Promise<ChangelogEntry[]> {
  let files: string[];
  try {
    files = await fs.readdir(CONTENT_DIR);
  } catch {
    return [];
  }

  const devlogs = files.filter((f) => /^\d{4}-\d{2}-\d{2}-.*\.md$/.test(f));

  const entries = await Promise.all(
    devlogs.map(async (file) => {
      const content = await fs.readFile(path.join(CONTENT_DIR, file), "utf-8");
      const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
      const date = dateMatch?.[1] ?? "";
      const slug = dateMatch?.[2] ?? file.replace(/\.md$/, "");
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch?.[1] ?? slug;
      return { slug, date, title, content };
    }),
  );

  return entries.sort((a, b) => b.date.localeCompare(a.date));
}
