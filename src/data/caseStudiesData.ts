import { CaseStudy, CaseStudyCategory } from "@/types/caseStudy";

export const CATEGORIES: CaseStudyCategory[] = [
  "All",
  "Real Estate",
  "Technology",
  "Education",
  "Fashion & Lifestyle",
  "Health & Fitness",
  "Food & Beverage",
];

export const caseStudiesData: CaseStudy[] = [
  {
    id: "cs-1",
    slug: "novafit-wellness",
    client: "NovaFit Wellness",
    industry: "Health & Fitness",
    featuredImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Scaled organic patient acquisition and online booking conversions across digital touchpoints for a premium wellness brand.",
    services: ["SEO", "Google Ads", "Social Media Marketing"],
    heroMetric: {
      label: "Organic Traffic Growth",
      value: "187% increase in organic traffic",
    },
    overview: "NovaFit Wellness operates modern wellness clinics offering holistic health assessments, personalized fitness coaching, and preventative therapies. They partnered with BuzzSpire Media to expand their regional digital presence and build a reliable pipeline for online appointment bookings.",
    challenge: "Despite high customer satisfaction in-clinic, NovaFit suffered from low search visibility for key local fitness and wellness queries. High reliance on expensive offline print ads yielded diminishing returns, and paid campaigns lacked targeted landing pages.",
    objectives: [
      "Improve Google organic ranking for top 25 high-intent wellness keywords.",
      "Lower Cost Per Acquisition (CPA) on Google Search Ads by 30%.",
      "Redesign campaign landing pages to boost online booking conversion rates.",
    ],
    strategy: "We built a multi-channel digital acquisition framework combining high-intent local SEO content hubs, hyper-targeted Google Search campaigns focused on symptoms & solutions, and dynamic social media retargeting to capture prospective wellness clients.",
    execution: [
      {
        title: "Local & Technical SEO Audit",
        description: "Restructured site hierarchy, optimized core web vitals, and engineered local landing pages optimized for Delhi NCR wellness searches.",
      },
      {
        title: "High-Intent Google Ads Campaign",
        description: "Implemented single-theme ad groups with exact match keyword bidding, dynamic negative keyword lists, and dedicated mobile conversion funnels.",
      },
      {
        title: "Social Proof & Video Marketing",
        description: "Produced informative short-form video reels highlighting client transformations, backed by paid Meta retargeting ads.",
      },
    ],
    results: [
      {
        label: "Organic Traffic",
        value: "+187%",
        description: "Year-over-year surge in non-branded organic website visitors.",
        change: "+187%",
      },
      {
        label: "Online Bookings",
        value: "2.4X",
        description: "Multiplied monthly digital appointment reservations.",
        change: "+140%",
      },
      {
        label: "Search Ad CPA",
        value: "-34%",
        description: "Reduction in average cost per verified booking lead.",
        change: "-34%",
      },
      {
        label: "ROAS",
        value: "4.8X",
        description: "Overall return on digital marketing spend across search & social.",
        change: "4.8X",
      },
    ],
    conclusion: "By unifying local search engine optimization with high-conversion landing pages and targeted search ads, NovaFit established a sustainable, scalable growth model with reduced dependence on traditional media.",
    testimonial: {
      quote: "BuzzSpire Media transformed our online presence. Our clinics are consistently booked weeks in advance, and our organic search rankings have never been stronger.",
      author: "Dr. Rohan Verma",
      role: "Founder & Managing Director",
      company: "NovaFit Wellness",
    },
    isDemo: true,
  },
  {
    id: "cs-2",
    slug: "urbannest-properties",
    client: "UrbanNest Properties",
    industry: "Real Estate",
    featuredImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Engineered a high-ticket real estate lead generation engine driving verified homebuyers for premium residential projects.",
    services: ["Performance Marketing", "Lead Generation", "SEO"],
    heroMetric: {
      label: "Qualified Lead Surge",
      value: "3.2X increase in qualified leads",
    },
    overview: "UrbanNest Properties is a luxury real estate developer specializing in premium residential apartments and commercial suites in top metropolitan areas. They partnered with BuzzSpire Media to drive verified buyer leads for two newly launched luxury townships.",
    challenge: "Real estate lead generation in competitive metros is saturated with low-quality leads and fake contact entries. UrbanNest's sales team was spending 70% of their time filtering invalid phone numbers, resulting in bloated customer acquisition costs.",
    objectives: [
      "Generate high-intent leads with budget verification and site-visit intent.",
      "Reduce lead-to-opportunity cycle time down to under 24 hours.",
      "Establish organic search authority for luxury real estate projects.",
    ],
    strategy: "We engineered a multi-step performance marketing funnel featuring interactive property value estimators, OTP-verified lead capture forms, dynamic Facebook/Instagram lead ads with custom qualifying questions, and long-form SEO project guides.",
    execution: [
      {
        title: "Interactive Lead Qualification Funnels",
        description: "Deployed high-speed landing pages with 3D virtual site tour previews and built-in budget verification fields before submission.",
      },
      {
        title: "Meta & Google Performance Campaigns",
        description: "Ran targeted luxury buyer segment targeting using custom audience lookalikes, investor intent signals, and location radii around high-income hubs.",
      },
      {
        title: "Real Estate Technical SEO",
        description: "Published comprehensive neighborhood buying guides, floorplan analysis articles, and optimized Google Business profiles for sales offices.",
      },
    ],
    results: [
      {
        label: "Qualified Leads",
        value: "3.2X",
        description: "Increase in sales-ready prospective homebuyer leads.",
        change: "+220%",
      },
      {
        label: "Lead Verification Rate",
        value: "89%",
        description: "Percentage of leads with active buyers ready for site visits.",
        change: "+45%",
      },
      {
        label: "Cost Per Qualified Lead",
        value: "-41%",
        description: "Reduction in acquisition cost per site-visit lead.",
        change: "-41%",
      },
      {
        label: "Pipeline Value",
        value: "₹42 Cr",
        description: "Total property transaction value generated in 90 days.",
        change: "₹42 Cr",
      },
    ],
    conclusion: "Through targeted performance campaigns and pre-qualification funnels, UrbanNest maximized sales team efficiency while drastically reducing wasted ad spend on unverified leads.",
    testimonial: {
      quote: "The lead quality delivered by BuzzSpire Media was remarkable. Our sales team went from chasing cold contacts to closing high-value property bookings every week.",
      author: "Ananya Mehta",
      role: "Head of Marketing",
      company: "UrbanNest Properties",
    },
    isDemo: true,
  },
  {
    id: "cs-3",
    slug: "luxe-aura",
    client: "LuxeAura",
    industry: "Fashion & Lifestyle",
    featuredImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Elevated direct-to-consumer online fashion sales through aesthetic social campaigns, Meta ad scaling, and creative storytelling.",
    services: ["Social Media Marketing", "Meta Ads", "Content Marketing"],
    heroMetric: {
      label: "Social Engagement Rate",
      value: "142% increase in online engagement",
    },
    overview: "LuxeAura is a direct-to-consumer (D2C) fashion and lifestyle brand crafting sustainable apparel and handcrafted accessories. They sought BuzzSpire Media's expertise to scale their e-commerce storefront sales across India.",
    challenge: "LuxeAura faced stagnant revenue due to high ad fatigue on social platforms, low ad creative refresh rates, and drop-offs during peak festival shopping seasons where ad costs spike.",
    objectives: [
      "Boost social media engagement rate and brand community sentiment.",
      "Achieve sustained 3.5X+ Return on Ad Spend (ROAS) on Meta platforms.",
      "Increase repeat purchase rate through targeted content nurturing.",
    ],
    strategy: "We built an aesthetic creative content engine centered around lifestyle video lookbooks, user-generated content (UGC) styling guides, and dynamic catalog Advantage+ campaigns on Instagram and Facebook.",
    execution: [
      {
        title: "Creative Content Studio & UGC",
        description: "Produced weekly short-form video content showcasing product fit, fabric textures, and influencer styling tips.",
      },
      {
        title: "Advantage+ Meta Ad Scaling",
        description: "Structured full-funnel Meta advertising campaigns with dynamic product ads (DPA), carousel lookbooks, and high-converting collection ads.",
      },
      {
        title: "Influencer Collaboration & Content Amplification",
        description: "Partnered with micro-influencers in fashion and amplified top-performing organic posts into paid ad campaigns.",
      },
    ],
    results: [
      {
        label: "Online Engagement",
        value: "+142%",
        description: "Increase in social post interactions, shares, and saves.",
        change: "+142%",
      },
      {
        label: "E-commerce ROAS",
        value: "3.9X",
        description: "Average return on ad spend across Meta ad campaigns.",
        change: "3.9X",
      },
      {
        label: "Monthly Store Revenue",
        value: "+165%",
        description: "Growth in total e-commerce order revenue.",
        change: "+165%",
      },
      {
        label: "Customer Acquisition Cost",
        value: "-28%",
        description: "Decrease in average CAC across new buyer cohorts.",
        change: "-28%",
      },
    ],
    conclusion: "LuxeAura transformed its digital storefront into a high-growth e-commerce brand by pairing visually rich brand storytelling with data-driven Meta performance advertising.",
    testimonial: {
      quote: "BuzzSpire Media understands the nuances of fashion marketing. Their creative team brought our brand vision to life and delivered our highest monthly sales figures to date.",
      author: "Priya Kapoor",
      role: "Creative Director & Co-Founder",
      company: "LuxeAura",
    },
    isDemo: true,
  },
  {
    id: "cs-4",
    slug: "techcore-solutions",
    client: "TechCore Solutions",
    industry: "Technology",
    featuredImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Drove inbound B2B enterprise software enquiries through technical SEO content hubs and targeted LinkedIn outreach.",
    services: ["SEO", "Content Marketing", "LinkedIn Marketing"],
    heroMetric: {
      label: "Organic B2B Inquiries",
      value: "215% increase in organic enquiries",
    },
    overview: "TechCore Solutions provides enterprise cloud migration, cybersecurity audits, and custom SaaS engineering for mid-market businesses. They engaged BuzzSpire Media to build an inbound B2B demand generation engine.",
    challenge: "TechCore relied heavily on outbound cold calling with long sales cycles and low conversion rates. Their website lacked structured technical content to educate CTOs and IT Directors searching for enterprise solutions online.",
    objectives: [
      "Rank on Page 1 for core enterprise software engineering terms.",
      "Establish LinkedIn thought leadership for C-suite decision-makers.",
      "Generate qualified demo requests and RFP submissions from enterprise accounts.",
    ],
    strategy: "We launched an Inbound B2B Content Engine featuring high-value whitepapers, architecture comparison guides, technical SEO landing pages, and executive LinkedIn thought leadership campaigns.",
    execution: [
      {
        title: "Technical SEO & Hub-and-Spoke Content Architecture",
        description: "Created comprehensive cloud migration pillar pages supported by technical cluster articles addressing specific IT pain points.",
      },
      {
        title: "LinkedIn Executive Branding & Sponsored Content",
        description: "Managed executive profiles for company founders, publishing technical teardowns and running targeted LinkedIn InMail and Thought Leader ads.",
      },
      {
        title: "Gated Lead Magnet Funnels",
        description: "Designed downloadable enterprise cybersecurity blueprints that converted high-intent site visitors into sales pipeline leads.",
      },
    ],
    results: [
      {
        label: "Organic Enquiries",
        value: "+215%",
        description: "Growth in inbound demo requests and RFP contact submissions.",
        change: "+215%",
      },
      {
        label: "First Page Keywords",
        value: "45+",
        description: "High-value enterprise IT search terms ranking in Google top 10.",
        change: "45+",
      },
      {
        label: "LinkedIn Impressions",
        value: "450K+",
        description: "Quarterly organic & paid views among target IT decision-makers.",
        change: "+310%",
      },
      {
        label: "Average Deal Size",
        value: "+35%",
        description: "Increase in average contract value from inbound web leads.",
        change: "+35%",
      },
    ],
    conclusion: "By position TechCore as trusted technical experts through authoritative content and targeted B2B distribution, BuzzSpire Media helped secure high-value enterprise accounts predictably.",
    testimonial: {
      quote: "The quality of leads coming through our website has skyrocketed. BuzzSpire Media helped us establish credibility with enterprise CTOs before our first sales call.",
      author: "Vikram Malhotra",
      role: "Chief Technology Officer",
      company: "TechCore Solutions",
    },
    isDemo: true,
  },
  {
    id: "cs-5",
    slug: "brew-and-bean",
    client: "Brew & Bean",
    industry: "Food & Beverage",
    featuredImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Dominated local food discovery and boosted café foot traffic across multiple urban locations using hyper-local SEO and geo-targeted ads.",
    services: ["Social Media", "Local SEO", "Paid Advertising"],
    heroMetric: {
      label: "Local Search Discovery",
      value: "96% increase in local discovery",
    },
    overview: "Brew & Bean is a chain of artisanal specialty coffee houses and bakehouses located across major metro hubs. They collaborated with BuzzSpire Media to launch local marketing initiatives driving foot traffic and table reservations.",
    challenge: "New location openings suffered from slow initial customer adoption due to intense local competition from established coffee chains and lack of location-based search visibility on mobile maps.",
    objectives: [
      "Dominate 'coffee shop near me' and 'best café' local search queries.",
      "Drive weekend foot traffic during off-peak hours using targeted promo offers.",
      "Grow local Instagram follower community and user-generated tagged posts.",
    ],
    strategy: "We built a hyper-local marketing growth engine utilizing Google Business Profile optimizations, geotargeted Meta Instagram Reels, localized micro-influencer tasting events, and map directions ads.",
    execution: [
      {
        title: "Google Business Profile Optimization & Map Ads",
        description: "Optimized multi-location map listings with geo-tagged images, live menu updates, customer review response automation, and Google Local Services ads.",
      },
      {
        title: "Geo-Fenced Social Media Ads",
        description: "Deployed 3km radius Instagram ads around each café location featuring mouth-watering food visuals and limited-time mobile coupons.",
      },
      {
        title: "Local Influencer Tasting Nights",
        description: "Organized exclusive tasting events for local food bloggers, generating hundreds of organic Instagram stories and Google reviews.",
      },
    ],
    results: [
      {
        label: "Local Discovery",
        value: "+96%",
        description: "Increase in views on Google Maps & Search local map packs.",
        change: "+96%",
      },
      {
        label: "Map Driving Directions",
        value: "+112%",
        description: "Surge in customer requests for directions to café locations.",
        change: "+112%",
      },
      {
        label: "Weekend Store Revenue",
        value: "+78%",
        description: "Growth in weekend sales across newly opened café branches.",
        change: "+78%",
      },
      {
        label: "Google Review Score",
        value: "4.8 ★",
        description: "Average customer rating across 1,200+ verified customer reviews.",
        change: "4.8 ★",
      },
    ],
    conclusion: "Brew & Bean successfully established itself as a top-rated local coffee destination by leveraging localized search strategies and visually compelling social campaigns.",
    testimonial: {
      quote: "Our stores are packed every weekend. BuzzSpire Media put our cafés on the digital map and gave us a scalable formula for every new store launch.",
      author: "Siddharth Roy",
      role: "Co-Founder & Operations Head",
      company: "Brew & Bean",
    },
    isDemo: true,
  },
  {
    id: "cs-6",
    slug: "eduprime-academy",
    client: "EduPrime Academy",
    industry: "Education",
    featuredImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Scaled student admissions for professional certification courses using high-converting landing pages and precision Google Search ads.",
    services: ["Lead Generation", "Google Ads", "Landing Page Optimization"],
    heroMetric: {
      label: "Qualified Student Admissions",
      value: "168% increase in qualified enquiries",
    },
    overview: "EduPrime Academy provides online and hybrid post-graduate diploma programs in Data Science, Digital Marketing, and Financial Analysis. They partnered with BuzzSpire Media to increase student enrollment for their flagship cohort programs.",
    challenge: "EduPrime faced rising ad costs in the ed-tech sector with high bounce rates on generic course catalog pages and drop-offs during counseling call registrations.",
    objectives: [
      "Increase prospective student counseling form submissions.",
      "Improve landing page conversion rate from 2.1% to over 5.5%.",
      "Decrease Cost Per Enrolled Student (CPES) across digital channels.",
    ],
    strategy: "We re-engineered the student acquisition funnel by creating course-specific interactive landing pages, launching search intent campaigns targeting career upgraders, and introducing automated WhatsApp lead follow-ups.",
    execution: [
      {
        title: "High-Conversion Course Landing Pages",
        description: "Built mobile-first landing pages featuring downloadable syllabus brochures, alumnus placement statistics, and instant counselor booking widgets.",
      },
      {
        title: "Intent-Based Google & YouTube Ads",
        description: "Ran high-intent keyword search campaigns alongside YouTube in-stream ads targeting professionals looking for career advancement courses.",
      },
      {
        title: "Automated Multi-Channel Nurturing",
        description: "Configured automated email & WhatsApp drip sequences sharing student success stories to nurture leads through to enrollment.",
      },
    ],
    results: [
      {
        label: "Qualified Enquiries",
        value: "+168%",
        description: "Increase in verified student counseling inquiries.",
        change: "+168%",
      },
      {
        label: "Landing Page Conversion",
        value: "6.2%",
        description: "Up from 2.1% baseline through mobile UI optimization.",
        change: "+195%",
      },
      {
        label: "Cohort Fill Rate",
        value: "98%",
        description: "Percentage of available batch seats filled prior to start date.",
        change: "+28%",
      },
      {
        label: "Cost Per Student",
        value: "-32%",
        description: "Reduction in customer acquisition cost per enrolled student.",
        change: "-32%",
      },
    ],
    conclusion: "By aligning campaign messaging with student career aspirations and removing frictionless booking barriers, EduPrime achieved record-breaking enrollment figures.",
    testimonial: {
      quote: "BuzzSpire Media delivered exceptional results for our admission drive. Every cohort fills up faster than scheduled with highly qualified candidates.",
      author: "Dr. Meera Nambiar",
      role: "Academic Dean",
      company: "EduPrime Academy",
    },
    isDemo: true,
  },
];

export function getAllCaseStudies(): CaseStudy[] {
  return caseStudiesData;
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudiesData.find((cs) => cs.slug === slug);
}

export function getCaseStudiesByCategory(category: CaseStudyCategory): CaseStudy[] {
  if (category === "All") return caseStudiesData;
  return caseStudiesData.filter((cs) => cs.industry === category);
}

export function getAllCategories(): CaseStudyCategory[] {
  return CATEGORIES;
}
