/**
 * Reinos del servidor. En el futuro este modulo expondra un fetcher
 * que consultara la BD del worldserver via /api/realms.
 *
 * Nombres tomados de locations icónicas de Rasganorte (WoTLK).
 */
export type RealmType = "PvE" | "PvP" | "RP" | "RP-PvP";
export type RealmStatus = "online" | "offline" | "maintenance";

export type Realm = {
  id: string;
  name: string;
  type: RealmType;
  status: RealmStatus;
  players: number;
  population: "baja" | "media" | "alta" | "llena";
  description: string;
};

export const realms: Realm[] = [
  {
    id: "acherus",
    name: "Acherus",
    type: "PvE",
    status: "offline",
    players: 0,
    population: "baja",
    description:
      "Reino principal. Contenido de mundo, mazmorras y bandas sin la presion del PvP abierto. Nombre de la necropolis flotante de los Caballeros de la Muerte.",
  },
  {
    id: "wyrmrest",
    name: "Wyrmrest",
    type: "PvP",
    status: "offline",
    players: 0,
    population: "baja",
    description:
      "Reino PvP de mundo activo. Los conflictos entre facciones definen la experiencia. Nombre del Templo de Wyrmrest en el Bosque del Dragon.",
  },
  {
    id: "crystalsong",
    name: "Crystalsong",
    type: "RP",
    status: "offline",
    players: 0,
    population: "baja",
    description:
      "Reino de rol. Eventos narrativos, historia viva y comunidad enfocada en la inmersion. Nombre del Bosque Cantocristal de Rasganorte.",
  },
];
