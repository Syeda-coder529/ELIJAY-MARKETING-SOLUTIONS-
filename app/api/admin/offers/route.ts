import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { addOffer, getOffers } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const offers = await getOffers();
  return NextResponse.json({ offers });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();

  const required = [
    "title",
    "vertical",
    "payout",
    "geo",
    "cap",
    "schedule",
    "description",
    "allowedTraffic",
    "status",
  ];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `Missing field: ${field}` },
        { status: 400 }
      );
    }
  }

  const offers = await addOffer(body);
  return NextResponse.json({ offers });
}
