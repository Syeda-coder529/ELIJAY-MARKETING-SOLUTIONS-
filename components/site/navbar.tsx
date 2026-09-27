"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/site/magnetic-button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/offers", label: "Offers" },
  { href: "/apply-as-publisher", label: "Publishers" },
  { href: "/for-buyers", label: "For Buyers" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Glass header only once the page has moved — flat at the top, frosted after.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-gold/15 bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="ELIJAY Performance Partners">
          {/* Logo ships with its own black background, so it sits on the dark
              header without a plate. Proportions untouched. */}
          <Image
            src="/elijay-logo.png"
            alt="ELIJAY Performance Partners"
            width={1254}
            height={1254}
            priority
            className="h-12 w-12 rounded-md object-cover"
          />
          <span className="hidden leading-tight sm:block">
            <span className="block font-display text-sm font-semibold tracking-[0.18em] text-gold">
              ELIJAY
            </span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-emerald-teal">
              Performance Partners
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm font-medium text-muted transition-colors hover:text-foreground",
                pathname === link.href && "text-gold"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-1.5 left-0 h-px w-full bg-gold-gradient" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <MagneticButton>
            <Button asChild size="sm" shimmer>
              <Link href="/for-buyers">Get Vetted as a Buyer</Link>
            </Button>
          </MagneticButton>
        </div>

        <button
          className="text-foreground lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 px-6 pb-6 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-4 pt-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-sm font-medium text-muted transition-colors hover:text-foreground",
                  pathname === link.href && "text-gold"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild size="sm" className="mt-2 w-full">
              <Link href="/for-buyers">Get Vetted as a Buyer</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
