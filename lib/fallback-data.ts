import type { AccountBrief } from "./types"

const fallbacks: Record<string, AccountBrief> = {
  "stripe.com": {
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
          "The Billing 2.0 launch with AI features shows they're investing in helping customers optimize revenue.",
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
      { provider: "Linkup", purpose: "Recent news and funding signals", status: "fallback", price: 0, latencyMs: 0 },
      { provider: "People Data Labs", purpose: "Company profile and recent hires", status: "fallback", price: 0, latencyMs: 0 },
      { provider: "ScrapeGraph", purpose: "Website positioning analysis", status: "fallback", price: 0, latencyMs: 0 },
      { provider: "GPT-4o", purpose: "Brief synthesis", status: "fallback", price: 0, latencyMs: 0 },
    ],
  },

  "anthropic.com": {
    companySnapshot: {
      name: "Anthropic",
      description:
        "AI safety company building reliable, interpretable, and steerable AI systems. Creator of the Claude family of AI assistants.",
      hq: "San Francisco, CA",
      employeeCount: "1,000+",
      industryTags: ["AI / ML", "AI Safety", "Enterprise AI", "Research"],
    },
    fundingSignals: [
      {
        date: "2024-03-04",
        summary:
          "Anthropic raised $2.75B in a Series C round led by Menlo Ventures, valuing the company at $18.4B.",
        sourceUrl: "https://techcrunch.com/anthropic-series-c",
      },
      {
        date: "2024-01-10",
        summary:
          "Amazon announced an additional $1.25B investment in Anthropic, bringing its total to $4B.",
        sourceUrl: "https://aboutamazon.com/anthropic-investment",
      },
      {
        date: "2024-03-14",
        summary:
          "Launched Claude 3 model family (Opus, Sonnet, Haiku) with state-of-the-art benchmark performance.",
        sourceUrl: "https://anthropic.com/claude-3",
      },
    ],
    keyHires: [
      {
        name: "Daniela Amodei",
        title: "President",
        startDate: "2021-01-01",
        linkedInUrl: "https://linkedin.com/in/danielaamodei",
      },
      {
        name: "Mike Krieger",
        title: "Chief Product Officer",
        startDate: "2024-03-18",
        linkedInUrl: "https://linkedin.com/in/mikekrieger",
      },
      {
        name: "Scott White",
        title: "VP of Revenue",
        startDate: "2024-01-15",
        linkedInUrl: "https://linkedin.com/in/scottwhite",
      },
    ],
    buyingTriggers: [
      {
        title: "Rapid Enterprise Growth",
        whyItMatters:
          "Major funding rounds and enterprise-tier launches signal aggressive go-to-market. They need tools to support scaling sales motion.",
      },
      {
        title: "Product-Led Growth Pivot",
        whyItMatters:
          "Hiring a CPO from Instagram suggests a consumer-grade product push, creating new tooling needs across the org.",
      },
      {
        title: "API Platform Expansion",
        whyItMatters:
          "Claude API growth means expanding developer relations and partner ecosystem that requires supporting infrastructure.",
      },
    ],
    contacts: [
      {
        name: "Scott White",
        title: "VP of Revenue",
        linkedInUrl: "https://linkedin.com/in/scottwhite",
      },
      {
        name: "Mike Krieger",
        title: "Chief Product Officer",
        linkedInUrl: "https://linkedin.com/in/mikekrieger",
      },
    ],
    outreachAngle:
      "Anthropic is scaling its enterprise sales motion rapidly after massive funding rounds. With a new VP of Revenue building out the GTM org, they're likely evaluating tools that help reps research accounts and personalize outreach at scale. Lead with how you can help their expanding sales team convert the surge of inbound enterprise interest.",
    providerCalls: [
      { provider: "Linkup", purpose: "Recent news and funding signals", status: "fallback", price: 0, latencyMs: 0 },
      { provider: "People Data Labs", purpose: "Company profile and recent hires", status: "fallback", price: 0, latencyMs: 0 },
      { provider: "ScrapeGraph", purpose: "Website positioning analysis", status: "fallback", price: 0, latencyMs: 0 },
      { provider: "GPT-4o", purpose: "Brief synthesis", status: "fallback", price: 0, latencyMs: 0 },
    ],
  },

  "linear.app": {
    companySnapshot: {
      name: "Linear",
      description:
        "Modern project management and issue tracking tool built for high-performance software teams. Known for speed and keyboard-first UX.",
      hq: "San Francisco, CA",
      employeeCount: "100+",
      industryTags: ["SaaS", "Developer Tools", "Project Management", "B2B"],
    },
    fundingSignals: [
      {
        date: "2022-09-06",
        summary:
          "Linear raised $35M in Series B led by Spark Capital, at a $400M+ valuation.",
        sourceUrl: "https://linear.app/blog/series-b",
      },
      {
        date: "2024-02-12",
        summary:
          "Launched Linear Initiatives for cross-team project tracking and portfolio-level planning.",
        sourceUrl: "https://linear.app/blog/initiatives",
      },
    ],
    keyHires: [
      {
        name: "Nan Yu",
        title: "Head of Design",
        startDate: "2023-10-01",
        linkedInUrl: "https://linkedin.com/in/nanyu",
      },
      {
        name: "Ian Storm Taylor",
        title: "Engineering Lead",
        startDate: "2023-06-15",
        linkedInUrl: "https://linkedin.com/in/ianstormtaylor",
      },
    ],
    buyingTriggers: [
      {
        title: "Enterprise Feature Push",
        whyItMatters:
          "Initiatives and portfolio planning features signal a push into larger orgs that need more sophisticated tooling around their dev workflow.",
      },
      {
        title: "Team Scaling",
        whyItMatters:
          "Growing from a small team to 100+ means new internal tooling needs and vendor evaluations as processes formalize.",
      },
    ],
    contacts: [
      {
        name: "Karri Saarinen",
        title: "CEO & Co-founder",
        linkedInUrl: "https://linkedin.com/in/karrisaarinen",
      },
      {
        name: "Tuomas Artman",
        title: "CTO & Co-founder",
        linkedInUrl: "https://linkedin.com/in/tuomasartman",
      },
    ],
    outreachAngle:
      "Linear is moving upmarket with enterprise features like Initiatives. As they scale the team and onboard larger customers, they'll need tools that match their own bar for speed and polish. Position your product as something that fits their engineering-first culture and helps their growing sales/CS teams keep pace with product velocity.",
    providerCalls: [
      { provider: "Linkup", purpose: "Recent news and funding signals", status: "fallback", price: 0, latencyMs: 0 },
      { provider: "People Data Labs", purpose: "Company profile and recent hires", status: "fallback", price: 0, latencyMs: 0 },
      { provider: "ScrapeGraph", purpose: "Website positioning analysis", status: "fallback", price: 0, latencyMs: 0 },
      { provider: "GPT-4o", purpose: "Brief synthesis", status: "fallback", price: 0, latencyMs: 0 },
    ],
  },

  "vercel.com": {
    companySnapshot: {
      name: "Vercel",
      description:
        "Frontend cloud platform enabling developers to build and deploy web applications. Creator of the Next.js framework.",
      hq: "San Francisco, CA",
      employeeCount: "800+",
      industryTags: ["Developer Tools", "Cloud Infrastructure", "SaaS", "Web Platform"],
    },
    fundingSignals: [
      {
        date: "2024-05-16",
        summary:
          "Vercel raised $250M in Series E at a $3.25B valuation, led by Accel.",
        sourceUrl: "https://vercel.com/blog/series-e",
      },
      {
        date: "2024-04-10",
        summary:
          "Launched v0, an AI-powered UI generation tool, signaling investment in AI-assisted development.",
        sourceUrl: "https://vercel.com/blog/v0",
      },
      {
        date: "2024-02-22",
        summary:
          "Announced Vercel Firewall, expanding into the application security space for enterprise customers.",
        sourceUrl: "https://vercel.com/blog/firewall",
      },
    ],
    keyHires: [
      {
        name: "Jared Palmer",
        title: "VP of AI",
        startDate: "2023-08-01",
        linkedInUrl: "https://linkedin.com/in/jaredpalmer",
      },
      {
        name: "Christina Cacioppo",
        title: "VP of Sales",
        startDate: "2024-01-20",
        linkedInUrl: "https://linkedin.com/in/christinacacioppo",
      },
    ],
    buyingTriggers: [
      {
        title: "AI Product Investment",
        whyItMatters:
          "v0 and the VP of AI hire show Vercel is betting big on AI-assisted development. They may need supporting data and intelligence tooling.",
      },
      {
        title: "Enterprise Sales Build-Out",
        whyItMatters:
          "New VP of Sales and enterprise features like Firewall signal a push into larger accounts with formal sales cycles.",
      },
      {
        title: "Series E Growth Mode",
        whyItMatters:
          "$250M in fresh funding means aggressive hiring and expansion, creating needs across the GTM stack.",
      },
    ],
    contacts: [
      {
        name: "Guillermo Rauch",
        title: "CEO & Founder",
        linkedInUrl: "https://linkedin.com/in/guillermorauch",
      },
      {
        name: "Christina Cacioppo",
        title: "VP of Sales",
        linkedInUrl: "https://linkedin.com/in/christinacacioppo",
      },
    ],
    outreachAngle:
      "Vercel just raised $250M and is building out enterprise sales with a new VP of Sales. They're also pushing into AI with v0. Position your outreach around enabling their sales team to convert the growing wave of enterprise interest, especially as they expand beyond developer-led adoption into top-down enterprise deals.",
    providerCalls: [
      { provider: "Linkup", purpose: "Recent news and funding signals", status: "fallback", price: 0, latencyMs: 0 },
      { provider: "People Data Labs", purpose: "Company profile and recent hires", status: "fallback", price: 0, latencyMs: 0 },
      { provider: "ScrapeGraph", purpose: "Website positioning analysis", status: "fallback", price: 0, latencyMs: 0 },
      { provider: "GPT-4o", purpose: "Brief synthesis", status: "fallback", price: 0, latencyMs: 0 },
    ],
  },

  "notion.so": {
    companySnapshot: {
      name: "Notion",
      description:
        "All-in-one workspace combining notes, docs, wikis, project management, and databases. Used by teams for knowledge management and collaboration.",
      hq: "San Francisco, CA",
      employeeCount: "800+",
      industryTags: ["SaaS", "Productivity", "Collaboration", "Knowledge Management"],
    },
    fundingSignals: [
      {
        date: "2024-02-20",
        summary:
          "Notion launched Notion AI connectors, integrating with Slack, Google Drive, and other tools for contextual AI answers.",
        sourceUrl: "https://notion.so/blog/ai-connectors",
      },
      {
        date: "2023-07-11",
        summary:
          "Announced Notion Projects, a full project management suite competing with Linear and Asana.",
        sourceUrl: "https://notion.so/blog/projects",
      },
    ],
    keyHires: [
      {
        name: "Ravi Mehta",
        title: "VP of Product",
        startDate: "2023-09-01",
        linkedInUrl: "https://linkedin.com/in/ravimehta",
      },
      {
        name: "Linus Lee",
        title: "Head of AI",
        startDate: "2023-11-01",
        linkedInUrl: "https://linkedin.com/in/linuslee",
      },
    ],
    buyingTriggers: [
      {
        title: "AI Platform Expansion",
        whyItMatters:
          "Notion AI connectors show they're building an AI-first knowledge layer. They'll need data providers and infrastructure to power these features.",
      },
      {
        title: "Enterprise GTM Push",
        whyItMatters:
          "Notion Projects and enterprise SSO/SCIM features indicate a push into larger organizations with formal procurement cycles.",
      },
    ],
    contacts: [
      {
        name: "Ivan Zhao",
        title: "CEO & Co-founder",
        linkedInUrl: "https://linkedin.com/in/ivanzhao",
      },
      {
        name: "Ravi Mehta",
        title: "VP of Product",
        linkedInUrl: "https://linkedin.com/in/ravimehta",
      },
    ],
    outreachAngle:
      "Notion is investing heavily in AI features and moving upmarket into enterprise. Their AI connectors initiative signals a need for high-quality data integrations. Position your outreach around how you can help their expanding enterprise sales team research and personalize outreach to larger accounts adopting Notion as their team workspace.",
    providerCalls: [
      { provider: "Linkup", purpose: "Recent news and funding signals", status: "fallback", price: 0, latencyMs: 0 },
      { provider: "People Data Labs", purpose: "Company profile and recent hires", status: "fallback", price: 0, latencyMs: 0 },
      { provider: "ScrapeGraph", purpose: "Website positioning analysis", status: "fallback", price: 0, latencyMs: 0 },
      { provider: "GPT-4o", purpose: "Brief synthesis", status: "fallback", price: 0, latencyMs: 0 },
    ],
  },
}

export function hasFallback(domain: string): boolean {
  return domain in fallbacks
}

export function getFallback(domain: string): AccountBrief | null {
  return fallbacks[domain] ?? null
}
