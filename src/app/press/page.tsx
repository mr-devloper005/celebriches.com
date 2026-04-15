'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PageShell } from '@/components/shared/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { mockPressAssets, mockPressCoverage } from '@/data/mock-data'

export default function PressPage() {
  const { toast } = useToast()
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null)
  const activeAsset = mockPressAssets.find((asset) => asset.id === activeAssetId)

  return (
    <PageShell
      title="Press"
      description="Media resources, brand assets, leadership notes, and recent coverage."
    >
      <div className="space-y-8">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <Badge variant="secondary">Newsroom</Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-foreground">Brand assets and verified media material</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Everything here is approved for editorial use. If you need custom media support, contact the communications team.
            </p>
            <div className="mt-5 grid gap-2">
              {mockPressAssets.map((asset) => (
                <div key={asset.id} className="rounded-lg border border-border bg-secondary/40 px-4 py-3">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{asset.title}</p>
                      <p className="text-xs text-muted-foreground">{asset.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{asset.fileType}</Badge>
                      <Button size="sm" variant="outline" onClick={() => setActiveAssetId(asset.id)}>
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          toast({
                            title: 'Download started',
                            description: `${asset.title} is downloading.`,
                          })
                        }
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground">Recent coverage</h3>
              <div className="mt-4 space-y-4">
                {mockPressCoverage.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border bg-muted/40 p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{item.outlet}</div>
                    <p className="mt-2 text-sm font-medium text-foreground">{item.headline}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{item.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground">Media contact</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                For interview requests, brand partnerships, or data-backed stories, reach out to our communications desk.
              </p>
              <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-sm font-semibold text-foreground">press@celebriches.com</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">Response time: within 24 hours</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={Boolean(activeAsset)} onOpenChange={() => setActiveAssetId(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{activeAsset?.title}</DialogTitle>
          </DialogHeader>
          {activeAsset?.previewUrl && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={activeAsset.previewUrl}
                alt={activeAsset.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <p className="text-sm text-muted-foreground">{activeAsset?.description}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveAssetId(null)}>
              Close
            </Button>
            <Button
              onClick={() =>
                toast({
                  title: 'Download started',
                  description: `${activeAsset?.title} is downloading.`,
                })
              }
            >
              Download {activeAsset?.fileType}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
