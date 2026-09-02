export interface ServiceData {
  slug: string;
  title: string;
  navTitle: string;
  navShort: string;
  shortDesc: string;
  fullContent: string[];
  iconName: string;
  ctaText: string;
  tag: string;
  gradient: string;
  heroBadge: string;
  delhiRelevance: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  features: {
    title: string;
    description: string;
  }[];
  benefits: {
    title: string;
    description: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
  relatedSlugs: string[];
}

export const OLD_TO_NEW_SLUG_MAP: Record<string, string> = {
  // Legacy / Short Slugs -> Final Production Slugs
  "smo": "smo-services-in-delhi",
  "google-business-profile-management": "google-business-profile-management-in-delhi",
  "gmb": "google-business-profile-management-in-delhi",
  "gmb-management": "google-business-profile-management-in-delhi",
  "sem-paid-ads": "ppc-services-in-delhi",
  "ppc": "ppc-services-in-delhi",
  "google-ads": "ppc-services-in-delhi",
  "ecommerce-management": "ecommerce-management-services-in-delhi",
  "graphic-design": "graphic-design-services-in-delhi",
  "seo": "seo-services-in-delhi",
  "smm": "social-media-marketing-services-in-delhi",
  "social-media-marketing": "social-media-marketing-services-in-delhi",
  "product-photography": "product-photography-services-in-delhi",
  "video-editing": "video-editing-services-in-delhi",
  "web-development": "web-development-services-in-delhi",
};

export const servicesData: ServiceData[] = [
  {
    slug: "smo-services-in-delhi",
    title: "SMO (Social Media Optimization)",
    navTitle: "SMO",
    navShort: "Optimize your social presence for stronger visibility.",
    shortDesc: "Turn casual social scrollers into followers with fully optimized profiles across platforms. We align your branding, bio details, and post structures to improve profile conversion, engagement, and reach.",
    fullContent: [
      "A social media profile that isn't optimized looks inactive, even if you're posting - wrong bio, inconsistent branding, no clear way for people to contact or buy from you.",
      "Our smo services Delhi cover the details most businesses skip: a clear, consistent brand presence across platforms, an optimized profile that converts visitors into followers, and content structured to boost engagement rate and reach.",
      "As a smo company in Delhi, we focus on building steady social visibility, not just follower counts. The benefit for you is a social presence that actually supports sales - better engagement, more brand recognition, and profiles that reflect your business the way it deserves to be seen."
    ],
    iconName: "Share2",
    ctaText: "Explore SMO",
    tag: "Profile Conversion",
    gradient: "from-pink-600/10 via-purple-600/10 to-primary/10",
    heroBadge: "Social Profile Optimization",
    delhiRelevance: "Building professional social media profiles for retail shops, service businesses, and brands across Delhi NCR.",
    seo: {
      title: "SMO Services in Delhi | Boost Engagement",
      description: "Get real likes, shares & followers with Delhi's trusted SMO experts. Proven strategies, fast growth. Call now for a free SMO consultation!",
      keywords: [
        "smo services Delhi",
        "smo company in Delhi",
        "social media optimization Delhi",
        "profile optimization agency Delhi",
        "social branding Delhi NCR"
      ]
    },
    features: [
      {
        title: "Bio & Landing Funnel Links",
        description: "Craft clear, benefit-driven profile bios and link trees that guide social visitors straight to your phone or website."
      },
      {
        title: "Visual Brand Standardization",
        description: "Align profile covers, highlight covers, and grid styling with your company logo and color identity."
      },
      {
        title: "Engagement Structure Setup",
        description: "Structure post templates and pinned posts designed to trigger comments, shares, and direct messages."
      },
      {
        title: "Platform Setup & Verification",
        description: "Verify business details, map coordinates, and contact action buttons across Instagram, Facebook, and Google."
      }
    ],
    benefits: [
      {
        title: "Immediate Credibility",
        description: "When potential customers check your Instagram or Facebook, clean profiles signal an active, legitimate business."
      },
      {
        title: "Higher Profile Conversion",
        description: "Turn profile visits into actual inquiries, WhatsApp messages, or website clicks instead of lost scrollers."
      },
      {
        title: "Consistent Brand Voice",
        description: "Maintain a cohesive visual standard across all social touchpoints your customers visit."
      }
    ],
    faqs: [
      {
        q: "What is the difference between SMO and SMM?",
        a: "SMO focuses on optimizing your profiles, bio layout, branding consistency, and content structure for conversion, while SMM involves managing active marketing campaigns, content calendars, and targeted outreach."
      }
    ],
    relatedSlugs: [
      "social-media-marketing-services-in-delhi",
      "graphic-design-services-in-delhi",
      "video-editing-services-in-delhi"
    ]
  },
  {
    slug: "google-business-profile-management-in-delhi",
    title: "Google Business Profile (GMB) Management",
    navTitle: "Google Business Profile",
    navShort: "Improve your Google Maps and local search visibility.",
    shortDesc: "Keep your Google Maps profile complete and active with accurate business details, real photos, and regular updates. We manage your categories, posts, and customer reviews to boost visibility in local 'near me' searches.",
    fullContent: [
      "Your shop might show up on Google Maps, but if your hours, photos, or reviews are outdated, customers scroll past you to a competitor. Missing or inconsistent details on your Google Maps listing quietly cost you local business every day.",
      "Our google business profile management Delhi service keeps your profile complete and active - accurate hours, real photos, the right categories, and regular posts. We also manage customer reviews and respond to them, since reviews directly affect how you rank in local search.",
      "The result is simple: when someone nearby searches for what you offer, your business shows up with the trust signals that make them choose you. Our gmb optimization services are built for exactly this - better visibility in 'near me' searches and the local pack, without you having to manage it yourself."
    ],
    iconName: "MapPin",
    ctaText: "Explore GMB Management",
    tag: "Local Maps SEO",
    gradient: "from-blue-600/10 via-indigo-600/10 to-primary/10",
    heroBadge: "Local Search & Maps Pack Specialist",
    delhiRelevance: "Targeting 'near me' local searchers across West Delhi, Uttam Nagar, Janakpuri, Dwarka, and Delhi NCR.",
    seo: {
      title: "Google Business Profile Experts in Delhi | Rank #1",
      description: "Show up first on Google Maps & get more calls with expert GBP management in Delhi. Verified results, real reviews. Book your free audit today!",
      keywords: [
        "google business profile management Delhi",
        "gmb optimization services Delhi",
        "local seo agency Delhi",
        "google maps ranking Delhi NCR",
        "near me search optimization Delhi"
      ]
    },
    features: [
      {
        title: "Complete Profile Optimization",
        description: "Standardize NAP (Name, Address, Phone), categories, attributes, and store hours to maximize Google Maps algorithm signals."
      },
      {
        title: "Active Post & Offer Updates",
        description: "Publish regular localized updates, product offers, and announcements to keep your profile active and engaging."
      },
      {
        title: "Review Strategy & Responses",
        description: "Implement simple review generation systems and provide professional responses that build trust and ranking strength."
      },
      {
        title: "Local Pack Rank Tracking",
        description: "Monitor your position in the Google Maps 3-Pack across target pincodes in West Delhi and broader Delhi NCR."
      }
    ],
    benefits: [
      {
        title: "More In-Store Footfall",
        description: "Local shoppers finding your business on Google Maps can easily navigate directly to your shop or clinic."
      },
      {
        title: "Increased Direct Calls",
        description: "Optimized click-to-call buttons on Google Maps generate direct customer inquiries daily."
      },
      {
        title: "Outrank Local Competitors",
        description: "A complete, active profile with positive reviews naturally beats static, outdated listings nearby."
      }
    ],
    faqs: [
      {
        q: "How does GMB optimization help my local shop in Delhi?",
        a: "When customers search 'near me' for services in Delhi, Google displays the Local 3-Pack on Maps. GMB optimization ensures your listing meets Google's ranking criteria, bringing your business to the top of search results."
      },
      {
        q: "How quickly will we see results from GMB management?",
        a: "Profile fixes and review management often lead to noticeable increases in phone calls and direction requests within the first 30 to 60 days."
      }
    ],
    relatedSlugs: [
      "seo-services-in-delhi",
      "web-development-services-in-delhi",
      "ppc-services-in-delhi"
    ]
  },
  {
    slug: "ppc-services-in-delhi",
    title: "PPC / Paid Ads (Google Ads)",
    navTitle: "PPC / Paid Ads",
    navShort: "Generate targeted leads through Google Ads and paid campaigns.",
    shortDesc: "Launch well-structured Google Ads campaigns targeted at keywords your customers actually search. We manage your account daily, refining ad copy and bids to lower your cost per click and drive qualified leads.",
    fullContent: [
      "Running Google Ads without the right setup means spending money on clicks that never turn into customers - a common and expensive mistake for businesses new to paid search.",
      "Our sem services Delhi start with clear goals for your ad spend, then build campaigns around the keywords your customers actually search. We manage your Google Ads account daily, testing and adjusting to improve click-through rate and lower your cost per click.",
      "As a ppc agency Delhi businesses trust for transparent reporting, we make sure every rupee of ad spend is working toward real leads, not just traffic. You get a google ads management agency that treats your budget like it's ours."
    ],
    iconName: "TrendingUp",
    ctaText: "Explore Paid Ads",
    tag: "Google Ads & PPC",
    gradient: "from-cyan-600/10 via-blue-600/10 to-primary/10",
    heroBadge: "PPC & Paid Search Specialists",
    delhiRelevance: "High-ROI Google Ads campaigns targeted directly to active searchers in Delhi NCR.",
    seo: {
      title: "PPC Services in Delhi | Instant Leads, Real ROI",
      description: "Get instant traffic & qualified leads with Delhi's top PPC experts. Smart bidding, proven ROI, zero guesswork. Call now for a free SEM strategy!",
      keywords: [
        "ppc services in Delhi",
        "sem services Delhi",
        "ppc agency Delhi",
        "google ads management agency Delhi",
        "paid search company Delhi NCR"
      ]
    },
    features: [
      {
        title: "Keyword Intent Research",
        description: "Target commercial search terms while adding negative keyword lists to prevent wasted ad budget."
      },
      {
        title: "Conversion Copywriting",
        description: "Craft high-CTR ad headlines and extensions that highlight your local business strengths."
      },
      {
        title: "Daily Bid & Budget Optimization",
        description: "Adjust keyword bids and location radiuses daily to maximize conversions within your budget."
      },
      {
        title: "Transparent Lead Tracking",
        description: "Map ad clicks directly to phone calls, form submits, and store direction requests."
      }
    ],
    benefits: [
      {
        title: "Immediate Traffic & Calls",
        description: "Start capturing interested local searchers on Google within days of campaign launch."
      },
      {
        title: "Controlled Budgeting",
        description: "Set strict daily caps so you spend only what you decide, with full reporting on every rupee."
      },
      {
        title: "High-Intent Customer Acquisition",
        description: "Reach people actively looking to buy or hire your specific service right now."
      }
    ],
    faqs: [
      {
        q: "What ad budget do I need to start Google Ads in Delhi?",
        a: "We tailor budgets to your local competition and goals. We work with flexible budgets designed for small and growing businesses so every rupee spent targets real local leads."
      }
    ],
    relatedSlugs: [
      "seo-services-in-delhi",
      "web-development-services-in-delhi",
      "google-business-profile-management-in-delhi"
    ]
  },
  {
    slug: "ecommerce-management-services-in-delhi",
    title: "Ecommerce Management",
    navTitle: "Ecommerce Management",
    navShort: "Manage marketplace listings, inventory and ecommerce operations.",
    shortDesc: "Keep your marketplace listings, inventory, and orders synchronized across Amazon, Flipkart, and your web store. We handle daily account management so your seller accounts stay active, accurate, and error-free.",
    fullContent: [
      "Managing your own store on Amazon, Flipkart, and your website at the same time is a full-time job on its own - and mistakes in inventory or listings cost you sales and ratings.",
      "Our ecommerce management services handle your marketplace listings, inventory updates, and order management, so your seller accounts stay accurate and active across platforms. We also support ecommerce website development Delhi for businesses building or improving their own online store.",
      "The benefit is fewer errors, faster order handling, and listings that stay optimized without you monitoring them daily. If you need amazon flipkart account management Delhi handled properly, this is exactly what we do."
    ],
    iconName: "ShoppingBag",
    ctaText: "Explore Ecommerce Management",
    tag: "Marketplace Growth",
    gradient: "from-emerald-600/10 via-teal-600/10 to-primary/10",
    heroBadge: "Marketplace & Online Store Operations",
    delhiRelevance: "Amazon, Flipkart, and store management services for ecommerce sellers in Delhi NCR.",
    seo: {
      title: "Ecommerce Management Delhi | Sell More, Stress Less",
      description: "Boost sales with expert ecommerce management in Delhi. Listings, ads, orders handled end-to-end. Get a free consultation today!",
      keywords: [
        "ecommerce management services Delhi",
        "amazon flipkart account management Delhi",
        "ecommerce website development Delhi",
        "marketplace management Delhi NCR",
        "online store management Delhi"
      ]
    },
    features: [
      {
        title: "Listing Optimization & SEO",
        description: "Write search-optimized product titles, bullet points, and A+ content for maximum search visibility."
      },
      {
        title: "Multi-Channel Inventory Sync",
        description: "Keep stock counts aligned across Amazon, Flipkart, Shopify, and local warehouse records."
      },
      {
        title: "Seller Account Health Audits",
        description: "Monitor order defect rates, customer feedback, and listing suspensions to keep accounts healthy."
      },
      {
        title: "Promotion & Ad Campaign Setup",
        description: "Run marketplace sponsored ads and deal promotions to drive velocity during peak sales periods."
      }
    ],
    benefits: [
      {
        title: "Fewer Operational Mistakes",
        description: "Prevent stockouts and wrong shipments with synchronized multi-platform inventory management."
      },
      {
        title: "Time Savings for Business Owners",
        description: "Focus on sourcing and business strategy while our team handles daily listing updates."
      },
      {
        title: "Higher Marketplace Ratings",
        description: "Maintain seller status and positive buyer reviews with fast, accurate account support."
      }
    ],
    faqs: [
      {
        q: "Can you help launch our brand on Amazon and Flipkart?",
        a: "Yes, we handle complete seller account setup, brand registry, initial product catalog uploads, and ad launch setups."
      }
    ],
    relatedSlugs: [
      "product-photography-services-in-delhi",
      "web-development-services-in-delhi",
      "ppc-services-in-delhi"
    ]
  },
  {
    slug: "graphic-design-services-in-delhi",
    title: "Graphic Design",
    navTitle: "Graphic Design",
    navShort: "Build a consistent and professional visual identity.",
    shortDesc: "Establish a strong visual identity with custom logos, brand assets, and marketing collateral. We keep your colors, typography, and design templates consistent so your business looks credible everywhere customers see it.",
    fullContent: [
      "Inconsistent visuals - a different logo style here, mismatched colours there - make even a good business look unprofessional and harder to remember.",
      "As a graphic design agency Delhi businesses turn to for consistent branding, we create your full visual identity: logo, brand assets, and marketing collateral that all work together. Our logo design services start with understanding your business before we design anything.",
      "The result is a brand that looks the same - and looks credible - everywhere your customers see it. Working with a graphic design company in Delhi that keeps your design templates and brand consistency in one place saves you time on every future project."
    ],
    iconName: "Palette",
    ctaText: "Explore Graphic Design",
    tag: "Brand Identity",
    gradient: "from-amber-600/10 via-yellow-600/10 to-primary/10",
    heroBadge: "Brand Identity & Graphic Design",
    delhiRelevance: "Logo design, marketing collateral, and visual branding systems for businesses in Delhi.",
    seo: {
      title: "Graphic Design Services Delhi | Designs That Convert",
      description: "Get logos, posts & brand kits that actually get noticed. Delhi's trusted graphic design experts, fast turnaround. Call now for a free quote!",
      keywords: [
        "graphic design services in Delhi",
        "graphic design agency Delhi",
        "graphic design company in Delhi",
        "logo design services Delhi",
        "brand design agency Delhi NCR"
      ]
    },
    features: [
      {
        title: "Logo & Brand Mark Design",
        description: "Versatile, original logo concepts crafted to reflect your core business values and market positioning."
      },
      {
        title: "Brand Style Guides",
        description: "Comprehensive color palettes, typography rules, and usage guidelines for brand consistency."
      },
      {
        title: "Marketing Collateral & Print Assets",
        description: "Brochures, signage, banners, business cards, and packaging designs ready for local print."
      },
      {
        title: "Social Media Design Templates",
        description: "Editable graphic templates for Instagram, Facebook, and ad banners."
      }
    ],
    benefits: [
      {
        title: "Instant Customer Trust",
        description: "Professional, cohesive visual design gives prospects confidence in your service quality."
      },
      {
        title: "Consistent Brand Recognition",
        description: "Look recognizable everywhere—from your shop sign to your website and social feeds."
      },
      {
        title: "Time Savings on Future Projects",
        description: "Pre-built brand templates make creating future posts and ads fast and effortless."
      }
    ],
    faqs: [
      {
        q: "What files do I receive with logo and branding projects?",
        a: "You receive complete master vector source files (AI, EPS, SVG) alongside PNG, JPG, and PDF versions for web and print."
      }
    ],
    relatedSlugs: [
      "web-development-services-in-delhi",
      "smo-services-in-delhi",
      "product-photography-services-in-delhi"
    ]
  },
  {
    slug: "seo-services-in-delhi",
    title: "SEO Services",
    navTitle: "SEO",
    navShort: "Build long-term organic visibility and qualified traffic.",
    shortDesc: "We start with a thorough website and competitor audit to fix technical issues and improve on-page content. Our team builds local relevance to help your business gain steady organic search visibility and qualified traffic over time.",
    fullContent: [
      "Most businesses in Delhi have a website, but it doesn't show up when people actually search for their products or services - which means customers are finding your competitors instead of you.",
      "Our seo services in Delhi start with a full audit of your website, keywords, and competitors. We fix technical issues, improve on-page content, strengthen local relevance for your area, and target the exact searches your customers are typing in.",
      "Over time, this means more people find your business organically, without paying for every click. As a seo agency Delhi NCR businesses turn to for steady growth, we focus on real gains - better search rankings, more organic traffic, and stronger website authority - with most clients seeing progress within 3 to 6 months."
    ],
    iconName: "Search",
    ctaText: "Explore SEO Services",
    tag: "Organic Search",
    gradient: "from-emerald-600/10 via-teal-600/10 to-primary/10",
    heroBadge: "Data-Driven SEO Agency",
    delhiRelevance: "Optimizing website rankings for competitive commercial terms across Delhi NCR and local Delhi markets.",
    seo: {
      title: "SEO Services in Delhi | Rank #1 on Google Fast",
      description: "Get real keywords, real traffic & real growth with Delhi's top SEO experts. Proven strategies, guaranteed results. Book a free SEO audit now!",
      keywords: [
        "seo services in Delhi",
        "seo agency Delhi NCR",
        "local seo company Delhi",
        "organic search optimization Delhi",
        "website ranking Delhi"
      ]
    },
    features: [
      {
        title: "Technical SEO Audits",
        description: "Identify and resolve page speed bottlenecks, indexing errors, mobile responsiveness issues, and site architecture flaws."
      },
      {
        title: "Local Keyword Targeting",
        description: "Target high-intent transactional search queries used by customers searching in Delhi and specific local suburbs."
      },
      {
        title: "On-Page Content Optimization",
        description: "Structure headers, meta tags, and body content to match search intent and establish topical authority."
      },
      {
        title: "Authority Link Building",
        description: "Build clean, relevant backlinks and local directory references that strengthen domain trust safely."
      }
    ],
    benefits: [
      {
        title: "Sustainable Free Traffic",
        description: "Unlike paid ads that stop when budget runs out, organic search rankings continue driving visitors long-term."
      },
      {
        title: "Higher Conversion Intent",
        description: "Searchers actively looking for solutions on Google convert at significantly higher rates than casual scrollers."
      },
      {
        title: "Stronger Brand Authority",
        description: "Ranking on Page 1 of Google establishes immediate credibility and trust in your industry."
      }
    ],
    faqs: [
      {
        q: "How long does SEO take to produce measurable results?",
        a: "SEO is a consistent, compound process. Initial keyword position improvements appear in 45-60 days, with major traffic and ranking gains taking hold within 3 to 6 months."
      },
      {
        q: "Do you guarantee #1 Google rankings?",
        a: "No honest SEO agency can guarantee #1 spots due to search algorithm updates, but our methodologies consistently move target terms onto Page 1 for local businesses in Delhi."
      }
    ],
    relatedSlugs: [
      "google-business-profile-management-in-delhi",
      "ppc-services-in-delhi",
      "web-development-services-in-delhi"
    ]
  },
  {
    slug: "social-media-marketing-services-in-delhi",
    title: "Social Media Marketing (SMM)",
    navTitle: "Social Media Marketing",
    navShort: "Build consistent social media growth and engagement.",
    shortDesc: "Build a real audience with strategic content calendars and targeted posts designed for engagement. We help you connect with your ideal customers and turn social interactions into genuine leads for your business.",
    fullContent: [
      "Posting occasionally on social media rarely brings in customers. Without a plan, it becomes noise your audience scrolls past instead of a channel that grows your business.",
      "As a social media marketing agency Delhi businesses rely on for consistent growth, we build a real content calendar, define your audience targeting, and create posts designed for engagement - not just likes.",
      "The result is a social media presence that builds genuine community around your brand and brings in leads, not just views. Our SMM services Delhi NCR are built to turn followers into customers, with content and targeting tailored to your specific audience."
    ],
    iconName: "Target",
    ctaText: "Explore SMM",
    tag: "Audience & Leads",
    gradient: "from-amber-600/10 via-orange-600/10 to-primary/10",
    heroBadge: "Social Media Growth Agency",
    delhiRelevance: "Targeted content marketing and community growth for businesses operating in Delhi NCR markets.",
    seo: {
      title: "SMM Services in Delhi | Build a Brand People Follow",
      description: "Get scroll-stopping content, smart ads & real engagement with Delhi's top SMM experts. Proven growth strategies. Call now for a free consultation!",
      keywords: [
        "social media marketing services in Delhi",
        "social media marketing agency Delhi",
        "SMM services Delhi NCR",
        "social media company Delhi",
        "instagram marketing Delhi"
      ]
    },
    features: [
      {
        title: "Strategic Content Calendars",
        description: "Plan monthly publishing schedules balancing educational, promotional, reel, and community content."
      },
      {
        title: "Targeted Audience Strategy",
        description: "Identify demographic and interest profiles specific to your local Delhi NCR buyer persona."
      },
      {
        title: "Engagement Copywriting",
        description: "Write direct, relatable post captions crafted to drive comments, saves, and inquiries."
      },
      {
        title: "Performance Reporting",
        description: "Track reach, profile visits, post interactions, and lead inquiries driven by your social channels."
      }
    ],
    benefits: [
      {
        title: "Genuine Customer Leads",
        description: "Transform your social accounts into active lead generators instead of passive photo galleries."
      },
      {
        title: "Active Local Community",
        description: "Build brand loyalty with local Delhi customers who regularly interact with your posts."
      },
      {
        title: "Consistent Publishing",
        description: "Never worry about what to post next; our team handles design, copy, and scheduling consistently."
      }
    ],
    faqs: [
      {
        q: "Which social media platforms should my Delhi business be on?",
        a: "Most local businesses benefit most from Instagram and Facebook. B2B businesses also benefit greatly from LinkedIn. We help you choose the right platforms for your specific customer base."
      }
    ],
    relatedSlugs: [
      "smo-services-in-delhi",
      "video-editing-services-in-delhi",
      "graphic-design-services-in-delhi"
    ]
  },
  {
    slug: "product-photography-services-in-delhi",
    title: "Product Photography",
    navTitle: "Product Photography",
    navShort: "Professional product visuals designed to improve trust and conversions.",
    shortDesc: "Build buyer trust with clean white-background listings and styled product photos for your store and social channels. Our catalog shoots ensure every item looks professional and consistent, driving higher sales conversions.",
    fullContent: [
      "Product photos taken on a phone in poor lighting can quietly hurt your online sales - customers judge quality by how your listings look before they read a single word.",
      "Our product photography services Delhi cover everything from white background photography for listings to styled shots for your website and social media. We handle full catalog shoots so every product looks consistent and professional.",
      "Clean, consistent product images build trust and directly improve conversion on your listings. Whether it's an ecommerce product shoot Delhi for Amazon and Flipkart or visual merchandising for your own site, better photos mean fewer questions and more completed purchases."
    ],
    iconName: "Camera",
    ctaText: "Explore Product Photography",
    tag: "Catalog & Visuals",
    gradient: "from-purple-600/10 via-violet-600/10 to-primary/10",
    heroBadge: "Ecommerce Studio Photography",
    delhiRelevance: "Studio catalog shoots and styled product photography for sellers and brands in Delhi NCR.",
    seo: {
      title: "Product Photography Delhi | Shots That Sell Fast",
      description: "Get clean, high-converting product shots with Delhi's trusted photography experts. Better listings, higher sales. Book your free shoot today!",
      keywords: [
        "product photography services in Delhi",
        "product photography services Delhi",
        "ecommerce product shoot Delhi",
        "amazon flipkart photography Delhi",
        "catalog photography Delhi NCR"
      ]
    },
    features: [
      {
        title: "White Background Catalog Shoots",
        description: "High-resolution studio lighting shoots meeting Amazon, Flipkart, and marketplace specifications."
      },
      {
        title: "Styled Lifestyle & Prop Shoots",
        description: "Contextual staging with color palettes and props designed for website banners and social media."
      },
      {
        title: "High-End Retouching & Color Grading",
        description: "Professional post-processing ensuring accurate product textures, colors, and shadow detail."
      },
      {
        title: "Web & Print Ready Files",
        description: "Receive web-optimized images for fast loading alongside print-ready resolution files."
      }
    ],
    benefits: [
      {
        title: "Higher Conversion Rates",
        description: "Clear, crisp product visuals build buyer confidence and reduce bounce rates on listings."
      },
      {
        title: "Reduced Product Returns",
        description: "Accurate lighting and color rendering ensure customers receive exactly what they expect."
      },
      {
        title: "Marketplace Compliance",
        description: "Images formatted cleanly to prevent listing rejections on Amazon, Flipkart, and Shopify."
      }
    ],
    faqs: [
      {
        q: "Do you handle product shoots for Amazon and Flipkart in Delhi?",
        a: "Yes, our photography team understands the exact image resolution, white background, and crop requirements for major marketplaces."
      }
    ],
    relatedSlugs: [
      "ecommerce-management-services-in-delhi",
      "graphic-design-services-in-delhi",
      "web-development-services-in-delhi"
    ]
  },
  {
    slug: "video-editing-services-in-delhi",
    title: "Video Editing",
    navTitle: "Video Editing",
    navShort: "Turn raw footage into engaging short-form and brand content.",
    shortDesc: "Turn raw clips into engaging short-form Reels and corporate brand videos that hold viewer attention. We handle visual pacing, animated captions, and sound design to help your video content perform on any platform.",
    fullContent: [
      "Raw video footage rarely performs well online - it's the editing that turns a simple clip into something people actually watch and share.",
      "Our video editing services Delhi cover everything from short-form video for reels to full brand videos for your website and campaigns. We handle pacing, captions, and sound so your videos hold attention from the first few seconds.",
      "As a reels editing agency built for how people actually watch content today, we focus on video that performs - more views, more shares, and stronger brand recall. Our corporate video editing work follows the same standard, whether it's for social media or a company presentation."
    ],
    iconName: "Video",
    ctaText: "Explore Video Editing",
    tag: "Reels & Corporate",
    gradient: "from-rose-600/10 via-pink-600/10 to-primary/10",
    heroBadge: "Reels & Creative Video Editing",
    delhiRelevance: "Short-form video editing for Instagram Reels, YouTube Shorts, and corporate brand videos in Delhi NCR.",
    seo: {
      title: "Video Editing Services Delhi | Scroll-Stopping Cuts",
      description: "Turn raw footage into high-quality, scroll-stopping content with Delhi's top video editors. Fast turnaround, real results. Call now for a free quote!",
      keywords: [
        "video editing services in Delhi",
        "video editing agency Delhi",
        "youtube video editor Delhi",
        "reels editing agency Delhi",
        "commercial video editing Delhi NCR"
      ]
    },
    features: [
      {
        title: "Short-Form Reels & Shorts Editing",
        description: "Pacing cuts, hook enhancements, animated text captions, and trending audio setups for social algorithms."
      },
      {
        title: "Corporate & Brand Showcase Videos",
        description: "Polished interviews, office walkthroughs, and product highlights formatted for web and presentations."
      },
      {
        title: "Sound Design & Audio Cleaning",
        description: "Remove background noise, adjust voice levels, and add licensed background music."
      },
      {
        title: "Color Grading & Graphic Motion",
        description: "Enhance visual vibrance with color correction and lower-third animated titles."
      }
    ],
    benefits: [
      {
        title: "Higher Viewer Retention",
        description: "Engaging cuts and dynamic subtitles keep scrollers watching your videos to the end."
      },
      {
        title: "Greater Organic Social Reach",
        description: "Optimized short-form video performs significantly better on social algorithms."
      },
      {
        title: "Professional Brand Image",
        description: "Turn raw phone clips into polished marketing assets that showcase your quality."
      }
    ],
    faqs: [
      {
        q: "What raw video formats can I send for editing?",
        a: "You can send raw video clips directly from your phone or camera via Google Drive, Dropbox, or WeTransfer."
      }
    ],
    relatedSlugs: [
      "social-media-marketing-services-in-delhi",
      "smo-services-in-delhi",
      "graphic-design-services-in-delhi"
    ]
  },
  {
    slug: "web-development-services-in-delhi",
    title: "Web Development",
    navTitle: "Web Development",
    navShort: "Fast, responsive websites designed for performance and conversion.",
    shortDesc: "Build a fast, mobile-friendly website engineered for speed and conversion. Our team develops responsive sites with clear user pathways that keep visitors engaged and make it simple for them to contact your business.",
    fullContent: [
      "A slow, outdated, or hard-to-navigate website loses customers before they even see what you offer - most visitors leave a page that takes too long to load.",
      "Our web development company Delhi team builds responsive websites that work as well on a phone as on a desktop, with page speed and user experience built in from the start, not fixed later.",
      "A faster, mobile-friendly site means visitors stay longer and are more likely to convert into customers. As a website design agency Delhi NCR businesses choose for custom website design company Delhi work, including our web development company in Uttam Nagar clients, we build sites meant to perform, not just look good."
    ],
    iconName: "Code",
    ctaText: "Explore Web Development",
    tag: "High-Speed Next.js",
    gradient: "from-blue-600/10 via-indigo-600/10 to-primary/10",
    heroBadge: "Custom Web Engineering & Next.js",
    delhiRelevance: "Responsive, high-speed website development for businesses in Uttam Nagar, West Delhi, and across Delhi NCR.",
    seo: {
      title: "Website Development Delhi | Fast, Built to Convert",
      description: "Get a fast, mobile-friendly website that actually converts. Delhi's trusted web development experts. Call now for a free website consultation!",
      keywords: [
        "web development company in Delhi",
        "web design agency Delhi NCR",
        "custom website development Delhi",
        "ecommerce web development Delhi",
        "responsive web design services"
      ]
    },
    features: [
      {
        title: "Custom Next.js & React Frontend",
        description: "Ultra-fast page speed, server-side rendering, and clean modern code structure with zero bloat."
      },
      {
        title: "Mobile-First Responsive Layouts",
        description: "Flawless user experience across smartphones, tablets, laptops, and desktop displays."
      },
      {
        title: "Conversion-Focused UX Architecture",
        description: "Clear call-to-action pathways, phone click buttons, and lead capture forms built right in."
      },
      {
        title: "On-Page SEO & Speed Optimization",
        description: "Built-in meta structures, schema markup, and optimal Google Core Web Vitals performance."
      }
    ],
    benefits: [
      {
        title: "Lower Visitor Exit Rates",
        description: "Instant loading pages keep visitors engaged instead of bouncing back to search results."
      },
      {
        title: "Higher Conversion Velocity",
        description: "Intuitive layout navigation leads scrollers smoothly into submitting inquiries or calling."
      },
      {
        title: "Strong Search Ranking Foundation",
        description: "Clean code structure allows search engine bots to crawl and index your pages easily."
      }
    ],
    faqs: [
      {
        q: "Is the website mobile-friendly and fast?",
        a: "Yes, all our websites follow a mobile-first engineering approach, optimized for high Core Web Vitals speed scores."
      }
    ],
    relatedSlugs: [
      "seo-services-in-delhi",
      "ppc-services-in-delhi",
      "graphic-design-services-in-delhi"
    ]
  }
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  if (!slug) return undefined;
  // First, check direct match with current production slug
  let match = servicesData.find((s) => s.slug === slug);
  if (match) return match;

  // Next, check if it's a mapped legacy/short slug
  const mappedSlug = OLD_TO_NEW_SLUG_MAP[slug];
  if (mappedSlug) {
    return servicesData.find((s) => s.slug === mappedSlug);
  }

  return undefined;
}
