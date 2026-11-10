import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, SectionHeading } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story",
  description: "The story of Fenyal, a Qatari café on Gewan Island named after the small cup Arabic coffee is poured into.",
};

const DAY = [
  { time: "07:00", title: "Morning starts sweet.", text: "Saffron balaleet beneath a thin omelette, slow-cooked foul and bread fresh from the oven, with Arabic coffee from the dallah.", image: "/images/eggs.webp" },
  { time: "15:00", title: "Afternoon, warm from the oven.", text: "Cheese fatayer and pull-apart honeycomb hives with za'atar, spinach or lamb, with a strong karak on the side.", image: "/images/hive.webp" },
  { time: "21:00", title: "Evening, the full table.", text: "Chicken nashif, lamb kofta and ribs over hummus, then saffron elbah to finish.", image: "/images/grill.webp" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Our story" title="The dishes Qatari homes grew up on." image="/images/hive.webp" />

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-28 sm:px-8 md:grid-cols-2 md:py-36">
        <Reveal>
          <p className="display text-3xl leading-snug sm:text-5xl sm:leading-[1.15]">A <em className="italic text-gold">fenyal</em> is the small cup Arabic coffee is poured into. It gave us our name, and our way of cooking.</p>
        </Reveal>
        <Reveal delay={150} className="space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>That cup sets the tone for everything we serve: simple, generous food, made the way it is made at home, in a bright café on Crystal Walk, Gewan Island.</p>
          <p>In 2026 the MICHELIN Guide Doha recognised Fenyal with a Bib Gourmand, the distinction for good food at a fair price. For us it is a reminder to keep the classics honest: balaleet sweet and saffron-yellow, foul slow and rich, karak strong.</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal><SectionHeading center eyebrow="A day at Fenyal" title="From sunrise to late evening." /></Reveal>
        <div className="mt-20 space-y-28">
          {DAY.map((d, i) => (
            <div key={d.time} className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
              <Reveal className={`relative aspect-[4/3] overflow-hidden rounded-[2rem] ${i % 2 ? "md:order-2" : ""}`}>
                <Image src={d.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </Reveal>
              <Reveal delay={150}>
                <p className="font-serif text-7xl font-light text-transparent [-webkit-text-stroke:1px_var(--color-gold)] sm:text-8xl">{d.time}</p>
                <h3 className="display mt-6 text-4xl">{d.title}</h3>
                <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{d.text}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-36 max-w-7xl px-5 sm:px-8">
        <Reveal className="grid gap-10 rounded-[2.5rem] border border-border bg-card/50 p-8 sm:p-14 md:grid-cols-[auto_1fr] md:items-center">
          <p className="display text-6xl text-gold sm:text-8xl">{SITE.reviews}</p>
          <div>
            <p className="display text-3xl">Guests have reviewed Fenyal on Google.</p>
            <p className="mt-3 text-muted-foreground">Come and see why. We would love to have you.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/reservations/" className="btn-gold">Reserve a table</Link>
              <Link href="/menu/" className="btn-line">See the menu</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
