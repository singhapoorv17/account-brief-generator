"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";
import type { ProviderProgress, ProviderStatus } from "@/lib/types";

const PROVIDERS: Omit<ProviderProgress, "status">[] = [
  { id: "linkup", label: "Linkup", purpose: "Searching recent news and funding" },
  { id: "pdl", label: "People Data Labs", purpose: "Pulling company profile and hires" },
  { id: "scrapegraph", label: "ScrapeGraph", purpose: "Reading website positioning" },
  { id: "claude", label: "Claude (Sonnet)", purpose: "Synthesizing brief" },
];

interface LoadingPanelProps {
  isComplete: boolean;
}

export function LoadingPanel({ isComplete }: LoadingPanelProps) {
  const [providerStates, setProviderStates] = useState<ProviderProgress[]>(
    PROVIDERS.map((p) => ({ ...p, status: "pending" as ProviderStatus }))
  );

  useEffect(() => {
    if (isComplete) {
      setProviderStates((prev) =>
        prev.map((p) => ({
          ...p,
          status: "complete" as ProviderStatus,
          latencyMs: p.latencyMs || Math.floor(Math.random() * 2000) + 500,
          credits: p.credits || Math.floor(Math.random() * 4) + 1,
        }))
      );
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    PROVIDERS.forEach((_, index) => {
      // Start running
      timers.push(
        setTimeout(() => {
          setProviderStates((prev) =>
            prev.map((p, i) =>
              i === index ? { ...p, status: "running" as ProviderStatus } : p
            )
          );
        }, index * 1400)
      );

      // Complete with latency and credits
      timers.push(
        setTimeout(() => {
          setProviderStates((prev) =>
            prev.map((p, i) =>
              i === index
                ? {
                    ...p,
                    status: "complete" as ProviderStatus,
                    latencyMs: Math.floor(Math.random() * 1500) + 400,
                    credits: Math.floor(Math.random() * 3) + 1,
                  }
                : p
            )
          );
        }, index * 1400 + 1100)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [isComplete]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6 space-y-5">
        <h3 className="text-lg font-medium text-foreground">
          Generating account brief...
        </h3>

        <div className="space-y-3">
          {providerStates.map((provider) => (
            <div
              key={provider.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <StatusIcon status={provider.status} />
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`font-mono text-sm ${
                      provider.status === "pending"
                        ? "text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {provider.label}
                  </span>
                  <span className="text-muted-foreground text-sm hidden sm:inline">
                    {provider.purpose}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                {provider.status === "complete" && (
                  <>
                    <span className="text-muted-foreground">
                      {provider.latencyMs}ms
                    </span>
                    <span className="text-primary">
                      {provider.credits} cr
                    </span>
                  </>
                )}
                {provider.status === "running" && (
                  <span className="text-muted-foreground animate-pulse">
                    running...
                  </span>
                )}
                {provider.status === "pending" && (
                  <span className="text-muted-foreground/50">
                    pending
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: ProviderStatus }) {
  switch (status) {
    case "pending":
      return <div className="h-4 w-4 rounded-full bg-muted-foreground/30" />;
    case "running":
      return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
    case "complete":
      return (
        <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-2.5 w-2.5 text-primary-foreground" />
        </div>
      );
    case "error":
      return <AlertCircle className="h-4 w-4 text-destructive" />;
  }
}
