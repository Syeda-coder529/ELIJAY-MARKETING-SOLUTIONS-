import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Toaster } from "sonner";
import { Hero3D } from "@/components/site/hero-3d";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ELIJAY Performance Partners | Pay-Per-Call & Live Transfer Network",
  description:
    "Built on partnership, driven by performance. ELIJAY Performance Partners connects premium publishers with vetted buyers through real-time pay-per-call and live transfer routing.",
  icons: { icon: "/elijay-logo.png" },
};

// Without this the page can render at desktop width on a phone and appear
// zoomed out, which makes every section look broken rather than just some.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {/* Globe sits behind the page content but ABOVE the body background.
            z-0 (not -z-10): a negative z-index would put it behind body's own
            background colour and it would never be seen.
            inset-0 already sizes it — w-screen is 100vw, which is wider than
            the viewport whenever a scrollbar exists and forces sideways scroll. */}
        <Hero3D className="pointer-events-none fixed inset-0 z-0 opacity-25 md:opacity-40" />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#141716",
              border: "1px solid #D6A343",
              color: "#F4F1E8",
            },
          }}
        />
      </body>
    </html>
  );
}
