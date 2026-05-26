import Link from "next/link";
import { ScrollText, Download, BookOpen, MessageSquare, UserPlus, ChevronRight } from "lucide-react";
import { RealmStatus } from "@/components/features/realm-status";
import { Panel } from "@/components/ui/panel";
import { ButtonLink } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { brand } from "@/config/brand";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
      {/* Banner Carta Abierta */}
      <Link
        href="/carta-abierta"
        className="panel panel-hover lift-on-hover animate-fade-in-up mb-8 lg:mb-10 flex items-center justify-between gap-4 px-4 sm:px-6 py-4 group"
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <ScrollText
            size={22}
            strokeWidth={1.5}
            className="text-[var(--color-accent-dim)] group-hover:text-[var(--color-accent)] transition-colors shrink-0"
          />
          <span className="font-display text-sm sm:text-base lg:text-lg uppercase tracking-wide text-[var(--color-accent)] truncate">
            Carta Abierta a Blizzard Entertainment
          </span>
        </div>
        <ChevronRight
          size={20}
          className="text-[var(--color-accent-dim)] group-hover:text-[var(--color-accent)] shrink-0"
        />
      </Link>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_340px]">
        <Panel as="section" className="p-6 sm:p-8 lg:p-10 animate-fade-in-up stagger-1">
          <p className="font-display uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-xs text-[var(--color-accent-dim)]">
            {brand.tagline}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-accent-gradient mt-3 sm:mt-4 leading-none">
            {brand.fullName}
          </h1>
          <Divider className="my-6 sm:my-8" />
          <p className="text-base sm:text-lg leading-relaxed text-[var(--color-text)]">
            Un servidor privado de{" "}
            <strong className="text-[var(--color-accent-bright)]">
              {brand.expansion}
            </strong>{" "}
            hecho por fans, para fans. Profundizamos en la exploración de la historia
            original del juego, destacando el Azeroth familiar de antaño y añadiendo
            contenido custom que respeta el espíritu del universo Warcraft.
          </p>
          <p className="mt-4 text-[var(--color-text-dim)] leading-relaxed">
            Comunidad hispana, sin tiendas pay-to-win, con eventos semanales y un
            equipo activo de desarrollo. Únete a la aventura.
          </p>

          <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row flex-wrap gap-3">
            <ButtonLink
              href="/descargar"
              size="lg"
              className="inline-flex items-center justify-center gap-2"
            >
              <Download size={18} strokeWidth={1.5} />
              Descargar Cliente
            </ButtonLink>
            <ButtonLink
              href="/comenzar"
              size="lg"
              className="inline-flex items-center justify-center gap-2"
            >
              <BookOpen size={18} strokeWidth={1.5} />
              Cómo Empezar
            </ButtonLink>
          </div>
        </Panel>

        <aside className="space-y-4 animate-fade-in-up stagger-2">
          <ButtonLink
            href="/registrarse"
            variant="green"
            size="lg"
            className="flex items-center justify-center gap-2 w-full"
          >
            <UserPlus size={20} strokeWidth={1.5} />
            Registrarse
          </ButtonLink>
          <ButtonLink
            href={brand.social.discord}
            external
            size="lg"
            className="flex items-center justify-center gap-2 w-full"
          >
            <MessageSquare size={18} strokeWidth={1.5} />
            Únete a Discord
          </ButtonLink>
          <RealmStatus />
        </aside>
      </div>

      <section className="mt-12 lg:mt-16">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-xl sm:text-2xl uppercase tracking-wide text-[var(--color-accent)]">
            Últimas Noticias
          </h2>
          <Link
            href="/desarrollo/changelog"
            className="text-sm text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors"
          >
            Ver todo →
          </Link>
        </div>
        <Divider className="mb-6 sm:mb-8" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Panel
              as="article"
              hover
              key={i}
              className={`p-5 sm:p-6 lift-on-hover animate-fade-in-up stagger-${i + 3}`}
            >
              <p className="text-xs uppercase tracking-widest text-[var(--color-accent-dim)]">
                Próximamente
              </p>
              <h3 className="mt-3 font-display text-lg text-[var(--color-text)]">
                Noticia #{i}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-dim)] leading-relaxed">
                Pronto publicaremos las últimas novedades del servidor aquí.
              </p>
            </Panel>
          ))}
        </div>
      </section>
    </div>
  );
}
