import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/site-config";

const roles = [
  { title: "Senior Frontend Engineer", location: "Remote (India)", type: "Full-time", level: "Senior" },
  { title: "Product Designer", location: "Remote (Global)", type: "Full-time", level: "Mid-Senior" },
  { title: "Community Partnerships Lead", location: "Hybrid (Delhi NCR)", type: "Full-time", level: "Mid" },
  { title: "Content Operations Specialist", location: "Remote (India)", type: "Full-time", level: "Mid" },
];

const benefits = [
  "Flexible schedules with async-first collaboration",
  "Medical coverage and well-being allowance",
  "Annual learning budget for courses and conferences",
  "Quarterly in-person team retreats",
  "Clear growth frameworks and mentorship",
];

export default function CareersPage() {
  return (
    <PageShell
      title="Careers"
      description={`Help us build the future of community-driven publishing at ${SITE_CONFIG.name}.`}
      actions={
        <>
          <Button variant="outline" asChild>
            <Link href="/team">Meet the team</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Apply now</Link>
          </Button>
        </>
      }
    >
      <div className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <Badge variant="secondary">Hiring approach</Badge>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-foreground">Build in public. Ship with intent.</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                We are a small, high-ownership team. Every role contributes across product thinking, execution quality, and
                customer empathy. If you thrive in fast-moving environments with strong design standards, we would love to talk.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground">What we value</h3>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                {benefits.map((benefit) => (
                  <div key={benefit} className="rounded-md border border-border bg-secondary/40 px-3 py-2">
                    {benefit}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {roles.map((role) => (
            <Card key={role.title} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{role.level}</Badge>
                  <Badge variant="outline">{role.type}</Badge>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-foreground">{role.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{role.location}</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/contact">View role</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
