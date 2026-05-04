import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockTeamMembers } from "@/data/mock-data";
import { SITE_CONFIG } from "@/lib/site-config";

const pillars = [
  {
    title: "Editorial excellence",
    body: "Writers, researchers, and operators work together to keep every surface useful and trustworthy.",
  },
  {
    title: "Design systems",
    body: "Our product and brand teams align layout quality with speed so launches stay consistent.",
  },
  {
    title: "Community growth",
    body: "Partnership and support teams help creators and businesses publish with confidence.",
  },
];

export default function TeamPage() {
  return (
    <PageShell
      title="Team"
      description={`Meet the people shaping ${SITE_CONFIG.name} across product, design, editorial, and community.`}
    >
      <div className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <Card key={pillar.title} className="border-border bg-card">
              <CardContent className="p-6">
                <Badge variant="secondary">Team pillar</Badge>
                <h2 className="mt-3 text-lg font-semibold text-foreground">{pillar.title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{pillar.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {mockTeamMembers.map((member) => (
            <Card key={member.id} className="border-border bg-card transition-transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{member.bio}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">{member.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border bg-card">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Join the team</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                We are hiring builders who care about craftsmanship, clarity, and community impact.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
