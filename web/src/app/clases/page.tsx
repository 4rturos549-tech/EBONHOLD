import Link from "next/link";
import Image from "next/image";
import { Calculator } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { classes } from "@/config/classes";

export const metadata = { title: "Clases" };

export default function ClassesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
      <PageHeader
        title="Clases"
        subtitle="Las nueve clases jugables de Wrath of the Lich King. Cada una con tres especializaciones que cambian radicalmente su forma de jugar."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls, idx) => (
          <Link key={cls.slug} href={`/clases/${cls.slug}`}>
            <Panel
              hover
              className={`class-card lift-on-hover p-6 h-full animate-fade-in-up`}
              style={{
                ["--class-color" as string]: cls.color,
                animationDelay: `${idx * 40}ms`,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-14 h-14 rounded border-2 overflow-hidden shadow-lg"
                  style={{ borderColor: cls.color }}
                >
                  <Image
                    src={cls.iconUrl}
                    alt={cls.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2
                    className="font-display text-2xl leading-tight"
                    style={{ color: cls.color }}
                  >
                    {cls.name}
                  </h2>
                  <p className="text-xs uppercase tracking-wider text-[var(--color-text-dim)] mt-1">
                    {cls.role.join(" · ")} · {cls.armor}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-[var(--color-text-dim)] line-clamp-3">
                {cls.description}
              </p>
            </Panel>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/clases/calculadora"
          className="btn-primary inline-flex items-center gap-2 px-6 py-3 font-display uppercase tracking-wider"
        >
          <Calculator size={18} strokeWidth={1.5} />
          Calculadora de Talentos
        </Link>
      </div>
    </div>
  );
}
