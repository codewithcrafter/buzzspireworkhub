import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/animations/SmoothScroll";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: true,
  fallback: ["Arial", "sans-serif"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["600", "700", "800", "900"],
  adjustFontFallback: true,
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://buzzspiremedia.com"),
  title: {
    default: "BuzzSpire Media | Digital Marketing Agency in Delhi",
    template: "%s | BuzzSpire Media"
  },
  description: "BuzzSpire Media is a digital marketing agency in Delhi NCR helping local businesses show up on Google, grow social presence, and win more customers with SEO, GMB management, Google Ads, web development, and ecommerce services.",
  alternates: {
    canonical: "https://buzzspiremedia.com",
  },
  keywords: [
    "digital marketing agency Delhi",
    "SEO services Delhi",
    "Google Business Profile management Delhi",
    "social media marketing Delhi",
    "PPC Google Ads Delhi",
    "web development Delhi",
    "ecommerce management Delhi",
    "product photography Delhi",
    "video editing Delhi",
    "graphic design Delhi",
    "Delhi NCR",
    "West Delhi",
    "Uttam Nagar",
    "Janakpuri",
    "Dwarka"
  ],
  authors: [{ name: "BuzzSpire Media" }],
  creator: "BuzzSpire Media",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://buzzspiremedia.com",
    title: "BuzzSpire Media | Digital Marketing Agency in Delhi",
    description: "Digital marketing agency in Delhi helping local businesses grow online with SEO, GMB management, paid ads, and web development.",
    siteName: "BuzzSpire Media",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuzzSpire Media | Digital Marketing Agency in Delhi",
    description: "Digital marketing agency in Delhi helping local businesses grow online with SEO, GMB management, paid ads, and web development.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`light ${inter.variable} ${outfit.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <WhatsAppButton />
      </body>
    </html>
  );
}

