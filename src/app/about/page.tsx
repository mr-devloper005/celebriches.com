import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/site-config";

const metrics = [
  { label: "Communities launched", value: "640+" },
  { label: "Monthly active readers", value: "210k" },
  { label: "Saved references", value: "1.8M" },
  { label: "Countries represented", value: "34" },
];

const principles = [
  {
    title: "Human-curated trust",
    description:
      "Everything starts with real contributors and operators, not anonymous growth loops.",
  },
  {
    title: "Fast publishing, clean structure",
    description:
      "From profiles to bookmark collections, each surface is designed for clear reading and action.",
  },
  {
    title: "One ecosystem, many workflows",
    description:
      "Teams can run editorial, local discovery, and resource hubs in one consistent product.",
  },
];

const timeline = [
  { year: "2024", title: "Foundation", body: "Started as a focused publishing stack for curated communities." },
  { year: "2025", title: "Expansion", body: "Added profile surfaces, bookmark lanes, and creator collaboration tools." },
  { year: "2026", title: "Scale", body: "Unified content operations with modular layouts and brand-ready components." },
];

export default function AboutPage() {
  return (
    <PageShell
      title={`About ${SITE_CONFIG.name}`}
      description={`${SITE_CONFIG.name} is a modern platform for creators, communities, and curated business discovery.`}
      actions={
        <>
          <Button variant="outline" asChild>
            <Link href="/team">Meet the Team</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Start a Conversation</Link>
          </Button>
        </>
      }
    >
      <div className="space-y-8">
        <Card className="border-border bg-card">
          <CardContent className="p-8">
            <Badge variant="secondary">Our mission</Badge>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
              Build the modern operating layer for content-first businesses.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
              {SITE_CONFIG.name} helps teams publish better, organize faster, and launch trusted digital surfaces with a
              consistent editorial experience. Instead of stitching together separate tools for blogs, profiles, and
              discovery, everything stays connected.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-muted/40 p-4">
                  <div className="text-2xl font-semibold text-foreground">{item.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground">What makes us different</h3>
              <div className="mt-4 space-y-4">
                {principles.map((principle) => (
                  <div key={principle.title} className="rounded-lg border border-border bg-muted/30 p-4">
                    <h4 className="text-sm font-semibold text-foreground">{principle.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{principle.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground">Journey so far</h3>
              <div className="mt-4 space-y-4">
                {timeline.map((item) => (
                  <div key={item.year} className="rounded-lg border border-border bg-muted/30 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{item.year}</p>
                    <h4 className="mt-1 text-sm font-semibold text-foreground">{item.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Building something similar?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We work with founders, publishers, and operators shaping multi-surface content products.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link href="/press">Press kit</Link>
              </Button>
              <Button asChild>
                <Link href="/contact">Contact team</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
