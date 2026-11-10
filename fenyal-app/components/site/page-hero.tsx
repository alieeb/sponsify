import Image from "next/image";
import { asset } from "@/lib/site";

/** Banner at the top of inner pages: photo, dark veil, eyebrow, serif title. */
export function PageHero({ eyebrow, title, intro, image }: { eyebrow: string; title: string; intro?: string; image: string }) {
  return (
    <section className="relative isolate flex min-h-[62svh] items-end overflow-hidden pb-16 pt-40">
      <Image src={asset(image)} alt="" fill priority sizes="100vw" className="kenburns -z-20 object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/60 to-background" />
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display mt-5 max-w-4xl text-5xl leading-[1.02] sm:text-7xl">{title}</h1>
        {intro && <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg">{intro}</p>}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, intro, center = false }: { eyebrow: string; title: string; intro?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={center ? "ornament justify-center" : "eyebrow"}>{center ? <span className="eyebrow">{eyebrow}</span> : eyebrow}</p>
      <h2 className="display mt-5 text-4xl leading-[1.05] sm:text-6xl">{title}</h2>
      {intro && <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p>}
    </div>
  );
}
