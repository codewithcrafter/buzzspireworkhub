import { Metadata } from "next";
import ContactClientView from "./ContactClientView";

export const metadata: Metadata = {
  title: "Get In Touch & Free Strategy Brief | BuzzSpire Media",
  description:
    "Schedule a free digital marketing, SEO, and ad account audit with BuzzSpire Media. Contact our strategy desks.",
  alternates: {
    canonical: "https://buzzspiremedia.com/contact",
  },
};

export default function ContactPage() {
  return <ContactClientView />;
}
