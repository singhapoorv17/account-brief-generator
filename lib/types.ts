export interface CompanySnapshot {
  name: string;
  description: string;
  hq: string;
  employeeCount: string;
  industryTags: string[];
}

export interface FundingSignal {
  date: string;
  summary: string;
  sourceUrl: string;
}

export interface KeyHire {
  name: string;
  title: string;
  startDate: string;
  linkedInUrl: string;
}

export interface BuyingTrigger {
  title: string;
  whyItMatters: string;
}

export interface Contact {
  name: string;
  title: string;
  linkedInUrl: string;
  email?: string;
}

export interface ProviderCall {
  provider: string;
  purpose: string;
  status: "success" | "fallback" | "error";
  price: number;
  latencyMs: number;
}

export interface AccountBrief {
  companySnapshot: CompanySnapshot;
  fundingSignals: FundingSignal[];
  keyHires: KeyHire[];
  buyingTriggers: BuyingTrigger[];
  contacts: Contact[];
  outreachAngle: string;
  providerCalls: ProviderCall[];
}

export interface ResearchRequest {
  url: string;
  icp?: string;
  product?: string;
}

export type ProviderStatus = "pending" | "running" | "complete" | "error";

export interface ProviderProgress {
  id: string;
  label: string;
  purpose?: string;
  status: ProviderStatus;
  latencyMs?: number;
  credits?: number;
}
