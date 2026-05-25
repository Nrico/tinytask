import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import { inter, playfair, oswald, outfit } from "@/lib/fonts";
import { AuthProvider } from "@/lib/auth-context";
import { BrandKitProvider } from "@tinytask/ui/brand/brand-context";

export const metadata: Metadata = {
  title: "TinyTask - Productivity Tools Suite",
  description: "A collection of premium productivity tools for everyday tasks.",
  metadataBase: new URL("https://tinytask.com"),
  openGraph: {
    title: "TinyTask - Productivity Tools Suite",
    description: "A collection of premium productivity tools for everyday tasks.",
    url: "https://tinytask.com",
    siteName: "TinyTask",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "TinyTask - Productivity Tools Suite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TinyTask - Productivity Tools Suite",
    description: "A collection of premium productivity tools for everyday tasks.",
    images: ["/og-image.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        outfit.variable,
        inter.variable,
        playfair.variable,
        oswald.variable
      )}>
        <AuthProvider>
          <BrandKitProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </BrandKitProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
