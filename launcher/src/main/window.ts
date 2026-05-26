import { BrowserWindow, shell } from "electron";
import { join } from "node:path";

const isDev = !!process.env["ELECTRON_RENDERER_URL"];

export function createMainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    show: false,
    frame: false,                  // titlebar custom (lo dibuja React)
    titleBarStyle: "hidden",
    backgroundColor: "#07101a",    // mismo bg que la web (no flicker blanco al abrir)
    icon: join(__dirname, "../../resources/icon.png"),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.once("ready-to-show", () => win.show());

  // Abrir links externos en el navegador del sistema, no en la ventana del launcher
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  if (isDev) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]!);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return win;
}
