import { NextResponse } from "next/server";
import { getChangelogEntries } from "@/lib/changelog";
import { brand } from "@/config/brand";

// 5min en CDN, 10min stale-while-revalidate.
export const revalidate = 300;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function extractExcerpt(markdown: string, maxLen = 220): string {
  const plain = markdown
    .replace(/^#\s+.+\n/m, "")
    .replace(/^##.+\n/gm, "")
    .replace(/^###.+\n/gm, "")
    .replace(/[`*_>~-]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
  return plain.length > maxLen ? plain.slice(0, maxLen).trimEnd() + "…" : plain;
}

function cleanTitle(raw: string): string {
  return raw
    .replace(/^\d{4}-\d{2}-\d{2}\s*·\s*/, "")
    .replace(/^—\s*0\.0\.\d+\s*·\s*/, "")
    .trim();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 10), 50);

  const entries = await getChangelogEntries();
  const items = entries.slice(0, limit).map((e) => ({
    id: e.slug,
    slug: e.slug,
    title: cleanTitle(e.title),
    date: e.date,
    excerpt: extractExcerpt(e.content),
    url: `${brand.url.replace(/\/$/, "")}/desarrollo/changelog`,
  }));

  return NextResponse.json(
    { items, total: entries.length },
    {
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
