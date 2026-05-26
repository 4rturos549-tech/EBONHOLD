/**
 * Tipos compartidos entre el proceso main (Electron Node) y el renderer (React).
 *
 * Si cambias algo aqui, el contrato del bridge se actualiza automaticamente
 * en ambos lados gracias a TypeScript.
 */

export type RealmStatus = "online" | "offline" | "maintenance";
export type RealmType = "PvE" | "PvP" | "RP" | "RP-PvP";

export interface Realm {
  id: string;
  name: string;
  type: RealmType;
  status: RealmStatus;
  players: number;
  ping?: number;
}

export interface NewsItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  coverImage?: string;
  url: string;
}

export interface LauncherConfig {
  gamePath: string | null;
  username: string;
  rememberMe: boolean;
  windowMode: "windowed" | "fullscreen" | "borderless";
  language: "esES" | "enUS";
}

export interface UpdateInfo {
  available: boolean;
  version?: string;
  releaseNotes?: string;
  releaseDate?: string;
}

export interface DownloadProgress {
  percent: number;
  bytesPerSecond: number;
  transferred: number;
  total: number;
}

/**
 * API expuesta al renderer via contextBridge.
 * Disponible como `window.api.<method>()`.
 */
export interface BridgeAPI {
  // Window controls (titlebar custom)
  window: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
    isMaximized: () => Promise<boolean>;
  };
  // Lanzar el juego
  game: {
    launch: (config: { realmlist: string; gamePath?: string }) => Promise<{
      ok: boolean;
      error?: string;
    }>;
    pickGamePath: () => Promise<string | null>;
    verifyGamePath: (path: string) => Promise<boolean>;
  };
  // Config local persistente
  config: {
    get: () => Promise<LauncherConfig>;
    set: (config: Partial<LauncherConfig>) => Promise<LauncherConfig>;
  };
  // Updater
  updater: {
    check: () => Promise<UpdateInfo>;
    download: () => Promise<void>;
    install: () => Promise<void>;
    onProgress: (cb: (progress: DownloadProgress) => void) => () => void;
  };
  // Info de la app
  app: {
    getVersion: () => Promise<string>;
    openExternal: (url: string) => Promise<void>;
  };
}

declare global {
  interface Window {
    api: BridgeAPI;
  }
}
