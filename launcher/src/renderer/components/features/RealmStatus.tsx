import { useEffect, useState } from "react";
import { fetchRealms, type ApiRealm } from "@/lib/api";

const FALLBACK: ApiRealm[] = [
  { id: "acherus",     name: "Acherus",     type: "PvE", status: "offline", players: 0, population: "baja", alliance: 0, horde: 0 },
  { id: "wyrmrest",    name: "Wyrmrest",    type: "PvP", status: "offline", players: 0, population: "baja", alliance: 0, horde: 0 },
  { id: "crystalsong", name: "Crystalsong", type: "RP",  status: "offline", players: 0, population: "baja", alliance: 0, horde: 0 },
];

export function RealmStatus() {
  const [realms, setRealms] = useState<ApiRealm[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      const data = await fetchRealms();
      if (!alive) return;
      if (data.length > 0) setRealms(data);
      setLoading(false);
    }
    load();
    const id = setInterval(load, 30_000); // refresca cada 30s
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="panel">
      <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
        <h3 className="font-display uppercase tracking-wide text-[var(--color-accent)] text-xs">
          Estado de Reinos
        </h3>
        {loading && (
          <span className="text-[10px] text-[var(--color-text-muted)]">cargando…</span>
        )}
      </div>
      <ul className="divide-y divide-[var(--color-border)]">
        {realms.map((realm) => (
          <li key={realm.id} className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span
                className={
                  realm.status === "online"
                    ? "h-2 w-2 rounded-full bg-[var(--color-secondary)] status-online"
                    : realm.status === "maintenance"
                    ? "h-2 w-2 rounded-full bg-yellow-500"
                    : "h-2 w-2 rounded-full bg-red-700/70"
                }
              />
              <span className="text-sm text-[var(--color-text)]">{realm.name}</span>
              <span className="text-[10px] text-[var(--color-text-dim)]">· {realm.type}</span>
            </div>
            <span className="text-[10px] uppercase tracking-wide text-[var(--color-text-dim)]">
              {realm.status === "online"
                ? `${realm.players} en línea`
                : realm.status === "maintenance"
                ? "Mantenimiento"
                : "Offline"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
