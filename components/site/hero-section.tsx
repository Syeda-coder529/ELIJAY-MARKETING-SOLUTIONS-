"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gauge, ShieldCheck, Radio, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Hero3D } from "@/components/site/hero-3d";
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
        className="layer-blob pointer-events-none absolute left-1/2 top-[8%] h-[420px] w-[720px] -translate-x-1/2 animate-drift rounded-full bg-emerald-blob opacity-30 blur-[130px]"
      />

      <Hero3D className="pointer-events-none absolute right-0 top-[-14%] h-[105%] w-full opacity-40 md:right-[-6%] md:top-[-22%] md:h-[115%] md:w-[56%] md:opacity-80" />

      <div className="container relative z-10 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Badge variant="accent" className="mb-6">
            <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-emerald-teal" />
            Real-Time Call Routing Network
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
          className="max-w-3xl font-display text-4xl font-semibold leading-tight text-foreground md:text-6xl"
        >
          Precision-Matched Calls.{" "}
          <span className="text-gold-gradient">Zero Wasted Spend.</span>
        </motion.h1>

        <p className="mt-5 font-display text-base tracking-wide text-gold md:text-lg">
          <Typewriter text="Built on partnership, driven by performance." />
        </p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg"
        >
          ELIJAY Performance Partners routes qualified inbound calls from vetted
          publishers to premium buyers in real time — with compliance built into
          every hop and payment terms stated clearly on every offer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.32, ease: "easeOut" }}
          className="mt-9 flex flex-wrap items-center gap-4"
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
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.08, delayChildren: 0.4 }}
          className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Card className="h-full">
                <CardContent className="p-5">
                  <stat.icon className="mb-3 h-5 w-5 text-gold" />
                  <p className="font-display text-2xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
