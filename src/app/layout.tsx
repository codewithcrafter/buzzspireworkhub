import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/animations/SmoothScroll";
import AiChatbot from "@/components/chat/AiChatbot";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BuzzSpire Media | High-End Digital Marketing Agency",
    template: "%s | BuzzSpire Media"
  },
  description: "Award-winning digital marketing agency creating visually impressive and highly interactive digital experiences. Elevate your brand with BuzzSpire Media.",
  keywords: ["Digital Marketing", "Web Development", "UI/UX Design", "SEO", "Branding", "Agency"],
  authors: [{ name: "BuzzSpire Media" }],
  creator: "BuzzSpire Media",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://buzzspire.media",
    title: "BuzzSpire Media | High-End Digital Marketing Agency",
    description: "Award-winning digital marketing agency creating visually impressive and highly interactive digital experiences.",
    siteName: "BuzzSpire Media",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuzzSpire Media",
    description: "Award-winning digital marketing agency creating visually impressive and highly interactive digital experiences.",
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
      className={`light ${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <AiChatbot />
      </body>
    </html>
  );
}

