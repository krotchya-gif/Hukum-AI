import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import {
  ArrowLeft,
  Download,
  Share2,
  Calendar,
  Gavel,
  FileText,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AISummaryCard } from "@/components/regulasi/AISummaryCard";
import { BookmarkButton } from "@/components/regulasi/BookmarkButton";

export default async function RegulationDetailPage({
  params
}: {
  params: Promise<{ locale: string, slug: string }>
}) {
  const { locale, slug } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Regulasi yang belum dipublikasikan tidak boleh diakses via URL langsung
  const { data: reg } = await supabase
    .from('regulations')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!reg) {
    notFound();
  }

  // Status langganan & bookmark untuk tombol simpan
  const { data: { user } } = await supabase.auth.getUser();
  let hasActivePremium = false;
  let initialSaved = false;
  if (user) {
    const [{ data: profile }, { data: bookmark }] = await Promise.all([
      supabase.from('profiles').select('tier, subscription_end_at').eq('id', user.id).single(),
      supabase.from('bookmarks').select('id').eq('regulation_id', reg.id).maybeSingle(),
    ]);
    hasActivePremium =
      profile?.tier === 'premium' &&
      (!profile.subscription_end_at || new Date(profile.subscription_end_at) > new Date());
    initialSaved = Boolean(bookmark);
  }

  const isID = locale === 'id';

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <div className="container py-8 max-w-6xl">
        {/* Navigation Breadcrumb */}
        <Link href="/regulasi" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-8 group">
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          {isID ? 'Kembali ke Database' : 'Back to Database'}
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border p-8 md:p-12 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase py-1 px-3">
                  {reg.type}
                </Badge>
                <Badge className={reg.status === 'berlaku' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  {reg.status.toUpperCase()}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6 leading-tight">
                {isID ? reg.title_id : (reg.title_en || reg.title_id)}
              </h1>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-8 border-y border-dashed mb-8">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase opacity-60">Nomor/Tahun</p>
                  <p className="font-semibold text-primary">{reg.number || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase opacity-60">Tanggal Terbit</p>
                  <div className="flex items-center gap-1.5 font-semibold text-primary">
                    <Calendar className="size-4 text-accent" />
                    {reg.issued_date || '-'}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase opacity-60">Instansi</p>
                  <div className="flex items-center gap-1.5 font-semibold text-primary">
                    <Gavel className="size-4 text-accent" />
                    <span className="line-clamp-1">{reg.issuing_body || '-'}</span>
                  </div>
                </div>
              </div>

              {/* AI Summary Card */}
              <AISummaryCard 
                regulationId={reg.id}
                initialSummaryId={reg.ai_summary_id}
                initialSummaryEn={reg.ai_summary_en}
                locale={locale}
              />

              <div className="prose prose-slate max-w-none">
                <h3 className="font-display font-bold text-2xl mb-4">{isID ? 'Tentang Regulasi' : 'About Regulation'}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {isID ? reg.about_id : (reg.about_en || reg.about_id)}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Actions (Right) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border p-8 shadow-sm h-fit sticky top-24">
              <h4 className="font-bold text-primary mb-6 flex items-center gap-2">
                <FileText className="size-5 text-accent" />
                {isID ? 'Aksi Dokumen' : 'Document Actions'}
              </h4>
              <div className="space-y-3">
                {reg.file_url ? (
                  <a href={reg.file_url} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full gap-2 h-12 bg-primary hover:bg-primary/90 font-bold shadow-md">
                      <Download className="size-4" />
                      {isID ? 'Unduh PDF (Salinan Asli)' : 'Download PDF (Original)'}
                    </Button>
                  </a>
                ) : (
                  <div className="w-full flex items-center justify-center gap-2 h-12 rounded-md border border-dashed text-sm text-muted-foreground opacity-70 cursor-not-allowed">
                    <Download className="size-4" />
                    {isID ? 'PDF belum tersedia' : 'PDF not yet available'}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <BookmarkButton
                    regulationId={reg.id}
                    initialSaved={initialSaved}
                    hasActivePremium={hasActivePremium}
                    isID={isID}
                  />
                  <Button variant="outline" className="gap-2 h-12 font-semibold">
                    <Share2 className="size-4" />
                    Bagikan
                  </Button>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-dashed">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 opacity-50">Link Eksternal</p>
                <Link href="#" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-accent/5 hover:text-accent transition-all group">
                  <span className="text-sm font-semibold">JDIH Nasional</span>
                  <ExternalLink className="size-4 opacity-50 group-hover:opacity-100" />
                </Link>
              </div>
            </div>

            {/* Premium Upsell Side Card */}
            {!reg.is_premium && (
              <div className="rounded-3xl bg-amber-500 p-8 text-white shadow-xl shadow-amber-500/20">
                <CrownIcon className="size-10 mb-4 opacity-70" />
                <h4 className="text-xl font-bold mb-2">Ingin Analisis Lebih Dalam?</h4>
                <p className="text-sm text-white/90 mb-6 leading-relaxed">
                  Buka fitur Premium untuk mendapatkan perbandingan pasal secara otomatis dan notifikasi perubahan status regulasi.
                </p>
                <Link href={`/${locale}/dashboard/langganan`}>
                  <Button className="w-full bg-white text-amber-600 font-bold hover:bg-gray-100 border-none">
                    Lihat Paket Premium
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}
