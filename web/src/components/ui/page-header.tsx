import { Divider } from "./divider";

export function PageHeader({
  title,
  subtitle,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}) {
  return (
    <header className="mb-8 animate-fade-in-up">
      {breadcrumb && (
        <p className="font-display uppercase tracking-widest text-xs text-[var(--color-accent-dim)]">
          {breadcrumb}
        </p>
      )}
      <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-accent-gradient mt-2">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-[var(--color-text-dim)] text-base sm:text-lg max-w-3xl">
          {subtitle}
        </p>
      )}
      <Divider className="mt-6" />
    </header>
  );
}
