import Link from "next/link";
import { LEGAL_NAV, NAV, SITE, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border bg-[oklch(0.12_0.004_285)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-baseline gap-3">
            <span className="font-serif text-2xl tracking-[0.22em]">FENYAL</span>
            <span className="font-arabic text-xl text-gold" lang="ar">{SITE.nameAr}</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">Qatari cooking from first coffee to late karak. Recognised with a Bib Gourmand in the MICHELIN Guide Doha 2026.</p>
        </div>

        <div>
          <p className="eyebrow">Visit</p>
          <address className="mt-5 not-italic text-sm leading-7 text-foreground/85">
            {SITE.address.map((line) => <span key={line} className="block">{line}</span>)}
          </address>
          <a href={SITE.mapsUrl} target="_blank" rel="noopener" className="mt-3 inline-block text-sm text-gold underline-offset-4 hover:underline">Get directions</a>
        </div>

        <div>
          <p className="eyebrow">Hours</p>
          <ul className="mt-5 space-y-1 text-sm leading-7 text-foreground/85">
            {SITE.hours.map((h) => <li key={h.days}>{h.days}<br /><span className="text-muted-foreground">{h.time}</span></li>)}
          </ul>
          <p className="eyebrow mt-8">Contact</p>
          <ul className="mt-5 space-y-1 text-sm leading-7">
            <li><a href={SITE.phoneHref} className="text-foreground/85 hover:text-gold">{SITE.phone}</a></li>
            <li><a href={whatsappLink("Hello Fenyal,")} target="_blank" rel="noopener" className="text-foreground/85 hover:text-gold">WhatsApp</a></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-5 space-y-1 text-sm leading-7">
            {NAV.map((item) => <li key={item.href}><Link href={item.href} className="text-foreground/85 hover:text-gold">{item.label}</Link></li>)}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <ul className="flex gap-6">
            {LEGAL_NAV.map((item) => <li key={item.href}><Link href={item.href} className="hover:text-gold">{item.label}</Link></li>)}
          </ul>
        </div>
      </div>
    </footer>
  );
}
