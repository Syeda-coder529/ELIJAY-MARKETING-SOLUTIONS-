"use client";

import Link from "next/link";
import { ArrowRight, Gauge, ShieldCheck, Radio, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MagneticButton } from "@/components/site/magnetic-button";
import { Typewriter } from "@/components/site/typewriter";

const STATS = [
  { icon: ShieldCheck, value: "100%", label: "TCPA Compliant Routing" },
  { icon: Gauge, value: "<1.8s", label: "Average Connect Time" },
  { icon: Radio, value: "24/7", label: "Real-Time Call Distribution" },
  { icon: Wallet, value: "Stated", label: "Payment Terms on Every Offer" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* depth stack: grid < emerald blob < 3D orbs < content */}
      <div className="grid-fade layer-bg absolute inset-0" />

      {/* single soft emerald glow behind the headline — kept fully inside the
          section bounds so its edge can never clip into a visible band */}
      <div
        aria-hidden="true"
        className="layer-blob pointer-events-none absolute left-1/2 top-[8%] h-[300px] w-[95vw] max-w-[720px] -translate-x-1/2 animate-drift rounded-full bg-emerald-blob opacity-30 blur-[100px] md:h-[420px]"
      />

      <div className="container relative z-10 py-16 md:py-32">
        <div>
          <Badge variant="accent" className="mb-6">
            <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-emerald-teal" />
            Real-Time Call Routing Network
          </Badge>
        </div>

        <h1
          className="max-w-3xl font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-6xl"
        >
          Precision-Matched Calls.{" "}
          <span className="text-gold-gradient">Zero Wasted Spend.</span>
        </h1>

        <p className="mt-5 font-display text-sm tracking-wide text-gold sm:text-base md:text-lg">
          <Typewriter text="Built on partnership, driven by performance." />
        </p>

        <p
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg"
        >
          ELIJAY Performance Partners routes qualified inbound calls from vetted
          publishers to premium buyers in real time — with compliance built into
          every hop and payment terms stated clearly on every offer.
        </p>

        <div
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
        >
          <MagneticButton>
            <Button asChild size="lg" shimmer>
              <Link href="/for-buyers">
                Get Vetted as a Buyer <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </MagneticButton>
          <Button asChild size="lg" variant="outline">
            <Link href="/offers">View Live Offers</Link>
          </Button>
        </div>

        <div
          className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:mt-20 md:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label}>
              <Card className="h-full">
                <CardContent className="p-5">
                  <stat.icon className="mb-3 h-5 w-5 text-gold" />
                  <p className="font-display text-2xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted">{stat.label}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
