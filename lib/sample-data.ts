import type { AccountBrief } from "./types";

export const sampleBrief: AccountBrief = {
  companySnapshot: {
    name: "Stripe",
    description:
      "Financial infrastructure platform for the internet, enabling businesses to accept payments and manage their finances online.",
    hq: "San Francisco, CA",
    employeeCount: "7,000+",
    industryTags: ["FinTech", "Payments", "SaaS", "Developer Tools"],
  },
  fundingSignals: [
    {
      date: "2023-03-15",
      summary:
        "Stripe raised $6.5B in Series I funding at a $50B valuation, down from $95B in 2021.",
      sourceUrl: "https://techcrunch.com/stripe-series-i",
    },
    {
      date: "2024-01-20",
      summary:
        "Announced expansion into crypto on-ramps and fiat-to-crypto payments.",
      sourceUrl: "https://stripe.com/blog/crypto-onramp",
    },
    {
      date: "2024-02-28",
      summary:
        "Launched Stripe Billing 2.0 with AI-powered revenue optimization features.",
      sourceUrl: "https://stripe.com/blog/billing-2",
    },
  ],
  keyHires: [
    {
      name: "Sarah Chen",
      title: "VP of Engineering",
      startDate: "2024-01-15",
      linkedInUrl: "https://linkedin.com/in/sarahchen",
    },
    {
      name: "Marcus Johnson",
      title: "Head of AI Products",
      startDate: "2024-02-01",
      linkedInUrl: "https://linkedin.com/in/marcusjohnson",
    },
    {
      name: "Emily Rodriguez",
      title: "Director of Enterprise Sales",
      startDate: "2024-02-20",
      linkedInUrl: "https://linkedin.com/in/emilyrodriguez",
    },
    {
      name: "David Kim",
      title: "Chief Revenue Officer",
      startDate: "2024-03-01",
      linkedInUrl: "https://linkedin.com/in/davidkim",
    },
  ],
  buyingTriggers: [
    {
      title: "New AI Products Leadership",
      whyItMatters:
        "The recent hire of a Head of AI Products signals investment in AI capabilities. They may be evaluating AI tools to enhance their product offerings.",
    },
    {
      title: "Enterprise Sales Expansion",
      whyItMatters:
        "New Director of Enterprise Sales indicates a push upmarket. They likely need tools that help close larger deals faster.",
    },
    {
      title: "Revenue Optimization Focus",
      whyItMatters:
        "The Billing 2.0 launch with AI features shows they're investing in helping customers optimize revenue - a potential alignment with your value prop.",
    },
  ],
  contacts: [
    {
      name: "David Kim",
      title: "Chief Revenue Officer",
      linkedInUrl: "https://linkedin.com/in/davidkim",
      email: "d.kim@stripe.com",
    },
    {
      name: "Emily Rodriguez",
      title: "Director of Enterprise Sales",
      linkedInUrl: "https://linkedin.com/in/emilyrodriguez",
      email: "e.rodriguez@stripe.com",
    },
    {
      name: "Marcus Johnson",
      title: "Head of AI Products",
      linkedInUrl: "https://linkedin.com/in/marcusjohnson",
    },
  ],
  outreachAngle:
    "Given Stripe's recent focus on AI-powered revenue optimization and their enterprise sales expansion, position your outreach around how your solution can help their sales team close larger deals faster. Reference the Billing 2.0 launch as evidence they're investing in AI to drive customer outcomes.",
  providerCalls: [
    {
      provider: "Linkup",
      purpose: "Recent news and funding signals",
      status: "success",
      price: 2,
      latencyMs: 1250,
    },
    {
      provider: "People Data Labs",
      purpose: "Company profile and recent hires",
      status: "success",
      price: 3,
      latencyMs: 890,
    },
    {
      provider: "ScrapeGraph",
      purpose: "Website positioning analysis",
      status: "success",
      price: 2,
      latencyMs: 2100,
    },
    {
      provider: "GPT-4o",
      purpose: "Brief synthesis",
      status: "success",
      price: 5,
      latencyMs: 3400,
    },
  ],
};
