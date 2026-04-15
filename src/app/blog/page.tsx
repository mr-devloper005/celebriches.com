import Link from "next/link";
import { PageShell } from "@/components/shared/page-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site-config";

const featured = {
  title: "Designing content systems that scale without losing editorial quality",
  excerpt:
    "A practical framework for balancing publishing speed, information architecture, and brand consistency across multiple surfaces.",
  date: "Apr 2026",
  readTime: "8 min read",
  tag: "Editorial systems",
};

const posts = [
  {
    title: "From idea to published page in one workflow",
    excerpt: "How teams can reduce handoffs and publish with predictable quality every sprint.",
    tag: "Operations",
    date: "Apr 2026",
  },
  {
    title: "Building profile hubs that convert trust into action",
    excerpt: "Patterns that help creators and businesses present authority with clear calls to action.",
    tag: "Product",
    date: "Mar 2026",
  },
  {
    title: "Curated bookmarking as a growth channel",
    excerpt: "Why structured collections outperform generic link dumps for SEO and retention.",
    tag: "Growth",
    date: "Mar 2026",
  },
  {
    title: "The anatomy of a modern content homepage",
    excerpt: "Hero, rails, social proof, and modular sections tuned for readability and depth.",
    tag: "Design",
    date: "Feb 2026",
  },
];

export default function BlogPage() {
  return (
    <PageShell
      title="Blog"
      description={`Fresh insights on product, publishing, and community-led growth from the ${SITE_CONFIG.name} team.`}
      actions={
        <Button asChild>
          <Link href="/contact">Pitch a topic</Link>
        </Button>
      }
    >
      <div className="space-y-8">
        <Card className="border-border bg-card">
          <CardContent className="p-8">
            <Badge variant="secondary">{featured.tag}</Badge>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">{featured.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{featured.excerpt}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span>{featured.date}</span>
              <span>•</span>
              <span>{featured.readTime}</span>
            </div>
            <Button className="mt-6" asChild>
              <Link href="/contact">Read feature</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Card key={post.title} className="border-border bg-card transition-transform hover:-translate-y-1">
              <CardContent className="p-6">
                <Badge variant="outline">{post.tag}</Badge>
                <h3 className="mt-3 text-lg font-semibold text-foreground">{post.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
                <div className="mt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">{post.date}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-border bg-card">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Want content tailored to your audience?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Our editorial and growth teams collaborate on strategy, structure, and execution.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/contact">Book a call</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
