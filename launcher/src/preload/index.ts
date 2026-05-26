import { contextBridge, ipcRenderer } from "electron";
import type {
  BridgeAPI,
  LauncherConfig,
  DownloadProgress,
} from "@shared/types";

const api: BridgeAPI = {
  window: {
    minimize: () => ipcRenderer.invoke("window:minimize"),
    maximize: () => ipcRenderer.invoke("window:maximize"),
    close: () => ipcRenderer.invoke("window:close"),
    isMaximized: () => ipcRenderer.invoke("window:isMaximized"),
  },
  game: {
    launch: (config) => ipcRenderer.invoke("game:launch", config),
    pickGamePath: () => ipcRenderer.invoke("game:pickGamePath"),
    verifyGamePath: (path) => ipcRenderer.invoke("game:verifyGamePath", path),
  },
  config: {
    get: () => ipcRenderer.invoke("config:get"),
    set: (patch: Partial<LauncherConfig>) => ipcRenderer.invoke("config:set", patch),
  },
  updater: {
    check: () => ipcRenderer.invoke("updater:check"),
    download: () => ipcRenderer.invoke("updater:download"),
    install: () => ipcRenderer.invoke("updater:install"),
    onProgress: (cb) => {
      const listener = (_: unknown, p: DownloadProgress) => cb(p);
      ipcRenderer.on("updater:progress", listener);
      return () => ipcRenderer.off("updater:progress", listener);
    },
  },
  app: {
    getVersion: () => ipcRenderer.invoke("app:getVersion"),
    openExternal: (url) => ipcRenderer.invoke("app:openExternal", url),
  },
};

contextBridge.exposeInMainWorld("api", api);
