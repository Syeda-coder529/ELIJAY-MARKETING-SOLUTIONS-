"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BuyerLead, Vertical } from "@/lib/types";

const EMPTY: BuyerLead = {
  companyName: "",
  contactPerson: "",
  companyEmail: "",
  companyPhone: "",
  contactId: "",
  offerName: "",
  offerDetails: "",
  vertical: "",
  geoStates: "",
  zipCodes: "",
  payoutRpc: "",
  capVolume: "",
  offerLinkIvr: "",
  notes: "",
};

export function BuyerForm() {
  const [form, setForm] = useState<BuyerLead>(EMPTY);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/verticals")
      .then((r) => r.json())
      .then((d) => setVerticals(d.verticals ?? []))
      .catch(() => setVerticals([]));
  }, []);

  function update<K extends keyof BuyerLead>(key: K, value: BuyerLead[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.vertical) {
      toast.error("Please select a vertical.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetName: "Buyers_Data", ...form }),
      });
      if (!res.ok) throw new Error();
      toast.success("Offer submitted — our team reviews every submission.");
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
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input id="contactPerson" required value={form.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="companyEmail">Company Email</Label>
          <Input id="companyEmail" type="email" required value={form.companyEmail} onChange={(e) => update("companyEmail", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="companyPhone">Company Phone</Label>
          <Input id="companyPhone" type="tel" required value={form.companyPhone} onChange={(e) => update("companyPhone", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contactId">Teams / WhatsApp ID</Label>
          <Input id="contactId" required value={form.contactId} onChange={(e) => update("contactId", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="offerName">Offer Name</Label>
          <Input id="offerName" required value={form.offerName} onChange={(e) => update("offerName", e.target.value)} />
        </div>
      </div>

      <div>
        <Label htmlFor="offerDetails">Offer Details</Label>
        <Textarea id="offerDetails" required rows={4} value={form.offerDetails} onChange={(e) => update("offerDetails", e.target.value)} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="vertical">Vertical</Label>
          <Select value={form.vertical} onValueChange={(v) => update("vertical", v)}>
            <SelectTrigger id="vertical">
              <SelectValue placeholder="Select a vertical" />
            </SelectTrigger>
            <SelectContent>
              {verticals.map((v) => (
                <SelectItem key={v.id} value={v.name}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="geoStates">Geo / States</Label>
          <Input id="geoStates" required placeholder="e.g. TX, FL, GA" value={form.geoStates} onChange={(e) => update("geoStates", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="zipCodes">Zip Codes</Label>
          <Input id="zipCodes" placeholder="Optional — comma separated" value={form.zipCodes} onChange={(e) => update("zipCodes", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="payoutRpc">Payout / RPC</Label>
          <Input id="payoutRpc" required value={form.payoutRpc} onChange={(e) => update("payoutRpc", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="capVolume">Cap / Volume</Label>
          <Input id="capVolume" required value={form.capVolume} onChange={(e) => update("capVolume", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="offerLinkIvr">Offer Link / IVR</Label>
          <Input id="offerLinkIvr" required value={form.offerLinkIvr} onChange={(e) => update("offerLinkIvr", e.target.value)} />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
      </div>

      <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Submit Offer
      </Button>
    </form>
  );
}
