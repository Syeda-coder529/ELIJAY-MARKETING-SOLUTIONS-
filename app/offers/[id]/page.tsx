import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FadeUp } from "@/components/site/motion-wrap";
import { OfferApplyForm } from "@/components/forms/offer-apply-form";
import { getOfferById } from "@/lib/kv";

export const dynamic = "force-dynamic";

export default async function OfferDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let offer;
  try {
    offer = await getOfferById(params.id);
  } catch {
    offer = undefined;
  }

  if (!offer || offer.status !== "active") {
    notFound();
  }

  return (
    <div className="bg-hero-gradient">
      <div className="container grid gap-10 py-20 lg:grid-cols-[1fr_1.2fr]">
        <FadeUp>
          <Badge variant="accent" className="mb-4">
            {offer.vertical}
          </Badge>
          <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
            {offer.title}
          </h1>
          <p className="mt-4 leading-relaxed text-muted">{offer.description}</p>

          <Card className="mt-8">
            <CardContent className="grid grid-cols-2 gap-6 p-6 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Payout</p>
                <p className="mt-1 font-display text-lg font-semibold text-gold">
                  {offer.payout}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Geo</p>
                <p className="mt-1 font-medium text-foreground">{offer.geo}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Cap</p>
                <p className="mt-1 font-medium text-foreground">{offer.cap}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Schedule</p>
                <p className="mt-1 font-medium text-foreground">{offer.schedule}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-wide text-muted">Allowed Traffic</p>
                <p className="mt-1 font-medium text-foreground">{offer.allowedTraffic}</p>
              </div>
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.1}>
          <Card>
            <CardContent className="p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Apply for This Offer
              </h2>
              <p className="mt-1 mb-6 text-sm text-muted">
                Tell us about your traffic — our team reviews every application.
              </p>
              <OfferApplyForm offerId={offer.id} offerTitle={offer.title} />
            </CardContent>
          </Card>
        </FadeUp>
      </div>
    </div>
  );
}
