import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Toaster } from "sonner";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Navbar />
        <main>{children}</main>
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
