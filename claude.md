# CLAUDE.md — HukumAI Platform

Platform hukum digital Indonesia dengan database regulasi, berita hukum, dan asisten AI.

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| AI | Minimax (Anthropic-compatible API) |
| i18n | next-intl (locale prefix: always) |
| Deployment | Vercel |

---

## Struktur Direktori

```
src/
├── app/
│   ├── [locale]/           # i18n routes (id/en)
│   │   ├── page.tsx       # Homepage
│   │   ├── regulasi/      # Database regulasi
│   │   ├── berita/        # Berita & artikel
│   │   ├── tanya-ai/      # AI Chatbot
│   │   ├── kontak/        # Contact page
│   │   ├── login/         # Login
│   │   ├── register/      # Register
│   │   └── dashboard/     # Protected routes
│   └── api/
│       ├── ai/chat/       # AI chat endpoint
│       ├── ai/summarize/  # AI summarize endpoint
│       ├── auth/          # Auth routes (login, register, logout)
│       └── webhook/payment/  # Xendit webhook
├── components/
│   ├── ui/               # shadcn components
│   ├── layout/           # Header, Footer, DashboardSidebar
│   ├── langganan/        # Subscription components
│   └── premium/          # Paywall components
├── lib/
│   ├── supabase/         # client.ts, server.ts
│   └── ai-client.ts      # AI provider abstraction
├── navigation.ts         # next-intl navigation
└── routing.ts            # next-intl routing config
messages/id.json, en.json  # i18n translations
supabase/migrations/       # SQL migrations
supabase/seed.sql          # Seed data
```

---

## Database Schema (Key Tables)

```sql
-- profiles (extends auth.users)
profiles: id, full_name, avatar_url, tier ('free'|'premium'),
          subscription_end_at, ai_chat_count_today, ai_chat_reset_at

-- regulations
regulations: id, type (enum: uu|pp|perda|permen|putusan), number, title_id,
             title_en, slug, about_id, about_en, status, issued_date, effective_date,
             issuing_body, file_url, full_text, ai_summary_id, ai_summary_en, view_count

-- articles
articles: id, title_id, title_en, slug, content_id, content_en, excerpt_id,
           excerpt_en, cover_image, category_id, author_name, is_premium, is_published

-- bookmarks (premium)
bookmarks: id, user_id, regulation_id, note

-- ai_chat_history
ai_chat_history: id, user_id, session_id, role, content
```

---

## Pages

| Route | Description |
|---|---|
| `/[locale]` | Homepage with hero, search, featured articles |
| `/[locale]/regulasi` | Regulation database listing |
| `/[locale]/regulasi/[slug]` | Regulation detail with AI summary |
| `/[locale]/berita` | News/articles listing |
| `/[locale]/berita/[slug]` | Article detail |
| `/[locale]/tanya-ai` | AI chatbot interface |
| `/[locale]/kontak` | Contact page |
| `/[locale]/dashboard/profil` | User profile |
| `/[locale]/dashboard/bookmark` | Saved regulations (premium) |
| `/[locale]/dashboard/langganan` | Subscription & pricing |
| `/[locale]/dashboard/pengaturan` | User settings |

---

## Features

### AI Chat (`/tanya-ai`)
- Free: 5 questions/day
- Premium: unlimited + chat history
- Rate limit resets at midnight WIB
- Model: MiniMax-M2.7 via Anthropic-compatible API

### Premium Tiers
| Feature | Free | Premium |
|---|---|---|
| Browse regulations | ✅ | ✅ |
| AI Chat | 5/day | Unlimited |
| AI Summarize | 3/day | Unlimited |
| Bookmark | ❌ | ✅ |
| Download PDF | ❌ | ✅ |
| Premium articles | 5/month | Unlimited |

**Pricing:** Monthly Rp 49.000 | Yearly Rp 399.000

---

## API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/ai/chat` | POST | AI chatbot (requires auth) |
| `/api/ai/summarize` | POST | Summarize regulation (requires auth) |
| `/api/auth/callback` | GET/POST | OAuth + email login |
| `/api/auth/register` | POST | User registration |
| `/api/auth/logout` | POST | User logout |
| `/api/webhook/payment` | POST | Xendit payment webhook |

---

## Development Status

- [x] Phase 1-3: Foundation, Core Features, AI Features
- [x] Phase 4: Bookmark, Premium gate, Pricing page
- [ ] Phase 4: **Xendit payment + Pasal.id API integration** ← NEXT
- [ ] Phase 5: SEO, Polish, Deploy

---

## Coding Conventions

- Files: `kebab-case.tsx`
- Components: `PascalCase.tsx`
- Functions/variables: `camelCase`
- Database columns: `snake_case`
- Server Components → `supabase/server.ts`
- Client Components → `supabase/client.ts`

---

## Important Notes

1. **Header**: Custom dropdown (no Radix) - click outside to close
2. **Logout**: Uses `supabase.auth.signOut()` then redirect
3. **i18n**: Locale in URL (`/id/...`, `/en/...`), default: `id`
4. **Supabase**: Only 2 env vars needed (see `supabase.md`)
5. **AI Provider**: Currently using Minimax (Anthropic-compatible)

---

## External APIs

### Pasal.id - Database Hukum Indonesia Terbuka
- **Base URL**: `https://pasal.id/api/v1`
- **Auth**: Bearer token di header `Authorization: Bearer YOUR_TOKEN`
- **Endpoints**:
  - `GET /search?q=...` - Pencarian full-text
  - `GET /laws?type=UU&year=2024` - Listing regulasi
  - `GET /laws/{frbr_uri}` - Detail regulasi + pasal
- **Data**: 50.545 regulasi, 1.010.789 pasal
- **Rate Limit**: 60 req/min (dengan token)
- **Docs**: https://pasal.id/api

### Xendit - Payment Gateway
- **Webhook**: `/api/webhook/payment`
- **Update user tier** ke 'premium' setelah payment sukses

---

*Versi: 1.1 | April 2026*
