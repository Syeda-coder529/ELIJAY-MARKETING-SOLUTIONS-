"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { GeoChips } from "@/components/site/geo-chips";
import { cn } from "@/lib/utils";
import type { Offer, Vertical } from "@/lib/types";

export function OffersGrid({
  offers,
  verticals,
}: {
  offers: Offer[];
  verticals: Vertical[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(
    () => (active ? offers.filter((o) => o.vertical === active) : offers),
    [offers, active]
  );

  // Filter chips reflect only what currently exists in the Verticals KV list.
  // An offer that still references a deleted vertical stays visible under
  // "All Verticals," but its vertical no longer gets its own filter button.
  const verticalNames = useMemo(
    () => verticals.map((v) => v.name),
    [verticals]
  );

  // If the currently selected filter's vertical gets deleted (e.g. an admin
  // removes it while this page is open), fall back to "All Verticals"
  // instead of silently filtering by a vertical that no longer exists.
  useEffect(() => {
    if (active && !verticalNames.includes(active)) {
      setActive(null);
    }
  }, [active, verticalNames]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActive(null)}
          className={cn(
            "rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors",
            active === null && "border-accent bg-accent/10 text-accent"
          )}
        >
          All Verticals
        </button>
        {verticalNames.map((name) => (
          <button
            key={name}
            onClick={() => setActive(name)}
            className={cn(
              "rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors",
              active === name && "border-accent bg-accent/10 text-accent"
            )}
          >
            {name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-10 p-10 text-center text-muted">
          No live offers in this vertical right now — check back soon.
        </Card>
      ) : (
        <motion.div
          key={active ?? "all"}
          className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {filtered.map((offer) => (
            <motion.div
              key={offer.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <Card className="flex h-full flex-col transition-transform hover:-translate-y-1 hover:shadow-glow">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <Badge variant="accent">{offer.vertical}</Badge>
                    <Badge variant="live">
                      <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-success" />
                      Live
                    </Badge>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {offer.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">
                    {offer.description}
                  </p>

                  {/* Meta rows.
                      `items-start` + a shrink-proof label + a right-aligned,
                      min-w-0 value keeps long values (a 17-state geo list)
                      from colliding with their label. */}
                  <dl className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="shrink-0 text-muted">Payout</dt>
                      <dd className="min-w-0 text-right font-display font-semibold text-gold">
                        {offer.payout}
                      </dd>
                    </div>
                    <div className="pt-1">
                      <dt className="mb-1.5 text-muted">Geo</dt>
                      <dd>
                        <GeoChips geo={offer.geo} limit={8} />
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="shrink-0 text-muted">Cap</dt>
                      <dd className="min-w-0 text-right text-foreground">{offer.cap}</dd>
                    </div>
                    {offer.breakHours && (
                      <div className="flex items-start justify-between gap-4">
                        <dt className="shrink-0 text-muted">Break</dt>
                        <dd className="min-w-0 text-right text-foreground">
                          {offer.breakHours}
                        </dd>
                      </div>
                    )}
                    {offer.paymentTerms && (
                      <div className="flex items-start justify-between gap-4">
                        <dt className="shrink-0 text-muted">Terms</dt>
                        <dd className="min-w-0 text-right text-foreground">
                          {offer.paymentTerms}
                        </dd>
                      </div>
                    )}
                  </dl>
