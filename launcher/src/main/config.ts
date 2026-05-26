import { app } from "electron";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import type { LauncherConfig } from "@shared/types";

const DEFAULTS: LauncherConfig = {
  gamePath: null,
  username: "",
  rememberMe: false,
  windowMode: "fullscreen",
  language: "esES",
};

function configPath(): string {
  return join(app.getPath("userData"), "launcher-config.json");
}

export async function loadConfig(): Promise<LauncherConfig> {
  try {
    const raw = await fs.readFile(configPath(), "utf-8");
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export async function saveConfig(
  patch: Partial<LauncherConfig>,
): Promise<LauncherConfig> {
  const current = await loadConfig();
  const next = { ...current, ...patch };
  await fs.writeFile(configPath(), JSON.stringify(next, null, 2), "utf-8");
  return next;
}
