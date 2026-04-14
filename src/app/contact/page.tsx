import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/site-config'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes =
    productKind === 'directory'
      ? [
          { icon: Building2, title: 'Business onboarding', body: 'Add listings, verify operational details, and bring your business surface live quickly.' },
          { icon: Phone, title: 'Partnership support', body: 'Talk through bulk publishing, local growth, and operational setup questions.' },
          { icon: MapPin, title: 'Coverage requests', body: 'Need a new geography or category lane? We can shape the directory around it.' },
        ]
      : productKind === 'editorial'
        ? [
            { icon: FileText, title: 'Editorial submissions', body: 'Pitch essays, columns, and long-form ideas that fit the publication.' },
            { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate sponsorships, collaborations, and issue-level campaigns.' },
            { icon: Sparkles, title: 'Contributor support', body: 'Get help with voice, formatting, and publication workflow questions.' },
          ]
        : productKind === 'visual'
          ? [
              { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, creator features, and visual campaigns.' },
              { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about usage rights, commercial requests, and visual partnerships.' },
              { icon: Mail, title: 'Media kits', body: 'Request creator decks, editorial support, or visual feature placement.' },
            ]
          : [
              { icon: Bookmark, title: 'Collection submissions', body: 'Suggest resources, boards, and links that deserve a place in the library.' },
              { icon: Mail, title: 'Resource partnerships', body: 'Coordinate curation projects, reference pages, and link programs.' },
              { icon: Sparkles, title: 'Curator support', body: 'Need help organizing shelves, collections, or profile-connected boards?' },
            ]

  return (
    <PageShell
      title={`Contact ${SITE_CONFIG.name}`}
      description="Tell us what you are trying to launch, publish, or improve. We will route your request to the right team."
      actions={
        <Button asChild>
          <a href="mailto:hello@celebriches.com">Email us directly</a>
        </Button>
      }
    >
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <Card className="border-border bg-card">
          <CardContent className="p-7">
            <Badge variant="secondary">Contact lanes</Badge>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-foreground">
              Let us route your request to the right team from day one.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              Share your goals, blockers, or launch timeline. We will reply with concrete next steps and ownership, not a generic support response.
            </p>
            <div className="mt-6 space-y-3">
              {lanes.map((lane) => (
                <div key={lane.title} className="rounded-xl border border-border bg-muted/40 p-4">
                  <lane.icon className="h-5 w-5 text-foreground" />
                  <h3 className="mt-2 text-base font-semibold text-foreground">{lane.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">{lane.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Direct lines</h3>
              <div className="mt-3 space-y-1 text-sm text-foreground">
                <p><strong>General:</strong> hello@celebriches.com</p>
                <p><strong>Partnerships:</strong> growth@celebriches.com</p>
                <p><strong>Press:</strong> press@celebriches.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-7">
            <h2 className="text-2xl font-semibold text-foreground">Send a message</h2>
            <form className="mt-6 grid gap-4">
              <input className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground" placeholder="Your name" />
              <input className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground" placeholder="Email address" />
              <input className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground" placeholder="Company or brand name" />
              <input className="h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground" placeholder="What do you need help with?" />
              <textarea className="min-h-[180px] rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground" placeholder="Share the full context so we can respond with the right next step." />
              <Button type="submit" className="h-12 rounded-full px-6 text-sm font-semibold">
                Send message
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </PageShell>
  )
}
