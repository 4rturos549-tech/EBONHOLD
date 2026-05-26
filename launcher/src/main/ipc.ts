import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import { promises as fs } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { loadConfig, saveConfig } from "./config";

export function registerIpcHandlers() {
  /* === Window controls === */
  ipcMain.handle("window:minimize", (e) => {
    BrowserWindow.fromWebContents(e.sender)?.minimize();
  });
  ipcMain.handle("window:maximize", (e) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    if (!win) return;
    win.isMaximized() ? win.unmaximize() : win.maximize();
  });
  ipcMain.handle("window:close", (e) => {
    BrowserWindow.fromWebContents(e.sender)?.close();
  });
  ipcMain.handle("window:isMaximized", (e) => {
    return BrowserWindow.fromWebContents(e.sender)?.isMaximized() ?? false;
  });

  /* === Config persistente === */
  ipcMain.handle("config:get", async () => loadConfig());
  ipcMain.handle("config:set", async (_, patch) => saveConfig(patch));

  /* === Game === */
  ipcMain.handle("game:pickGamePath", async (e) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    if (!win) return null;
    const result = await dialog.showOpenDialog(win, {
      title: "Selecciona tu carpeta de World of Warcraft 3.3.5a",
      properties: ["openDirectory"],
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  });

  ipcMain.handle("game:verifyGamePath", async (_, path: string) => {
    try {
      const wowExe = join(path, "Wow.exe");
      await fs.access(wowExe);
      return true;
    } catch {
      return false;
    }
  });

  ipcMain.handle(
    "game:launch",
    async (_, { realmlist, gamePath }: { realmlist: string; gamePath?: string }) => {
      const cfg = await loadConfig();
      const path = gamePath ?? cfg.gamePath;
      if (!path) return { ok: false, error: "No hay carpeta del juego configurada" };

      try {
        // Escribir realmlist.wtf
        const langDir = cfg.language ?? "esES";
        const realmlistPath = join(path, "Data", langDir, "realmlist.wtf");
        await fs.writeFile(realmlistPath, `set realmlist ${realmlist}\n`, "utf-8");

        // Lanzar Wow.exe
        const wowExe = join(path, "Wow.exe");
        spawn(wowExe, [], { detached: true, stdio: "ignore", cwd: path }).unref();
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) };
      }
    },
  );

  /* === App info === */
  ipcMain.handle("app:getVersion", () => app.getVersion());
  ipcMain.handle("app:openExternal", (_, url: string) => shell.openExternal(url));
}
