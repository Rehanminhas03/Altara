import { Container } from "@/components/ui/container";
import { Counter } from "@/components/motion/counter";
import { STATS } from "@/lib/constants";

export function StatsBand() {
  return (
    <section className="py-20">
      <Container>
        <div className="theme-dark grid grid-cols-2 gap-8 rounded-3xl border border-hairline bg-graphite p-10 text-ink lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="chrome-text font-heading text-4xl font-bold sm:text-5xl">
                {stat.text != null ? (
                  stat.text
                ) : (
                  <Counter
                    value={stat.value ?? 0}
                    suffix={stat.suffix}
                    decimals={stat.decimals ?? 0}
                  />
                )}
              </p>
              <p className="mt-2 text-sm text-ink-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
