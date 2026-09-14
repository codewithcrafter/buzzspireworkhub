export type CaseStudyCategory = 
  | "All"
  | "Real Estate"
  | "Technology"
  | "Education"
  | "Fashion & Lifestyle"
  | "Health & Fitness"
  | "Food & Beverage";

export interface MetricItem {
  label: string;
  value: string;
  description: string;
  change?: string;
}

export interface ExecutionStep {
  title: string;
  description: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  client: string;
  industry: CaseStudyCategory;
  logoText?: string;
  featuredImage: string;
  shortDescription: string;
  services: string[];
  heroMetric: {
    label: string;
    value: string;
  };
  overview: string;
  challenge: string;
  objectives: string[];
  strategy: string;
  execution: ExecutionStep[];
  results: MetricItem[];
  conclusion: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
  isDemo: boolean;
}
