import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative border-t border-gold/15 bg-background">
      <div className="container grid gap-10 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/elijay-logo.png"
              alt="ELIJAY Performance Partners"
              width={1254}
              height={1254}
              className="h-14 w-14 rounded-md object-cover"
            />
            <span className="leading-tight">
              <span className="block font-display text-base font-semibold tracking-[0.18em] text-gold">
                ELIJAY
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-emerald-teal">
                Performance Partners
              </span>
            </span>
          </Link>
          <p className="mt-5 font-display text-sm italic text-foreground/80">
            Built on partnership, driven by performance.
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            A performance marketing network specializing in compliant, real-time
            pay-per-call and live transfer routing between vetted publishers and
            buyers.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
            Company
          </p>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="text-muted hover:text-foreground">Home</Link></li>
            <li><Link href="/offers" className="text-muted hover:text-foreground">Live Offers</Link></li>
            <li><Link href="/contact" className="text-muted hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
            Verticals
          </p>
          <ul className="space-y-3 text-sm text-muted">
            <li>Medicare</li>
            <li>Final Expense</li>
            <li>ACA</li>
            <li>Home Warranty</li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">
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
          <p>© {new Date().getFullYear()} ELIJAY Performance Partners. All rights reserved.</p>
          <p className="text-emerald-teal">TCPA-Aligned Network Partner</p>
        </div>
        <div className="container mt-4 text-[11px] leading-relaxed text-muted/70">
          ELIJAY Performance Partners operates as a call aggregation and routing
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
