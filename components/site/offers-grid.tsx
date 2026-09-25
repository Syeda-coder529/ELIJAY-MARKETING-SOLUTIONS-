"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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
              <Card className="h-full transition-transform hover:-translate-y-1 hover:shadow-glow">
                <CardContent className="p-6">
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

                  <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted">Payout</span>
                      <span className="font-display font-semibold text-gold">{offer.payout}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted">Geo</span>
                      <span className="text-foreground">{offer.geo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted">Cap</span>
                      <span className="text-foreground">{offer.cap}</span>
                    </div>
                    {offer.paymentTerms && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted">Terms</span>
                        <span className="text-foreground">{offer.paymentTerms}</span>
                      </div>
                    )}
                  </div>

                  <Button asChild size="sm" className="mt-5 w-full">
                    <Link href={`/offers/${offer.id}`}>View &amp; Apply</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
