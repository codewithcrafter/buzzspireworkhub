import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/animations/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.buzzspiremedia.com"),
  title: {
    default: "BuzzSpire Media | Digital Marketing Agency in Delhi",
    template: "%s | BuzzSpire Media"
  },
  description: "BuzzSpire Media is a digital marketing agency in Delhi offering SEO, PPC, social media marketing, Google Business Profile management and web development services.",
  alternates: {
    canonical: "https://www.buzzspiremedia.com/",
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
    url: "https://www.buzzspiremedia.com/",
    title: "BuzzSpire Media | Digital Marketing Agency in Delhi",
    description: "Digital marketing agency in Delhi helping local businesses grow online with SEO, GMB management, paid ads, and web development.",
    siteName: "BuzzSpire Media",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuzzSpire Media | Digital Marketing Agency in Delhi",
    description: "Digital marketing agency in Delhi helping local businesses grow online with SEO, GMB management, paid ads, and web development.",
  },
  other: {
    "facebook-domain-verification": "ld3jkr89zb6rmumr1qit7jtpbaxqh1",
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

import GlobalContactButtons from "@/components/layout/GlobalContactButtons";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`light antialiased ${inter.variable} ${outfit.variable}`}>
      <head>
      </head>
      <body className="min-h-screen flex flex-col">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <GlobalContactButtons />
      </body>
    </html>
  );
}

