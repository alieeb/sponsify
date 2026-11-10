import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import FenyalConveyor from "@/components/fenyal-conveyor";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/page-hero";
import { SITE } from "@/lib/site";

const SIGNATURES = [
  { image: "/images/hive.webp", name: "Honeycomb Hive", note: "Savouries · from QAR 24", text: "Pull-apart buns with sesame, baked to order in cast iron." },
  { image: "/images/eggs.webp", name: "Morning Eggs", note: "Breakfast", text: "Soft and creamy, finished with olive oil and chives." },
  { image: "/images/kofta.webp", name: "Lamb Kofta", note: "Plates", text: "Grilled with herbs and spice, served on fresh bread." },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-svh items-center overflow-hidden">
        <Image src="/images/grill.webp" alt="" fill priority sizes="100vw" className="kenburns -z-20 object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_40%,transparent,var(--background)_85%),linear-gradient(to_bottom,color-mix(in_oklab,var(--background)_55%,transparent),color-mix(in_oklab,var(--background)_70%,transparent)_60%,var(--background))]" />
        <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-36 text-center sm:px-8">
          <Reveal><p className="ornament justify-center"><span className="eyebrow">{SITE.award}</span></p></Reveal>
          <Reveal delay={120}>
            <h1 className="display mx-auto mt-8 max-w-5xl text-6xl leading-[0.98] sm:text-8xl lg:text-[8.5rem]">
              Qatari cooking,<br /><em className="font-normal italic text-gold">served with care.</em>
            </h1>
          </Reveal>
          <Reveal delay={260}>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg">Balaleet at sunrise, nashif by night and Arabic coffee poured from the dallah all day, on Crystal Walk, Gewan Island.</p>
          </Reveal>
          <Reveal delay={380} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/reservations/" className="btn-gold">Reserve a table</Link>
            <Link href="/menu/" className="btn-line">Discover the menu</Link>
          </Reveal>
        </div>
        <div aria-hidden="true" className="absolute bottom-8 left-1/2 h-14 w-px -translate-x-1/2 bg-gradient-to-b from-gold to-transparent" />
      </section>

      {/* INTRO */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-28 sm:px-8 md:grid-cols-12 md:py-40">
        <Reveal className="md:col-span-5">
          <p className="eyebrow">The house</p>
          <p className="font-arabic mt-6 text-7xl text-gold/90 sm:text-8xl" lang="ar">فنيال</p>
        </Reveal>
        <Reveal delay={150} className="md:col-span-7">
          <p className="display text-3xl leading-snug sm:text-5xl sm:leading-[1.15]">Named after the small cup that Arabic coffee is poured into, Fenyal serves the dishes Qatari homes grew up on, simply and generously.</p>
          <Link href="/about/" className="group mt-10 inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-gold">
            Our story <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </Reveal>
      </section>

      {/* CONVEYOR BELT */}
      <section aria-label="Dishes on the belt" className="border-y border-border bg-[oklch(0.165_0.005_285)]">
        <FenyalConveyor />
      </section>

      {/* SIGNATURES */}
      <section className="mx-auto max-w-7xl px-5 py-28 sm:px-8 md:py-40">
        <Reveal><SectionHeading center eyebrow="Signatures" title="The plates guests come back for." intro="A taste of the kitchen, from the first bake of the morning to the grill at night." /></Reveal>
        <div className="mt-20 grid gap-10 md:grid-cols-3">
          {SIGNATURES.map((s, i) => (
            <Reveal key={s.name} delay={i * 140} as="article" className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                <Image src={s.image} alt={s.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105" />
                <div aria-hidden="true" className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
              </div>
              <p className="eyebrow mt-7">{s.note}</p>
              <h3 className="display mt-3 text-3xl">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MICHELIN */}
      <section className="relative isolate overflow-hidden border-y border-border py-32 md:py-44">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_50%_50%,color-mix(in_oklab,var(--color-maroon)_45%,transparent),transparent_75%)]" />
        <Reveal className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <p className="ornament justify-center"><span className="eyebrow">MICHELIN Guide Doha · 2026</span></p>
          <p className="display mt-10 text-7xl leading-none sm:text-9xl">Bib <em className="italic text-gold">Gourmand</em></p>
          <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg">The Bib Gourmand recognises good food at a fair price. Fenyal received it in the second edition of the MICHELIN Guide Doha, for Qatari classics cooked simply and well. More than {SITE.reviews} guests have reviewed us on Google.</p>
        </Reveal>
      </section>

      {/* GALLERY STRIP */}
      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 py-28 sm:px-8 md:grid-cols-4 md:py-40">
        {["/images/grill.webp", "/images/eggs.webp", "/images/hive.webp", "/images/kofta.webp"].map((src, i) => (
          <Reveal key={src} delay={i * 100} className={`relative overflow-hidden rounded-3xl ${i % 2 ? "aspect-[3/4] md:translate-y-12" : "aspect-[3/4]"}`}>
            <Image src={src} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-[1.6s] hover:scale-105" />
          </Reveal>
        ))}
      </section>

      {/* VISIT */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="grid gap-10 rounded-[2.5rem] border border-border bg-card/50 p-8 sm:p-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow">Visit us</p>
            <h2 className="display mt-5 text-4xl sm:text-6xl">Your table is waiting.</h2>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/reservations/" className="btn-gold">Reserve a table</Link>
              <Link href="/contact/" className="btn-line">Contact us</Link>
            </div>
          </div>
          <ul className="space-y-6 text-sm">
            <li className="flex gap-4"><MapPin className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" /><span>{SITE.address.join(", ")}</span></li>
            <li className="flex gap-4"><Clock className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" /><span>{SITE.hours.map((h) => `${h.days}, ${h.time}`).join(" · ")}</span></li>
            <li className="flex gap-4"><Phone className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" /><a href={SITE.phoneHref} className="hover:text-gold">{SITE.phone}</a></li>
          </ul>
        </Reveal>
      </section>
    </>
  );
}
