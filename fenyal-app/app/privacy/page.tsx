import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Fenyal handles personal information shared through this website, WhatsApp and phone.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "who", title: "Who we are",
    body: <p>This website belongs to {SITE.name}, a café on {SITE.address.join(", ")}. In this policy, &ldquo;we&rdquo; and &ldquo;us&rdquo; mean {SITE.name}. We are responsible for the personal information you share with us.</p>,
  },
  {
    id: "collect", title: "What we collect",
    body: (
      <>
        <p>We only receive personal information you choose to send us:</p>
        <ul>
          <li><strong>Reservation requests:</strong> your name, phone number, date, time, number of guests, occasion and any notes you add.</li>
          <li><strong>Messages:</strong> your name, phone number and the content of your message.</li>
          <li><strong>Calls:</strong> what you tell us when you phone the café.</li>
        </ul>
        <p>The forms on this website do not store anything on our servers. When you press send, they open WhatsApp with your message filled in, and nothing reaches us until you send it there.</p>
        <p>This website does not use accounts, analytics or advertising cookies.</p>
      </>
    ),
  },
  {
    id: "use", title: "How we use it",
    body: (
      <ul>
        <li>To confirm, change or cancel your reservation.</li>
        <li>To answer your questions and plan events or large groups.</li>
        <li>To prepare for allergies or special requests you tell us about.</li>
        <li>To improve our service based on your feedback.</li>
      </ul>
    ),
  },
  {
    id: "third-parties", title: "Services we rely on",
    body: (
      <>
        <p>Some parts of this website are provided by other companies, which process data under their own privacy policies:</p>
        <ul>
          <li><strong>WhatsApp (Meta):</strong> used to send reservation requests and messages.</li>
          <li><strong>Google Maps:</strong> the map on our Contact page is loaded from Google.</li>
          <li><strong>Google Fonts:</strong> the typefaces on this website are loaded from Google.</li>
        </ul>
        <p>We do not sell your personal information or share it for advertising.</p>
      </>
    ),
  },
  {
    id: "retention", title: "How long we keep it",
    body: <p>We keep reservation and message details only as long as we need them to look after your visit or answer your request, and then delete them, unless the law requires us to keep them longer.</p>,
  },
  {
    id: "rights", title: "Your rights",
    body: (
      <>
        <p>We handle personal information in line with Qatar&rsquo;s Law No. 13 of 2016 on Personal Data Privacy Protection. You can ask us to:</p>
        <ul>
          <li>tell you what personal information we hold about you;</li>
          <li>correct it if it is wrong;</li>
          <li>delete it, or stop using it.</li>
        </ul>
        <p>To make a request, contact us by phone on <a href={SITE.phoneHref}>{SITE.phone}</a> or through our <a href="/contact/">Contact page</a>.</p>
      </>
    ),
  },
  {
    id: "children", title: "Children",
    body: <p>This website is not aimed at children. Reservations should be made by an adult.</p>,
  },
  {
    id: "changes", title: "Changes to this policy",
    body: <p>We may update this policy from time to time. The date at the top of this page shows when it last changed.</p>,
  },
];

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" intro={<p>Your privacy matters to us. This policy explains what personal information we receive through this website, why, and the choices you have.</p>} sections={SECTIONS} />;
}
