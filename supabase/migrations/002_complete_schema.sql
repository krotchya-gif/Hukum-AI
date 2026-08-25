-- =====================================================
-- HUKUMAI PLATFORM - Complete Database Migration
-- Supabase PostgreSQL Migration
-- Version: 1.0.0
-- Date: 2026-04-08
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- DROP EXISTING TABLES (CLEAN START)
-- =====================================================

DROP TABLE IF EXISTS ai_chat_history CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS regulation_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS regulations CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS user_tier CASCADE;
DROP TYPE IF EXISTS regulation_type CASCADE;
DROP TYPE IF EXISTS regulation_status CASCADE;

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_tier AS ENUM ('free', 'premium');
CREATE TYPE regulation_type AS ENUM ('uu', 'pp', 'perda', 'permen', 'putusan');
CREATE TYPE regulation_status AS ENUM ('berlaku', 'dicabut', 'diubah');

-- =====================================================
-- PROFILES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  tier user_tier DEFAULT 'free',
  subscription_end_at TIMESTAMPTZ,
  ai_chat_count_today INTEGER DEFAULT 0,
  ai_chat_reset_at DATE DEFAULT CURRENT_DATE,
  articles_read_count INTEGER DEFAULT 0,
  articles_read_reset_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name_id TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#1a56db',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ARTICLES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_id TEXT NOT NULL,
  title_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  content_id TEXT NOT NULL,
  content_en TEXT,
  excerpt_id TEXT,
  excerpt_en TEXT,
  cover_image TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  author_name TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- REGULATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS regulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type regulation_type NOT NULL,
  number TEXT,
  title_id TEXT NOT NULL,
  title_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  about_id TEXT,
  about_en TEXT,
  status regulation_status DEFAULT 'berlaku',
  issued_date DATE,
  effective_date DATE,
  issuing_body TEXT,
  file_url TEXT,
  full_text TEXT,
  ai_summary_id TEXT,
  ai_summary_en TEXT,
  ai_summarized_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BOOKMARKS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  regulation_id UUID REFERENCES regulations(id) ON DELETE CASCADE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, regulation_id)
);

