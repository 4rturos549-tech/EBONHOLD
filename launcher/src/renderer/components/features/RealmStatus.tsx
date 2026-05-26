import type { Realm } from "@shared/types";

// Placeholder: en el futuro fetch a https://ebonhold.vercel.app/api/realms
const placeholder: Realm[] = [
  { id: "acherus", name: "Acherus", type: "PvE", status: "offline", players: 0 },
  { id: "wyrmrest", name: "Wyrmrest", type: "PvP", status: "offline", players: 0 },
  { id: "crystalsong", name: "Crystalsong", type: "RP", status: "offline", players: 0 },
];

export function RealmStatus() {
  return (
    <div className="panel">
      <div className="px-4 py-3 border-b border-[var(--color-border)]">
        <h3 className="font-display uppercase tracking-wide text-[var(--color-accent)] text-xs">
          Estado de Reinos
        </h3>
      </div>
      <ul className="divide-y divide-[var(--color-border)]">
        {placeholder.map((realm) => (
          <li key={realm.id} className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span
                className={
                  realm.status === "online"
                    ? "h-2 w-2 rounded-full bg-[var(--color-secondary)] status-online"
                    : "h-2 w-2 rounded-full bg-red-700/70"
                }
              />
              <span className="text-sm text-[var(--color-text)]">{realm.name}</span>
              <span className="text-[10px] text-[var(--color-text-dim)]">· {realm.type}</span>
            </div>
            <span className="text-[10px] uppercase tracking-wide text-[var(--color-text-dim)]">
              {realm.status === "online" ? `${realm.players}` : "Offline"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
