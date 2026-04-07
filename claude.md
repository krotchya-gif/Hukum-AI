# claude.md — Instruksi AI Agent: Website Hukum Indonesia

> Dokumen ini adalah panduan lengkap untuk AI agent dalam membangun platform hukum Indonesia.
> Baca seluruh dokumen sebelum mulai eksekusi apapun.

---

## 🎯 Visi Produk

Platform hukum digital Indonesia yang **accessible untuk semua kalangan** — dari masyarakat awam hingga praktisi hukum profesional. Menggabungkan database regulasi yang komprehensif dengan berita hukum terkini, diperkuat fitur AI untuk pemahaman hukum yang lebih mudah.

**Inspirasi referensi:**
- [hukumonline.com](https://www.hukumonline.com/) — struktur database & konten premium
- [pahamhukum.id](https://pahamhukum.id/) — pendekatan edukasi yang ramah pengguna

---

## 🏗️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Backend/DB | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Search | Supabase Full-Text Search + pgvector (semantic search) |
| Deployment | Vercel |
| CMS Admin | Custom admin panel (Next.js route group) |

### Struktur Direktori Proyek

```
/
├── app/
│   ├── (public)/               # Route group halaman publik
│   │   ├── page.tsx            # Homepage
│   │   ├── berita/             # Halaman berita & artikel
│   │   │   ├── page.tsx        # Listing berita
│   │   │   └── [slug]/page.tsx # Detail artikel
│   │   ├── regulasi/           # Database peraturan/UU
│   │   │   ├── page.tsx        # Listing & search regulasi
│   │   │   └── [id]/page.tsx   # Detail regulasi + AI summary
│   │   ├── tanya-ai/           # AI Chatbot halaman
│   │   └── tentang/            # About page
│   ├── (auth)/                 # Route group autentikasi
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── callback/route.ts   # Supabase OAuth callback
│   ├── (dashboard)/            # Route group user dashboard
│   │   ├── profil/page.tsx
│   │   ├── bookmark/page.tsx   # Regulasi tersimpan (premium)
│   │   └── langganan/page.tsx  # Kelola subscription
│   ├── (admin)/                # Route group admin CMS
│   │   ├── dashboard/
│   │   ├── berita/
│   │   └── regulasi/
│   └── api/
│       ├── ai/
│       │   ├── chat/route.ts       # AI Chatbot endpoint
│       │   └── summarize/route.ts  # AI summarize regulasi
│       └── webhook/
│           └── payment/route.ts    # Payment webhook
├── components/
│   ├── ui/                     # shadcn/ui base components
│   ├── layout/                 # Header, Footer, Sidebar
│   ├── regulasi/               # Komponen khusus regulasi
│   ├── berita/                 # Komponen khusus berita
│   ├── ai/                     # AI Chat & Summarize components
│   └── premium/                # Paywall & upgrade components
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── middleware.ts
│   ├── ai/
│   │   ├── claude.ts           # Anthropic client wrapper
│   │   ├── prompts.ts          # System prompts
│   │   └── rate-limiter.ts     # Rate limit per user tier
│   └── utils/
│       ├── search.ts
│       └── format-date.ts
├── middleware.ts                # Auth & premium gate middleware
└── supabase/
    └── migrations/             # SQL migration files
```

---

## 🗄️ Database Schema (Supabase)

### Tabel Utama

```sql
-- Profil pengguna (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
  subscription_end_at TIMESTAMPTZ,
  ai_chat_count_today INTEGER DEFAULT 0,
  ai_chat_reset_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kategori berita/artikel
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name_id TEXT NOT NULL,       -- Bahasa Indonesia
  name_en TEXT NOT NULL,       -- Bahasa Inggris
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#1a56db'
);

-- Berita & artikel hukum
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_id TEXT NOT NULL,
  title_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  content_id TEXT NOT NULL,    -- Konten Bahasa Indonesia
  content_en TEXT,             -- Konten Bahasa Inggris (opsional)
  excerpt_id TEXT,
  excerpt_en TEXT,
  cover_image TEXT,
  category_id INTEGER REFERENCES categories(id),
  author_name TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jenis regulasi
CREATE TYPE regulation_type AS ENUM (
  'uu',           -- Undang-Undang
  'pp',           -- Peraturan Pemerintah
  'perda',        -- Peraturan Daerah
  'permen',       -- Peraturan Menteri
  'putusan'       -- Putusan Pengadilan
);

-- Database regulasi/peraturan
CREATE TABLE regulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type regulation_type NOT NULL,
  number TEXT,                 -- Nomor regulasi (e.g., "1 Tahun 2024")
  title_id TEXT NOT NULL,      -- Judul lengkap
  title_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  about_id TEXT,               -- Deskripsi singkat
  about_en TEXT,
  status TEXT DEFAULT 'berlaku' CHECK (status IN ('berlaku', 'dicabut', 'diubah')),
  issued_date DATE,
  effective_date DATE,
  issuing_body TEXT,           -- Lembaga penerbit
  file_url TEXT,               -- PDF asli (Supabase Storage)
  full_text TEXT,              -- Teks lengkap untuk full-text search
  ai_summary_id TEXT,          -- Cache AI summary (Bahasa Indonesia)
  ai_summary_en TEXT,          -- Cache AI summary (Bahasa Inggris)
  ai_summarized_at TIMESTAMPTZ,
  embedding vector(1536),      -- pgvector untuk semantic search
  view_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmark regulasi (fitur premium)
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  regulation_id UUID REFERENCES regulations(id) ON DELETE CASCADE,
  note TEXT,                   -- Catatan pribadi user
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, regulation_id)
);

-- Riwayat chat AI (per user, rolling 30 hari)
CREATE TABLE ai_chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tag regulasi (many-to-many)
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE regulation_tags (
  regulation_id UUID REFERENCES regulations(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (regulation_id, tag_id)
);

-- Full-text search index
CREATE INDEX regulations_fts ON regulations
  USING GIN (to_tsvector('indonesian', title_id || ' ' || COALESCE(full_text, '')));

CREATE INDEX articles_fts ON articles
  USING GIN (to_tsvector('indonesian', title_id || ' ' || COALESCE(content_id, '')));
```

### Row Level Security (RLS)

```sql
-- Aktifkan RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;

-- User hanya bisa akses data sendiri
CREATE POLICY "user_own_profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "user_own_bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "user_own_chat" ON ai_chat_history
  FOR ALL USING (auth.uid() = user_id);
```

---

## 🎨 Design System

### Identitas Visual

- **Tone**: Modern & minimalis — bersih, profesional, namun tetap accessible
- **Inspirasi**: Editorial hukum premium bertemu dengan clarity desain civic tech
- **Prinsip**: White space generous, tipografi kuat, accent color tegas

### Palet Warna

```css
:root {
  /* Primary — Deep Navy (otoritas & kepercayaan) */
  --primary-950: #0a0f1e;
  --primary-900: #0f172a;
  --primary-800: #1e2a45;
  --primary-700: #1d3461;
  --primary-600: #1e3a8a;
  --primary-500: #1d4ed8;
  --primary-400: #3b82f6;
  --primary-100: #dbeafe;
  --primary-50:  #eff6ff;

  /* Accent — Warm Amber (highlight & CTA) */
  --accent-500: #f59e0b;
  --accent-400: #fbbf24;
  --accent-100: #fef3c7;

  /* Semantic */
  --success: #10b981;
  --warning: #f59e0b;
  --error:   #ef4444;
  --info:    #3b82f6;

  /* Neutral */
  --gray-950: #030712;
  --gray-900: #111827;
  --gray-800: #1f2937;
  --gray-600: #4b5563;
  --gray-400: #9ca3af;
  --gray-200: #e5e7eb;
  --gray-100: #f3f4f6;
  --gray-50:  #f9fafb;
  --white:    #ffffff;
}
```

### Tipografi

```css
/* Gunakan Google Fonts */
/* Display: Playfair Display — otoritatif, editorial */
/* Body: DM Sans — modern, sangat readable */

--font-display: 'Playfair Display', Georgia, serif;
--font-body: 'DM Sans', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Scale */
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
--text-4xl:  2.25rem;   /* 36px */
--text-5xl:  3rem;      /* 48px */
```

### Komponen UI Kunci

```
Badge regulasi type:
  - UU          → bg-blue-100 text-blue-800
  - PP          → bg-purple-100 text-purple-800
  - Perda       → bg-green-100 text-green-800
  - Permen      → bg-orange-100 text-orange-800
  - Putusan     → bg-gray-100 text-gray-800

Badge status:
  - Berlaku     → bg-emerald-100 text-emerald-700
  - Dicabut     → bg-red-100 text-red-700 line-through
  - Diubah      → bg-yellow-100 text-yellow-700

Premium gate:
  - Blur overlay + lock icon + upgrade CTA button
  - Jangan sembunyikan konten — tampilkan tapi blur
```

---

## 📄 Halaman & Fitur

### 1. Homepage (`/`)

**Komponen:**
- Hero section — search bar besar + tagline bilingual
- Ticker regulasi terbaru (horizontal scroll)
- Grid berita terbaru (3 kolom)
- Section "Regulasi Populer" dengan filter type
- CTA banner premium upgrade
- Section statistik (jumlah regulasi, artikel, pengguna)

**Search bar behavior:**
- Placeholder: `"Cari peraturan, UU, atau artikel hukum..."`
- Autocomplete dari judul regulasi & artikel
- Tekan Enter → redirect ke `/regulasi?q=...` atau `/berita?q=...`

---

### 2. Database Regulasi (`/regulasi`)

**Filter sidebar:**
- Type: UU, PP, Perda, Permen, Putusan (checkbox)
- Status: Berlaku, Dicabut, Diubah
- Tahun terbit (range slider)
- Lembaga penerbit (dropdown)

**Listing card regulasi:**
```
[Badge Type] [Badge Status]
Judul Regulasi — Nomor & Tahun
Diterbitkan: [Lembaga] • [Tanggal]
[Preview 2 baris about]
[👁 Views] [🔖 Bookmark — premium]
```

**Sorting:** Terbaru | Terlama | Paling Banyak Dilihat | Relevansi

**Search:** Full-text search + semantic search (pgvector)

---

### 3. Detail Regulasi (`/regulasi/[id]`)

**Layout:**
```
[Breadcrumb]
[Badge Type] [Badge Status]
# Judul Lengkap Regulasi

Metadata grid:
  Nomor | Tanggal Terbit | Tanggal Berlaku | Lembaga Penerbit

---

[Tab: Ringkasan AI] [Tab: Teks Lengkap] [Tab: Dokumen]

Tab Ringkasan AI:
  - Tombol "Generate Ringkasan" (free: 3x/hari, premium: unlimited)
  - Tampilkan AI summary bilingual (ID | EN toggle)
  - Loading state dengan animasi typewriter

Tab Teks Lengkap:
  - Render konten full text
  - Highlight kata kunci dari search query

Tab Dokumen:
  - Preview PDF embed
  - Tombol Download (PREMIUM GATE)

---

Sidebar:
  - Tombol Bookmark (PREMIUM GATE)
  - Regulasi terkait (by tag/category)
  - Bagikan (share buttons)
```

---

### 4. Berita & Artikel (`/berita`)

**Filter:** Kategori (tabs horizontal) + pencarian

**Card artikel:**
```
[Cover Image]
[Badge Kategori] [PREMIUM badge jika premium]
# Judul Artikel
[Excerpt 2-3 baris]
[Penulis] • [Tanggal] • [Est. waktu baca]
```

**Paywall artikel premium:**
- Tampilkan 3 paragraf pertama
- Blur gradient + CTA upgrade
- Jumlah artikel free per bulan: 5 artikel

---

### 5. Detail Artikel (`/berita/[slug]`)

**Layout editorial:**
- Hero image full-width
- Judul besar (Playfair Display)
- Meta: penulis, tanggal, kategori, share
- Konten artikel dengan typography yang nyaman dibaca
- Sidebar: artikel terkait + banner upgrade premium
- Paywall gate di tengah artikel (jika premium & user free)

---

### 6. AI Chatbot (`/tanya-ai`)

**Behavior:**
- Interface chat bubble (mirip ChatGPT)
- **Free user:** 5 pertanyaan/hari, reset tengah malam WIB
- **Premium user:** Unlimited, dengan riwayat chat 30 hari
- Setiap sesi baru mendapat `session_id` baru
- Tombol "Sesi Baru" untuk reset konteks

**System prompt untuk AI Chatbot:**
```
Kamu adalah asisten hukum Indonesia yang berpengetahuan luas.
Tugasmu adalah membantu pengguna memahami hukum Indonesia 
dengan bahasa yang jelas dan mudah dipahami.

Panduan:
- Jawab dalam bahasa yang sama dengan pertanyaan user (ID atau EN)
- Selalu sertakan disclaimer: "Ini adalah informasi hukum umum, 
  bukan nasihat hukum profesional. Konsultasikan dengan advokat 
  untuk kasus spesifik Anda."
- Jika merujuk peraturan, sebutkan nomor dan tahunnya
- Jika tidak tahu, katakan tidak tahu — jangan mengarang
- Maksimum 500 kata per jawaban kecuali diminta lebih detail
```

**Rate limiting implementation:**
```typescript
// lib/ai/rate-limiter.ts
export async function checkAIChatLimit(userId: string, tier: string) {
  if (tier === 'premium') return { allowed: true };
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('ai_chat_count_today, ai_chat_reset_at')
    .eq('id', userId)
    .single();

  const today = new Date().toISOString().split('T')[0];
  
  // Reset counter jika hari baru
  if (profile.ai_chat_reset_at !== today) {
    await supabase.from('profiles').update({
      ai_chat_count_today: 0,
      ai_chat_reset_at: today
    }).eq('id', userId);
    return { allowed: true, remaining: 4 };
  }

  if (profile.ai_chat_count_today >= 5) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: 5 - profile.ai_chat_count_today };
}
```

---

### 7. User Dashboard (`/dashboard`)

**Halaman Bookmark** (`/dashboard/bookmark`) — PREMIUM:
- Grid regulasi yang di-bookmark
- Catatan pribadi per bookmark (editable inline)
- Export daftar bookmark ke PDF

**Halaman Profil** (`/dashboard/profil`):
- Edit nama, foto profil
- Info tier & tanggal berakhir subscription
- Tombol Upgrade (jika free) / Perpanjang (jika premium)
- Riwayat aktivitas (artikel dibaca, regulasi dilihat)

---

### 8. Admin CMS (`/admin`)

**Hanya untuk role `admin` di Supabase**

**Manajemen Artikel:**
- CRUD artikel dengan rich text editor (TipTap)
- Upload cover image ke Supabase Storage
- Toggle: published/draft, free/premium
- Preview sebelum publish

**Manajemen Regulasi:**
- CRUD data regulasi
- Upload file PDF ke Supabase Storage
- Trigger generate AI summary
- Bulk import dari CSV

---

## 🔐 Sistem Autentikasi & Otorisasi

### Supabase Auth

```typescript
// Metode login yang disupport:
- Email + Password
- Google OAuth
- Magic Link (email)
```

### Middleware Route Protection

```typescript
// middleware.ts
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};

export async function middleware(req: NextRequest) {
  const { data: { session } } = await supabase.auth.getSession();
  
  // Redirect login jika belum auth
  if (!session) return NextResponse.redirect('/login');
  
  // Cek role admin untuk route /admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (profile?.role !== 'admin') {
      return NextResponse.redirect('/');
    }
  }
}
```

### Premium Gate Component

```typescript
// components/premium/PremiumGate.tsx
interface PremiumGateProps {
  children: React.ReactNode;
  feature: 'download' | 'bookmark' | 'ai-unlimited' | 'article';
  userTier: 'free' | 'premium';
}

// Behavior:
// - Jika premium: render children normal
// - Jika free: render children dengan blur overlay + CTA upgrade
// - JANGAN sembunyikan konten, selalu blur + gate
```

---

## 🤖 Integrasi AI

### AI Summarize Regulasi

```typescript
// app/api/ai/summarize/route.ts
// POST { regulationId: string, language: 'id' | 'en' }

const systemPrompt = `
Kamu adalah ahli hukum Indonesia. Buatkan ringkasan dari regulasi/peraturan berikut 
dengan format terstruktur:

Format output (dalam bahasa ${language}):
## Tentang Regulasi Ini
[1-2 kalimat gambaran umum]

## Poin-Poin Utama
- [poin 1]
- [poin 2]
- [dst, maksimal 7 poin]

## Siapa yang Terdampak?
[jelaskan pihak yang perlu memperhatikan regulasi ini]

## Hal Penting yang Perlu Diketahui
[catatan khusus, pengecualian, atau implementasi penting]

Gunakan bahasa yang mudah dipahami masyarakat umum.
`;

// Cache hasil summary ke database (kolom ai_summary_id / ai_summary_en)
// Cek cache dulu sebelum hit API Anthropic
```

### AI Chatbot Streaming

```typescript
// app/api/ai/chat/route.ts
// Gunakan streaming response untuk UX yang lebih baik

export async function POST(req: Request) {
  const { messages, sessionId } = await req.json();
  
  // 1. Cek rate limit
  // 2. Simpan pesan user ke DB
  // 3. Stream response dari Claude
  // 4. Simpan response assistant ke DB
  // 5. Increment counter jika free user
  
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: CHATBOT_SYSTEM_PROMPT,
    messages: messages
  });
  
  return new Response(stream.toReadableStream());
}
```

---

## 🌐 Internasionalisasi (i18n)

### Strategi Bilingual

```typescript
// Gunakan next-intl
// Locale: 'id' (default) dan 'en'
// URL: /id/... dan /en/... (atau query param ?lang=en)

// Konten regulasi & artikel:
// - title_id, content_id → wajib ada
// - title_en, content_en → opsional, tampilkan ID jika EN kosong

// UI labels: semua di-translate via next-intl messages
// messages/id.json & messages/en.json
```

---

## 💳 Model Freemium

### Tier Free
- ✅ Akses semua listing regulasi (tanpa download)
- ✅ Baca detail regulasi (teks lengkap)
- ✅ AI Summary regulasi: 3x per hari
- ✅ AI Chatbot: 5 pertanyaan per hari
- ✅ Baca 5 artikel premium per bulan
- ❌ Download PDF regulasi
- ❌ Bookmark & catatan regulasi
- ❌ Riwayat chat AI

### Tier Premium
- ✅ Semua fitur free
- ✅ Download PDF semua regulasi
- ✅ Bookmark unlimited + catatan pribadi
- ✅ AI Chatbot unlimited + riwayat 30 hari
- ✅ AI Summary unlimited (semua bahasa)
- ✅ Akses semua artikel premium tanpa batas
- ✅ Early access fitur baru

### Harga (rekomendasi)
```
Bulanan:  Rp 49.000/bulan
Tahunan:  Rp 399.000/tahun (hemat ~32%)
```

---

## ⚡ SEO & Performance

### SEO Requirements

```typescript
// Setiap halaman HARUS punya:
export const metadata: Metadata = {
  title: `${judul} | NamaWebsite`,
  description: excerpt,
  openGraph: { title, description, image },
  alternates: {
    canonical: url,
    languages: { 'id': '/id/...', 'en': '/en/...' }
  }
};

// Halaman regulasi: structured data Schema.org LegalDocument
// Halaman artikel: structured data Schema.org Article
```

### Performance

```
- Gunakan next/image untuk semua gambar
- Static Generation (SSG) untuk halaman regulasi yang sudah publish
- ISR (revalidate: 3600) untuk listing halaman
- Server Components by default, Client Components hanya jika perlu interaktivitas
- Lazy load AI components (dynamic import)
- Implementasi loading.tsx di setiap route segment
```

---

## 🚀 Urutan Pengembangan (Development Phases)

### Phase 1 — Foundation (Week 1-2)
```
[ ] Setup Next.js 14 + TypeScript + Tailwind + shadcn/ui
[ ] Setup Supabase project + schema migration
[ ] Implementasi auth (email, Google OAuth)
[ ] Layout dasar: Header, Footer, navigation bilingual
[ ] Design system: warna, tipografi, komponen dasar
```

### Phase 2 — Core Features (Week 3-4)
```
[ ] Halaman listing & detail Regulasi
[ ] Search + filter regulasi
[ ] Halaman listing & detail Artikel/Berita
[ ] Admin CMS: CRUD artikel & regulasi
[ ] Upload PDF ke Supabase Storage
```

### Phase 3 — AI Features (Week 5)
```
[ ] Integrasi Anthropic Claude API
[ ] AI Summarize regulasi (dengan cache)
[ ] AI Chatbot dengan streaming
[ ] Rate limiting per tier
```

### Phase 4 — Premium & Monetisasi (Week 6)
```
[ ] Sistem bookmark regulasi
[ ] Premium gate component
[ ] Halaman pricing & upgrade
[ ] Integrasi payment gateway (Midtrans/Xendit)
[ ] Webhook handling subscription
```

### Phase 5 — Polish & Launch (Week 7-8)
```
[ ] SEO optimization (metadata, structured data, sitemap.xml)
[ ] Performance audit (Lighthouse score > 90)
[ ] Mobile responsiveness QA
[ ] Error handling & loading states semua halaman
[ ] Analytics (Vercel Analytics atau PostHog)
[ ] Deploy ke Vercel + custom domain
```

---

## 📋 Coding Standards & Conventions

### Naming Conventions
```typescript
// Files: kebab-case
// Components: PascalCase
// Functions/variables: camelCase
// Constants: SCREAMING_SNAKE_CASE
// Database columns: snake_case

// Komponen file structure:
// components/regulasi/RegulationCard.tsx
// components/regulasi/RegulationCard.types.ts (jika perlu)
```

### Error Handling Pattern
```typescript
// Selalu handle error dari Supabase
const { data, error } = await supabase.from('regulations').select('*');
if (error) {
  console.error('[regulations/fetch]', error);
  // Return user-friendly error, jangan expose detail error ke UI
}

// Gunakan try-catch untuk API routes
// Selalu return typed response
```

### Supabase Best Practices
```typescript
// Server Components → gunakan supabase/server.ts
// Client Components → gunakan supabase/client.ts
// Jangan pernah expose service_role key ke client
// Selalu gunakan RLS, jangan bypass di production
```

---

## ⚠️ Hal Penting untuk AI Agent

1. **Jangan asumsikan** — jika ada ambiguitas dalam requirement, tanya dulu sebelum eksekusi
2. **Database first** — buat migration SQL sebelum membuat komponen yang bergantung pada data
3. **Type safety** — generate Supabase types dengan `supabase gen types typescript`
4. **Mobile first** — semua komponen harus responsive, test di viewport 375px
5. **Disclaimer hukum** — SELALU tampilkan disclaimer bahwa konten bukan nasihat hukum profesional, terutama di fitur AI
6. **Bahasa konten** — default tampilan Bahasa Indonesia, toggle ke Inggris tersedia
7. **Aksesibilitas** — gunakan semantic HTML, aria-label, dan pastikan kontras warna WCAG AA
8. **Loading states** — setiap fetch data harus punya skeleton loader, bukan spinner polos
9. **Empty states** — setiap listing harus punya tampilan "data tidak ditemukan" yang informatif
10. **Optimistic updates** — untuk bookmark, update UI dulu baru sync ke server

---

## 📝 Catatan Tambahan

- Nama domain & branding belum ditentukan — gunakan placeholder `[NAMA_WEBSITE]`
- Payment gateway belum dipilih — siapkan abstraction layer agar mudah diganti
- Sumber data regulasi awal: bisa scrape dari JDIH (Jaringan Dokumentasi dan Informasi Hukum) atau input manual via admin CMS
- Pertimbangkan integrasi dengan API JDIH Nasional jika tersedia secara publik

---

*Dokumen ini dibuat berdasarkan sesi interview requirements gathering.*  
*Versi: 1.0 | Tanggal: April 2026*
