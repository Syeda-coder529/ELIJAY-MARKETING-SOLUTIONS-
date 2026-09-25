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
