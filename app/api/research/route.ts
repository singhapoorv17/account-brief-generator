import { NextResponse } from "next/server";
import type { ResearchRequest, AccountBrief } from "@/lib/types";
import { sampleBrief } from "@/lib/sample-data";

export async function POST(request: Request) {
  try {
    const body: ResearchRequest = await request.json();

    if (!body.url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(body.url.startsWith("http") ? body.url : `https://${body.url}`);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Simulate processing time for realistic demo
    await new Promise((resolve) => setTimeout(resolve, 100));

    // For now, return hardcoded sample data
    // In the follow-up step, we'll wire this to real Orthogonal API calls
    const response: AccountBrief = {
      ...sampleBrief,
      // Customize company name based on URL domain
      companySnapshot: {
        ...sampleBrief.companySnapshot,
        name: extractCompanyName(body.url),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Research API error:", error);
    return NextResponse.json(
      { error: "Failed to generate account brief" },
      { status: 500 }
    );
  }
}

function extractCompanyName(url: string): string {
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    const hostname = urlObj.hostname.replace("www.", "");
    const name = hostname.split(".")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return "Company";
  }
}