-- =====================================================
-- AI CHAT HISTORY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS ai_chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TAGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS regulation_tags (
  regulation_id UUID REFERENCES regulations(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (regulation_id, tag_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Full-text search indexes
CREATE INDEX idx_regulations_fts ON regulations
  USING GIN (to_tsvector('indonesian', title_id || ' ' || COALESCE(about_id, '') || ' ' || COALESCE(full_text, '')));

CREATE INDEX idx_articles_fts ON articles
  USING GIN (to_tsvector('indonesian', title_id || ' ' || COALESCE(excerpt_id, '') || ' ' || COALESCE(content_id, '')));

-- B-tree indexes for common queries
CREATE INDEX idx_regulations_type ON regulations(type);
CREATE INDEX idx_regulations_status ON regulations(status);
CREATE INDEX idx_regulations_issued_date ON regulations(issued_date DESC);
CREATE INDEX idx_regulations_view_count ON regulations(view_count DESC);
CREATE INDEX idx_articles_published ON articles(is_published, published_at DESC);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_chat_history_user_session ON ai_chat_history(user_id, session_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see/edit their own profile
CREATE POLICY "Profiles are viewable by owner"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Profiles are updatable by owner"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Profiles are insertable by authenticated"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Bookmarks: Users can only access their own bookmarks
CREATE POLICY "Bookmarks are manageable by owner"
  ON bookmarks FOR ALL
  USING (auth.uid() = user_id);

-- AI Chat History: Users can only access their own chat history
CREATE POLICY "Chat history is manageable by owner"
  ON ai_chat_history FOR ALL
  USING (auth.uid() = user_id);

-- Public read access for published articles
CREATE POLICY "Published articles are viewable by anyone"
  ON articles FOR SELECT
  USING (is_published = TRUE);

-- Public read access for published regulations
CREATE POLICY "Published regulations are viewable by anyone"
  ON regulations FOR SELECT
  USING (is_published = TRUE);

-- Categories and tags are publicly readable
CREATE POLICY "Categories are viewable by anyone"
  ON categories FOR SELECT
  USING (TRUE);

CREATE POLICY "Tags are viewable by anyone"
  ON tags FOR SELECT
  USING (TRUE);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for articles updated_at
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for regulations updated_at
DROP TRIGGER IF EXISTS update_regulations_updated_at ON regulations;
CREATE TRIGGER update_regulations_updated_at
  BEFORE UPDATE ON regulations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA - Categories
-- =====================================================

INSERT INTO categories (name_id, name_en, slug, color) VALUES
  ('Peradilan', 'Judiciary', 'peradilan', '#3b82f6'),
  ('Pertanahan', 'Land', 'pertanahan', '#10b981'),
  ('Ketenagakerjaan', 'Labor', 'ketenagakerjaan', '#f59e0b'),
  ('Korporasi', 'Corporate', 'korporasi', '#8b5cf6'),
  ('Pajak', 'Tax', 'pajak', '#ef4444'),
  ('Lingkungan', 'Environment', 'lingkungan', '#14b8a6'),
  ('Hak Asasi Manusia', 'Human Rights', 'ham', '#ec4899'),
  ('Kriminal', 'Criminal', 'kriminal', '#6366f1')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SEED DATA - Sample Regulations
-- =====================================================

INSERT INTO regulations (type, number, title_id, title_en, slug, about_id, about_en, status, issued_date, effective_date, issuing_body, is_published) VALUES
  ('uu', 'UU No. 11 Tahun 2008', 'Undang-Undang Republik Indonesia Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik', 'Law of the Republic of Indonesia Number 11 of 2008 concerning Electronic Information and Transactions', 'uu-ite-11-2008', 'UU ITE mengatur tentang informasi elektronik dan transaksi elektronik di Indonesia. UU ini sering digunakan untuk menangani kasus pencemaran nama baik di media sosial.', 'ITE Law regulates electronic information and transactions in Indonesia. This law is often used to handle defamation cases on social media.', 'berlaku', '2008-04-21', '2009-04-21', 'Presiden Republik Indonesia', TRUE),

  ('uu', 'UU No. 13 Tahun 2003', 'Undang-Undang Republik Indonesia Nomor 13 Tahun 2003 tentang Ketenagakerjaan', 'Law of the Republic of Indonesia Number 13 of 2003 concerning Manpower', 'uu-ketenagakerjaan-13-2003', 'UU Ketenagakerjaan mengatur tentang perlindungan hak-hak pekerja/buruh di Indonesia, termasuk ketentuan upah, jamsostek, dan PHK.', 'Manpower Law regulates the protection of worker rights in Indonesia, including provisions for wages, social security, and termination.', 'berlaku', '2003-03-25', '2003-03-25', 'Presiden Republik Indonesia', TRUE),

  ('uu', 'UU No. 12 Tahun 2006', 'Undang-Undang Republik Indonesia Nomor 12 Tahun 2006 tentang Kewarganegaraan', 'Law of the Republic of Indonesia Number 12 of 2006 concerning Citizenship', 'uu-kewarganegaraan-12-2006', 'UU Kewarganegaraan mengatur tentang syarat-syarat menjadi warga negara Indonesia, cara memperoleh dan kehilangan kewarganegaraan.', 'Citizenship Law regulates the requirements for becoming an Indonesian citizen, ways to obtain and lose citizenship.', 'berlaku', '2006-07-04', '2006-07-04', 'Presiden Republik Indonesia', TRUE),

  ('pp', 'PP No. 24 Tahun 2018', 'Peraturan Pemerintah Nomor 24 Tahun 2018 tentang Pelayanan Perizinan Berusaha Terintegrasi Elektronik', 'Government Regulation Number 24 of 2018 concerning Electronic Integrated Business Licensing Services', 'pp-oss-24-2018', 'PP OSS mengatur tentang sistem perizinan berusaha yang terintegrasi secara elektronik melalui portal OSS (Online Single Submission).', 'OSS PP regulates the electronic integrated business licensing system through the OSS (Online Single Submission) portal.', 'berlaku', '2018-06-21', '2018-06-21', 'Presiden Republik Indonesia', TRUE),

  ('uu', 'UU No. 28 Tahun 2014', 'Undang-Undang Republik Indonesia Nomor 28 Tahun 2014 tentang Hak Cipta', 'Law of the Republic of Indonesia Number 28 of 2014 concerning Copyright', 'uu-hak-cipta-28-2014', 'UU Hak Cipta mengatur tentang perlindungan hak cipta atas karya cipta di bidang ilmu pengetahuan, seni, dan sastra.', 'Copyright Law regulates the protection of copyrights over works in science, art, and literature.', 'berlaku', '2014-10-16', '2014-10-16', 'Presiden Republik Indonesia', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SEED DATA - Sample Articles
-- =====================================================

INSERT INTO articles (title_id, title_en, slug, content_id, content_en, excerpt_id, excerpt_en, category_id, author_name, is_premium, is_published, published_at) VALUES
  (
    'Memahami Hak Pekerja yang Terkena PHK Menurut UU Ketenagakerjaan',
    'Understanding Worker Rights Upon Termination Under Labor Law',
    'memahami-hak-pekerja-phk',
    'Pemutusan Hubungan Kerja (PHK) merupakan hal yang tidak diinginkan baik oleh pekerja maupun pemberi kerja. Namun, dalam situasi tertentu PHK tidak dapat dihindari. Pasal-pasal dalam UU No. 13 Tahun 2003 tentang Ketenagakerjaan memberikan perlindungan yang cukup bagi pekerja yang mengalami PHK. Hak-hak yang harus diterima pekerja antara lain: uang pesangon, uang penghargaan masa kerja, dan uang penggantian hak. Besaran masing-masing komponen ini tergantung pada alasan PHK dan masa kerja pekerja.',
    'Termination of Employment (PHK) is something unwanted by both workers and employers. However, in certain situations termination cannot be avoided. Articles in Law No. 13 of 2003 concerning Manpower provide sufficient protection for workers experiencing termination. Rights that workers must receive include: severance pay, service award money, and compensation for rights.',
    'Berikut panduan lengkap mengenai hak-hak pekerja yang terkena PHK dan cara menghitung kompensasi yang berhak diterima.',
    'A complete guide to worker rights upon termination and how to calculate the compensation you are entitled to.',
    3,
    'Tim Redaksi HukumAI',
    FALSE,
    TRUE,
    NOW() - INTERVAL '1 day'
  ),
  (
    'Prosedur Pendaftaran Hak Cipta Logo di Indonesia',
    'Procedure for Registering Logo Copyright in Indonesia',
    'prosedur-pendaftaran-hak-cipta-logo',
    'Logo merupakan salah satu bentuk karya cipta dalam ranah seni rupa yang dilindungi oleh Undang-Undang Hak Cipta. Meskipun pendaftaran bukan merupakan syarat mutlak untuk mendapatkan perlindungan hak cipta, mendaftarkan logo memiliki beberapa keuntungan hukum. Prosedur pendaftaran hak cipta dapat dilakukan secara online melalui situs resmi Direktorat Jenderal Kekayaan Intelektual (DJKI) Kementerian Hukum dan HAM.',
    'A logo is a form of copyrightable work in the field of visual arts protected by the Copyright Law. Although registration is not a mandatory requirement for obtaining copyright protection, registering a logo has several legal advantages. The copyright registration procedure can be done online through the official website of the Directorate General of Intellectual Property (DJKI) of the Ministry of Law and Human Rights.',
    'Pelajari langkah-langkah pendaftaran hak cipta logo dan keuntungan mendaftarkan karya Anda.',
    'Learn the steps to register logo copyright and the benefits of registering your work.',
    4,
    'Tim Redaksi HukumAI',
    FALSE,
    TRUE,
    NOW() - INTERVAL '2 days'
  ),
  (
    'Risiko Hukum Penggunaan Data Pribadi Tanpa Izin di Era Digital',
    'Legal Risks of Using Personal Data Without Consent in the Digital Era',
    'risiko-hukum-data-pribadi',
    'Penggunaan data pribadi tanpa izin merupakan pelanggaran yang dapat dikenai sanksi baik secara pidana maupun perdata. UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP) memberikan kerangka hukum yang komprehensif untuk mengatur pengumpulan, pengolahan, dan penggunaan data pribadi. Ancaman pidana bagi pelanggaran PDP dapat berupa penjara hingga 6 tahun dan/atau denda miliaran rupiah.',
    'The use of personal data without consent is a violation that can be subject to both criminal and civil sanctions. Law No. 27 of 2022 concerning Personal Data Protection (UU PDP) provides a comprehensive legal framework for regulating the collection, processing, and use of personal data. Criminal threats for PDP violations can include imprisonment of up to 6 years and/or fines of billions of rupiah.',
    'Ketahui risiko hukum yang dihadapi jika menggunakan data pribadi orang lain tanpa izin.',
    'Know the legal risks faced if you use other people''s personal data without permission.',
    7,
    'Ahmad Fauzi, S.H.',
    TRUE,
    TRUE,
    NOW() - INTERVAL '3 days'
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- STORAGE BUCKETS (Optional - for file uploads)
-- =====================================================

-- Note: Storage buckets need to be created in Supabase Dashboard
-- or using the Storage API. The policies below are for reference.

-- CREATE POLICY "Anyone can view regulation files"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'regulations');

-- GRANT PERMISSIONS
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;

-- =====================================================
-- VERIFICATION QUERIES (Run these to verify setup)
-- =====================================================

-- Check tables exist:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check profiles table structure:
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'profiles';
