import Link from "next/link";
import { SITE } from "@/lib/site";

export type LegalSection = { id: string; title: string; body: React.ReactNode };

/** Shared layout for the Privacy Policy and Terms of Use: title, table of contents, numbered sections. */
export function LegalPage({ title, intro, sections }: { title: string; intro: React.ReactNode; sections: LegalSection[] }) {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-10 pt-40 sm:px-8">
      <p className="eyebrow">Legal</p>
      <h1 className="display mt-5 text-5xl sm:text-7xl">{title}</h1>
      <p className="mt-4 text-sm text-muted-foreground">Last updated: {SITE.updated}</p>

      <div className="mt-16 grid gap-16 lg:grid-cols-[16rem_1fr]">
        <nav aria-label="On this page" className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow">On this page</p>
          <ol className="mt-5 space-y-3 text-sm">
            {sections.map((s, i) => (
              <li key={s.id}><a href={`#${s.id}`} className="text-muted-foreground transition-colors hover:text-gold"><span className="mr-2 tabular-nums text-gold/70">{String(i + 1).padStart(2, "0")}</span>{s.title}</a></li>
            ))}
          </ol>
        </nav>

        <article className="max-w-3xl">
          <div className="text-lg leading-relaxed text-foreground/85">{intro}</div>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-32 border-t border-border pt-10 mt-10">
              <h2 className="font-serif text-3xl"><span className="mr-3 text-gold/70">{String(i + 1).padStart(2, "0")}</span>{s.title}</h2>
              <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground [&_a]:text-gold [&_a]:underline-offset-4 hover:[&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:space-y-2">{s.body}</div>
            </section>
          ))}
          <p className="mt-16 border-t border-border pt-8 text-sm text-muted-foreground">Questions about this page? <Link href="/contact/">Contact us</Link> or call <a href={SITE.phoneHref}>{SITE.phone}</a>.</p>
        </article>
      </div>
    </div>
  );
}
