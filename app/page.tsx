"use client";

import { useState } from "react";
import { ResearchForm } from "@/components/research-form";
import { LoadingPanel } from "@/components/loading-panel";
import { BriefOutput } from "@/components/brief-output";
import type { AccountBrief } from "@/lib/types";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [brief, setBrief] = useState<AccountBrief | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    url: string;
    icp?: string;
    product?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setBrief(null);

    try {
      // Add artificial delay to show loading states
      await new Promise((resolve) => setTimeout(resolve, 6000));

      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate brief");
      }

      const result: AccountBrief = await response.json();
      setBrief(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setBrief(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_50%)]" />

        <div className="relative px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight text-balance">
              Turn a company URL into a sales-ready account brief.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              One input. One agent run. Linkup, People Data Labs, ScrapeGraph,
              Apollo, and GPT-4o coordinated through Orthogonal in roughly 90 seconds.
            </p>
          </div>

          {/* Form / Loading / Output */}
          <div className="mt-12 md:mt-16">
            {!isLoading && !brief && (
              <ResearchForm onSubmit={handleSubmit} isLoading={isLoading} />
            )}

            {isLoading && <LoadingPanel isComplete={false} />}

            {error && (
              <div className="w-full max-w-xl mx-auto">
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center">
                  <p className="text-destructive">{error}</p>
                  <button
                    onClick={handleReset}
                    className="mt-2 text-sm text-primary hover:underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Brief Output Section */}
      {brief && (
        <section className="px-4 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto mb-8">
            <button
              onClick={handleReset}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Generate another brief
            </button>
          </div>
          <BriefOutput brief={brief} />
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          Built with{" "}
          <a
            href="https://orthogonal.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Orthogonal
          </a>
          . Demo by Apoorv Singh.
        </div>
      </footer>
    </main>
  );
}
