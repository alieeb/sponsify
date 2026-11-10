"use client";

import * as React from "react";
import Link from "next/link";
import SushiConveyorMenu from "@/components/ui/sushi-conveyor-menu";
import type { ConveyorDish } from "@/components/ui/sushi-conveyor-menu";
import { asset, whatsappLink } from "@/lib/site";

/**
 * Fenyal's dishes on the belt. Plates are round crops of real photos taken at Fenyal.
 * The ring colour (tier) marks the menu category, not the price: only the hive price is confirmed so far.
 * Replace "Price on request" with real prices before this goes live.
 */
export const FENYAL_DISHES: ConveyorDish[] = [
  { id: "hive", name: "Honeycomb Hive", price: "from QAR 24", tier: 2, description: "Pull-apart honeycomb buns with sesame, baked to order in a cast-iron pan.", details: ["Za'atar", "Spinach", "Lamb"], image: "/plates/hive.webp" },
  { id: "eggs", name: "Breakfast Eggs", price: "Price on request", tier: 1, description: "Soft, creamy eggs with olive oil and chives, served in the pan.", details: ["Breakfast", "Egg"], image: "/plates/eggs.webp" },
  { id: "kofta", name: "Lamb Kofta", price: "Price on request", tier: 3, description: "Grilled minced lamb on fresh bread, with fries, salad and dips.", details: ["Grill", "Lamb"], image: "/plates/kofta.webp" },
  { id: "hummus", name: "Hummus", price: "Price on request", tier: 4, description: "Creamy hummus finished with olive oil, sumac and parsley.", details: ["Mezze", "Vegetarian"], image: "/plates/hummus.webp" },
  { id: "tray", name: "Breakfast Tray", price: "Price on request", tier: 1, description: "Cheese with walnuts, olives, eggs, honey and jams, with fresh vegetables.", details: ["Breakfast", "To share"], image: "/plates/tray.webp" },
  { id: "chicken", name: "Grilled Chicken", price: "Price on request", tier: 3, description: "Charred chicken on oven-fresh bread, with grilled tomato and lemon.", details: ["Grill", "Chicken"], image: "/plates/chicken.webp" },
  { id: "bread", name: "Oven Bread", price: "Price on request", tier: 1, description: "Baked fresh through the morning and served warm in the basket.", details: ["Breakfast", "Vegetarian"], image: "/plates/bread.webp" },
  { id: "karak", name: "Karak", price: "Price on request", tier: 5, description: "Strong spiced milk tea, made Fenyal's way.", details: ["Hot drink", "Milk"], image: "/plates/karak.webp" },
];

const DISHES = FENYAL_DISHES.map((dish) => ({ ...dish, image: asset(dish.image) }));

export const FENYAL_LEGEND = { 1: "Breakfast", 2: "Savouries", 3: "Grills", 4: "Mezze", 5: "Drinks" };

/** The belt as a section of the home page. "Ask about this dish" opens WhatsApp with the dish name. */
export default function FenyalConveyor({ autoplay = true }: { autoplay?: boolean }) {
  const ask = React.useCallback((item: ConveyorDish) => {
    window.open(whatsappLink(`Hello Fenyal, I'd like to know more about the ${item.name}.`), "_blank", "noopener");
  }, []);

  return (
    <SushiConveyorMenu
      items={DISHES}
      legend={FENYAL_LEGEND}
      eyebrow="On the belt"
      heading="Our table, always turning."
      caption="Hover to stop the belt, flick to spin it, pick a plate to see it up close."
      autoplay={autoplay}
      onAdd={ask}
      labels={{ add: "Ask about this dish", close: "Close", previous: "Previous dish", next: "Next dish", pause: "Pause belt" }}
      className="bg-transparent"
      action={<Link href="/menu/" className="btn-line">View the full menu</Link>}
    />
  );
}
