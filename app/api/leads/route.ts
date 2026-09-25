import { NextRequest, NextResponse } from "next/server";
import { sendToSheet, type SheetTab } from "@/lib/sheet";

const VALID_TABS: SheetTab[] = [
  "Offer_Applications",
  "Publishers_Data",
  "Buyers_Data",
  "Contact_Queries",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sheetName, ...formData } = body ?? {};

    if (!VALID_TABS.includes(sheetName)) {
      return NextResponse.json(
        { error: "Invalid or missing sheetName." },
        { status: 400 }
      );
    }

    await sendToSheet(sheetName, formData);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Lead submission failed:", err);
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }
}
