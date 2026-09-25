"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ContactPref, PublisherLead, Vertical } from "@/lib/types";

const EMPTY: PublisherLead = {
  companyName: "",
  companyEmail: "",
  companyPhone: "",
  linkedinUrl: "",
  contactPref: "WhatsApp",
  contactId: "",
  verticalsInterested: [],
  trafficDescription: "",
};

export function PublisherForm() {
  const [form, setForm] = useState<PublisherLead>(EMPTY);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/verticals")
      .then((r) => r.json())
      .then((d) => setVerticals(d.verticals ?? []))
      .catch(() => setVerticals([]));
  }, []);

  function update<K extends keyof PublisherLead>(key: K, value: PublisherLead[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleVertical(name: string) {
    setForm((f) => {
      const has = f.verticalsInterested.includes(name);
      return {
        ...f,
        verticalsInterested: has
          ? f.verticalsInterested.filter((v) => v !== name)
          : [...f.verticalsInterested, name],
      };
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.verticalsInterested.length === 0) {
      toast.error("Select at least one vertical you're interested in.");
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
          verticalsInterested: form.verticalsInterested.join(", "),
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
          <Label>Contact Preference</Label>
          <RadioGroup
            value={form.contactPref}
            onValueChange={(v) => update("contactPref", v as ContactPref)}
          >
            <RadioGroupItem value="Teams" id="pub-teams" label="Teams" />
            <RadioGroupItem value="WhatsApp" id="pub-whatsapp" label="WhatsApp" />
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="contactId">Contact ID</Label>
          <Input id="contactId" required placeholder="Teams email or WhatsApp number" value={form.contactId} onChange={(e) => update("contactId", e.target.value)} />
        </div>
      </div>

      <div>
        <Label>Verticals Interested</Label>
        {verticals.length === 0 ? (
          <p className="text-sm text-muted">No verticals configured yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {verticals.map((v) => (
              <label
                key={v.id}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground"
              >
                <Checkbox
                  checked={form.verticalsInterested.includes(v.name)}
                  onCheckedChange={() => toggleVertical(v.name)}
                />
                {v.name}
              </label>
            ))}
          </div>
        )}
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
