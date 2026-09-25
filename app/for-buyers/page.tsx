import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FadeUp } from "@/components/site/motion-wrap";
import { BuyerForm } from "@/components/forms/buyer-form";

export default function ForBuyersPage() {
  return (
    <div className="bg-hero-gradient">
      <div className="container grid gap-12 py-20 lg:grid-cols-[1fr_1.3fr]">
        <FadeUp>
          <Badge variant="gold" className="mb-4">For Buyers</Badge>
          <h1 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
            Have a Payout to Offer?
          </h1>
          <p className="mt-4 leading-relaxed text-muted">
            If you&apos;re buying calls in Medicare, Final Expense, Auto, Home
            Services, or another vertical, tell us your payout and targeting.
            Our team reviews every submission and publishes approved campaigns
            to the live network within hours, not weeks.
          </p>
          <ul className="mt-8 space-y-4 text-sm text-muted">
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              Real-time routing to vetted, compliant publishers
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              Full control over geo, cap, and schedule
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              A direct line to our team, not a support queue
            </li>
          </ul>
        </FadeUp>

        <FadeUp delay={0.1}>
          <Card>
            <CardContent className="p-6 md:p-8">
              <BuyerForm />
            </CardContent>
          </Card>
        </FadeUp>
      </div>
    </div>
  );
}
