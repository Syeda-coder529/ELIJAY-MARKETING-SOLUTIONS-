import Link from "next/link";
import { ArrowRight, Clock, Eye, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FadeUp, StaggerGroup, StaggerItem } from "@/components/site/motion-wrap";
import { HeroSection } from "@/components/site/hero-section";
import { TiltCard } from "@/components/site/tilt-card";
import { GeoChips } from "@/components/site/geo-chips";
import { MagneticButton } from "@/components/site/magnetic-button";
import { CallExchange } from "@/components/site/call-exchange";
import { Waveform } from "@/components/site/waveform";
import { Counter } from "@/components/site/counter";
import { VerticalTicker } from "@/components/site/vertical-ticker";
import { getActiveOffers } from "@/lib/kv";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const BENEFITS = [
  {
    icon: Zap,
    title: "Dedicated Account Managers",
    description:
      "A direct line to a real strategist who knows your traffic, not a ticket queue.",
  },
  {
    icon: Eye,
    title: "Transparent Real-Time Tracking",
    description:
      "Live dashboards show every call's disposition, duration, and payout the moment it's logged.",
  },
  {
    icon: Clock,
    title: "Clear Payment Terms",
    description:
      "Every offer states its payment terms up front, so you always know what you're working to before you send a single call.",
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
      <HeroSection />

      {/* VERTICALS TICKER */}
      <VerticalTicker />

      {/* HOW A CALL MOVES — animated routing diagram */}
      <section className="relative border-b border-border py-24">
        <div className="container">
          <FadeUp className="max-w-xl">
            <Badge className="mb-4">How It Works</Badge>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Calls Bought, Calls Sold
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              Publishers sell inbound calls on one side, buyers purchase them on
              the other, and ELIJAY screens and matches in between. Calls that
              fail consent, duplicate, geo or duration checks never reach a
              buyer.
            </p>
          </FadeUp>

          <FadeUp className="mt-12">
            <Card className="overflow-hidden border-gold/20 bg-emerald/25 p-0">
              <CallExchange className="h-[420px] w-full md:h-[460px]" />
              <div className="flex flex-wrap gap-5 border-t border-border px-6 py-4 text-xs text-muted">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-teal" />
                  Inbound from publisher
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold" />
                  Matched &amp; sold to buyer
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-danger" />
                  Disqualified at screening
                </span>
              </div>
            </Card>
          </FadeUp>

          <FadeUp className="mt-12">
            <Card className="flex flex-col items-start justify-between gap-6 border-gold/20 bg-emerald/40 p-6 md:flex-row md:items-center">
              <div className="flex items-center gap-5">
                <Waveform />
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">
                    Live line, in progress
                  </p>
                  <p className="text-xs text-muted">
                    Calls are recorded and scored for quality on every campaign.
                  </p>
                </div>
              </div>
              <Badge variant="live">
                <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-emerald-teal" />
                Routing Active
              </Badge>
            </Card>
          </FadeUp>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="relative border-b border-border py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/3 h-[300px] w-[560px] -translate-x-1/2 rounded-full bg-emerald-blob opacity-20 blur-[130px]"
        />
        <div className="container relative">
          <FadeUp className="mx-auto max-w-xl text-center">
            <Badge className="mx-auto mb-4">By the Numbers</Badge>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              Built for Volume, Tuned for Quality
            </h2>
          </FadeUp>

          <StaggerGroup className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: 120, suffix: "s+", label: "Avg. billable duration" },
              { value: 94, suffix: "%", label: "Buyer acceptance rate" },
              { value: 40, suffix: "+", label: "Active buyer partners" },
              { value: 12, suffix: "", label: "Verticals in rotation" },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <p className="font-display text-4xl font-semibold text-gold-gradient md:text-5xl">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted">
                    {stat.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <FadeUp className="mt-10 text-center">
            <p className="text-[11px] leading-relaxed text-muted/60">
              Figures are representative of recent network performance and vary
              by vertical, geo and time of day. They are not a guarantee of
              results.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* LIVE OFFERS PREVIEW */}
      <section className="relative border-t border-border py-24">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <FadeUp className="max-w-xl">
              <Badge className="mb-4">Live Verticals &amp; Offers</Badge>
              <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
                Built for Serious Publishers
              </h2>
              <p className="mt-3 leading-relaxed text-muted">
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
                  <TiltCard className="h-full">
                    <Card className="group h-full border-border bg-emerald/40 transition-colors hover:border-gold">
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <Badge variant="accent">{offer.vertical}</Badge>
                          <Badge variant="live">
                            <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-emerald-teal" />
                            Live
                          </Badge>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {offer.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                          {offer.description}
                        </p>
                        <div className="mt-4">
                          <GeoChips geo={offer.geo} limit={6} />
                        </div>
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
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerGroup>
          ) : (
            <FadeUp className="mt-12">
              <Card className="p-10 text-center text-muted">
                New live offers are added regularly — check back soon or{" "}
                <Link href="/offers" className="text-gold underline">
                  browse all verticals
                </Link>
                .
              </Card>
            </FadeUp>
          )}
        </div>
      </section>

      {/* PUBLISHER BENEFITS */}
      <section className="relative border-t border-border py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-8%] top-1/4 h-[320px] w-[420px] rounded-full bg-emerald-blob opacity-20 blur-[120px]"
        />
        <div className="container relative">
          <FadeUp className="max-w-xl">
            <Badge className="mb-4">Publisher Benefits</Badge>
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              We Treat Your Traffic Like the Asset It Is
            </h2>
            <p className="mt-3 leading-relaxed text-muted">
              Routing logic, transparency, and payout speed to prove it.
            </p>
          </FadeUp>

          <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <StaggerItem key={benefit.title}>
                <TiltCard className="h-full">
                  <Card className="h-full border-border bg-emerald/40 transition-colors hover:border-gold">
                    <CardContent className="p-6">
                      <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
                        <benefit.icon className="h-4 w-4 text-gold" />
                      </span>
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {benefit.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </TiltCard>
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

      {/* COMPLIANCE */}
      <section className="relative border-t border-border py-24">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <FadeUp>
              <Badge className="mb-4">Compliance First</Badge>
              <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
                Clean Traffic Is the Whole Business
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Every publisher is vetted before a single call routes. Consent
                trails, source URLs, call recordings and scripts are reviewed up
                front — and audited again once volume scales.
              </p>
            </FadeUp>

            <StaggerGroup className="grid gap-4 sm:grid-cols-2">
              {[
                { t: "Consent Trail on File", d: "Source URL, script and opt-in language reviewed before approval." },
                { t: "Recorded & Scored", d: "Calls are recorded and quality-scored per campaign." },
                { t: "Duplicate Screening", d: "Repeat callers filtered before they ever reach a buyer." },
                { t: "Geo & Hour Enforcement", d: "Caps, states and calling windows enforced at the router." },
              ].map((item) => (
                <StaggerItem key={item.t}>
                  <Card className="h-full border-border bg-emerald/30 p-5">
                    <p className="font-display text-sm font-semibold text-gold">
                      {item.t}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {item.d}
                    </p>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      {/* BUYER CTA */}
      <section className="relative border-t border-border py-24">
        <div className="container">
          <FadeUp>
            <Card className="relative overflow-hidden border-gold/25 bg-emerald/50 p-10 text-center md:p-16">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-blob opacity-30 blur-[100px]"
              />
              <div className="relative">
                <Badge variant="gold" className="mx-auto mb-5">
                  For Buyers
                </Badge>
                <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
                  Have a Payout to Offer?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">
                  If you&apos;re buying calls in Medicare, Final Expense, Auto,
                  Home Services, or another vertical, tell us your payout and
                  targeting — our team reviews every submission and publishes
                  approved campaigns to the live network.
                </p>
                <div className="mt-8 flex justify-center">
                  <MagneticButton>
                    <Button asChild size="lg" shimmer>
                      <Link href="/for-buyers">
                        Submit an Offer <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </MagneticButton>
                </div>
              </div>
            </Card>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
