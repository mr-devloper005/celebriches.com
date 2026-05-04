'use client'

import { ContentImage } from "@/components/shared/content-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { MapPin, Globe, Phone, Tag, Mail } from "lucide-react";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildPostUrl, fetchTaskPostBySlug, fetchTaskPosts } from "@/lib/task-data";
import { SITE_CONFIG, getTaskConfig, type TaskKey } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";
import { cn } from "@/lib/utils";
import { ArticleComments } from "@/components/tasks/article-comments";
import { SchemaJsonLd } from "@/components/seo/schema-jsonld";
import { RichContent, formatRichHtml } from "@/components/shared/rich-content";
import { getFactoryState } from "@/design/factory/get-factory-state";
import { getProductKind } from "@/design/factory/get-product-kind";
import { DirectoryTaskDetailPage } from "@/design/products/directory/task-detail-page";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

type PostContent = {
  category?: string;
  location?: string;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  description?: string;
  body?: string;
  excerpt?: string;
  author?: string;
  highlights?: string[];
  logo?: string;
  images?: string[];
  latitude?: number | string;
  longitude?: number | string;
};

const isValidImageUrl = (value?: string | null) =>
  typeof value === "string" && (value.startsWith("/") || /^https?:\/\//i.test(value));

const absoluteUrl = (value?: string | null) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (!value.startsWith("/")) return null;
  return `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}${value}`;
};

const getContent = (post: SitePost): PostContent => {
  const content = post.content && typeof post.content === "object" ? post.content : {};
  return content as PostContent;
};

const formatArticleHtml = (content: PostContent, post: SitePost) => {
  const raw =
    (typeof content.body === "string" && content.body.trim()) ||
    (typeof content.description === "string" && content.description.trim()) ||
    (typeof post.summary === "string" && post.summary.trim()) ||
    "";

  return formatRichHtml(raw, "Details coming soon.");
};

const getImageUrls = (post: SitePost, content: PostContent) => {
  const media = Array.isArray(post.media) ? post.media : [];
  const mediaImages = media
    .map((item) => item?.url)
    .filter((url): url is string => isValidImageUrl(url));
  const contentImages = Array.isArray(content.images)
    ? content.images.filter((url): url is string => isValidImageUrl(url))
    : [];
  const merged = [...mediaImages, ...contentImages];
  if (merged.length) return merged;
  if (isValidImageUrl(content.logo)) return [content.logo as string];
  return ["/placeholder.svg?height=900&width=1400"];
};

const toNumber = (value?: number | string) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const buildMapEmbedUrl = (
  latitude?: number | string,
  longitude?: number | string,
  address?: string
) => {
  const lat = toNumber(latitude);
  const lon = toNumber(longitude);
  const normalizedAddress = typeof address === "string" ? address.trim() : "";
  const googleMapsEmbedApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY?.trim();

  if (googleMapsEmbedApiKey) {
    const query = lat !== null && lon !== null ? `${lat},${lon}` : normalizedAddress;
    if (!query) return null;
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
      googleMapsEmbedApiKey
    )}&q=${encodeURIComponent(query)}`;
  }

  if (lat !== null && lon !== null) {
    const delta = 0.01;
    const left = lon - delta;
    const right = lon + delta;
    const bottom = lat - delta;
    const top = lat + delta;
    const bbox = `${left},${bottom},${right},${top}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
      bbox
    )}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`;
  }

  if (normalizedAddress) {
    return `https://www.google.com/maps?q=${encodeURIComponent(normalizedAddress)}&output=embed`;
  }

  return null;
};

