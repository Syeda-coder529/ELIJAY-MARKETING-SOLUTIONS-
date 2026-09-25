import Link from "next/link";
import { ArrowRight, Gauge, ShieldCheck, Clock, Wallet, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FadeUp, StaggerGroup, StaggerItem } from "@/components/site/motion-wrap";
import { getActiveOffers } from "@/lib/kv";

const STATS = [
  { icon: ShieldCheck, value: "100%", label: "TCPA Compliant Routing" },
  { icon: Gauge, value: "<1.8s", label: "Average Connect Time" },
  { icon: Radio, value: "24/7", label: "Real-Time Call Distribution" },
  { icon: Wallet, value: "Daily", label: "Instant Publisher Payouts" },
];

const BENEFITS = [
  {
    title: "Dedicated Account Managers",
    description:
      "A direct line to a real strategist who knows your traffic, not a ticket queue.",
  },
  {
    title: "Transparent Real-Time Tracking",
    description:
      "Live dashboards show every call's disposition, duration, and payout the moment it's logged.",
  },
  {
    title: "Fast, Reliable Payouts",
    description:
      "Publisher earnings post daily, not net-30, so you can scale traffic with confidence.",
  },
];

export default async function HomePage() {
  let offers: Awaited<ReturnType<typeof getActiveOffers>> = [];
  try {
    offers = (await getActiveOffers()).slice(0, 3);
  } catch {
    offers = [];
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="grid-fade absolute inset-0 opacity-60" />
        <div className="container relative py-24 md:py-32">
          <FadeUp>
            <Badge variant="accent" className="mb-6">
              <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-accent" />
              Real-Time Call Routing Network
            </Badge>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-foreground md:text-6xl">
              Precision-Matched Calls.{" "}
              <span className="text-gradient">Zero Wasted Spend.</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.16}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              Elijah Performance Partners routes qualified inbound calls from
              vetted publishers to premium buyers in real time — with
              compliance built into every hop and payouts that never wait on a
              billing cycle.
            </p>
          </FadeUp>
          <FadeUp delay={0.24}>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/for-buyers">
                  Get Vetted as a Buyer <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/offers">View Live Offers</Link>
              </Button>
            </div>
          </FadeUp>

          <StaggerGroup className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((stat) => (
              <StaggerItem key={stat.label}>
                <Card className="h-full">
                  <CardContent className="p-5">
                    <stat.icon className="mb-3 h-5 w-5 text-accent" />
                    <p className="font-display text-2xl font-semibold text-foreground">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-muted">{stat.label}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* LIVE OFFERS PREVIEW */}
      <section className="border-t border-border py-24">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <FadeUp className="max-w-xl">
              <Badge className="mb-4">Live Verticals &amp; Offers</Badge>
              <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
                Built for Serious Publishers
              </h2>
              <p className="mt-3 text-muted">
                A snapshot of what&apos;s buying right now. Payouts and
                geo-targeting update as buyer demand shifts.
              </p>
            </FadeUp>
            <Button asChild variant="outline">
              <Link href="/offers">
                View All Offers <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {offers.length > 0 ? (
            <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
              {offers.map((offer) => (
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
                      <p className="mt-2 text-sm text-muted line-clamp-2">
                        {offer.description}
                      </p>
                      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                        <span className="text-muted">Payout</span>
                        <span className="font-display font-semibold text-gold">
                          {offer.payout}
                        </span>
                      </div>
                      <Button asChild size="sm" variant="subtle" className="mt-4 w-full">
                        <Link href={`/offers/${offer.id}`}>View Offer</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerGroup>
          ) : (
            <FadeUp className="mt-12">
              <Card className="p-10 text-center text-muted">
                New live offers are added regularly — check back soon or{" "}
                <Link href="/offers" className="text-accent underline">
                  browse all verticals
                </Link>
                .
              </Card>
            </FadeUp>
          )}
        </div>
      </section>

      {/* PUBLISHER BENEFITS */}
      <section className="border-t border-border bg-surface/40 py-24">
        <div className="container">
          <FadeUp className="max-w-xl">
            <Badge className="mb-4">Publisher Benefits</Badge>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              We Treat Your Traffic Like the Asset It Is
            </h2>
            <p className="mt-3 text-muted">
              Routing logic, transparency, and payout speed to prove it.
            </p>
          </FadeUp>

          <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <StaggerItem key={benefit.title}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <Clock className="mb-4 h-5 w-5 text-accent" />
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <FadeUp className="mt-10">
            <Button asChild variant="outline">
              <Link href="/apply-as-publisher">
                Apply as a Publisher <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </FadeUp>
        </div>
      </section>

      {/* BUYER CTA */}
      <section className="border-t border-border py-24">
        <div className="container">
          <FadeUp>
            <Card className="overflow-hidden bg-hero-gradient p-10 text-center md:p-16">
              <Badge variant="gold" className="mx-auto mb-5">
                For Buyers
              </Badge>
              <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
                Have a Payout to Offer?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted">
                If you&apos;re buying calls in Medicare, Final Expense, Auto,
                Home Services, or another vertical, tell us your payout and
                targeting — our team reviews every submission and publishes
                approved campaigns to the live network.
              </p>
              <Button asChild size="lg" className="mt-8">
                <Link href="/for-buyers">
                  Submit an Offer <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Card>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
