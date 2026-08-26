import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Link } from '@/navigation'
import { ArrowLeft } from 'lucide-react'
import { RegulasiForm, type RegulasiFormValues } from '@/components/admin/RegulasiForm'

export default async function EditRegulationPage({
  params
}: {
  params: Promise<{ locale: string, id: string }>
}) {
  const { locale, id } = await params;
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // maybeSingle agar ID yang tidak valid (bukan UUID) tidak melempar error
  const { data: regulation } = await supabase
    .from('regulations')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!regulation) notFound()

  const isID = locale === 'id'

  const initial: RegulasiFormValues = {
    id: regulation.id,
    type: regulation.type ?? 'uu',
    number: regulation.number ?? '',
    title_id: regulation.title_id ?? '',
    title_en: regulation.title_en ?? '',
    slug: regulation.slug ?? '',
    about_id: regulation.about_id ?? '',
    about_en: regulation.about_en ?? '',
    status: regulation.status ?? 'berlaku',
    issued_date: regulation.issued_date ?? '',
    effective_date: regulation.effective_date ?? '',
    issuing_body: regulation.issuing_body ?? '',
    file_url: regulation.file_url ?? '',
    full_text: regulation.full_text ?? '',
    is_premium: Boolean(regulation.is_premium),
    is_published: regulation.is_published !== false,
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href={`/${locale}/admin/regulasi`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary mb-2">
          <ArrowLeft className="size-4" />
          {isID ? 'Kembali ke Daftar' : 'Back to List'}
        </Link>
        <h1 className="text-3xl font-display font-bold text-primary">
          {isID ? 'Edit Regulasi' : 'Edit Regulation'}
        </h1>
      </div>

      <RegulasiForm initial={initial} locale={locale} />
    </div>
  )
}
