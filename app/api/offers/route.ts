import { NextResponse } from "next/server";
import { getActiveOffers } from "@/lib/kv";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const offers = await getActiveOffers();
    return NextResponse.json({ offers });
  } catch (err) {
    console.error("Failed to load offers:", err);
    return NextResponse.json({ offers: [] }, { status: 200 });
  }
}
