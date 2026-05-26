import { useState } from "react";
import { TitleBar } from "@/components/layout/TitleBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { HomePage } from "@/pages/Home";
import { NewsPage } from "@/pages/News";
import { PatchesPage } from "@/pages/Patches";
import { SettingsPage } from "@/pages/Settings";
import { AboutPage } from "@/pages/About";
import { RegisterPage } from "@/pages/Register";

export type Route = "home" | "news" | "register" | "patches" | "settings" | "about";

export function App() {
  const [route, setRoute] = useState<Route>("home");

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg)]">
      <TitleBar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar active={route} onChange={setRoute} />
        <main className="flex-1 overflow-hidden">
          {route === "home" && <HomePage />}
          {route === "news" && <NewsPage />}
          {route === "register" && <RegisterPage />}
          {route === "patches" && <PatchesPage />}
          {route === "settings" && <SettingsPage />}
          {route === "about" && <AboutPage />}
        </main>
      </div>
    </div>
  );
}
