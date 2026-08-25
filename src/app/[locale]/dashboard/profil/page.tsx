import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Link } from '@/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Crown, Calendar, Clock, BookOpen } from 'lucide-react'
import { ProfileForm } from '@/components/dashboard/ProfileForm'

export default async function ProfilePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isID = locale === 'id'

  const getInitials = (name: string) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          {isID ? 'Profil Saya' : 'My Profile'}
        </h1>
        <p className="text-muted-foreground">
          {isID 
            ? 'Kelola informasi profil dan preferensi akun Anda.' 
            : 'Manage your profile information and account preferences.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {getInitials(profile?.full_name || user.email || 'U')}
                </AvatarFallback>
              </Avatar>
              {isID ? 'Informasi Profil' : 'Profile Information'}
            </CardTitle>
            <CardDescription>
              {isID ? 'Data diri Anda.' : 'Your personal data.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProfileForm initialName={profile?.full_name || ''} isID={isID} />
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user.email}
                disabled
                className="bg-gray-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Subscription Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="size-5 text-amber-500" />
              {isID ? 'Status Langganan' : 'Subscription Status'}
            </CardTitle>
            <CardDescription>
              {isID ? 'Informasi paket langganan Anda.' : 'Your subscription package information.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {isID ? 'Paket Saat Ini' : 'Current Package'}
                </p>
                <Badge 
                  className={
                    profile?.tier === 'premium' 
                      ? 'bg-amber-500 text-white border-none text-sm px-3 py-1' 
                      : 'bg-gray-200 text-gray-600 text-sm px-3 py-1'
                  }
                >
                  {profile?.tier === 'premium' ? 'Premium' : 'Free'}
                </Badge>
              </div>
              {profile?.tier !== 'premium' && (
                <Link href={`/${locale}/dashboard/langganan`}>
                  <Button size="sm" className="bg-accent hover:bg-accent/90">
                    {isID ? 'Upgrade Premium' : 'Upgrade to Premium'}
                  </Button>
                </Link>
              )}
            </div>

            {profile?.tier === 'premium' && profile?.subscription_end_at && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <Calendar className="size-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    {isID ? 'Berlaku hingga' : 'Valid until'}
                  </p>
                  <p className="text-lg font-bold text-amber-600">
                    {formatDate(profile.subscription_end_at)}
                  </p>
                </div>
              </div>
            )}

            <Separator />

            {/* Usage Stats */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                {isID ? 'Statistik Penggunaan' : 'Usage Statistics'}
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <BookOpen className="size-4" />
                    <span className="text-xs">{isID ? 'Artikel Dibaca' : 'Articles Read'}</span>
                  </div>
                  <p className="text-xl font-bold">{profile?.articles_read_count || 0}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="size-4" />
                    <span className="text-xs">{isID ? 'Chat AI Hari Ini' : 'AI Chat Today'}</span>
                  </div>
                  <p className="text-xl font-bold">
                    {profile?.tier === 'premium' ? '∞' : `${profile?.ai_chat_count_today || 0}/5`}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}