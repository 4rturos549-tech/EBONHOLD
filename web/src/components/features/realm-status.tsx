import { Panel, PanelHeader } from "@/components/ui/panel";
import { realms } from "@/config/realms";

export function RealmStatus() {
  return (
    <Panel>
      <PanelHeader>
        <h3 className="font-display uppercase tracking-wide text-[var(--color-accent)] text-sm">
          Estado de Reinos
        </h3>
      </PanelHeader>
      <ul className="divide-y divide-[var(--color-border)]">
        {realms.map((realm) => (
          <li
            key={realm.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span
                className={
                  realm.status === "online"
                    ? "h-2.5 w-2.5 rounded-full bg-[var(--color-secondary)] status-online"
                    : realm.status === "maintenance"
                    ? "h-2.5 w-2.5 rounded-full bg-yellow-500"
                    : "h-2.5 w-2.5 rounded-full bg-red-700/70"
                }
              />
              <span className="text-[var(--color-text)]">{realm.name}</span>
              <span className="text-xs text-[var(--color-text-dim)]">
                · {realm.type}
              </span>
            </div>
            <span className="text-xs uppercase tracking-wide text-[var(--color-text-dim)]">
              {realm.status === "online"
                ? `${realm.players} en línea`
                : realm.status === "maintenance"
                ? "Mantenimiento"
                : "Offline"}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
