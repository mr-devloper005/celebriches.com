import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/shared/footer";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { ContentImage } from "@/components/shared/content-image";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { buildPostUrl } from "@/lib/task-data";
import { buildPostMetadata, buildTaskMetadata } from "@/lib/seo";
import { fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG } from "@/lib/site-config";
import { ProfileTabs } from "@/components/profile/profile-tabs";

export const revalidate = 3;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeRichHtml = (html: string) =>
  html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\shref\s*=\s*(['"])javascript:.*?\1/gi, ' href="#"');

const formatRichHtml = (raw?: string | null, fallback = "Profile details will appear here once available.") => {
  const source = typeof raw === "string" ? raw.trim() : "";
  if (!source) return `<p>${escapeHtml(fallback)}</p>`;
  if (/<[a-z][\s\S]*>/i.test(source)) return sanitizeRichHtml(source);
  return source
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.replace(/\n/g, " ").trim())}</p>`)
    .join("");
};

export async function generateStaticParams() {
  const posts = await fetchTaskPosts("profile", 50);
  if (!posts.length) {
    return [{ username: "placeholder" }];
  }
  return posts.map((post) => ({ username: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  try {
    const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
    return post ? await buildPostMetadata("profile", post) : await buildTaskMetadata("profile");
  } catch (error) {
    console.warn("Profile metadata lookup failed", error);
    return await buildTaskMetadata("profile");
  }
}

export default async function ProfileDetailPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const post = await fetchTaskPostBySlug("profile", resolvedParams.username);
  if (!post) {
    notFound();
  }
  const content = (post.content || {}) as Record<string, any>;
  const logoUrl = typeof content.logo === "string" ? content.logo : undefined;
  const brandName =
    (content.brandName as string | undefined) ||
    (content.companyName as string | undefined) ||
    (content.name as string | undefined) ||
    post.title;
  const website = content.website as string | undefined;
  const domain = website ? website.replace(/^https?:\/\//, "").replace(/\/.*$/, "") : undefined;
  const description =
    (content.description as string | undefined) ||
    post.summary ||
    "Profile details will appear here once available.";
  const descriptionHtml = formatRichHtml(description);
  const initialLetter = (brandName || post.title).slice(0, 1).toUpperCase();
  const suggestedArticles = await fetchTaskPosts("article", 6);
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Profiles",
        item: `${baseUrl}/profile`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brandName,
        item: `${baseUrl}/profile/${post.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <SchemaJsonLd data={breadcrumbData} />
        
        {/* Profile Header Card */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="relative h-32 bg-gradient-to-r from-emerald-100 via-cyan-50 to-lime-100" />
            <div className="relative px-6 pb-6 pt-0 sm:px-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                {/* Avatar */}
                <div className="relative -mt-16 inline-block">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-muted shadow-lg">
                    {logoUrl ? (
                      <ContentImage src={logoUrl} alt={post.title} fill className="object-cover" sizes="128px" intrinsicWidth={128} intrinsicHeight={128} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-muted-foreground">
                        {initialLetter}
                      </div>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{brandName}</h1>
                      {domain && (
                        <p className="mt-1 text-sm text-muted-foreground">{domain}</p>
                      )}
                    </div>
                    {website && (
                      <Button asChild size="sm">
                        <Link href={website} target="_blank" rel="noopener noreferrer">
                          Visit Website
                        </Link>
                      </Button>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Left Column - Tabs and Content */}
          <div className="space-y-6">
            <ProfileTabs 
              descriptionHtml={descriptionHtml}
              brandName={brandName}
              domain={domain}
              website={website}
              post={post}
            />

            {/* Suggested Articles */}
            {suggestedArticles.length ? (
              <Card>
                <CardHeader>
                  <CardTitle>Suggested Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {suggestedArticles.slice(0, 4).map((article) => (
                      <TaskPostCard
                        key={article.id}
                        post={article}
                        href={buildPostUrl("article", article.slug)}
                        compact
                      />
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link href="/articles" className="text-sm font-medium text-primary hover:underline">
                      View all articles →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/profile" className="text-primary hover:underline">
                      Browse all profiles
                    </Link>
                  </li>
                  {suggestedArticles.slice(0, 3).map((article) => (
                    <li key={`quick-${article.id}`}>
                      <Link
                        href={buildPostUrl("article", article.slug)}
                        className="text-primary hover:underline"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
