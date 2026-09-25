import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient">
              <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
            </span>
            <p className="font-display text-sm font-semibold text-foreground">
              Elijah Performance Partners
            </p>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            A performance marketing network specializing in compliant, real-time
            pay-per-call and live transfer routing between vetted publishers and
            buyers.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
            Company
          </p>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="text-muted hover:text-foreground">Home</Link></li>
            <li><Link href="/offers" className="text-muted hover:text-foreground">Live Offers</Link></li>
            <li><Link href="/contact" className="text-muted hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
            Verticals
          </p>
          <ul className="space-y-3 text-sm">
            <li className="text-muted">Medicare</li>
            <li className="text-muted">Final Expense</li>
            <li className="text-muted">ACA</li>
            <li className="text-muted">Home Warranty</li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
            Partners
          </p>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/apply-as-publisher" className="text-muted hover:text-foreground">
                Become a Publisher
              </Link>
            </li>
            <li>
              <Link href="/for-buyers" className="text-muted hover:text-foreground">
                Submit a Buyer Offer
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <div className="container flex flex-col gap-2 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Elijah Performance Partners. All rights reserved.</p>
          <p>TCPA-Aligned Network Partner</p>
        </div>
        <div className="container mt-4 text-[11px] leading-relaxed text-muted/70">
          Elijah Performance Partners operates as a call aggregation and routing
          network. All publishers and buyers are independently responsible for
          compliance with applicable federal and state telemarketing, TCPA, and
          licensing regulations within their respective verticals. Payout figures
          shown are representative and subject to change based on live buyer
          demand, geo-targeting, and call quality scoring. This site does not
          constitute a guarantee of call volume, payout, or campaign availability.
        </div>
      </div>
    </footer>
  );
}
