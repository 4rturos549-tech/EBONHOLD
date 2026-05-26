import { cn } from "@/lib/utils";

type PanelProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "article" | "aside";
  hover?: boolean;
};

export function Panel({
  as: Tag = "div",
  hover = false,
  className,
  ...props
}: PanelProps) {
  return (
    <Tag className={cn("panel", hover && "panel-hover", className)} {...props} />
  );
}

export function PanelHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-4 py-3 border-b border-[var(--color-border)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
