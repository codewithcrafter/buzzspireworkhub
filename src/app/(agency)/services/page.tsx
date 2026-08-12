import { Metadata } from "next";
import ServicesClientView from "./ServicesClientView";

export const metadata: Metadata = {
  title: "Digital Marketing Services in Delhi | Buzzspire",
  description:
    "Explore all digital marketing services in Delhi under one roof — SEO, PPC, SMM, design, and more. One agency, every service you need. Call now!",
  alternates: {
    canonical: "https://buzzspiremedia.com/services",
  },
};

export default function ServicesPage() {
  return <ServicesClientView />;
}
