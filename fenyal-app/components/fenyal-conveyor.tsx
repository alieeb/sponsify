"use client";

import * as React from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import SushiConveyorMenu from "@/components/ui/sushi-conveyor-menu";
import type { ConveyorDish } from "@/components/ui/sushi-conveyor-menu";

/**
 * Fenyal's dishes on the belt. Plates are round crops of real photos taken at Fenyal.
 * The ring colour (tier) marks the menu category, not the price: only the hive price is confirmed so far.
 * Replace "Price TBC" with real prices before this goes live.
 */
export const FENYAL_DISHES: ConveyorDish[] = [
  {
    id: "hive",
    name: "Honeycomb Hive",
    price: "from QAR 24",
    tier: 2,
    description: "Pull-apart honeycomb buns with sesame, baked to order in a cast-iron pan.",
    details: ["Za'atar", "Spinach", "Lamb"],
    image: "/plates/hive.webp",
  },
  {
    id: "eggs",
    name: "Breakfast eggs",
    price: "Price TBC",
    tier: 1,
    description: "Soft, creamy eggs with olive oil and chives, served in the pan.",
    details: ["Breakfast", "Egg"],
    image: "/plates/eggs.webp",
  },
  {
    id: "kofta",
    name: "Lamb Kofta",
    price: "Price TBC",
    tier: 3,
    description: "Grilled minced lamb on fresh bread, with fries, salad and dips.",
    details: ["Grill", "Lamb"],
    image: "/plates/kofta.webp",
  },
  {
    id: "hummus",
    name: "Hummus",
    price: "Price TBC",
    tier: 4,
    description: "Creamy hummus finished with olive oil, sumac and parsley.",
    details: ["Mezze", "Vegetarian"],
    image: "/plates/hummus.webp",
  },
  {
    id: "tray",
    name: "Breakfast tray",
    price: "Price TBC",
    tier: 1,
    description: "Cheese with walnuts, olives, eggs, honey and jams, with fresh vegetables.",
    details: ["Breakfast", "To share"],
    image: "/plates/tray.webp",
  },
  {
    id: "chicken",
    name: "Grilled chicken",
    price: "Price TBC",
    tier: 3,
    description: "Charred chicken on oven-fresh bread, with grilled tomato and lemon.",
    details: ["Grill", "Chicken"],
    image: "/plates/chicken.webp",
  },
  {
    id: "bread",
    name: "Oven bread",
    price: "Price TBC",
    tier: 1,
    description: "Baked fresh through the morning and served warm in the basket.",
    details: ["Breakfast", "Vegetarian"],
    image: "/plates/bread.webp",
  },
  {
    id: "karak",
    name: "Karak",
    price: "Price TBC",
    tier: 5,
    description: "Strong spiced milk tea, made Fenyal's way.",
    details: ["Hot drink", "Milk"],
    image: "/plates/karak.webp",
  },
];

export const FENYAL_LEGEND = { 1: "Breakfast", 2: "Savouries", 3: "Grills", 4: "Mezze", 5: "Drinks" };

const WHATSAPP = "https://wa.me/97470813711?text=" + encodeURIComponent("Hello Fenyal, I'd like to book a table. Date: ___ Time: ___ Guests: ___");

export default function FenyalConveyor({ autoplay = true }: { autoplay?: boolean }) {
  const [count, setCount] = React.useState(0);
  const [flash, setFlash] = React.useState(false);
  const timer = React.useRef(0);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const add = () => {
    setCount((n) => n + 1);
    setFlash(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlash(false), 2400);
  };

  return (
    <div className="relative flex min-h-svh w-full flex-col bg-background text-foreground">
      <header className="relative z-20 flex items-center justify-between px-5 py-4 sm:px-8">
        <p className="flex items-baseline gap-2.5 font-semibold">
          <span className="tracking-[0.18em]">FENYAL</span>
          <span className="text-accent" lang="ar">فنيال</span>
        </p>
        <div className="flex items-center gap-2">
          <span aria-live="polite" className={`rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-foreground transition-[opacity,translate] duration-300 motion-reduce:transition-none ${flash ? "translate-x-0 opacity-100" : "translate-x-1 opacity-0"}`}>
            {flash ? "Added" : ""}
          </span>
          <button type="button" aria-label={`Your order: ${count} ${count === 1 ? "dish" : "dishes"}`} className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-medium text-card-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ShoppingBag aria-hidden="true" className="size-4" />
            <span className="tabular-nums">{count}</span>
          </button>
        </div>
      </header>
      <main className="flex flex-1 items-center">
        <SushiConveyorMenu
          items={FENYAL_DISHES}
          legend={FENYAL_LEGEND}
          eyebrow="Fenyal · Gewan Island · Bib Gourmand 2026"
          heading="Qatari favourites, turning on the belt."
          caption="Hover to stop the belt, flick to spin it, pick a plate to see it up close."
          autoplay={autoplay}
          onAdd={add}
          labels={{ add: "Add to order", close: "Close", previous: "Previous dish", next: "Next dish", pause: "Pause belt" }}
          action={
            <a href={WHATSAPP} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-[translate,box-shadow] hover:-translate-y-px hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none">
              <MessageCircle aria-hidden="true" className="size-4" />
              Book a table on WhatsApp
            </a>
          }
        />
      </main>
    </div>
  );
}
