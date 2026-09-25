import { kv } from "@vercel/kv";
import { unstable_noStore as noStore } from "next/cache";
import type { Offer, OfferStatus, Vertical } from "./types";

// ---------------------------------------------------------------------------
// STORAGE MODEL
//
// Both keys are Redis HASHES (field = record id, value = the record), not a
// single JSON array.
//
// Why this matters: the previous version stored one JSON array per key and
// every write was a read-modify-write (`getOffers()` -> spread -> `kv.set()`).
// That pattern loses data. If the read returns a stale or empty snapshot for
// ANY reason -- a cached fetch, a cold KV response, two admin tabs open, a
// double-submit -- the subsequent `set` writes that stale snapshot back and
// silently erases every offer added since. That is the "only the first offer
// shows" symptom: the array in KV genuinely regressed.
//
// With a hash, adding an offer is a single HSET of one field. It physically
// cannot touch the other offers, no matter how stale the reader was.
//
// Existing data written in the old array format is migrated automatically on
// first access (see `ensureHash`), so nothing is lost on deploy.
// ---------------------------------------------------------------------------

const OFFERS_KEY = "epp:offers";
const VERTICALS_KEY = "epp:verticals";

function genId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Upstash can hand back either a parsed object or a raw JSON string depending
 * on how the value was written. Normalise both.
 */
function coerce<T>(value: unknown): T | null {
  if (value == null) return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }
  return value as T;
}

/**
 * One-time migration: if `key` still holds the old JSON-array string, convert
 * it into a hash keyed by record id. Safe to call on every request -- once the
 * key is a hash this is a single cheap TYPE command.
 */
async function ensureHash(key: string): Promise<void> {
  const type = await kv.type(key);
  if (type !== "string") return; // already a hash, or doesn't exist yet

  const legacy = coerce<Array<{ id?: string }>>(await kv.get(key));
  await kv.del(key);

  if (Array.isArray(legacy) && legacy.length > 0) {
    const entries: Record<string, unknown> = {};
    for (const record of legacy) {
      const id = record?.id ?? genId();
      entries[id] = { ...record, id };
    }
    await kv.hset(key, entries);
  }
}

async function readAll<T>(key: string): Promise<T[]> {
  noStore(); // never let Next's Data Cache serve a stale snapshot
  await ensureHash(key);
  const map = await kv.hgetall<Record<string, unknown>>(key);
  if (!map) return [];
  return Object.values(map)
    .map((v) => coerce<T>(v))
    .filter((v): v is T => v !== null);
}

function byCreatedAt<T extends { createdAt?: string }>(a: T, b: T) {
  return (a.createdAt ?? "").localeCompare(b.createdAt ?? "");
}

// ---------- Verticals ----------

export async function getVerticals(): Promise<Vertical[]> {
  const verticals = await readAll<Vertical>(VERTICALS_KEY);
  return verticals.sort(byCreatedAt);
}

export async function addVertical(name: string): Promise<Vertical[]> {
  const verticals = await getVerticals();
  if (verticals.some((v) => v.name.trim().toLowerCase() === name.trim().toLowerCase())) {
    return verticals;
  }
  const vertical: Vertical = {
    id: genId(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };
  await kv.hset(VERTICALS_KEY, { [vertical.id]: vertical });
  return getVerticals();
}

export async function deleteVertical(id: string): Promise<Vertical[]> {
  await ensureHash(VERTICALS_KEY);
  await kv.hdel(VERTICALS_KEY, id);
  return getVerticals();
}

// ---------- Offers ----------

export async function getOffers(): Promise<Offer[]> {
  const offers = await readAll<Offer>(OFFERS_KEY);
  return offers.sort(byCreatedAt);
}

export async function getActiveOffers(): Promise<Offer[]> {
  const offers = await getOffers();
  // Normalise before comparing: an offer saved with "Active" / " active "
  // should never be silently hidden from the public feed.
  return offers.filter(
    (o) => String(o.status ?? "").trim().toLowerCase() === "active"
  );
}

export async function getOfferById(id: string): Promise<Offer | undefined> {
  noStore();
  await ensureHash(OFFERS_KEY);
  const raw = await kv.hget(OFFERS_KEY, id);
  return coerce<Offer>(raw) ?? undefined;
}

export async function addOffer(
  input: Omit<Offer, "id" | "createdAt">
): Promise<Offer[]> {
  await ensureHash(OFFERS_KEY);
  const offer: Offer = {
    ...input,
    status: (String(input.status ?? "active").trim().toLowerCase() === "paused"
      ? "paused"
      : "active") as OfferStatus,
    paymentTerms: input.paymentTerms ?? "",
    id: genId(),
    createdAt: new Date().toISOString(),
  };
  // Single-field write: cannot clobber any other offer.
  await kv.hset(OFFERS_KEY, { [offer.id]: offer });
  return getOffers();
}

export async function updateOffer(
  id: string,
  patch: Partial<Omit<Offer, "id" | "createdAt">>
): Promise<Offer[]> {
  await ensureHash(OFFERS_KEY);
  const existing = await getOfferById(id);
  if (!existing) return getOffers();

  const next: Offer = { ...existing, ...patch, id, createdAt: existing.createdAt };
  if (patch.status !== undefined) {
    next.status = (String(patch.status).trim().toLowerCase() === "paused"
      ? "paused"
      : "active") as OfferStatus;
  }
  await kv.hset(OFFERS_KEY, { [id]: next });
  return getOffers();
}

export async function deleteOffer(id: string): Promise<Offer[]> {
  await ensureHash(OFFERS_KEY);
  await kv.hdel(OFFERS_KEY, id);
  return getOffers();
}
