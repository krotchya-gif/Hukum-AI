import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import {
  Search,
  Gavel,
  ChevronRight,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";

const PAGE_SIZE = 20;

const TYPES = [
  { value: 'uu', label: 'UU' },
  { value: 'pp', label: 'PP' },
  { value: 'perda', label: 'PERDA' },
  { value: 'permen', label: 'PERMEN' },
  { value: 'putusan', label: 'PUTUSAN' },
] as const;

interface RegulationsPageProps {
  params: { locale: string };
  searchParams?: { q?: string; type?: string; page?: string };
}

export default async function RegulationsPage({ params: { locale }, searchParams }: RegulationsPageProps) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const isID = locale === 'id';
  const q = searchParams?.q?.trim() ?? '';
  const selectedType = TYPES.some((t) => t.value === searchParams?.type)
    ? searchParams!.type!
    : null;
  const page = Math.max(1, parseInt(searchParams?.page ?? '1', 10) || 1);
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from('regulations')
    .select('*', { count: 'exact' })
    .eq('is_published', true);

  if (selectedType) {
    query = query.eq('type', selectedType);
  }

  if (q) {
    // Karakter khusus PostgREST (.or syntax) dibersihkan dari input pengguna
    const safeQ = q.replace(/[,()]/g, ' ').trim();
    if (safeQ) {
      query = query.or(
        `title_id.ilike.%${safeQ}%,title_en.ilike.%${safeQ}%,number.ilike.%${safeQ}%`
      );
    }
  }

  const { data: regulations, count } = await query
    .order('issued_date', { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (selectedType) params.set('type', selectedType);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return qs ? `/regulasi?${qs}` : '/regulasi';
  };

  const typeHref = (value: string | null) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (value) params.set('type', value);
    const qs = params.toString();
    return qs ? `/regulasi?${qs}` : '/regulasi';
  };

  return (
    <div className="container py-12 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary mb-4">
            {isID ? 'Database Regulasi' : 'Regulation Database'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isID
              ? 'Temukan akses mudah ke ribuan peraturan perundang-undangan Indonesia.'
              : 'Find easy access to thousands of Indonesian laws and regulations.'}
          </p>
        </div>
      </div>

      {/* Search */}
      <form action={`/${locale}/regulasi`} method="get" className="mb-6">
        <div className="relative max-w-3xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
          <Input
            name="q"
            defaultValue={q}
            placeholder={isID ? "Cari nomor, judul, atau kata kunci..." : "Search number, title, or keywords..."}
            className="pl-10 h-12 pr-24"
          />
          {selectedType && <input type="hidden" name="type" value={selectedType} />}
          <Button type="submit" variant="outline" className="h-12 absolute right-0 top-0 rounded-l-none px-6 border-l-0">
            {isID ? 'Cari' : 'Search'}
          </Button>
        </div>
      </form>

      {/* Type Quick Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[{ value: null, label: isID ? 'SEMUA' : 'ALL' }, ...TYPES].map((type) => (
          <Link key={type.label} href={typeHref(type.value)}>
            <Button
              variant={type.value === selectedType ? 'default' : 'secondary'}
              size="sm"
              className="rounded-full px-4"
            >
              {type.label}
            </Button>
          </Link>
        ))}
      </div>

      {/* Result count */}
      <p className="text-sm text-muted-foreground mb-8">
        {total > 0
          ? isID
            ? `${total} regulasi ditemukan`
            : `${total} regulations found`
          : ''}
        {q && total > 0 && (
          <span>
            {' '}
            {isID ? 'untuk pencarian' : 'for'} &ldquo;{q}&rdquo;
          </span>
        )}
      </p>

      {/* Regulations List */}
      <div className="space-y-4">
        {regulations && regulations.length > 0 ? (
          regulations.map((reg) => (
            <Link
              key={reg.id}
              href={`/regulasi/${reg.slug}`}
              className="group block bg-card border rounded-xl p-6 hover:shadow-md hover:border-accent transition-all animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase">
                      {reg.type}
                    </Badge>
                    <span className="text-sm font-semibold text-muted-foreground">
                      {reg.number}
                    </span>
                    {reg.status === 'berlaku' ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none flex gap-1 items-center">
                        <CheckCircle2 className="size-3" />
                        {isID ? 'Berlaku' : 'Effective'}
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="flex gap-1 items-center">
                        <AlertCircle className="size-3" />
                        {reg.status}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-accent transition-colors leading-tight mb-3">
                    {isID ? reg.title_id : (reg.title_en || reg.title_id)}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-4" />
                      {reg.issued_date}
                    </div>
                    {reg.issuing_body && (
                      <div className="flex items-center gap-1.5 line-clamp-1">
                        <Gavel className="size-4" />
                        {reg.issuing_body}
                      </div>
                    )}
                  </div>
                </div>
                <div className="hidden md:flex items-center">
                  <div className="p-2 rounded-full group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                    <ChevronRight className="size-6" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
            <Gavel className="size-12 mx-auto text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-semibold text-gray-500">
              {isID ? 'Belum ada regulasi ditemukan' : 'No regulations found'}
            </h3>
            <p className="text-gray-400 mt-2">
              {isID ? 'Cobalah kata kunci lain atau periksa kembali nanti.' : 'Try another keyword or check back later.'}
            </p>
            {(q || selectedType) && (
              <Link href="/regulasi">
                <Button variant="outline" size="sm" className="mt-4">
                  {isID ? 'Hapus Filter' : 'Clear Filters'}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          {page > 1 ? (
            <Link href={pageHref(page - 1)}>
              <Button variant="outline" size="sm" className="gap-2">
                <ChevronLeft className="size-4" />
                {isID ? 'Sebelumnya' : 'Previous'}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="gap-2 opacity-50 pointer-events-none" disabled>
              <ChevronLeft className="size-4" />
              {isID ? 'Sebelumnya' : 'Previous'}
            </Button>
          )}
          <span className="text-sm font-medium text-muted-foreground">
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={pageHref(page + 1)}>
              <Button variant="outline" size="sm" className="gap-2">
                {isID ? 'Selanjutnya' : 'Next'}
                <ChevronRight className="size-4" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="gap-2 opacity-50 pointer-events-none" disabled>
              {isID ? 'Selanjutnya' : 'Next'}
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
