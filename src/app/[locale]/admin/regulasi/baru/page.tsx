import { Link } from '@/navigation'
import { ArrowLeft } from 'lucide-react'
import { RegulasiForm } from '@/components/admin/RegulasiForm'

export default async function NewRegulationPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const isID = locale === 'id'

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href={`/${locale}/admin/regulasi`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary mb-2">
          <ArrowLeft className="size-4" />
          {isID ? 'Kembali ke Daftar' : 'Back to List'}
        </Link>
        <h1 className="text-3xl font-display font-bold text-primary">
          {isID ? 'Tambah Regulasi Baru' : 'New Regulation'}
        </h1>
      </div>

      <RegulasiForm locale={locale} />
    </div>
  )
}
