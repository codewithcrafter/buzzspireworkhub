import { Metadata } from "next";
import CareerClientView from "./CareerClientView";

export const metadata: Metadata = {
  title: "Careers & Open Roles | BuzzSpire Media",
  description:
    "Join BuzzSpire Media's team. Open positions for Senior Front-End Engineers, Performance Media Buyers, and B2B Copywriters with performance dividends.",
  alternates: {
    canonical: "https://buzzspiremedia.com/career",
  },
};

export default function CareerPage() {
  return <CareerClientView />;
}
