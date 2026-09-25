"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ContactPref, OfferApplicationLead } from "@/lib/types";

export function OfferApplyForm({
  offerId,
  offerTitle,
}: {
  offerId: string;
  offerTitle: string;
}) {
  const EMPTY: OfferApplicationLead = {
    offerId,
    offerTitle,
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    dailyVolume: "",
    rpc: "",
    dataSampleLink: "",
    callRecordingLink: "",
    sourceUrlLink: "",
    scriptLink: "",
    contactPref: "WhatsApp",
    contactId: "",
    linkedinUrl: "",
  };

  const [form, setForm] = useState<OfferApplicationLead>(EMPTY);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof OfferApplicationLead>(
    key: K,
    value: OfferApplicationLead[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetName: "Offer_Applications", ...form }),
      });
      if (!res.ok) throw new Error();
      toast.success("Application sent — our team will follow up shortly.");
      setForm(EMPTY);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" required value={form.companyName} onChange={(e) => update("companyName", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="companyEmail">Company Email</Label>
          <Input id="companyEmail" type="email" required value={form.companyEmail} onChange={(e) => update("companyEmail", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="companyPhone">Company Phone</Label>
          <Input id="companyPhone" type="tel" required value={form.companyPhone} onChange={(e) => update("companyPhone", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input id="linkedinUrl" type="url" required value={form.linkedinUrl} onChange={(e) => update("linkedinUrl", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="dailyVolume">Daily Volume</Label>
          <Input id="dailyVolume" required placeholder="e.g. 150 calls/day" value={form.dailyVolume} onChange={(e) => update("dailyVolume", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="rpc">RPC</Label>
          <Input id="rpc" required placeholder="Revenue per call" value={form.rpc} onChange={(e) => update("rpc", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="dataSampleLink">Data Sample (Drive Link)</Label>
          <Input id="dataSampleLink" type="url" required value={form.dataSampleLink} onChange={(e) => update("dataSampleLink", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="callRecordingLink">Call Recording (Drive Link)</Label>
          <Input id="callRecordingLink" type="url" required value={form.callRecordingLink} onChange={(e) => update("callRecordingLink", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="sourceUrlLink">Source URL (Drive Link)</Label>
          <Input id="sourceUrlLink" type="url" required value={form.sourceUrlLink} onChange={(e) => update("sourceUrlLink", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="scriptLink">Script (Drive Link)</Label>
          <Input id="scriptLink" type="url" required value={form.scriptLink} onChange={(e) => update("scriptLink", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label>Contact Preference</Label>
          <RadioGroup value={form.contactPref} onValueChange={(v) => update("contactPref", v as ContactPref)}>
            <RadioGroupItem value="Teams" id="offer-teams" label="Teams" />
            <RadioGroupItem value="WhatsApp" id="offer-whatsapp" label="WhatsApp" />
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="contactId">Contact ID</Label>
          <Input id="contactId" required placeholder="Teams email or WhatsApp number" value={form.contactId} onChange={(e) => update("contactId", e.target.value)} />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={loading} className="w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Apply for This Offer
      </Button>
    </form>
  );
}
