import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { MENU } from "@/lib/site";

export const metadata: Metadata = {
  title: "Menu",
  description: "Fenyal's menu: Qatari breakfast, savouries baked to order, plates for lunch and dinner, sweets and Arabic coffee.",
};

export default function MenuPage() {
  return (
    <>
      <PageHero eyebrow="The menu" title="From the first coffee to the last karak." intro="Breakfast from seven, savouries baked to order and Qatari plates through the evening." image="/images/eggs.webp" />

      <nav aria-label="Menu categories" className="sticky top-20 z-30 border-y border-border bg-background/90 backdrop-blur-xl">
        <ul className="mx-auto flex max-w-7xl gap-8 overflow-x-auto px-5 py-4 text-[13px] uppercase tracking-[0.2em] [scrollbar-width:none] sm:px-8">
          {MENU.map((c) => <li key={c.id} className="shrink-0"><a href={`#${c.id}`} className="text-foreground/75 transition-colors hover:text-gold">{c.name}</a></li>)}
        </ul>
      </nav>

      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        {MENU.map((cat) => (
          <section key={cat.id} id={cat.id} aria-labelledby={`${cat.id}-h`} className="scroll-mt-40 pt-24">
            <Reveal className="flex flex-wrap items-end justify-between gap-4 border-b border-gold/30 pb-6">
              <div>
                <h2 id={`${cat.id}-h`} className="display text-5xl sm:text-6xl">{cat.name}</h2>
                <p className="font-arabic mt-2 text-2xl text-gold" lang="ar">{cat.ar}</p>
              </div>
              {cat.note && <p className="eyebrow">{cat.note}</p>}
            </Reveal>
            <ul className="divide-y divide-border">
              {cat.items.map((item, i) => (
                <Reveal key={item.name} as="li" delay={i * 60} className="py-8">
                  <div className="flex items-baseline gap-4">
                    <h3 className="font-serif text-2xl sm:text-3xl">{item.name}</h3>
                    <span aria-hidden="true" className="flex-1 translate-y-[-0.3em] border-b border-dotted border-foreground/25" />
                    {item.price ? <p className="font-serif text-2xl tabular-nums text-gold"><span className="mr-1.5 text-xs tracking-widest text-muted-foreground">QAR</span>{item.price}</p> : <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ask our team</p>}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <p className="font-arabic text-lg text-foreground/60" lang="ar">{item.ar}</p>
                    {item.popular && <span className="rounded-full border border-gold/50 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-gold">Guest favourite</span>}
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{item.description}</p>
                </Reveal>
              ))}
            </ul>
          </section>
        ))}

        <Reveal className="mt-24 rounded-[2rem] border border-border bg-card/50 p-8 text-center sm:p-12">
          <p className="text-sm leading-relaxed text-muted-foreground">Prices are in Qatari riyals and may change. Please tell our team about any allergies or dietary needs before you order.</p>
          <Link href="/reservations/" className="btn-gold mt-8">Reserve a table</Link>
        </Reveal>
      </div>
    </>
  );
}
