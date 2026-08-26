import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Zap, Calendar, Check } from 'lucide-react'
import { CheckoutButton } from '@/components/langganan/CheckoutButton'

export default async function SubscriptionPage({
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
    .select('tier, subscription_end_at')
    .eq('id', user.id)
    .single()

  const isID = locale === 'id'
  const isPremium = profile?.tier === 'premium'

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const plans = [
    {
      name: isID ? 'Free' : 'Free',
      price: 'Rp 0',
      period: isID ? '/selamanya' : '/forever',
      description: isID ? 'Untuk pengguna baru' : 'For new users',
      features: [
        { text: isID ? 'Akses database regulasi' : 'Access regulation database', included: true },
        { text: isID ? 'Baca ringkasan AI (3/hari)' : 'Read AI summaries (3/day)', included: true },
        { text: isID ? 'Tanya AI (5 pertanyaan/hari)' : 'Ask AI (5 questions/day)', included: true },
        { text: isID ? 'Unduh PDF regulasi' : 'Download regulation PDFs', included: false },
        { text: isID ? 'Bookmark regulasi' : 'Save regulation bookmarks', included: false },
        { text: isID ? 'AI tanpa batas' : 'Unlimited AI access', included: false },
      ],
      cta: isID ? 'Paket Saat Ini' : 'Current Plan',
      popular: false,
      disabled: true
    },
    {
      name: isID ? 'Premium' : 'Premium',
      price: 'Rp 49.000',
      period: isID ? '/bulan' : '/month',
      description: isID ? 'Terpopuler untuk profesional' : 'Most popular for professionals',
      features: [
        { text: isID ? 'Semua fitur Free' : 'All Free features', included: true },
        { text: isID ? 'Unduh PDF semua regulasi' : 'Download all regulation PDFs', included: true },
        { text: isID ? 'Bookmark tanpa batas' : 'Unlimited bookmarks', included: true },
        { text: isID ? 'AI tanpa batas + riwayat' : 'Unlimited AI + history', included: true },
        { text: isID ? 'Artikel premium tak terbatas' : 'Unlimited premium articles', included: true },
        { text: isID ? 'Akses fitur baru lebih awal' : 'Early access to new features', included: true },
      ],
      cta: isID ? 'Berlangganan Sekarang' : 'Subscribe Now',
      popular: true
    },
    {
      name: isID ? 'Premium Tahunan' : 'Annual Premium',
      price: 'Rp 399.000',
      period: isID ? '/tahun' : '/year',
      description: isID ? 'Hemat 32%' : 'Save 32%',
      badge: isID ? 'BEST VALUE' : 'BEST VALUE',
      features: [
        { text: isID ? 'Semua fitur Premium' : 'All Premium features', included: true },
        { text: isID ? 'Hemat Rp 189.000/tahun' : 'Save Rp 189.000/year', included: true },
        { text: isID ? 'Prioritas dukungan' : 'Priority support', included: true },
        { text: isID ? 'Webinar bulanan eksklusif' : 'Exclusive monthly webinars', included: true },
        { text: isID ? 'Analisis regulasi prioritas' : 'Priority regulation analysis', included: true },
        { text: isID ? 'Early access semua fitur' : 'Early access all features', included: true },
      ],
      cta: isID ? 'Berlangganan Sekarang' : 'Subscribe Now',
      popular: false
    }
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          {isID ? 'Langganan' : 'Subscription'}
        </h1>
        <p className="text-muted-foreground">
          {isID 
            ? 'Pilih paket yang sesuai dengan kebutuhan hukum Anda.' 
            : 'Choose a plan that suits your legal needs.'}
        </p>
      </div>

      {/* Current Subscription Status */}
      {isPremium && profile?.subscription_end_at && (
        <Card className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-amber-200">
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500 rounded-xl text-white">
                <Crown className="size-8" />
              </div>
              <div>
                <Badge className="bg-amber-500 text-white border-none mb-2">Premium Active</Badge>
                <p className="text-sm text-amber-800">
                  {isID ? 'Berlaku hingga' : 'Valid until'}: <span className="font-bold">{formatDate(profile.subscription_end_at)}</span>
                </p>
              </div>
            </div>
            <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
              <Calendar className="size-4 mr-2" />
              {isID ? 'Perpanjang Langganan' : 'Renew Subscription'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card 
            key={index}
            className={`relative overflow-hidden transition-transform hover:scale-[1.02] ${
              plan.popular ? 'border-2 border-accent shadow-xl' : ''
            } ${
              isPremium && index === 1 ? 'opacity-50' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-accent text-white text-center py-1 text-sm font-bold">
                {isID ? 'TERPOPULER' : 'MOST POPULAR'}
              </div>
            )}
            {plan.badge && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-emerald-500 text-white border-none text-xs">
                  {plan.badge}
                </Badge>
              </div>
            )}
            <CardHeader className={`pt-8 ${plan.popular ? 'bg-accent/5' : ''}`}>
              <CardTitle className="flex items-center gap-2">
                <Zap className={`size-5 ${plan.popular ? 'text-accent' : 'text-muted-foreground'}`} />
                {plan.name}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold text-primary">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="size-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <span className="size-5 text-gray-300 shrink-0 mt-0.5">✕</span>
                    )}
                    <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              {index === 0 ? (
                <Button variant="outline" className="w-full mt-6" disabled>
                  {plan.cta}
                </Button>
              ) : (
                <CheckoutButton
                  plan={index === 1 ? 'monthly' : 'yearly'}
                  ctaText={plan.cta}
                  isPopular={plan.popular}
                  disabled={isPremium && index === 1}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {isID ? 'Perbandingan Fitur' : 'Feature Comparison'}
          </CardTitle>
          <CardDescription>
            {isID ? 'Detail lengkap fitur setiap paket.' : 'Complete feature details for each plan.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Fitur</th>
                  <th className="text-center py-3 px-4 font-semibold">Free</th>
                  <th className="text-center py-3 px-4 font-semibold bg-accent/5">Premium</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { feat: isID ? 'Akses database regulasi' : 'Access regulation database', free: true, premium: true },
                  { feat: isID ? 'Tanya AI per hari' : 'Ask AI per day', free: '5', premium: '∞' },
                  { feat: isID ? 'Ringkasan AI per hari' : 'AI summaries per day', free: '3', premium: '∞' },
                  { feat: isID ? 'Unduh PDF' : 'PDF downloads', free: false, premium: true },
                  { feat: isID ? 'Bookmark regulasi' : 'Save bookmarks', free: false, premium: true },
                  { feat: isID ? 'Baca artikel premium' : 'Read premium articles', free: '5/bulan', premium: '∞' },
                  { feat: isID ? 'Riwayat chat AI' : 'AI chat history', free: false, premium: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 px-4">{row.feat}</td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="size-4 mx-auto text-emerald-500" /> : <span className="text-gray-300">—</span>
                      ) : row.free}
                    </td>
                    <td className="py-3 px-4 text-center bg-accent/5">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? <Check className="size-4 mx-auto text-emerald-500" /> : <span className="text-gray-300">—</span>
                      ) : (
                        <span className="font-semibold text-accent">{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}