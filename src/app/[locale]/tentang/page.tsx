import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Scale,
  Bot,
  Users,
  ShieldCheck,
  Heart,
  Mail,
  Phone,
  MapPin,
  ArrowRight
} from 'lucide-react'
import { Link } from '@/navigation'
import { ContactForm } from '@/components/kontak/ContactForm'

export default async function TentangPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const isID = locale === 'id'

  const features = [
    {
      icon: Scale,
      title: isID ? 'Database Regulasi Lengkap' : 'Complete Regulation Database',
      desc: isID 
        ? 'Akses ribuan regulasi Indonesia dari UU hingga Perda. Semua informasi terkini dan akurat.'
        : 'Access thousands of Indonesian regulations from Laws to Regional Regulations. All up-to-date and accurate information.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Bot,
      title: isID ? 'Asisten Hukum AI' : 'Legal AI Assistant',
      desc: isID 
        ? 'Dapatkan jawaban cepat untuk pertanyaan hukum umum dari asisten AI kami yang terpercaya.'
        : 'Get quick answers to general legal questions from our trusted AI assistant.',
      color: 'bg-amber-50 text-amber-600'
    },
    {
      icon: ShieldCheck,
      title: isID ? 'Informasi Terpercaya' : 'Trusted Information',
      desc: isID 
        ? 'Semua konten dikurasi oleh tim ahli hukum berpengalaman untuk memastikan akurasi.'
        : 'All content is curated by experienced legal experts to ensure accuracy.',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: Users,
      title: isID ? 'Komunitas Hukum' : 'Legal Community',
      desc: isID 
        ? 'Bergabung dengan komunitas hukum terbesar di Indonesia. Bagikan pengetahuan dan pengalaman.'
        : 'Join the largest legal community in Indonesia. Share knowledge and experiences.',
      color: 'bg-purple-50 text-purple-600'
    }
  ]

  const team = [
    {
      name: 'Dr. Ahmad Wijaya, S.H., M.H.',
      role: isID ? 'Penasihat Hukum Utama' : 'Chief Legal Advisor',
      desc: isID 
        ? 'Mantan hakim agung dengan pengalaman 25+ tahun di peradilan Indonesia.'
        : 'Former supreme court justice with 25+ years of experience in Indonesian judiciary.'
    },
    {
      name: 'Sarah Putri, S.H.',
      role: isID ? 'Head of Content' : 'Head of Content',
      desc: isID 
        ? 'Konsultan hukum korporasi dengan spesialisasi di bidang kekayaan intelektual.'
        : 'Corporate legal consultant specializing in intellectual property.'
    },
    {
      name: 'Budi Santoso',
      role: isID ? 'Head of Technology' : 'Head of Technology',
      desc: isID 
        ? 'Teknisi software dengan pengalaman 15+ tahun di industri fintech.'
        : 'Software engineer with 15+ years of experience in fintech industry.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Badge className="bg-white/10 text-white border-white/20 mb-6">
            {isID ? 'Tentang Kami' : 'About Us'}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
            {isID 
              ? 'Platform Hukum Digital Indonesia'
              : 'Indonesian Digital Legal Platform'}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            {isID 
              ? 'HRP LEGAL Community memberdayakan masyarakat Indonesia dengan akses informasi hukum yang transparan, akurat, dan mudah dipahami.'
              : 'HRP LEGAL Community empowers Indonesian society with transparent, accurate, and easy-to-understand legal information access.'}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
                {isID ? 'Misi Kami' : 'Our Mission'}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {isID 
                  ? 'Kami percaya bahwa akses terhadap informasi hukum adalah hak fundamental setiap warga negara. Sayangnya, banyak masyarakat Indonesia yang kesulitan memahami regulasi yang berlaku.'
                  : 'We believe that access to legal information is a fundamental right of every citizen. Unfortunately, many Indonesians struggle to understand applicable regulations.'}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {isID 
                  ? 'HRP LEGAL Community hadir untuk menjembatani kesenjangan ini. Dengan teknologi AI dan tim ahli hukum berpengalaman, kami berkomitmen membuat hukum Indonesia lebih accessible untuk semua kalangan.'
                  : 'HRP LEGAL Community exists to bridge this gap. With AI technology and experienced legal experts, we are committed to making Indonesian law more accessible to everyone.'}
              </p>
              <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-2xl">
                <Heart className="size-8 text-accent" />
                <div>
                  <p className="font-bold text-primary">
                    {isID ? 'Dibuat dengan cinta di Indonesia' : 'Made with love in Indonesia'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isID 
                      ? 'Mendukung pemberantasan korupsi dan transparansi hukum'
                      : 'Supporting anti-corruption and legal transparency'}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/5 to-accent/10 rounded-3xl p-8 md:p-12">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                    <p className="text-4xl font-bold text-primary mb-2">5000+</p>
                    <p className="text-sm text-muted-foreground">
                      {isID ? 'Regulasi' : 'Regulations'}
                    </p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                    <p className="text-4xl font-bold text-primary mb-2">10K+</p>
                    <p className="text-sm text-muted-foreground">
                      {isID ? 'Pengguna' : 'Users'}
                    </p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                    <p className="text-4xl font-bold text-primary mb-2">50+</p>
                    <p className="text-sm text-muted-foreground">
                      {isID ? 'Artikel Hukum' : 'Legal Articles'}
                    </p>
                  </div>
                  <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
                    <p className="text-4xl font-bold text-primary mb-2">24/7</p>
                    <p className="text-sm text-muted-foreground">
                      {isID ? 'Asisten AI' : 'AI Assistant'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50/50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
              {isID ? 'Layanan Kami' : 'Our Services'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isID 
                ? 'Berbagai fitur yang membantu Anda memahami hukum Indonesia dengan lebih mudah.'
                : 'Various features to help you understand Indonesian law more easily.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <feature.icon className="size-7" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
              {isID ? 'Tim Kami' : 'Our Team'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {isID 
                ? 'Dipimpin oleh para ahli di bidang hukum dan teknologi.'
                : 'Led by experts in law and technology.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/50 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold">
                    {member.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-1">{member.name}</h3>
                  <p className="text-sm text-accent font-medium mb-4">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            {isID 
              ? 'Siap Memulai Perjalanan Hukum Anda?'
              : 'Ready to Start Your Legal Journey?'}
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {isID 
              ? 'Bergabunglah dengan ribuan pengguna yang telah menemukan kemudahan dalam memahami hukum Indonesia.'
              : 'Join thousands of users who have discovered ease in understanding Indonesian law.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/regulasi`}>
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 gap-2 text-lg px-8">
                {isID ? 'Jelajahi Regulasi' : 'Explore Regulations'}
                <ArrowRight className="size-5" />
              </Button>
            </Link>
            <Link href={`/${locale}/register`}>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 gap-2 text-lg px-8">
                {isID ? 'Daftar Gratis' : 'Register Free'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50/50">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-display font-bold text-primary mb-6">
                {isID ? 'Hubungi Kami' : 'Contact Us'}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {isID 
                  ? 'Punya pertanyaan atau saran? Jangan ragu untuk menghubungi kami.'
                  : 'Have questions or suggestions? Do not hesitate to contact us.'}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Mail className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-primary mb-1">Email</p>
                    <p className="text-muted-foreground">info@hrplegal.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Phone className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-primary mb-1">{isID ? 'Telepon' : 'Phone'}</p>
                    <p className="text-muted-foreground">+62 21 1234 5678</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <MapPin className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-primary mb-1">{isID ? 'Alamat' : 'Address'}</p>
                    <p className="text-muted-foreground">
                      {isID 
                        ? 'Jl. Sudirman No. 123, Jakarta Selatan 12190, Indonesia'
                        : '123 Sudirman Street, South Jakarta 12190, Indonesia'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card className="p-8">
                <h3 className="text-xl font-bold mb-6">
                  {isID ? 'Kirim Pesan' : 'Send Message'}
                </h3>
                <ContactForm isID={isID} />
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}