"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { whatsappLink } from "@/lib/site";

const TOPICS = ["General question", "Private event or large group", "Catering", "Feedback", "Press and partnerships"];

/** No server: the message is handed to WhatsApp for the visitor to send. */
export function ContactForm() {
  const [sent, setSent] = React.useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const text = [
      `Hello Fenyal, ${String(f.get("topic")).toLowerCase()}:`,
      "",
      String(f.get("message")).trim(),
      "",
      `${f.get("name")} · ${f.get("phone")}`,
    ].join("\n");
    window.open(whatsappLink(text), "_blank", "noopener");
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
      <div>
        <label htmlFor="c-name" className="label">Name</label>
        <input id="c-name" name="name" required autoComplete="name" className="field" placeholder="Your name" />
      </div>
      <div>
        <label htmlFor="c-phone" className="label">Phone</label>
        <input id="c-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="field" placeholder="+974" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-topic" className="label">Topic</label>
        <select id="c-topic" name="topic" defaultValue={TOPICS[0]} className="field appearance-none">
          {TOPICS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-message" className="label">Message</label>
        <textarea id="c-message" name="message" required rows={5} className="field h-auto py-3" placeholder="How can we help?" />
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">Your message opens in WhatsApp for you to send. See our <a href="/privacy/" className="text-gold underline-offset-4 hover:underline">Privacy Policy</a>.</p>
        <button type="submit" className="btn-gold shrink-0"><Send className="size-4" aria-hidden="true" />Send message</button>
      </div>
      {sent && <p role="status" className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold sm:col-span-2">WhatsApp opened with your message. Press send there and we will reply soon.</p>}
    </form>
  );
}
