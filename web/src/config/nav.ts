import type { LucideIcon } from "lucide-react";
import {
  Swords,
  Users,
  Hammer,
  Map,
  Skull,
  Target,
  Ship,
  Monitor,
  Calendar,
  Trees,
  Crosshair,
  Sparkles,
  Shield,
  Cross,
  EyeOff,
  Flame,
  Axe,
  Calculator,
  MessageSquare,
  ScrollText,
  Map as MapIcon,
  Bug,
  Database,
  Image as ImageIcon,
  Video,
  Palette,
} from "lucide-react";

/**
 * Estructura de navegacion. Punto unico de verdad para header y mapa del sitio.
 */
export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  icon?: LucideIcon;
};

export type NavGroup = {
  label: string;
  icon?: LucideIcon;
  items: NavItem[];
};

export const primaryNav: NavGroup[] = [
  {
    label: "Características",
    icon: Sparkles,
    items: [
      { label: "Personajes", href: "/caracteristicas/personajes", icon: Users },
      { label: "Hermandades", href: "/caracteristicas/hermandades", icon: Shield },
      { label: "Profesiones", href: "/caracteristicas/profesiones", icon: Hammer },
      { label: "Zonas", href: "/caracteristicas/zonas", icon: Map },
      { label: "Incursiones y Mazmorras", href: "/caracteristicas/mazmorras", icon: Skull },
      { label: "Desafíos de Nivelación", href: "/caracteristicas/desafios", icon: Target },
      { label: "Transporte", href: "/caracteristicas/transporte", icon: Ship },
      { label: "Interfaz del Cliente", href: "/caracteristicas/ui", icon: Monitor },
      { label: "Eventos", href: "/caracteristicas/eventos", icon: Calendar },
    ],
  },
  {
    label: "Clases",
    icon: Swords,
    items: [
      { label: "Druida", href: "/clases/druida", icon: Trees },
      { label: "Cazador", href: "/clases/cazador", icon: Crosshair },
      { label: "Mago", href: "/clases/mago", icon: Sparkles },
      { label: "Paladín", href: "/clases/paladin", icon: Shield },
      { label: "Sacerdote", href: "/clases/sacerdote", icon: Cross },
      { label: "Pícaro", href: "/clases/picaro", icon: EyeOff },
      { label: "Chamán", href: "/clases/chaman", icon: Flame },
      { label: "Brujo", href: "/clases/brujo", icon: Skull },
      { label: "Guerrero", href: "/clases/guerrero", icon: Axe },
      { label: "Calculadora de Talentos", href: "/clases/calculadora", icon: Calculator },
    ],
  },
  {
    label: "Desarrollo",
    icon: Hammer,
    items: [
      { label: "Roadmap", href: "/desarrollo/roadmap", icon: MapIcon },
      { label: "Changelog", href: "/desarrollo/changelog", icon: ScrollText },
      { label: "Content Patches", href: "/desarrollo/patches", icon: Sparkles },
      { label: "Base de Datos", href: "/desarrollo/base-de-datos", icon: Database },
      { label: "Rastreador de Errores", href: "/desarrollo/bugs", icon: Bug },
    ],
  },
  {
    label: "Comunidad",
    icon: Users,
    items: [
      { label: "Foro", href: "/comunidad/foro", icon: MessageSquare },
      { label: "Hermandades", href: "/comunidad/hermandades", icon: Shield },
      { label: "Discord", href: "https://discord.gg/", external: true, icon: MessageSquare },
    ],
  },
];

export const secondaryNav: NavGroup[] = [
  {
    label: "Medios",
    icon: ImageIcon,
    items: [
      { label: "Obras de Arte Oficiales", href: "/medios/arte", icon: Palette },
      { label: "Tráilers", href: "/medios/trailers", icon: Video },
      { label: "Logotipos", href: "/medios/logos", icon: ImageIcon },
    ],
  },
];

export const utilityLinks: NavItem[] = [
  { label: "Login", href: "/login" },
  { label: "Donar", href: "/donar" },
  { label: "Reglas", href: "/reglas" },
];
