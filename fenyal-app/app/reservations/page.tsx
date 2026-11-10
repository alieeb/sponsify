import type { Metadata } from "next";
import { Clock, MapPin, Phone, Users } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { ReservationForm } from "@/components/site/reservation-form";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reservations",
  description: "Reserve a table at Fenyal, Crystal Walk, Gewan Island, Doha.",
};

export default function ReservationsPage() {
  return (
    <>
      <PageHero eyebrow="Reservations" title="Reserve your table." intro="Tell us when you would like to come. We confirm every booking personally." image="/images/kofta.webp" />
      <section className="mx-auto grid max-w-7xl gap-12 px-5 pt-20 sm:px-8 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="rounded-[2rem] border border-border bg-card/50 p-6 sm:p-10">
          <ReservationForm />
        </Reveal>
        <Reveal delay={150} as="aside" className="space-y-10">
          <div>
            <p className="eyebrow">Good to know</p>
            <ul className="mt-6 space-y-5 text-sm leading-relaxed">
              <li className="flex gap-4"><Clock className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" /><span>{SITE.hours.map((h) => `${h.days}, ${h.time}`).join(" · ")}</span></li>
              <li className="flex gap-4"><Users className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" /><span>For groups of more than 10 or private events, please call us so we can plan your table.</span></li>
              <li className="flex gap-4"><MapPin className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden="true" /><span>{SITE.address.join(", ")}</span></li>
            </ul>
          </div>
          <div className="rounded-[2rem] border border-gold/30 p-8">
            <p className="display text-3xl">Prefer to call?</p>
            <p className="mt-2 text-sm text-muted-foreground">Our team is happy to help.</p>
            <a href={SITE.phoneHref} className="btn-line mt-6"><Phone className="size-4" aria-hidden="true" />{SITE.phone}</a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
