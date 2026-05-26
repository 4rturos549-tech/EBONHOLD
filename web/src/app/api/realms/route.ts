import { NextResponse } from "next/server";
import { realms as configRealms } from "@/config/realms";
import { fetchOnlinePlayers } from "@/lib/db/acore";

// 30s en CDN, 60s stale-while-revalidate.
export const revalidate = 30;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  let online: Record<number, { total: number; alliance: number; horde: number }> = {};
  try {
    online = await fetchOnlinePlayers();
  } catch {
    /* sin BD del core → todos offline */
  }

  // Por ahora solo Acherus tiene worldserver. Wyrmrest y Crystalsong
  // estan en la realmlist pero sin proceso → siempre offline.
  // Cuando levantemos esos reinos, este map deberia llamar /stats/online?realmId=X.
  const ACTIVE_REALM = "acherus";

  const result = configRealms.map((r) => {
    if (r.id !== ACTIVE_REALM) {
      return {
        id: r.id,
        name: r.name,
        type: r.type,
        status: "offline" as const,
        players: 0,
        population: r.population,
        alliance: 0,
        horde: 0,
      };
    }
    const players = online[1]?.total ?? 0;
    return {
      id: r.id,
      name: r.name,
      type: r.type,
      status: (players > 0 ? "online" : "offline") as "online" | "offline",
      players,
      population: r.population,
      alliance: online[1]?.alliance ?? 0,
      horde: online[1]?.horde ?? 0,
    };
  });

  return NextResponse.json(
    {
      realms: result,
      lastUpdate: new Date().toISOString(),
    },
    {
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": "s-maxage=30, stale-while-revalidate=60",
      },
    },
  );
}
