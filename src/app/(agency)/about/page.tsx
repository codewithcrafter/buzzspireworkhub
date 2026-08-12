import { Metadata } from "next";
import AboutClientView from "./AboutClientView";

export const metadata: Metadata = {
  title: "About Us | BuzzSpire Media - Digital Growth Experts",
  description:
    "Learn about BuzzSpire Media's story, vision, and core principles. Empowering businesses through SEO, performance marketing, website development, and branding.",
  alternates: {
    canonical: "https://buzzspiremedia.com/about",
  },
};

export default function AboutPage() {
  return <AboutClientView />;
}
