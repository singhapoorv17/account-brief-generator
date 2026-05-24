"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";

interface ResearchFormProps {
  onSubmit: (data: { url: string; icp?: string; product?: string }) => void;
  isLoading: boolean;
}

export function ResearchForm({ onSubmit, isLoading }: ResearchFormProps) {
  const [url, setUrl] = useState("");
  const [icp, setIcp] = useState("");
  const [product, setProduct] = useState("");
  const [showOptional, setShowOptional] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSubmit({
      url: url.trim(),
      icp: icp.trim() || undefined,
      product: product.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto space-y-4">
      <div className="space-y-3">
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://stripe.com"
          className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
          disabled={isLoading}
          required
        />

        <button
          type="button"
          onClick={() => setShowOptional(!showOptional)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          disabled={isLoading}
        >
          {showOptional ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          Add buyer ICP and product description (optional)
        </button>

        {showOptional && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
            <Input
              type="text"
              value={icp}
              onChange={(e) => setIcp(e.target.value)}
              placeholder="Series A to C B2B SaaS, 50 to 500 employees, technical buyer"
              className="h-11 bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary text-sm"
              disabled={isLoading}
            />
            <Input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="AI-native customer support that deflects 60% of tier-1 tickets"
              className="h-11 bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary text-sm"
              disabled={isLoading}
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading || !url.trim()}
        className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-base"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating brief...
          </>
        ) : (
          "Generate account brief"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Tip: try{" "}
        <span className="text-foreground/80">anthropic.com</span>,{" "}
        <span className="text-foreground/80">linear.app</span>,{" "}
        <span className="text-foreground/80">vercel.com</span>, or{" "}
        <span className="text-foreground/80">stripe.com</span> for a fast walkthrough.
      </p>
    </form>
  );
}
