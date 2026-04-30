'use client'

import * as React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Globe, MapPin, Briefcase } from 'lucide-react'

interface ProfileTabsProps {
  descriptionHtml: string
  brandName: string
  domain?: string
  website?: string
  post: any
}

export function ProfileTabs({ descriptionHtml, brandName, domain, website, post }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="posts">Profile Posts</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-slate max-w-none text-base leading-relaxed prose-p:my-4 prose-a:text-primary prose-a:underline prose-strong:font-semibold"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="about" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Website</p>
                    <a 
                      href={website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {website}
                    </a>
                  </div>
                </div>
              )}
              
              {domain && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Domain</p>
                    <p className="text-sm text-foreground">{domain}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-sm text-foreground">Not specified</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Occupation</p>
                  <p className="text-sm text-foreground">Not specified</p>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12 text-center">
              <div className="space-y-2">
                <p className="text-muted-foreground">The news feed is currently empty.</p>
                <p className="text-sm text-muted-foreground/60">
                  {brandName} hasn't posted any activity yet.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="posts" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12 text-center">
              <div className="space-y-2">
                <p className="text-muted-foreground">No profile posts yet.</p>
                <p className="text-sm text-muted-foreground/60">
                  {brandName} hasn't created any profile posts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
