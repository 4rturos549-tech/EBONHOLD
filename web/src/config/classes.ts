/**
 * Catalogo de clases jugables en WoTLK 3.3.5a.
 *
 * Iconos: usamos los iconos oficiales de Blizzard servidos desde wow.zamimg.com
 * (CDN de Wowhead). Es la convencion estandar en sites de fans desde 2006.
 * Colores: codigos oficiales de Blizzard por clase.
 */
export type ClassRole = "Tank" | "DPS" | "Healer";

export type ClassSpec = {
  slug: string;
  name: string;
  role: ClassRole[];
  resource: string;
  armor: string;
  description: string;
  specs: string[];
  color: string;
  iconUrl: string;
};

const ICON_BASE = "https://wow.zamimg.com/images/wow/icons/large";

export const classes: ClassSpec[] = [
  {
    slug: "druida",
    name: "Druida",
    role: ["Tank", "DPS", "Healer"],
    resource: "Mana / Furia / Energía",
    armor: "Cuero",
    description:
      "Cambiaformas híbrido. Puede tanquear como oso, hacer daño cuerpo a cuerpo como gato, daño a distancia con magia de equilibrio o curar al grupo.",
    specs: ["Equilibrio", "Combate Felino/Plantígrado", "Restauración"],
    color: "#FF7D0A",
    iconUrl: `${ICON_BASE}/classicon_druid.jpg`,
  },
  {
    slug: "cazador",
    name: "Cazador",
    role: ["DPS"],
    resource: "Mana",
    armor: "Malla",
    description:
      "Maestro del arco y los animales. Doma mascotas que pelean a su lado y ataca desde la distancia con flechas y trampas.",
    specs: ["Bestias", "Puntería", "Supervivencia"],
    color: "#ABD473",
    iconUrl: `${ICON_BASE}/classicon_hunter.jpg`,
  },
  {
    slug: "mago",
    name: "Mago",
    role: ["DPS"],
    resource: "Mana",
    armor: "Tela",
    description:
      "Caster puro. Domina el fuego, el hielo y la magia arcana para infligir daño masivo a una o varias víctimas.",
    specs: ["Arcano", "Fuego", "Escarcha"],
    color: "#69CCF0",
    iconUrl: `${ICON_BASE}/classicon_mage.jpg`,
  },
  {
    slug: "paladin",
    name: "Paladín",
    role: ["Tank", "DPS", "Healer"],
    resource: "Mana",
    armor: "Placas",
    description:
      "Guerrero sagrado. Puede sanar al grupo, tanquear o hacer daño cuerpo a cuerpo con bendiciones y auras divinas.",
    specs: ["Sagrado", "Protección", "Reprensión"],
    color: "#F58CBA",
    iconUrl: `${ICON_BASE}/classicon_paladin.jpg`,
  },
  {
    slug: "sacerdote",
    name: "Sacerdote",
    role: ["DPS", "Healer"],
    resource: "Mana",
    armor: "Tela",
    description:
      "El sanador clásico. También puede inclinarse al lado oscuro con la especialización de Sombra para hacer daño de magia oscura.",
    specs: ["Disciplina", "Sagrado", "Sombras"],
    color: "#FFFFFF",
    iconUrl: `${ICON_BASE}/classicon_priest.jpg`,
  },
  {
    slug: "picaro",
    name: "Pícaro",
    role: ["DPS"],
    resource: "Energía / Puntos de Combo",
    armor: "Cuero",
    description:
      "Maestro del sigilo y los venenos. Aparece de la nada para asestar golpes letales con dagas y desaparecer antes de recibir respuesta.",
    specs: ["Asesinato", "Combate", "Sutileza"],
    color: "#FFF569",
    iconUrl: `${ICON_BASE}/classicon_rogue.jpg`,
  },
  {
    slug: "chaman",
    name: "Chamán",
    role: ["DPS", "Healer"],
    resource: "Mana",
    armor: "Malla",
    description:
      "Invocador de los elementos. Equilibra al grupo con tótems y puede curar, hacer daño elemental o pelear en cuerpo a cuerpo con armas dobles.",
    specs: ["Elemental", "Mejora", "Restauración"],
    color: "#0070DE",
    iconUrl: `${ICON_BASE}/classicon_shaman.jpg`,
  },
  {
    slug: "brujo",
    name: "Brujo",
    role: ["DPS"],
    resource: "Mana",
    armor: "Tela",
    description:
      "Domina los demonios y los hechizos de aflicción. Convoca esbirros que pelean a su lado mientras drena la vida del enemigo.",
    specs: ["Aflicción", "Demonología", "Destrucción"],
    color: "#9482C9",
    iconUrl: `${ICON_BASE}/classicon_warlock.jpg`,
  },
  {
    slug: "guerrero",
    name: "Guerrero",
    role: ["Tank", "DPS"],
    resource: "Furia",
    armor: "Placas",
    description:
      "El luchador definitivo. Puede ser un tanque imparable con escudo o un berserker imparable con armas a dos manos.",
    specs: ["Armas", "Furia", "Protección"],
    color: "#C79C6E",
    iconUrl: `${ICON_BASE}/classicon_warrior.jpg`,
  },
];

export function getClassBySlug(slug: string): ClassSpec | undefined {
  return classes.find((c) => c.slug === slug);
}
