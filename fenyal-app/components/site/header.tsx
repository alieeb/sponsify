"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const overHero = pathname === "/";

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || !overHero || open;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/\/$/, "")));

  return (
    <header className={cn("fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500", solid ? "border-b border-border bg-background/85 backdrop-blur-xl" : "border-b border-transparent bg-transparent")}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-3" aria-label={`${SITE.name} home`}>
          <span className="font-serif text-2xl tracking-[0.22em]">FENYAL</span>
          <span className="font-arabic text-xl text-gold" lang="ar">{SITE.nameAr}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined}
              className={cn("relative py-2 text-[13px] uppercase tracking-[0.2em] transition-colors hover:text-gold",
                isActive(item.href) ? "text-gold" : "text-foreground/80",
                "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 hover:after:scale-x-100",
                isActive(item.href) && "after:scale-x-100")}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/reservations/" className="btn-gold hidden h-10 px-5 sm:inline-flex">Book a table</Link>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-11 items-center justify-center rounded-full border border-border text-foreground lg:hidden">
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div id="mobile-nav" hidden={!open} className="fixed inset-x-0 bottom-0 top-20 overflow-y-auto bg-background px-6 pb-10 pt-6 lg:hidden">
        <nav aria-label="Mobile" className="flex flex-col">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined}
              className={cn("border-b border-border py-5 font-serif text-3xl", isActive(item.href) ? "text-gold" : "text-foreground")}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/reservations/" className="btn-gold mt-8 w-full">Book a table</Link>
        <p className="mt-8 text-sm text-muted-foreground">{SITE.address.join(", ")}<br /><a href={SITE.phoneHref} className="text-foreground">{SITE.phone}</a></p>
      </div>
    </header>
  );
}
