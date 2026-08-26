import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import {
  ArrowLeft,
  Calendar,
    Clock,
  ChevronRight,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArticleActions, DisabledBookmarkHint } from "@/components/articles/ArticleActions";

export default async function ArticleDetailPage({
  params
}: {
  params: Promise<{ locale: string, slug: string }>
}) {
  const { locale, slug } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch article with category (draft tidak boleh diakses via URL langsung)
  const { data: article } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!article) {
    notFound();
  }

  // Paywall server-side: artikel premium hanya tampil penuh untuk
  // pengguna dengan langganan premium yang masih aktif.
  const { data: { user } } = await supabase.auth.getUser();
  let hasActivePremium = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier, subscription_end_at')
      .eq('id', user.id)
      .single();
    hasActivePremium =
      profile?.tier === 'premium' &&
      (!profile.subscription_end_at || new Date(profile.subscription_end_at) > new Date());
  }
  const isLocked = Boolean(article.is_premium) && !hasActivePremium;

  const isID = locale === 'id';
  const displayTitle = isID ? article.title_id : (article.title_en || article.title_id);
  const displayContent = isID ? article.content_id : (article.content_en || article.content_id);
  const displayCategory = isID ? article.category?.name_id : article.category?.name_en;
  const TEASER_CHARS = 600;
  const visibleContent = isLocked ? displayContent.slice(0, TEASER_CHARS).trimEnd() : displayContent;

  return (
    <article className="bg-white min-h-screen pb-20 overflow-hidden">
      {/* Article Header (Breadcrumb & Background) */}
      <div className="relative pt-12 pb-16 bg-gray-50 border-b overflow-hidden">
        <div className="container max-w-4xl relative z-10 px-6">
          <Link href="/berita" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-10 group">
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            {isID ? 'Kembali ke Berita' : 'Back to News'}
          </Link>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-3 py-1 text-xs font-bold tracking-widest uppercase">
                {displayCategory}
              </Badge>
              {article.is_premium && (
                <Badge className="bg-primary text-white border-none gap-1 py-1 px-3">
                  <Crown className="size-3" />
                  PREMIUM
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary leading-[1.1] tracking-tight max-w-3xl">
              {displayTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="size-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                  {article.author_name?.[0] || 'T'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-primary">{article.author_name || 'Tim Redaksi'}</span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest leading-none">Author</span>
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200 hidden sm:block" />
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <Calendar className="size-4" />
                {new Date(article.published_at).toLocaleDateString(isID ? 'id-ID' : 'en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <Clock className="size-4" />
                {isID ? '6 menit baca' : '6 min read'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl py-16 px-6">
        <div className="grid lg:grid-cols-[1fr_64px] gap-12">
          {/* Article Body */}
          <div className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-p:leading-relaxed prose-a:text-accent prose-strong:text-primary">
            {article.cover_image && (
              <figure className="mb-12 -mx-6 md:mx-0">
                <img
                  alt={displayTitle}
                  src={article.cover_image}
                  className="w-full h-auto rounded-3xl shadow-xl shadow-primary/5"
                />
                {article.excerpt_id && (
                  <figcaption className="text-center text-sm text-muted-foreground mt-4 italic italic font-medium px-4">
                    {isID ? article.excerpt_id : (article.excerpt_en || article.excerpt_id)}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="whitespace-pre-line text-gray-700">
              {visibleContent}
              {isLocked && '…'}
            </div>

            {isLocked && (
              <div className="mt-10 rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 text-center">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-amber-100">
                  <Crown className="size-7 text-amber-500" />
                </div>
                <h3 className="mb-2 font-display text-xl font-bold text-primary">
                  {isID ? 'Artikel Ini Khusus Premium' : 'This Article Is for Premium Members'}
                </h3>
                <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {isID
                    ? 'Anda sedang membaca cuplikan artikel. Berlangganan Premium untuk membaca artikel ini secara utuh, tanpa batas.'
                    : 'You are reading a preview. Subscribe to Premium to read this article in full, without limits.'}
                </p>
                {user ? (
                  <Link href={`/${locale}/dashboard/langganan`}>
                    <Button className="bg-amber-500 text-white hover:bg-amber-600">
                      <Crown className="mr-2 size-4" />
                      {isID ? 'Upgrade ke Premium' : 'Upgrade to Premium'}
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/${locale}/login?next=/${locale}/berita/${article.slug}`}>
                    <Button variant="outline">
                      {isID ? 'Masuk untuk Berlangganan' : 'Sign in to Subscribe'}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Sticky Social/Action Icons */}
          <div className="hidden lg:flex flex-col gap-4 sticky top-32 h-fit">
            <ArticleActions title={displayTitle} />
            <DisabledBookmarkHint />
          </div>
        </div>
      </div>

      {/* Recommended Articles Section (Placeholder) */}
      <div className="bg-gray-50 border-t py-16 mt-16">
        <div className="container max-w-4xl px-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-display font-bold text-primary italic underline decoration-accent decoration-4 underline-offset-8">
              {isID ? 'Berita Lainnya' : 'More News'}
            </h3>
            <Link href="/berita" className="text-sm font-bold text-accent hover:underline flex items-center gap-1 group">
              {isID ? 'Lihat Semua' : 'View All'}
              <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-24 bg-white rounded-2xl border animate-pulse" />
            <div className="h-24 bg-white rounded-2xl border animate-pulse" />
          </div>
        </div>
      </div>
    </article>
  );
}
