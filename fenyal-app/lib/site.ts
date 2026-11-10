/**
 * Single source of truth for Fenyal's details, navigation and menu.
 * Items marked "confirm" must be checked with Fenyal before launch.
 */

export const SITE = {
  name: "Fenyal",
  nameAr: "فنيال",
  tagline: "Qatari café · Gewan Island, Doha",
  phone: "+974 7081 3711",
  phoneHref: "tel:+97470813711",
  whatsapp: "97470813711", // confirm: number is on WhatsApp
  address: ["Crystal Walk, Gewan Island", "Doha, Qatar"],
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Fenyal%20Gewan%20Island%20Doha",
  mapEmbed: "https://maps.google.com/maps?q=Fenyal%2C%20Crystal%20Walk%2C%20Gewan%20Island%2C%20Doha&z=15&output=embed",
  hours: [{ days: "Every day", time: "7:00 am – 11:00 pm" }], // confirm: listings disagree
  award: "MICHELIN Guide Doha 2026 · Bib Gourmand",
  reviews: "8,782",
  updated: "10 November 2026",
};

/**
 * The live address of the site, e.g. "https://www.fenyalqatar.com".
 * Set NEXT_PUBLIC_SITE_URL when building for the real domain. While it is empty the site stays
 * hidden from Google (noindex + robots.txt disallow), which is right for previews and pitches.
 */
/**
 * Folder the site is served from, e.g. "/sponsify/fenyal-site" on GitHub Pages. Empty on its own domain.
 * next/link adds it to links automatically; asset() adds it to image paths.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
export function asset(path: string) {
  return `${BASE_PATH}${path}`;
}

export const SITE_URL =(process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
export const INDEXABLE = SITE_URL.startsWith("https://");

export const PAGES = [
  { path: "/", priority: 1 },
  { path: "/menu/", priority: 0.9 },
  { path: "/reservations/", priority: 0.9 },
  { path: "/about/", priority: 0.7 },
  { path: "/contact/", priority: 0.7 },
  { path: "/privacy/", priority: 0.2 },
  { path: "/terms/", priority: 0.2 },
];

export function whatsappLink(text: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/menu/", label: "Menu" },
  { href: "/about/", label: "Our Story" },
  { href: "/reservations/", label: "Reservations" },
  { href: "/contact/", label: "Contact" },
];

export const LEGAL_NAV = [
  { href: "/privacy/", label: "Privacy Policy" },
  { href: "/terms/", label: "Terms of Use" },
];

export type MenuItem = { name: string; ar: string; description: string; price?: number; popular?: boolean };
export type MenuCategory = { id: string; name: string; ar: string; note?: string; items: MenuItem[] };

/** Prices only where confirmed from Fenyal's online menu. */
export const MENU: MenuCategory[] = [
  {
    id: "breakfast", name: "Breakfast", ar: "الفطور", note: "Served from 7 am",
    items: [
      { name: "Balaleet", ar: "بلاليط", price: 32, description: "Sweet saffron vermicelli beneath a thin omelette. The Qatari breakfast." },
      { name: "Foul", ar: "فول", description: "Slow-cooked fava beans with olive oil, served with fresh bread." },
      { name: "Falafel", ar: "فلافل", description: "Crisp outside, green inside, with tahini." },
      { name: "Oven Bread", ar: "خبز الفرن", description: "Baked fresh through the morning, served warm." },
    ],
  },
  {
    id: "savouries", name: "Fenyal Savouries", ar: "مخبوزات فنيال", note: "Baked to order",
    items: [
      { name: "Cheese Fatayer", ar: "فطاير جبن", price: 25, popular: true, description: "Soft baked pastry filled with melted cheese." },
      { name: "Za'atar Hive", ar: "خلية زعتر", price: 24, description: "Pull-apart honeycomb buns with za'atar." },
      { name: "Spinach Hive", ar: "خلية سبانخ", price: 24, description: "Pull-apart honeycomb buns filled with spinach." },
      { name: "Lamb Hive", ar: "خلية لحم", price: 28, description: "Pull-apart honeycomb buns filled with spiced lamb." },
    ],
  },
  {
    id: "plates", name: "Plates", ar: "الأطباق", note: "Lunch & dinner",
    items: [
      { name: "Chicken Nashif", ar: "نشيف دجاج", description: "Chicken cooked down in spiced tomato until thick and rich." },
      { name: "Lamb Kofta", ar: "كفتة لحم", description: "Grilled minced lamb with herbs and spice, on fresh bread." },
      { name: "Ribs over Hummus", ar: "ريش على حمص", description: "Tender ribs served on a bed of creamy hummus." },
    ],
  },
  {
    id: "sweet", name: "Sweet", ar: "الحلى",
    items: [
      { name: "Saffron Elbah", ar: "إلبة بالزعفران", description: "Baked saffron custard. The MICHELIN Guide's pick to end the meal." },
    ],
  },
  {
    id: "drinks", name: "Drinks", ar: "المشروبات",
    items: [
      { name: "Arabic Coffee", ar: "قهوة عربية", description: "Cardamom and saffron, poured from the dallah." },
      { name: "Karak", ar: "كرك", description: "Strong spiced milk tea, made our way." },
      { name: "Fresh Juices", ar: "عصائر طازجة", description: "Pressed to order. Ask what is in season." },
    ],
  },
];
