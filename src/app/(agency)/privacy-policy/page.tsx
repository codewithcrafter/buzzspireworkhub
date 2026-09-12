import { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Database,
  CheckSquare,
  Lock,
  Ban,
  Share2,
  KeyRound,
  Cookie,
  Archive,
  UserCheck,
  Baby,
  ExternalLink,
  Calendar,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Buzzspire Media",
  description:
    "Read the Privacy Policy for Buzzspire Media to understand what information we collect, how we use it, and how we protect your personal and business data.",
  alternates: {
    canonical: "https://www.buzzspiremedia.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Buzzspire Media",
    description:
      "Read the Privacy Policy for Buzzspire Media to understand what information we collect, how we use it, and how we protect your personal and business data.",
    url: "https://www.buzzspiremedia.com/privacy-policy",
    type: "website",
  },
};

interface PolicySection {
  id: string;
  num: string;
  title: string;
  icon: any;
  intro?: string;
  bullets?: string[];
  points?: string[];
  footer?: string;
}

const privacySections: PolicySection[] = [
  {
    id: "information-we-collect",
    num: "1",
    title: "Information We Collect",
    icon: Database,
    intro: "Depending on how you interact with us, we may collect:",
    bullets: [
      "Your name and contact details",
      "Email address and phone number",
      "Company or business information",
      "Information you provide through contact forms",
      "Project details and requirements",
      "Payment and billing information",
      "Website, advertising, or marketing account details that you provide to us",
      "Technical information such as IP address, browser type, device information, and website usage data",
    ],
    footer:
      "We only collect information that is reasonably needed to provide our services or communicate with you.",
  },
  {
    id: "how-we-use-information",
    num: "2",
    title: "How We Use Your Information",
    icon: CheckSquare,
    intro: "We may use your information to:",
    bullets: [
      "Provide and manage our services",
      "Contact you about your project or enquiry",
      "Process payments and billing",
      "Understand your requirements",
      "Improve our website and services",
      "Provide customer support",
      "Send service-related updates",
      "Maintain records related to our business relationship",
    ],
    footer:
      "We will use your data only for BuzzSpire Media Marketing and the services we provide to you, unless you give us permission for another purpose or we are legally required to use it.",
  },
  {
    id: "data-security",
    num: "3",
    title: "Data Security",
    icon: Lock,
    points: [
      "Your data is stored and managed through BuzzSpire Media Marketing's servers and systems. We take reasonable steps to protect your information from unauthorized access, misuse, loss, or disclosure.",
      "Access to client information is limited to people who need it to provide the agreed services.",
      "However, no online system or method of storing data can be guaranteed to be completely secure.",
    ],
  },
  {
    id: "we-do-not-sell-data",
    num: "4",
    title: "We Do Not Sell Your Data",
    icon: Ban,
    points: [
      "We do not sell, rent, or trade your personal information to third parties for their own marketing purposes.",
      "Your information is used for our business operations and to provide the services you have requested.",
    ],
  },
  {
    id: "sharing-of-information",
    num: "5",
    title: "Sharing of Information",
    icon: Share2,
    points: [
      "We may share limited information with trusted service providers when it is necessary to provide our services. For example, this may include hosting providers, payment services, analytics tools, advertising platforms, or other tools used to complete your project.",
      "These providers only receive information that is reasonably required for the service.",
    ],
  },
  {
    id: "account-marketing-access",
    num: "6",
    title: "Account & Marketing Access",
    icon: KeyRound,
    points: [
      "If you provide access to your Google, Meta, website, hosting, social media, advertising, or other business accounts, we will use that access only for the agreed work.",
      "We will not intentionally use your account access for unrelated activities.",
    ],
  },
  {
    id: "cookies-analytics",
    num: "7",
    title: "Cookies & Analytics",
    icon: Cookie,
    points: [
      "Our website may use cookies and similar technologies to understand how visitors use the website, improve performance, and measure marketing activity.",
      "Some third-party tools may also use cookies or similar technologies according to their own privacy policies.",
    ],
  },
  {
    id: "data-retention",
    num: "8",
    title: "Data Retention",
    icon: Archive,
    points: [
      "We may keep your information for as long as it is reasonably required to provide our services, maintain business records, resolve disputes, meet legal requirements, or protect our legitimate business interests.",
      "When information is no longer required, we may delete or securely dispose of it.",
    ],
  },
  {
    id: "your-privacy-rights",
    num: "9",
    title: "Your Privacy Rights",
    icon: UserCheck,
    intro: "Depending on applicable law, you may have the right to:",
    bullets: [
      "Ask what personal information we hold about you",
      "Request correction of inaccurate information",
      "Request deletion of your information where applicable",
      "Ask how your information is being used",
      "Withdraw consent where processing is based on consent",
    ],
    footer:
      "To make a privacy-related request, you can contact us using the details provided on our website.",
  },
  {
    id: "childrens-privacy",
    num: "10",
    title: "Children's Privacy",
    icon: Baby,
    points: [
      "Our services are intended for businesses and general users. We do not knowingly collect personal information from children where such collection is not permitted by applicable law.",
    ],
  },
  {
    id: "third-party-websites",
    num: "11",
    title: "Third-Party Websites",
    icon: ExternalLink,
    points: [
      "Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of those websites.",
      "We recommend checking their privacy policies before providing them with personal information.",
    ],
  },
  {
    id: "changes-to-policy",
    num: "12",
    title: "Changes to This Privacy Policy",
    icon: Calendar,
    points: [
      "We may update this Privacy Policy from time to time to reflect changes in our services, technology, or legal requirements.",
      "Any updated version will be published on this page.",
    ],
  },
  {
    id: "contact-us",
    num: "13",
    title: "Contact Us",
    icon: Mail,
    points: [
      "If you have any questions about this Privacy Policy, your personal information, or how your data is handled, you can contact BuzzSpire Media Marketing through the contact details available on our website.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full bg-background select-none min-h-screen">
      {/* 1. HERO / HEADER SECTION */}
      <section className="relative py-16 md:py-24 px-6 border-b border-border/50 bg-muted/20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="w-full max-w-[1720px] mx-auto px-6 md:px-10 lg:px-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-semibold">Privacy Policy</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              Privacy &amp; Data Protection
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-foreground">
              Privacy Policy
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Your privacy matters to us. This Privacy Policy explains what information we collect, how we use it, and how we keep it protected when you use our website or services.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-muted-foreground">
              <span className="bg-background border border-border/80 px-3 py-1 rounded-full">
                Last Updated: August 2026
              </span>
              <span>•</span>
              <span>13 Core Sections</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT WITH STICKY TABLE OF CONTENTS */}
      <section className="py-16 md:py-20 px-6 md:px-10 lg:px-12 w-full max-w-[1720px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT SIDEBAR: Table of Contents (Sticky on Desktop) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="bg-white border border-border/80 rounded-3xl p-6 shadow-sm">
              <h3 className="font-heading font-bold text-base text-foreground mb-4 uppercase tracking-wider text-xs">
                Table of Contents
              </h3>
              <nav className="space-y-1.5 max-h-[65vh] overflow-y-auto pr-1">
                {privacySections.map((section) => (
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
                Privacy Questions?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                For questions about our privacy practices, data handling, or to exercise your privacy rights, reach out directly.
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
                  href="tel:+919205386625"
                  className="flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  +91 95992 49586
                </a>
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Privacy Sections */}
          <div className="lg:col-span-8 space-y-8">
            {privacySections.map((section) => {
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
                        Section {section.num}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-foreground">
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    {section.intro && (
                      <p className="text-sm sm:text-base font-semibold text-foreground leading-relaxed">
                        {section.intro}
                      </p>
                    )}

                    {section.bullets && (
                      <ul className="space-y-2 pl-2">
                        {section.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                              {bullet}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.points && (
                      <div className="space-y-3">
                        {section.points.map((point, pIdx) => (
                          <p
                            key={pIdx}
                            className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                          >
                            {point}
                          </p>
                        ))}
                      </div>
                    )}

                    {section.footer && (
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-2 border-t border-border/40 font-medium">
                        {section.footer}
                      </p>
                    )}
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