export function SbmDetailPage({ task, slug }: { task: TaskKey; slug: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [post, setPost] = useState<SitePost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const fetchedPost = await fetchTaskPostBySlug(task, slug);
        setPost(fetchedPost);
      } catch (error) {
        console.warn("Failed to load post detail", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [task, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavbarShell />
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-muted rounded mb-6"></div>
            <div className="h-12 w-3/4 bg-muted rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-muted rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  const content = getContent(post);
  const isClassified = task === "classified";
  const isArticle = task === "article";
  const category = content.category || post.tags?.[0] || task;
  const description = content.description || post.summary || "Details coming soon.";
  const descriptionHtml = !isArticle ? formatRichHtml(description, "Details coming soon.") : "";
  const articleHtml = isArticle ? formatArticleHtml(content, post) : "";
  const articleSummary =
    post.summary ||
    (typeof content.excerpt === "string" ? content.excerpt : "") ||
    "";
  const articleAuthor =
    (typeof content.author === "string" && content.author.trim()) ||
    post.authorName ||
    "Editorial Team";
  const articleDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const postTags = Array.isArray(post.tags) ? post.tags.filter((tag) => typeof tag === "string") : [];
  const location = content.address || content.location;
  const images = getImageUrls(post, content);
  const mapEmbedUrl = buildMapEmbedUrl(content.latitude, content.longitude, location);
  const isBookmark = task === "sbm" || task === "social";
  const bookmarkWebsite = typeof content.website === "string" ? content.website : undefined;
  const bookmarkDomain = bookmarkWebsite
    ? bookmarkWebsite.replace(/^https?:\/\//, "").replace(/\/.*$/, "")
    : undefined;
  const bookmarkVisual = isValidImageUrl(content.logo) ? content.logo : images[0];
  const bookmarkInitial = post.title.slice(0, 1).toUpperCase();
  const hideSidebar = isClassified || isArticle || task === "image" || isBookmark;
  const related = [] // Will be loaded separately if needed
  const articleUrl = `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}/sbm/${post.slug}`;
  const articleImage = absoluteUrl(images[0]) || absoluteUrl(SITE_CONFIG.defaultOgImage);
  const articleSchema = isArticle
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: articleSummary || description,
        image: articleImage ? [articleImage] : [],
        author: {
          "@type": "Person",
          name: articleAuthor,
        },
        datePublished: post.publishedAt || undefined,
        dateModified: post.publishedAt || undefined,
        articleSection: category,
        keywords: postTags.join(", "),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
      }
    : null;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_CONFIG.baseUrl.replace(/\/$/, ""),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Social Bookmarking",
        item: `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}/sbm`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_CONFIG.baseUrl.replace(/\/$/, "")}/sbm/${post.slug}`,
      },
    ],
  };
  const schemaPayload = articleSchema ? [articleSchema, breadcrumbSchema] : breadcrumbSchema;

  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SchemaJsonLd data={schemaPayload} />
        <Link
          href="/sbm"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Social Bookmarking
        </Link>

        <div className="grid gap-10 lg:grid-cols-1">
          <div className={cn(isClassified ? "space-y-8" : "")}>
            {isArticle ? (
              <div className="mx-auto w-full max-w-4xl space-y-6">
                <h1 className="text-4xl font-semibold leading-tight text-foreground">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span>By {articleAuthor}</span>
                  {articleDate ? <span>{articleDate}</span> : null}
                  <Badge variant="secondary" className="inline-flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    {category}
                  </Badge>
                </div>
                {postTags.length ? (
                  <div className="flex flex-wrap gap-2">
                    {postTags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : null}
                {articleSummary ? (
                  <p className="text-base leading-7 text-muted-foreground">{articleSummary}</p>
                ) : null}
                {images[0] ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border bg-muted">
                    <ContentImage
                      src={images[0]}
                      alt={`${post.title} featured image`}
                      fill
                      className="object-cover"
                      intrinsicWidth={1600}
                      intrinsicHeight={900}
                    />
                  </div>
                ) : null}
                <RichContent html={articleHtml} className="leading-8 prose-p:my-6 prose-h2:my-8 prose-h3:my-6 prose-ul:my-6" />
                <ArticleComments slug={post.slug} />
              </div>
            ) : null}

            {!isArticle ? (
              <>
                {isBookmark ? (
                  <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-sm">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-r from-sky-100 via-cyan-50 to-emerald-100" />
                    <div className="relative p-6 sm:p-8 lg:p-10">
                      {/* Header with title and meta info */}
                      <header className="mb-8">
                        <h1 className="mb-6 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">{post.title}</h1>
                        
                        {/* Author section */}
                        <div className="flex flex-wrap items-center gap-4 pb-6 sm:pb-8">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <p className="text-lg font-semibold text-foreground">
                                Professor Melissa
                              </p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="ml-auto h-9 px-6 text-sm font-medium border-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                            onClick={() => router.push('/login')}
                          >
                            Follow
                          </Button>
                        </div>

                        {/* Engagement buttons */}
                        <div className="flex items-center justify-center gap-8 border-t border-border/30 pt-6">
                          <button 
                            className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all hover:scale-105"
                            onClick={() => router.push('/login')}
                          >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            <span className="text-sm font-medium">Bookmark</span>
                          </button>
                          <button 
                            className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all hover:scale-105"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(window.location.href);
                                alert("URL copied");
                              } catch {
                                alert("Failed to copy URL");
                              }
                            }}
                          >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
                            </svg>
                            <span className="text-sm font-medium">Share</span>
                          </button>
                        </div>
                      </header>

                      {/* Main content */}
                      <div className="max-w-4xl mx-auto">
                        <div className="prose prose-slate max-w-none">
                          <p className="text-lg leading-relaxed text-foreground/90">
                            Accompany Professor Melissa as she takes you on a tour of the Fort Lauderdale port, highlighting its sights and sounds. Reserve your incredible trip now to create memories that will last forever.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                ) : (
                  <div className={cn(isClassified ? "mx-auto w-full max-w-4xl" : "mt-6")}>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="inline-flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" />
                        {category}
                      </Badge>
                      {location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {location}
                        </span>
                      )}
                    </div>
                    <h1 className="mt-4 text-3xl font-semibold text-foreground">{post.title}</h1>
                    <RichContent html={descriptionHtml} className="mt-3 max-w-3xl" />
                  </div>
                )}
              </>
            ) : null}

            {isClassified ? (
              <div className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">Business details</h2>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {content.website && (
                    <div className="flex items-start gap-2">
                      <Globe className="mt-0.5 h-4 w-4" />
                      <a
                        href={content.website}
                        className="break-all text-foreground hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {content.website}
                      </a>
                    </div>
                  )}
                  {content.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="mt-0.5 h-4 w-4" />
                      <span>{content.phone}</span>
                    </div>
                  )}
                  {content.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="mt-0.5 h-4 w-4" />
                      <a
                        href={`mailto:${content.email}`}
                        className="break-all text-foreground hover:underline"
                      >
                        {content.email}
                      </a>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {content.highlights?.length && !isArticle ? (
              <div className={cn("mt-8 rounded-2xl border border-border bg-card p-6", isClassified ? "mx-auto w-full max-w-4xl" : "")}>
                <h2 className="text-lg font-semibold text-foreground">Highlights</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {content.highlights.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {isClassified && mapEmbedUrl ? (
              <div className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">Location map</p>
                <div className="mt-4 overflow-hidden rounded-xl border border-border">
                  <iframe
                    title="Business location map"
                    src={mapEmbedUrl}
                    className="h-56 w-full"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}

          </div>
        </div>

        <section className="mt-12">
          <nav className="mt-6 rounded-2xl border border-border bg-card/60 p-4">
            <p className="text-sm font-semibold text-foreground">Related links</p>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link
                  href="/sbm"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Browse all Social Bookmarking
                </Link>
              </li>
            </ul>
          </nav>
        </section>
      </main>
      <Footer />
    </div>
  );
}
