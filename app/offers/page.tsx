import { Badge } from "@/components/ui/badge";
import { FadeUp } from "@/components/site/motion-wrap";
import { OffersGrid } from "@/components/site/offers-grid";
import { getActiveOffers, getVerticals } from "@/lib/kv";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function OffersPage() {
  let offers: Awaited<ReturnType<typeof getActiveOffers>> = [];
  let verticals: Awaited<ReturnType<typeof getVerticals>> = [];
  try {
    [offers, verticals] = await Promise.all([getActiveOffers(), getVerticals()]);
  } catch {
    offers = [];
    verticals = [];
  }

  return (
    <div className="bg-hero-gradient">
      <div className="container py-20">
        <FadeUp className="max-w-2xl">
          <Badge variant="accent" className="mb-4">
            <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-accent" />
            Live Network Feed
          </Badge>
          <h1 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
            Live Verticals &amp; Offers
          </h1>
          <p className="mt-4 text-muted">
            Every campaign below is active right now. Payouts, geo-targeting,
            and caps update as buyer demand shifts — apply directly to the
            offers that match your traffic.
          </p>
        </FadeUp>

        <div className="mt-12">
          <OffersGrid offers={offers} verticals={verticals} />
        </div>
      </div>
    </div>
  );
}
