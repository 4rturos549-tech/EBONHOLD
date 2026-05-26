import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { ComingSoon } from "@/components/features/coming-soon";
import { classes, getClassBySlug } from "@/config/classes";

export function generateStaticParams() {
  return classes.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/clases/[slug]">) {
  const { slug } = await params;
  const cls = getClassBySlug(slug);
  return { title: cls?.name ?? "Clase" };
}

export default async function ClassPage({ params }: PageProps<"/clases/[slug]">) {
  const { slug } = await params;
  const cls = getClassBySlug(slug);
  if (!cls) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
      <Link
        href="/clases"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-text-dim)] hover:text-[var(--color-accent)] mb-6 transition-colors"
      >
        <ChevronLeft size={16} />
        Todas las clases
      </Link>

      <div className="flex items-center gap-4 sm:gap-6 mb-6">
        <div
          className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded border-2 overflow-hidden shadow-xl"
          style={{ borderColor: cls.color }}
        >
          <Image
            src={cls.iconUrl}
            alt={cls.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
        <div className="min-w-0">
          <p className="font-display uppercase tracking-widest text-xs text-[var(--color-accent-dim)]">
            Clase
          </p>
          <h1
            className="font-display text-3xl sm:text-4xl md:text-5xl mt-1 truncate"
            style={{ color: cls.color }}
          >
            {cls.name}
          </h1>
        </div>
      </div>

      <p className="text-lg text-[var(--color-text)] leading-relaxed mb-8 max-w-3xl">
        {cls.description}
      </p>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Panel className="p-4">
          <p className="text-xs uppercase tracking-wider text-[var(--color-accent-dim)]">
            Rol
          </p>
          <p className="mt-1 text-[var(--color-text)]">{cls.role.join(", ")}</p>
        </Panel>
        <Panel className="p-4">
          <p className="text-xs uppercase tracking-wider text-[var(--color-accent-dim)]">
            Recurso
          </p>
          <p className="mt-1 text-[var(--color-text)]">{cls.resource}</p>
        </Panel>
        <Panel className="p-4">
          <p className="text-xs uppercase tracking-wider text-[var(--color-accent-dim)]">
            Armadura
          </p>
          <p className="mt-1 text-[var(--color-text)]">{cls.armor}</p>
        </Panel>
      </div>

      <Panel className="p-6 mb-8">
        <h2 className="font-display text-2xl uppercase tracking-wide mb-4" style={{ color: cls.color }}>
          Especializaciones
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {cls.specs.map((s) => (
            <div
              key={s}
              className="px-4 py-3 rounded border text-center"
              style={{
                borderColor: `${cls.color}40`,
                background: `${cls.color}08`,
              }}
            >
              <p className="font-display text-[var(--color-text)]">{s}</p>
            </div>
          ))}
        </div>
      </Panel>

      <ComingSoon message="Guías detalladas de cada especialización, rotaciones y builds próximamente." />
    </div>
  );
}
