"use client";

import * as React from "react";
import { CalendarCheck } from "lucide-react";
import { whatsappLink } from "@/lib/site";

const TIMES: string[] = [];
for (let h = 7; h <= 22; h++) for (const m of [0, 30]) {
  if (h === 22 && m === 30) continue;
  const hh = ((h + 11) % 12) + 1;
  TIMES.push(`${hh}:${m ? "30" : "00"} ${h < 12 ? "am" : "pm"}`);
}

function today() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

/** No server: the details are sent to Fenyal as a WhatsApp message the guest reviews and sends. */
export function ReservationForm() {
  const [min, setMin] = React.useState<string | undefined>(undefined);
  const [sent, setSent] = React.useState(false);
  React.useEffect(() => setMin(today()), []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const lines = [
      "Hello Fenyal, I would like to reserve a table.",
      "",
      `Name: ${f.get("name")}`,
      `Phone: ${f.get("phone")}`,
      `Date: ${f.get("date")}`,
      `Time: ${f.get("time")}`,
      `Guests: ${f.get("guests")}`,
    ];
    const occasion = String(f.get("occasion") || "");
    const notes = String(f.get("notes") || "").trim();
    if (occasion) lines.push(`Occasion: ${occasion}`);
    if (notes) lines.push(`Notes: ${notes}`);
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener");
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="r-name" className="label">Full name</label>
        <input id="r-name" name="name" required autoComplete="name" className="field" placeholder="Your name" />
      </div>
      <div>
        <label htmlFor="r-phone" className="label">Phone</label>
        <input id="r-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" className="field" placeholder="+974" />
      </div>
      <div>
        <label htmlFor="r-guests" className="label">Guests</label>
        <select id="r-guests" name="guests" required defaultValue="2" className="field appearance-none">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}
          <option value="More than 10">More than 10</option>
        </select>
      </div>
      <div>
        <label htmlFor="r-date" className="label">Date</label>
        <input id="r-date" name="date" type="date" required min={min} className="field [color-scheme:dark]" />
      </div>
      <div>
        <label htmlFor="r-time" className="label">Time</label>
        <select id="r-time" name="time" required defaultValue="" className="field appearance-none">
          <option value="" disabled>Choose a time</option>
          {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="r-occasion" className="label">Occasion <span className="normal-case tracking-normal text-muted-foreground/70">(optional)</span></label>
        <select id="r-occasion" name="occasion" defaultValue="" className="field appearance-none">
          <option value="">None</option>
          <option>Birthday</option>
          <option>Anniversary</option>
          <option>Business meal</option>
          <option>Family gathering</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="r-notes" className="label">Notes <span className="normal-case tracking-normal text-muted-foreground/70">(optional)</span></label>
        <textarea id="r-notes" name="notes" rows={4} className="field h-auto py-3" placeholder="Allergies, high chair, seating preference…" />
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">Your request opens in WhatsApp for you to send. A booking is confirmed once our team replies.</p>
        <button type="submit" className="btn-gold shrink-0"><CalendarCheck className="size-4" aria-hidden="true" />Request booking</button>
      </div>
      {sent && <p role="status" className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold sm:col-span-2">WhatsApp opened with your request. Press send there and we will confirm shortly.</p>}
    </form>
  );
}
