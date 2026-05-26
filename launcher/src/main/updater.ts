import { BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import type { UpdateInfo, DownloadProgress } from "@shared/types";

/**
 * Auto-update via GitHub Releases.
 * Cuando publiques un nuevo tag con `electron-builder --publish always`,
 * los launchers instalados detectaran y descargaran la nueva version.
 */
export function setupAutoUpdater(win: BrowserWindow) {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("download-progress", (progress) => {
    const payload: DownloadProgress = {
      percent: progress.percent,
      bytesPerSecond: progress.bytesPerSecond,
      transferred: progress.transferred,
      total: progress.total,
    };
    win.webContents.send("updater:progress", payload);
  });

  autoUpdater.on("update-downloaded", () => {
    win.webContents.send("updater:downloaded");
  });

  ipcMain.handle("updater:check", async (): Promise<UpdateInfo> => {
    try {
      const result = await autoUpdater.checkForUpdates();
      if (!result || !result.updateInfo) return { available: false };
      const info = result.updateInfo;
      // electron-updater devuelve info incluso si no hay update; comparamos versiones
      return {
        available: info.version !== autoUpdater.currentVersion.version,
        version: info.version,
        releaseNotes: typeof info.releaseNotes === "string" ? info.releaseNotes : "",
        releaseDate: info.releaseDate,
      };
    } catch {
      return { available: false };
    }
  });

  ipcMain.handle("updater:download", async () => {
    await autoUpdater.downloadUpdate();
  });

  ipcMain.handle("updater:install", () => {
    autoUpdater.quitAndInstall(false, true);
  });

  // Comprobar al arrancar (silencioso)
  if (process.env["NODE_ENV"] !== "development") {
    autoUpdater.checkForUpdates().catch(() => {
      /* sin red, sin release, etc — ignorar */
    });
  }
}
