import { kv } from "@vercel/kv";
import type { Offer, Vertical } from "./types";

const OFFERS_KEY = "epp:offers";
const VERTICALS_KEY = "epp:verticals";

function genId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

// ---------- Verticals ----------

export async function getVerticals(): Promise<Vertical[]> {
  const data = await kv.get<Vertical[]>(VERTICALS_KEY);
  return data ?? [];
}

export async function addVertical(name: string): Promise<Vertical[]> {
  const verticals = await getVerticals();
  if (verticals.some((v) => v.name.toLowerCase() === name.toLowerCase())) {
    return verticals;
  }
  const next: Vertical[] = [
    ...verticals,
    { id: genId(), name, createdAt: new Date().toISOString() },
  ];
  await kv.set(VERTICALS_KEY, next);
  return next;
}

export async function deleteVertical(id: string): Promise<Vertical[]> {
  const verticals = await getVerticals();
  const next = verticals.filter((v) => v.id !== id);
  await kv.set(VERTICALS_KEY, next);
  return next;
}

// ---------- Offers ----------

export async function getOffers(): Promise<Offer[]> {
  const data = await kv.get<Offer[]>(OFFERS_KEY);
  return data ?? [];
}

export async function getActiveOffers(): Promise<Offer[]> {
  const offers = await getOffers();
  // DEBUG - Vercel logs me dikhega kitni offers hain
  console.log("KV DEBUG - Total:", offers.length, "Statuses:", offers.map(o => `${o.title}:${o.status}`));
  return offers.filter((o) => o.status?.toLowerCase().trim() === "active");
}

export async function getOfferById(id: string): Promise<Offer | undefined> {
  const offers = await getOffers();
  return offers.find((o) => o.id === id);
}

export async function addOffer(
  input: Omit<Offer, "id" | "createdAt">
): Promise<Offer[]> {
  const offers = await getOffers();
  const next: Offer[] = [
    ...offers,
    { 
      ...input, 
      status: input.status?.toLowerCase().trim() as any || "active",
      id: genId(), 
      createdAt: new Date().toISOString() 
    },
  ];
  await kv.set(OFFERS_KEY, next);
  return next;
}

export async function updateOffer(
  id: string,
  patch: Partial<Omit<Offer, "id" | "createdAt">>
): Promise<Offer[]> {
  const offers = await getOffers();
  const next = offers.map((o) => {
    if (o.id === id) {
      const updated = { ...o, ...patch };
      if (patch.status) {
        (updated as any).status = patch.status.toLowerCase().trim();
      }
      return updated;
    }
    return o;
  });
  await kv.set(OFFERS_KEY, next);
  return next;
}

export async function deleteOffer(id: string): Promise<Offer[]> {
  const offers = await getOffers();
  const next = offers.filter((o) => o.id !== id);
  await kv.set(OFFERS_KEY, next);
  return next;
}
