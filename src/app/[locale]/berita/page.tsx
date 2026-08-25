import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Link } from "@/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, ChevronRight, ChevronLeft, Newspaper, Crown } from "lucide-react";

const PAGE_SIZE = 12;

interface NewsPageProps {
  params: { locale: string };
  searchParams?: { page?: string };
}

export default async function NewsPage({ params: { locale }, searchParams }: NewsPageProps) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const page = Math.max(1, parseInt(searchParams?.page ?? '1', 10) || 1);
  const from = (page - 1) * PAGE_SIZE;

  // Fetch articles and categories (dengan total untuk paginasi)
  const [{ data: articles, count }, { data: categories }] = await Promise.all([
    supabase
      .from('articles')
      .select(`
        *,
        category:categories(*)
      `, { count: 'exact' })
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1),
    supabase.from('categories').select('*').order('name_id', { ascending: true }),
  ]);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Artikel unggulan hanya di halaman pertama
  const featuredArticle = page === 1 ? articles?.[0] : undefined;
  const remainingArticles = (featuredArticle ? articles?.slice(1) : articles) || [];

  return (
    <div className="container py-12 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 mb-12">
        <h1 className="text-4xl font-display font-bold text-primary tracking-tight">
          {locale === 'id' ? 'Berita & Analisis Hukum' : 'Legal News & Analysis'}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {locale === 'id' 
            ? 'Wawasan mendalam mengenai perkembangan hukum terbaru, opini ahli, dan panduan praktis.' 
            : 'Deep insights into the latest legal developments, expert opinions, and practical guides.'}
        </p>
      </div>

      {/* Featured Article */}
      {featuredArticle && (
        <div className="mb-16">
          <Link href={`/berita/${featuredArticle.slug}`} className="group relative block overflow-hidden rounded-3xl border bg-card shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-[16/10] md:aspect-auto h-full min-h-[300px]">
                {featuredArticle.cover_image ? (
                  <img 
                    src={featuredArticle.cover_image} 
                    alt={featuredArticle.title_id}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                    <Newspaper className="size-20 text-primary/10" />
                  </div>
                )}
                {featuredArticle.is_premium && (
                  <Badge className="absolute top-4 left-4 bg-amber-500 text-white border-none gap-1 py-1.5 px-3">
                    <Crown className="size-4" />
                    PREMIUM
                  </Badge>
                )}
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {locale === 'id' ? featuredArticle.category?.name_id : featuredArticle.category?.name_en}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="size-4" />
                    {new Date(featuredArticle.published_at).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 group-hover:text-accent transition-colors leading-tight">
                  {locale === 'id' ? featuredArticle.title_id : (featuredArticle.title_en || featuredArticle.title_id)}
                </h2>
                <p className="text-muted-foreground text-lg mb-8 line-clamp-3">
                  {locale === 'id' ? featuredArticle.excerpt_id : (featuredArticle.excerpt_en || featuredArticle.excerpt_id)}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed">
                  <div className="flex items-center gap-2">
                    <div className="size-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <User className="size-5" />
                    </div>
                    <span className="font-semibold text-primary">{featuredArticle.author_name || 'Tim Redaksi'}</span>
                  </div>
                  <Button variant="ghost" className="gap-1 group-hover:translate-x-1 transition-transform">
                    {locale === 'id' ? 'Baca Selengkapnya' : 'Read More'}
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Categories Bar */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar border-b">
        <Button variant="default" className="rounded-full px-6 whitespace-nowrap">Semua</Button>
        {categories?.map((cat) => (
          <Button key={cat.id} variant="ghost" className="rounded-full px-6 whitespace-nowrap hover:bg-primary/5">
            {locale === 'id' ? cat.name_id : cat.name_en}
          </Button>
        ))}
      </div>

      {/* Grid of Articles */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {remainingArticles.length > 0 ? (
          remainingArticles.map((article) => (
            <Link key={article.id} href={`/berita/${article.slug}`} className="group flex flex-col h-full bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video overflow-hidden">
                {article.cover_image ? (
                  <img alt="Cover" src={article.cover_image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                    <Newspaper className="size-12 text-primary/10" />
                  </div>
                )}
                {article.is_premium && (
                  <Badge className="absolute top-3 left-3 bg-amber-500 border-none px-2 py-0.5">
                    <Crown className="size-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                    {locale === 'id' ? article.category?.name_id : article.category?.name_en}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">
                    {new Date(article.published_at).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US')}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                  {locale === 'id' ? article.title_id : (article.title_en || article.title_id)}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                  {locale === 'id' ? article.excerpt_id : (article.excerpt_en || article.excerpt_id)}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                  <span className="text-xs font-semibold text-primary/80">{article.author_name || 'Tim Redaksi'}</span>
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Clock className="size-3" />
                    <span>5 mnt</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : !featuredArticle ? (
          <div className="col-span-full py-20 text-center">
            <Newspaper className="size-16 mx-auto text-muted-foreground opacity-20 mb-4" />
            <p className="text-xl text-muted-foreground">{locale === 'id' ? 'Belum ada artikel dipublikasikan.' : 'No articles published yet.'}</p>
          </div>
        ) : null}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-14">
          {page > 1 ? (
            <Link href={`/berita?page=${page - 1}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <ChevronLeft className="size-4" />
                {locale === 'id' ? 'Sebelumnya' : 'Previous'}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="gap-2 opacity-50 pointer-events-none" disabled>
              <ChevronLeft className="size-4" />
              {locale === 'id' ? 'Sebelumnya' : 'Previous'}
            </Button>
          )}
          <span className="text-sm font-medium text-muted-foreground">
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={`/berita?page=${page + 1}`}>
              <Button variant="outline" size="sm" className="gap-2">
                {locale === 'id' ? 'Selanjutnya' : 'Next'}
                <ChevronRight className="size-4" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="gap-2 opacity-50 pointer-events-none" disabled>
              {locale === 'id' ? 'Selanjutnya' : 'Next'}
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
