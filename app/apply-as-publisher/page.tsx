import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FadeUp } from "@/components/site/motion-wrap";
import { PublisherForm } from "@/components/forms/publisher-form";

export default function ApplyAsPublisherPage() {
  return (
    <div className="bg-hero-gradient">
      <div className="container grid gap-12 py-20 lg:grid-cols-[1fr_1.3fr]">
        <FadeUp>
          <Badge className="mb-4">Publisher Benefits</Badge>
          <h1 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
            Apply as a Publisher
          </h1>
          <p className="mt-4 leading-relaxed text-muted">
            Join a network built for serious publishers — dedicated account
            managers, transparent real-time tracking, and payment terms stated
            clearly on every offer.
          </p>
          <ul className="mt-8 space-y-4 text-sm text-muted">
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-teal" />
              Dedicated account managers who know your traffic
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-teal" />
              Live dashboards for every call&apos;s disposition and payout
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-teal" />
              Payment terms stated on every offer
            </li>
          </ul>
        </FadeUp>

        <FadeUp delay={0.1}>
          <Card>
            <CardContent className="p-6 md:p-8">
              <PublisherForm />
            </CardContent>
          </Card>
        </FadeUp>
      </div>
    </div>
  );
}
