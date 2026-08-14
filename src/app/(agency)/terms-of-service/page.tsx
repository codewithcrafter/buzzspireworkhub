import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  CreditCard,
  Target,
  Layers,
  UserCheck,
  Clock,
  RefreshCw,
  Globe,
  TrendingUp,
  XCircle,
  RotateCcw,
  FileCheck,
  Lock,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Buzzspire Media",
  description:
    "Read the Terms & Conditions for Buzzspire Media services, including payment terms, lead expectations, client responsibilities, and service policies.",
  alternates: {
    canonical: "https://www.buzzspiremedia.com/terms-of-service",
  },
  openGraph: {
    title: "Terms of Service | Buzzspire Media",
    description:
      "Read the Terms & Conditions for Buzzspire Media services, including payment terms, lead expectations, client responsibilities, and service policies.",
    url: "https://www.buzzspiremedia.com/terms-of-service",
    type: "website",
  },
};

const termsSections = [
  {
    id: "payment",
    num: "1",
    title: "Payment",
    icon: CreditCard,
    points: [
      "All project payments must be made in advance before the work starts.",
      "Once the payment is received and the work has started, the amount paid is non-refundable.",
      "All monthly service payments must be made in advance at the beginning of the service period.",
      "If a payment is delayed, we may pause the work until the payment is received.",
      "Any work outside the agreed scope may have additional charges.",
    ],
  },
  {
    id: "leads-results",
    num: "2",
    title: "Leads & Results",
    icon: Target,
    points: [
      "We will always work to deliver the agreed services properly, but we do not guarantee a fixed number of leads, calls, enquiries, sales, or conversions.",
      "Results can depend on many things, including the market, competition, budget, pricing, website, offer, target audience, and customer demand.",
      "We will not take any commitment for leads or sales made by the client to their customers.",
    ],
  },
  {
    id: "scope-of-work",
    num: "3",
    title: "Scope of Work",
    icon: Layers,
    points: [
      "We will provide the services that have been agreed with the client.",
      "Any extra work, new requirements, or major changes that are not part of the agreed scope may be charged separately.",
    ],
  },
  {
    id: "client-responsibilities",
    num: "4",
    title: "Client Responsibilities",
    icon: UserCheck,
    points: [
      "The client must provide the required information, content, images, account access, approvals, and other details needed for the work.",
      "If the client delays providing the required information or approval, the project timeline may also be delayed.",
    ],
  },
  {
    id: "timelines",
    num: "5",
    title: "Timelines",
    icon: Clock,
    points: [
      "We will try to complete the work within the agreed timeline. However, delays can happen because of late client responses, missing information, technical problems, third-party platforms, or other factors outside our control.",
    ],
  },
  {
    id: "changes-revisions",
    num: "6",
    title: "Changes & Revisions",
    icon: RefreshCw,
    points: [
      "Revisions will be provided according to the agreed project or service scope.",
      "Major changes or additional revisions outside the agreed scope may be charged separately.",
    ],
  },
  {
    id: "third-party-platforms",
    num: "7",
    title: "Third-Party Platforms",
    icon: Globe,
    points: [
      "Some services may depend on platforms such as Google, Meta, hosting providers, social media platforms, payment gateways, or other third-party services.",
      "We are not responsible for changes, account restrictions, suspensions, policy updates, technical issues, or other actions taken by these platforms.",
    ],
  },
  {
    id: "seo-marketing",
    num: "8",
    title: "SEO & Marketing",
    icon: TrendingUp,
    points: [
      "SEO and digital marketing results are not guaranteed. Search rankings, traffic, leads, and conversions can change because of search engine updates, competition, market changes, advertising performance, and other factors.",
      "We do not guarantee a specific ranking, traffic level, number of leads, sales, or revenue.",
    ],
  },
  {
    id: "cancellation",
    num: "9",
    title: "Cancellation",
    icon: XCircle,
    points: [
      "If you want to stop a monthly service, you should inform us before the next billing cycle.",
      "Payments already made for services that have started will not be refunded.",
    ],
  },
  {
    id: "refunds",
    num: "10",
    title: "Refunds",
    icon: RotateCcw,
    points: [
      "Once payment has been received and work has started, the payment is non-refundable.",
      "Any exception to this policy must be agreed in writing before the work starts.",
    ],
  },
  {
    id: "client-content-information",
    num: "11",
    title: "Client Content & Information",
    icon: FileCheck,
    points: [
      "The client is responsible for providing accurate information and legally usable content, images, logos, videos, and other materials.",
      "We are not responsible for issues caused by content or information provided by the client.",
    ],
  },
  {
    id: "confidentiality",
    num: "12",
    title: "Confidentiality",
    icon: Lock,
    points: [
      "We will keep client information and business details private and will not knowingly share confidential information with others, except where required to provide the service or by law.",
    ],
  },
  {
    id: "service-suspension",
    num: "13",
    title: "Service Suspension",
    icon: AlertTriangle,
    points: [
      "We may pause or stop the service if payments are overdue, required information is not provided, or the client requests work that is illegal, misleading, harmful, or against the rules of a third-party platform.",
    ],
  },
  {
    id: "changes-to-terms",
    num: "14",
    title: "Changes to Terms",
    icon: Calendar,
    points: [
      "We may update these Terms & Conditions when needed. The latest version will always be available on this page.",
    ],
  },
  {
    id: "acceptance",
    num: "15",
    title: "Acceptance",
    icon: CheckCircle2,
    points: [
      "By making a payment, approving the work, or continuing to use our services, you confirm that you have read and agreed to these Terms & Conditions.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <main className="w-full bg-background select-none min-h-screen">
      {/* 1. HERO / HEADER SECTION */}
      <section className="relative py-16 md:py-24 px-6 border-b border-border/50 bg-muted/20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-semibold">Terms of Service</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              Legal Policy
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-foreground">
              Terms of Service
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              These Terms &amp; Conditions explain the basic rules for using our services. By making a payment or starting a project with us, you agree to these terms.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-muted-foreground">
              <span className="bg-background border border-border/80 px-3 py-1 rounded-full">
                Last Updated: August 2026
              </span>
              <span>•</span>
              <span>15 Core Clauses</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT WITH STICKY TABLE OF CONTENTS */}
      <section className="py-16 md:py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT SIDEBAR: Table of Contents (Sticky on Desktop) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="bg-white border border-border/80 rounded-3xl p-6 shadow-sm">
              <h3 className="font-heading font-bold text-base text-foreground mb-4 uppercase tracking-wider text-xs">
                Table of Contents
              </h3>
              <nav className="space-y-1.5 max-h-[65vh] overflow-y-auto pr-1">
                {termsSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors group"
                  >
                    <span className="w-5 h-5 rounded-md bg-muted text-foreground group-hover:bg-primary group-hover:text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0 transition-colors">
                      {section.num}
                    </span>
                    <span className="truncate">{section.title}</span>
                  </a>
                ))}
              </nav>
            </div>

            {/* Quick Contact Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 space-y-3">
              <h4 className="font-heading font-bold text-sm text-foreground">
                Questions About Our Terms?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If you have questions regarding any section of our terms, our administrative team is available to assist you.
              </p>
              <div className="pt-2 space-y-2 text-xs">
                <a
                  href="mailto:sales@buzzspiremedia.com"
                  className="flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  sales@buzzspiremedia.com
                </a>
                <a
                  href="tel:+919599249586"
                  className="flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  +91 95992 49586
                </a>
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Terms Content Sections */}
          <div className="lg:col-span-8 space-y-8">
            {termsSections.map((section) => {
              const Icon = section.icon;
              return (
                <article
                  key={section.id}
                  id={section.id}
                  className="bg-white border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-primary/30 transition-all scroll-mt-28 space-y-4"
                >
                  <div className="flex items-center gap-3.5 pb-4 border-b border-border/50">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">
                        Clause {section.num}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-foreground">
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    {section.points.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </section>
    </main>
  );
}
