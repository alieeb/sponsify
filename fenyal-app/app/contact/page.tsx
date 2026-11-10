import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { ContactForm } from "@/components/site/contact-form";
import { SITE, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Fenyal: address, opening hours, phone and WhatsApp, and directions to Crystal Walk, Gewan Island.",
};

export default function ContactPage() {
  const cards = [
    { icon: MapPin, title: "Visit", body: SITE.address.join(", "), href: SITE.mapsUrl, cta: "Get directions", external: true },
    { icon: Phone, title: "Call", body: SITE.phone, href: SITE.phoneHref, cta: "Call now", external: false },
    { icon: MessageCircle, title: "WhatsApp", body: "Questions, groups and events", href: whatsappLink("Hello Fenyal,"), cta: "Message us", external: true },
    { icon: Clock, title: "Hours", body: SITE.hours.map((h) => `${h.days}, ${h.time}`).join(" · "), href: "/reservations/", cta: "Reserve a table", external: false },
  ];
  return (
    <>
      <PageHero eyebrow="Contact us" title="We would love to hear from you." image="/images/grill.webp" />

      <section className="mx-auto grid max-w-7xl gap-4 px-5 pt-20 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 90} className="flex flex-col rounded-[1.75rem] border border-border bg-card/50 p-7">
            <c.icon className="size-6 text-gold" aria-hidden="true" />
            <p className="eyebrow mt-6">{c.title}</p>
            <p className="mt-3 flex-1 font-serif text-xl leading-snug">{c.body}</p>
            <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener" } : {})} className="mt-6 text-sm text-gold underline-offset-4 hover:underline">{c.cta}</a>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Write to us</p>
          <h2 className="display mt-5 text-4xl sm:text-5xl">Send a message.</h2>
          <div className="mt-10"><ContactForm /></div>
        </Reveal>
        <Reveal delay={150} className="min-h-[420px] overflow-hidden rounded-[2rem] border border-border">
          <iframe title="Map showing Fenyal on Crystal Walk, Gewan Island" src={SITE.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="size-full min-h-[420px] grayscale invert-[0.9] contrast-[0.9]" />
        </Reveal>
      </section>
    </>
  );
}
