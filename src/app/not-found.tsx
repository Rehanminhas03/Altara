import Link from "next/link";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <Container className="py-24">
        <Logo href="/" priority className="mx-auto mb-8 h-20" />
        <p className="chrome-text font-heading text-7xl font-bold">404</p>
        <h1 className="mt-4 font-heading text-2xl font-semibold text-ink">
          Route not found
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-ink-muted">
          The page you&apos;re looking for has moved on. Let&apos;s get you back
          to the collection.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className={buttonVariants({ variant: "chrome" })}>
            Back home
          </Link>
          <Link
            href="/inventory"
            className={buttonVariants({ variant: "ghost" })}
          >
            Browse inventory
          </Link>
        </div>
      </Container>
    </div>
  );
}
