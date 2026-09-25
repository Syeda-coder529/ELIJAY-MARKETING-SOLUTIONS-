"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StaggerGroup, StaggerItem } from "@/components/site/motion-wrap";
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

  const verticalNames = useMemo(() => {
    const fromOffers = Array.from(new Set(offers.map((o) => o.vertical)));
    const fromKv = verticals.map((v) => v.name);
    return Array.from(new Set([...fromKv, ...fromOffers]));
  }, [offers, verticals]);

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
        <StaggerGroup className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((offer) => (
            <StaggerItem key={offer.id}>
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
                  </div>

                  <Button asChild size="sm" className="mt-5 w-full">
                    <Link href={`/offers/${offer.id}`}>View &amp; Apply</Link>
                  </Button>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
