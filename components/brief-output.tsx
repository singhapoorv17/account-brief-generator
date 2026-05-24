"use client";

import type { AccountBrief } from "@/lib/types";
import {
  Building2,
  MapPin,
  Users,
  Tag,
  Calendar,
  ExternalLink,
  Linkedin,
  Mail,
  Lightbulb,
  Quote,
  Terminal,
  Check,
  AlertTriangle,
  XCircle,
  Copy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface BriefOutputProps {
  brief: AccountBrief;
}

export function BriefOutput({ brief }: BriefOutputProps) {
  const totalLatencyMs = brief.providerCalls.reduce((sum, p) => sum + p.latencyMs, 0);
  const totalPrice = brief.providerCalls.reduce((sum, p) => sum + p.price, 0);
  const totalSeconds = (totalLatencyMs / 1000).toFixed(1);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Summary Banner */}
      <div className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-center text-sm text-muted-foreground">
        Generated in {totalSeconds} seconds for ${totalPrice.toFixed(2)} across {brief.providerCalls.length} providers.
      </div>

      {/* Company Snapshot */}
      <CompanySnapshotCard snapshot={brief.companySnapshot} />

      {/* Funding Signals */}
      <FundingSignalsCard signals={brief.fundingSignals} />

      {/* Leadership Team */}
      {brief.keyHires.length > 0 && <KeyHiresCard hires={brief.keyHires} />}

      {/* Buying Triggers */}
      <BuyingTriggersCard triggers={brief.buyingTriggers} />

      {/* Contacts */}
      <ContactsCard contacts={brief.contacts} />

      {/* Outreach Angle */}
      <OutreachAngleCard angle={brief.outreachAngle} />

      {/* Orthogonal Recipe Panel */}
      <RecipePanel providerCalls={brief.providerCalls} />

      {/* CTA */}
      <CTASection />
    </div>
  );
}

function CompanySnapshotCard({
  snapshot,
}: {
  snapshot: AccountBrief["companySnapshot"];
}) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Building2 className="h-5 w-5 text-primary" />
          {snapshot.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-foreground/90">{snapshot.description}</p>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {snapshot.hq}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-4 w-4" />
            {snapshot.employeeCount} employees
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {snapshot.industryTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FundingSignalsCard({
  signals,
}: {
  signals: AccountBrief["fundingSignals"];
}) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg">Recent Funding &amp; Signals</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {signals.map((signal, index) => (
            <li key={index} className="flex gap-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm shrink-0">
                <Calendar className="h-4 w-4" />
                <span className="font-mono">{signal.date}</span>
              </div>
              <div className="flex-1">
                <p className="text-foreground/90">{signal.summary}</p>
                {signal.sourceUrl && (
                  <a
                    href={signal.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                  >
                    View source
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function KeyHiresCard({ hires }: { hires: AccountBrief["keyHires"] }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg">Leadership Team</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {hires.slice(0, 5).map((hire, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
            >
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                {hire.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {hire.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {hire.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="font-mono">{hire.startDate}</span>
                  {hire.linkedInUrl && (
                    <a
                      href={hire.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <Linkedin className="h-3 w-3" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function BuyingTriggersCard({
  triggers,
}: {
  triggers: AccountBrief["buyingTriggers"];
}) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-warning" />
          Likely Buying Triggers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {triggers.map((trigger, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-secondary/50 space-y-2"
            >
              <h4 className="font-medium text-foreground">{trigger.title}</h4>
              <p className="text-sm text-muted-foreground">
                {trigger.whyItMatters}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ContactsCard({ contacts }: { contacts: AccountBrief["contacts"] }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg">Relevant Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-secondary/50 space-y-2"
            >
              <div>
                <p className="font-medium text-foreground">{contact.name}</p>
                <p className="text-sm text-muted-foreground">{contact.title}</p>
              </div>
              <div className="flex gap-2">
                {contact.linkedInUrl && (
                  <a
                    href={contact.linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Linkedin className="h-3 w-3" />
                    LinkedIn
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Mail className="h-3 w-3" />
                    Email
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function OutreachAngleCard({ angle }: { angle: string }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Quote className="h-5 w-5 text-primary" />
          Suggested Outreach Angle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/90">
          {angle}
        </blockquote>
      </CardContent>
    </Card>
  );
}

function RecipePanel({
  providerCalls,
}: {
  providerCalls: AccountBrief["providerCalls"];
}) {
  const totalPrice = providerCalls.reduce((sum, p) => sum + p.price, 0);
  const totalLatency = providerCalls.reduce((sum, p) => sum + p.latencyMs, 0);

  return (
    <div className="bg-[oklch(0.08_0_0)] border border-border/50 rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border/50">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground/90">
          <Terminal className="h-4 w-4 text-primary" />
          Inside the Orthogonal call
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Every provider this agent ran, what it returned, and what it cost.
        </p>
      </div>
      <div className="px-5 py-3">
        <div className="space-y-0 font-mono text-xs">
          {providerCalls.map((call, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 py-2 border-b border-border/30 last:border-0"
            >
              <div className="flex items-center gap-2.5">
                <StatusBadge status={call.status} />
                <span className="text-foreground/80">{call.provider}</span>
                <span className="text-muted-foreground/70">• {call.purpose}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span>{call.latencyMs}ms</span>
                <span className="text-primary/90">${call.price.toFixed(2)}</span>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-border/50 font-medium">
            <span className="text-foreground/70">Total</span>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">{totalLatency}ms</span>
              <span className="text-primary">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "success" | "fallback" | "error" }) {
  switch (status) {
    case "success":
      return (
        <span className="flex items-center gap-1 text-success">
          <Check className="h-3 w-3" />
        </span>
      );
    case "fallback":
      return (
        <span className="flex items-center gap-1 text-warning">
          <AlertTriangle className="h-3 w-3" />
        </span>
      );
    case "error":
      return (
        <span className="flex items-center gap-1 text-destructive">
          <XCircle className="h-3 w-3" />
        </span>
      );
  }
}

function CTASection() {
  const [copied, setCopied] = useState(false);
  const snippet = `claude mcp add orthogonal --key sk_...`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg">Run this in your own agent</CardTitle>
        <p className="text-sm text-muted-foreground">
          Paste this into Claude Code, Cursor, or any MCP host. Your agent has
          Apollo, PDL, ScrapeGraph, Linkup, and 25 other providers behind one
          credit balance.
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre className="bg-secondary/50 rounded-lg p-4 font-mono text-sm text-foreground overflow-x-auto">
            {snippet}
          </pre>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="absolute top-2 right-2 h-8 w-8 p-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
