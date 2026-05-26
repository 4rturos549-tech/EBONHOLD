/**
 * Identidad de marca del servidor. Cambiar aqui propaga a toda la web.
 */
export const brand = {
  name: "Ebonhold",
  fullName: "EBONHOLD",
  tagline: "La Ciudadela del Norte Helado",
  description:
    "Servidor privado de World of Warcraft: Wrath of the Lich King 3.3.5a. Donde se forjan las leyendas del Norte, comunidad hispana, contenido custom y sin pay-to-win.",
  expansion: "Wrath of the Lich King 3.3.5a",
  language: "es" as const,
  locale: "es-ES",
  url: "https://ebonhold.example.com",
  realmlist: "play.ebonhold.example.com",
  social: {
    discord: "https://discord.gg/",
    twitter: "",
    youtube: "",
    twitch: "",
  },
  contact: {
    email: "contacto@ebonhold.example.com",
    abuse: "abuse@ebonhold.example.com",
  },
  founder: "Carlos (Chefsito / Masamuness)",
  year: 2026,
} as const;

export type Brand = typeof brand;
