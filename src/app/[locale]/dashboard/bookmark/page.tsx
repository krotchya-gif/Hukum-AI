import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { Link } from '@/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Bookmark,
  Calendar,
  Gavel,
  FileText,
  Search,
  Crown,
  Lock
} from 'lucide-react'
import { DeleteBookmarkButton } from '@/components/regulasi/DeleteBookmarkButton'

export default async function BookmarkPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tier')
    .eq('id', user.id)
    .single()

  const isID = locale === 'id'

  // Fetch user's bookmarks with regulation data
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select(`
      *,
      regulation:regulations(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Check if user is premium
  const isPremium = profile?.tier === 'premium'

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          {isID ? 'Regulasi Tersimpan' : 'Saved Regulations'}
        </h1>
        <p className="text-muted-foreground">
          {isID 
            ? 'Kelola regulasi yang Anda simpan untuk referensi cepat.' 
            : 'Manage your saved regulations for quick reference.'}
        </p>
      </div>

      {/* Premium Gate - Show if user is not premium */}
      {!isPremium && (
        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="flex flex-col md:flex-row items-center gap-6 py-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="size-6 text-amber-500" />
                <h3 className="text-xl font-bold text-primary">
                  {isID ? 'Fitur Premium' : 'Premium Feature'}
                </h3>
              </div>
              <p className="text-muted-foreground mb-4">
                {isID 
                  ? 'Simpan regulasi favorit dan akses kapan saja dengan langganan Premium. Dapatkan analisis AI tanpa batas dan fitur eksklusif lainnya.' 
                  : 'Save your favorite regulations and access them anytime with a Premium subscription. Get unlimited AI analysis and other exclusive features.'}
              </p>
              <Link href={`/${locale}/dashboard/langganan`}>
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                  <Crown className="size-4 mr-2" />
                  {isID ? 'Upgrade ke Premium' : 'Upgrade to Premium'}
                </Button>
              </Link>
            </div>
            <div className="p-4 bg-amber-100 rounded-2xl">
              <Lock className="size-12 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search & Filter */}
      {isPremium && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input 
              placeholder={isID ? "Cari regulasi tersimpan..." : "Search saved regulations..."}
              className="pl-10 h-11"
            />
          </div>
        </div>
      )}

      {/* Bookmarks List */}
      {isPremium && bookmarks && bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase">
                        {bookmark.regulation?.type}
                      </Badge>
                      {bookmark.regulation?.number && (
                        <span className="text-sm font-semibold text-muted-foreground">
                          {bookmark.regulation.number}
                        </span>
                      )}
                    </div>
                    <Link 
                      href={`/${locale}/regulasi/${bookmark.regulation?.slug}`}
                      className="block"
                    >
                      <h3 className="text-lg font-bold text-primary hover:text-accent transition-colors mb-2">
                        {isID ? bookmark.regulation?.title_id : (bookmark.regulation?.title_en || bookmark.regulation?.title_id)}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {bookmark.regulation?.issued_date && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-4" />
                          {new Date(bookmark.regulation.issued_date).getFullYear()}
                        </div>
                      )}
                      {bookmark.regulation?.issuing_body && (
                        <div className="flex items-center gap-1.5">
                          <Gavel className="size-4" />
                          <span className="truncate">{bookmark.regulation.issuing_body}</span>
                        </div>
                      )}
                    </div>
                    {bookmark.note && (
                      <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border">
                        {bookmark.note}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/${locale}/regulasi/${bookmark.regulation?.slug}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <FileText className="size-4" />
                        {isID ? 'Lihat' : 'View'}
                      </Button>
                    </Link>
                    <DeleteBookmarkButton bookmarkId={bookmark.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isPremium ? (
        <Card className="py-16">
          <CardContent className="text-center">
            <Bookmark className="size-16 mx-auto text-muted-foreground/20 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              {isID ? 'Belum ada regulasi tersimpan' : 'No saved regulations yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isID 
                ? 'Simpan regulasi favorit Anda untuk akses cepat di lain waktu.' 
                : 'Save your favorite regulations for quick access anytime.'}
            </p>
            <Link href={`/${locale}/regulasi`}>
              <Button variant="outline">
                {isID ? 'Jelajahi Regulasi' : 'Browse Regulations'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}