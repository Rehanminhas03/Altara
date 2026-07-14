import { Container } from "@/components/ui/container";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-hairline">
      <Container className="pb-12 pt-32">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-faint">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-heading text-4xl font-bold text-ink sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {description}
          </p>
        )}
        {children}
      </Container>
    </header>
  );
}
