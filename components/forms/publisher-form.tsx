"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CONTACT_PREFS, type ContactPref, type PublisherLead } from "@/lib/types";

const EMPTY: PublisherLead = {
  companyName: "",
  companyEmail: "",
  companyPhone: "",
  linkedinUrl: "",
  contactPref: "Telegram",
  contactId: "",
  verticalsInterested: "",
  trafficDescription: "",
};

export function PublisherForm() {
  const [form, setForm] = useState<PublisherLead>(EMPTY);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof PublisherLead>(key: K, value: PublisherLead[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.verticalsInterested.trim()) {
      toast.error("Tell us which verticals you're interested in.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sheetName: "Publishers_Data",
          ...form,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Application submitted — our team will review shortly.");
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
          <Label htmlFor="contactPref">Contact Preference</Label>
          <Select
            value={form.contactPref}
            onValueChange={(v) => update("contactPref", v as ContactPref)}
          >
            <SelectTrigger id="contactPref">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {CONTACT_PREFS.map((pref) => (
                <SelectItem key={pref} value={pref}>
                  {pref}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="contactId">Contact ID</Label>
          <Input id="contactId" required placeholder="Telegram @handle, WhatsApp number or Teams email" value={form.contactId} onChange={(e) => update("contactId", e.target.value)} />
        </div>
      </div>

      <div>
        <Label htmlFor="verticalsInterested">Verticals Interested</Label>
        <Input
          id="verticalsInterested"
          required
          placeholder="e.g. Medicare, ACA, Final Expense"
          value={form.verticalsInterested}
          onChange={(e) => update("verticalsInterested", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="trafficDescription">Traffic Description</Label>
        <Textarea
          id="trafficDescription"
          required
          rows={4}
          placeholder="Source of traffic, volume, geo, and quality notes"
          value={form.trafficDescription}
          onChange={(e) => update("trafficDescription", e.target.value)}
        />
      </div>

      <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Submit Application
      </Button>
    </form>
  );
}
