# ⚖️ HukumAI

Platform hukum digital Indonesia — database regulasi, berita hukum, dan asisten AI dalam satu aplikasi. Dibangun dengan **Next.js**, **Supabase**, dan dukungan AI untuk membantu masyarakat memahami peraturan perundang-undangan Indonesia.

> Repo asli: [krotchya-gif/Hukum-AI](https://github.com/krotchya-gif/Hukum-AI)

---

## ✨ Fitur Utama

### 📚 Database Regulasi
- Katalog regulasi: **UU, PP, PERDA, Permen, Putusan**
- Halaman detail regulasi dengan **ringkasan AI** (AI Summarize)
- Pencarian & filter berdasarkan jenis, tahun, dan badan penerbit

### 📰 Berita & Artikel Hukum
- Daftar artikel hukum dengan kategori
- Artikel **premium** (akses terbatas untuk pengguna free)
- Konten bilingual (Indonesia / English)

### 🤖 Asisten AI (`/tanya-ai`)
- Chat AI untuk menjawab pertanyaan hukum
- **Free**: 5 pertanyaan/hari
- **Premium**: tanpa batas + riwayat chat tersimpan
- Rate limit reset setiap tengah malam WIB
- Model: **MiniMax-M2.7** via API kompatibel Anthropic (bisa diganti OpenAI/Kimi)

### 💎 Premium Tiers
| Fitur | Free | Premium |
|---|---|---|
| Lihat regulasi | ✅ | ✅ |
| AI Chat | 5/hari | Tanpa batas |
| AI Summarize | 3/hari | Tanpa batas |
| Bookmark regulasi | ❌ | ✅ |
| Download PDF | ❌ | ✅ |
| Artikel premium | 5/bulan | Tanpa batas |

**Harga:** Bulanan **Rp 49.000** | Tahunan **Rp 399.000**

### 👤 Akun & Admin
- Registrasi, login, forgot password
- Dashboard pengguna: profil, bookmark, langganan, pengaturan
- **Panel Admin**: kelola regulasi & berita (CRUD)

---

## 🛠 Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui (Radix UI) |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| AI | MiniMax (Anthropic-compatible API) |
| i18n | next-intl (prefix locale: `id` / `en`) |
| Payment | Xendit |
| Deployment | Vercel |

---

## 📁 Struktur Direktori

```
src/
├── app/
│   ├── [locale]/                # Routes i18n (id/en)
│   │   ├── page.tsx            # Homepage
│   │   ├── regulasi/           # Database regulasi
│   │   ├── berita/             # Berita & artikel
│   │   ├── tanya-ai/           # AI Chatbot
│   │   ├── kontak/             # Halaman kontak
│   │   ├── tentang/            # Halaman tentang
│   │   ├── login/ register/    # Autentikasi
│   │   ├── dashboard/          # Routes terproteksi
│   │   └── admin/              # Panel admin
│   └── api/
│       ├── ai/chat/            # Endpoint AI chat
│       ├── ai/summarize/       # Endpoint ringkasan AI
│       ├── auth/               # Login, register, logout, delete-account
│       ├── admin/              # CRUD regulasi & artikel
│       ├── payment/            # Buat invoice Xendit
│       └── webhook/payment/    # Webhook Xendit
├── components/
│   ├── ui/                     # Komponen shadcn/ui
│   ├── layout/                 # Header, Footer, DashboardSidebar
│   ├── langganan/              # Komponen langganan
│   ├── regulasi/ articles/     # Komponen fitur
│   └── admin/ dashboard/       # Komponen khusus area
├── lib/
│   └── ai-client.ts            # Abstraksi provider AI
├── utils/
│   └── supabase/               # client.ts, server.ts, middleware.ts, admin.ts
├── i18n/                       # Konfigurasi next-intl
messages/
├── id.json                     # Terjemahan Indonesia
└── en.json                     # Terjemahan English
supabase/
├── migrations/                 # SQL migrations
└── seed.sql                    # Data awal
```

---

## 🚀 Memulai

### Prasyarat
- Node.js 20+ (disarankan LTS)
- Akun Supabase ([supabase.com](https://supabase.com))
- (Opsional) API key Minimax & Xendit

### 1. Clone & Install

```bash
git clone https://github.com/krotchya-gif/Hukum-AI.git
cd Hukum-AI
npm install
```

### 2. Konfigurasi Environment

```bash
cp .env.example .env.local
```

Isi variabel berikut (lihat juga `supabase.md`):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server-only (webhook & pembuatan profil)

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# AI (Minimax - Anthropic-compatible)
AI_PROVIDER=anthropic
AI_MODEL_NAME=MiniMax-M2.7
ANTHROPIC_API_KEY=your_minimax_api_key
ANTHROPIC_BASE_URL=https://api.minimax.io/anthropic

# Payment (Xendit)
XENDIT_SECRET_KEY=your_xendit_secret_key
XENDIT_CALLBACK_TOKEN=your_xendit_callback_token

# Pasal.id API (Database Hukum Indonesia)
PASAL_API_TOKEN=your_pasal_api_token
```

### 3. Setup Database

Jalankan migrasi yang ada di `supabase/migrations/` pada project Supabase kamu, lalu seed data:

```bash
# via Supabase SQL Editor: jalankan file di supabase/migrations/
# lalu jalankan supabase/seed.sql
```

### 4. Jalankan Dev Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## 📜 Scripts

| Command | Deskripsi |
|---|---|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build produksi |
| `npm start` | Jalankan server produksi |
| `npm run lint` | Lint dengan ESLint |

---

## 🔌 API Routes

| Endpoint | Method | Deskripsi |
|---|---|---|
| `/api/ai/chat` | POST | AI chatbot (butuh auth) |
| `/api/ai/summarize` | POST | Ringkasan AI regulasi (butuh auth) |
| `/api/auth/callback` | GET/POST | OAuth + email login |
| `/api/auth/register` | POST | Registrasi pengguna |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/delete-account` | POST | Hapus akun |
| `/api/admin/regulations` | GET/POST | Kelola regulasi (admin) |
| `/api/admin/articles` | GET/POST | Kelola artikel (admin) |
| `/api/payment/create-invoice` | POST | Buat invoice Xendit |
| `/api/webhook/payment` | POST | Webhook pembayaran Xendit |

---

## 🗄 Database Schema (Ringkasan)

```sql
profiles: id, full_name, avatar_url, tier ('free'|'premium'),
          subscription_end_at, ai_chat_count_today, ai_chat_reset_at

regulations: id, type (uu|pp|perda|permen|putusan), number, title_id, title_en,
             slug, about_id, about_en, status, issued_date, effective_date,
             issuing_body, file_url, full_text, ai_summary_id, ai_summary_en, view_count

articles: id, title_id, title_en, slug, content_id, content_en, excerpt_id,
          excerpt_en, cover_image, category_id, author_name, is_premium, is_published

bookmarks: id, user_id, regulation_id, note        -- (premium)

ai_chat_history: id, user_id, session_id, role, content
```

Detail lengkap: `supabase/migrations/`

---

## 🌐 Integrasi Eksternal

### Pasal.id — Database Hukum Indonesia Terbuka
- **Base URL**: `https://pasal.id/api/v1`
- **Auth**: `Authorization: Bearer <token>`
- **Endpoint**: `GET /search?q=...`, `GET /laws?type=UU&year=2024`, `GET /laws/{frbr_uri}`
- **Data**: 50.545 regulasi, 1.010.789 pasal
- **Rate limit**: 60 req/menit
- **Docs**: https://pasal.id/api

### Xendit — Payment Gateway
- Webhook: `/api/webhook/payment`
- Update tier user ke `premium` setelah pembayaran sukses

---

## 🤝 Konvensi Kode

- Nama file: `kebab-case.tsx`
- Nama komponen: `PascalCase.tsx`
- Fungsi/variabel: `camelCase`
- Kolom database: `snake_case`
- Server Components → `utils/supabase/server.ts`
- Client Components → `utils/supabase/client.ts`

---

## 🗺 Roadmap

- [x] Phase 1-3: Foundation, Core Features, AI Features
- [x] Phase 4: Bookmark, Premium gate, Pricing page
- [x] Migrasi Next.js 14 → 16 + React 19
- [ ] Xendit payment + Pasal.id API integration (pengembangan lanjut)
- [ ] SEO, polish, dan deployment

---

## 📄 Lisensi

Status lisensi belum ditentukan. Hubungi pemilik repository untuk izin penggunaan.

---

*Dibuat dengan ❤️ untuk masyarakat hukum Indonesia.*
