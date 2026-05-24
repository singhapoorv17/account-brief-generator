"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";
import type { ProviderProgress, ProviderStatus } from "@/lib/types";

const PROVIDERS: Omit<ProviderProgress, "status">[] = [
  { id: "linkup", label: "Searching recent news and funding via Linkup" },
  { id: "pdl", label: "Pulling company profile and hires via People Data Labs" },
  { id: "scrapegraph", label: "Reading website positioning via ScrapeGraph" },
  { id: "claude", label: "Synthesizing brief via Claude (Sonnet)" },
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
      // Mark all as complete when data arrives
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

    // Simulate sequential provider calls
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
        }, index * 1500)
      );

      // Complete
      timers.push(
        setTimeout(() => {
          setProviderStates((prev) =>
            prev.map((p, i) =>
              i === index
                ? {
                    ...p,
                    status: "complete" as ProviderStatus,
                    latencyMs: Math.floor(Math.random() * 2000) + 500,
                    credits: Math.floor(Math.random() * 4) + 1,
                  }
                : p
            )
          );
        }, index * 1500 + 1200)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [isComplete]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-medium text-foreground">
          Generating account brief...
        </h3>

        <div className="space-y-3">
          {providerStates.map((provider) => (
            <div
              key={provider.id}
              className="flex items-center justify-between gap-4 font-mono text-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <StatusIcon status={provider.status} />
                <span
                  className={
                    provider.status === "pending"
                      ? "text-muted-foreground"
                      : provider.status === "running"
                      ? "text-foreground"
                      : "text-foreground"
                  }
                >
                  {provider.label}
                </span>
              </div>

              {provider.status === "complete" && (
                <div className="flex items-center gap-3 text-muted-foreground shrink-0">
                  <span>{provider.latencyMs}ms</span>
                  <span className="text-primary">
                    {provider.credits} credits
                  </span>
                </div>
              )}
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
      return <div className="h-4 w-4 rounded-full bg-muted" />;
    case "running":
      return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
    case "complete":
      return (
        <div className="h-4 w-4 rounded-full bg-success flex items-center justify-center">
          <Check className="h-3 w-3 text-success-foreground" />
        </div>
      );
    case "error":
      return <AlertCircle className="h-4 w-4 text-destructive" />;
  }
}
