import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that apply when you use the Fenyal website and make a reservation request.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "about", title: "About these terms",
    body: <p>These terms apply to your use of this website, which belongs to {SITE.name}, {SITE.address.join(", ")}. By using the website you accept them.</p>,
  },
  {
    id: "menu", title: "Menu, prices and allergies",
    body: (
      <>
        <p>Dishes, prices and opening hours shown on this website may change without notice and can differ from those in the café. Prices are in Qatari riyals.</p>
        <p>Descriptions are a guide only. If you have an allergy or dietary need, please tell our team before you order so we can advise you.</p>
      </>
    ),
  },
  {
    id: "reservations", title: "Reservations",
    body: (
      <ul>
        <li>A reservation request sent through this website is not a booking until our team confirms it.</li>
        <li>Please let us know as early as possible if you need to change or cancel.</li>
        <li>We may release a table if guests arrive significantly later than the booked time.</li>
        <li>For groups of more than 10 and private events, additional arrangements may apply.</li>
      </ul>
    ),
  },
  {
    id: "content", title: "Our content",
    body: <p>The name {SITE.name}, the text, photographs and design of this website belong to {SITE.name} or are used with permission. You may not copy or reuse them for commercial purposes without our written consent.</p>,
  },
  {
    id: "links", title: "Links to other services",
    body: <p>This website links to services such as WhatsApp and Google Maps. We are not responsible for their content or for how they handle your information.</p>,
  },
  {
    id: "liability", title: "Our responsibility",
    body: <p>We work to keep this website accurate and available, but we cannot guarantee it will always be complete, up to date or free of errors. To the extent the law allows, we are not liable for losses arising from your use of the website.</p>,
  },
  {
    id: "law", title: "Governing law",
    body: <p>These terms are governed by the laws of the State of Qatar, and the courts of Qatar have jurisdiction over any dispute.</p>,
  },
  {
    id: "changes", title: "Changes",
    body: <p>We may update these terms from time to time. The date at the top of this page shows when they last changed.</p>,
  },
];

export default function TermsPage() {
  return <LegalPage title="Terms of Use" intro={<p>Thank you for visiting {SITE.name}. Please read these terms before using our website or sending a reservation request.</p>} sections={SECTIONS} />;
}
