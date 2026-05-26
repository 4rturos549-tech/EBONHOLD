import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { Markdown } from "@/components/features/markdown";
import { ComingSoon } from "@/components/features/coming-soon";
import { getChangelogEntries } from "@/lib/changelog";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Changelog" };

export default async function ChangelogPage() {
  const entries = await getChangelogEntries();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        breadcrumb="Desarrollo"
        title="Changelog"
        subtitle="Cada hito del proyecto, en orden cronológico inverso. Los devlogs los escribimos según avanzamos."
      />

      {entries.length === 0 ? (
        <ComingSoon message="Todavía no hay devlogs publicados, o no se pudo leer la carpeta /desarrollo." />
      ) : (
        <div className="space-y-8">
          {entries.map((entry) => (
            <Panel key={entry.slug} as="article" className="p-8">
              <p className="font-display uppercase tracking-widest text-xs text-[var(--color-accent-dim)]">
                {formatDate(entry.date)}
              </p>
              <h2 className="font-display text-3xl text-accent-gradient mt-2 mb-4">
                {entry.title.replace(/^\d{4}-\d{2}-\d{2}\s*·\s*/, "")}
              </h2>
              <Markdown content={entry.content} />
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
