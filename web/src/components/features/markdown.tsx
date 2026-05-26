/**
 * Renderer minimal de Markdown. Sin dependencias externas para el bootstrap.
 * Cuando agreguemos contenido rico, migraremos a react-markdown o MDX.
 */
export function Markdown({ content }: { content: string }) {
  // Quitamos el primer H1 (el titulo ya se muestra en el PageHeader)
  const cleaned = content.replace(/^#\s+.+\n/, "");

  const lines = cleaned.split("\n");
  const blocks: React.ReactNode[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = (key: number) => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul
        key={`l-${key}`}
        className="list-disc list-inside space-y-1 text-[var(--color-text-dim)] my-3 pl-2"
      >
        {listItems.map((it, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: renderInline(it) }} />
        ))}
      </ul>,
    );
    listItems = [];
    inList = false;
  };

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    if (line.startsWith("## ")) {
      flushList(idx);
      blocks.push(
        <h2
          key={idx}
          className="font-display text-2xl uppercase tracking-wide text-[var(--color-accent)] mt-8 mb-3"
        >
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith("### ")) {
      flushList(idx);
      blocks.push(
        <h3
          key={idx}
          className="font-display text-lg text-[var(--color-accent-bright)] mt-6 mb-2"
        >
          {line.slice(4)}
        </h3>,
      );
    } else if (/^[-*]\s+/.test(line)) {
      inList = true;
      listItems.push(line.replace(/^[-*]\s+/, ""));
    } else if (line === "") {
      flushList(idx);
    } else if (line.startsWith("---")) {
      flushList(idx);
      blocks.push(<hr key={idx} className="divider-ornate my-6" />);
    } else {
      flushList(idx);
      blocks.push(
        <p
          key={idx}
          className="text-[var(--color-text)] my-3 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderInline(line) }}
        />,
      );
    }
  });
  flushList(lines.length);

  return <div className="prose-wow">{blocks}</div>;
}

function renderInline(text: string): string {
  return text
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-[var(--color-accent)] hover:text-[var(--color-accent-bright)] underline">$1</a>',
    )
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-[var(--color-bg-elevated)] px-1.5 py-0.5 rounded text-[var(--color-accent-bright)] text-sm">$1</code>',
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}
