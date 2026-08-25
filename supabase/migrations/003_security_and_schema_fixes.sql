-- =====================================================
-- HUKUMAI PLATFORM - Security Hardening & Schema Sync
-- Migration 003
--
-- Fokus:
--   1. Sinkronisasi kolom yang dipakai kode tapi belum ada di DB
--   2. Aktifkan RLS pada tabel konten (policy lama tidak aktif)
--   3. Tutup privilege escalation di profiles (kolom sensitif)
--   4. Cabut GRANT ALL ke anon dari 002
--   5. Kuota AI atomik (race-safe) via RPC, reset tengah malam WIB
-- =====================================================

-- =====================================================
-- 1. SINKRONISASI SKEMA
-- =====================================================

-- Dipakai oleh /api/ai/summarize tapi belum ada di migration mana pun
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_summary_count_today INTEGER NOT NULL DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_summary_reset_at DATE;

-- Dipakai oleh halaman detail regulasi (kartu upsell)
ALTER TABLE regulations ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT FALSE;

-- Index untuk penghapusan regulasi (FK tanpa index sendiri)
CREATE INDEX IF NOT EXISTS idx_bookmarks_regulation_id ON bookmarks(regulation_id);

-- =====================================================
-- 1b. TABEL PESAN KONTAK
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit contact message" ON contact_messages;
CREATE POLICY "Anyone can submit contact message"
  ON contact_messages FOR INSERT
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admins can read contact messages" ON contact_messages;
CREATE POLICY "Admins can read contact messages"
  ON contact_messages FOR SELECT
  USING (public.is_admin());

REVOKE ALL ON contact_messages FROM anon, authenticated;
GRANT INSERT ON contact_messages TO anon, authenticated;
GRANT SELECT ON contact_messages TO authenticated;

-- =====================================================
-- 2. FUNGSI BANTU ADMIN
-- =====================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- =====================================================
-- 3. RLS TABEL KONTEN
-- Policy untuk articles/regulations sudah ada sejak 002,
-- tapi RLS-nya tidak pernah diaktifkan sehingga policy
-- mati dan tabel bisa ditulis siapa saja (GRANT ALL anon).
-- =====================================================

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulation_tags ENABLE ROW LEVEL SECURITY;

-- Pastikan policy publik ada (idempoten terhadap 002)
DROP POLICY IF EXISTS "Published articles are viewable by anyone" ON articles;
CREATE POLICY "Published articles are viewable by anyone"
  ON articles FOR SELECT
  USING (is_published = TRUE);

DROP POLICY IF EXISTS "Published regulations are viewable by anyone" ON regulations;
CREATE POLICY "Published regulations are viewable by anyone"
  ON regulations FOR SELECT
  USING (is_published = TRUE);

DROP POLICY IF EXISTS "Categories are viewable by anyone" ON categories;
CREATE POLICY "Categories are viewable by anyone"
  ON categories FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Tags are viewable by anyone" ON tags;
CREATE POLICY "Tags are viewable by anyone"
  ON tags FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Regulation tags are viewable by anyone" ON regulation_tags;
CREATE POLICY "Regulation tags are viewable by anyone"
  ON regulation_tags FOR SELECT
  USING (TRUE);

-- Hanya admin yang boleh mengelola konten
DROP POLICY IF EXISTS "Admins can manage articles" ON articles;
CREATE POLICY "Admins can manage articles"
  ON articles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage regulations" ON regulations;
CREATE POLICY "Admins can manage regulations"
  ON regulations FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage tags" ON tags;
CREATE POLICY "Admins can manage tags"
  ON tags FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage regulation_tags" ON regulation_tags;
CREATE POLICY "Admins can manage regulation_tags"
  ON regulation_tags FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Cache ringkasan AI boleh diisi user terautentikasi (dipakai
-- /api/ai/summarize), tapi kolom lain tetap terkunci lewat GRANT di bawah.
DROP POLICY IF EXISTS "Authenticated can update AI summary cache" ON regulations;
CREATE POLICY "Authenticated can update AI summary cache"
  ON regulations FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- 4. PROFILES: TUTUP PRIVILEGE ESCALATION
-- Sebelumnya pemilik profil bisa mengubah SEMUA kolom,
-- termasuk tier, role, dan counter kuota AI sendiri.
-- =====================================================

REVOKE UPDATE ON profiles FROM anon, authenticated;
GRANT UPDATE (full_name, avatar_url) ON profiles TO authenticated;

-- =====================================================
-- 5. CABUT GRANT MEREBAB DARI 002
-- anon tidak boleh punya akses tulis apa pun; hanya
-- baca konten publik. authenticated dapat akses minimal.
-- =====================================================

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
GRANT SELECT ON articles, regulations, categories, tags, regulation_tags TO anon;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
GRANT SELECT ON articles, regulations, categories, tags, regulation_tags TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON bookmarks, ai_chat_history TO authenticated;
-- profiles: SELECT penuh (baris sendiri via RLS) + UPDATE kolom terbatas di atas
GRANT SELECT ON profiles TO authenticated;
-- cache ringkasan AI pada regulations (lihat policy di atas)
GRANT UPDATE (ai_summary_id, ai_summary_en, ai_summarized_at) ON regulations TO authenticated;
-- Tulis konten tetap dibatasi RLS oleh policy "Admins can manage ..." di atas;
-- grant tabel hanya membuka pintu, is_admin() yang menjaga.
GRANT INSERT, UPDATE, DELETE ON articles, regulations, categories, tags, regulation_tags TO authenticated;

-- =====================================================
-- 6. KUOTA AI ATOMIK
-- Menggantikan pola read-modify-write di route API yang
-- rentan race condition. Reset harian memakai tanggal WIB
-- (Asia/Jakarta), bukan UTC.
-- Return TRUE jika kuota tersedia (dan terkonsumsi), FALSE jika habis.
-- Premium dengan langganan aktif tidak dibatasi.
-- =====================================================

CREATE OR REPLACE FUNCTION public.consume_ai_quota(p_kind TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_today  DATE := (NOW() AT TIME ZONE 'asia/jakarta')::DATE;
  v_tier   user_tier;
  v_role   TEXT;
  v_sub_end TIMESTAMPTZ;
  v_count  INTEGER;
  v_reset  DATE;
  v_limit  INTEGER := CASE WHEN p_kind = 'chat' THEN 5 ELSE 3 END;
BEGIN
  IF v_user IS NULL OR p_kind NOT IN ('chat', 'summary') THEN
    RETURN FALSE;
  END IF;

  -- Buat profil bila belum ada (mis. user OAuth tanpa profil),
  -- agar jatuh ke kuota free alih-alih lolos tanpa batas.
  INSERT INTO profiles (id) VALUES (v_user)
  ON CONFLICT (id) DO NOTHING;

  SELECT tier, role, subscription_end_at INTO v_tier, v_role, v_sub_end
  FROM profiles WHERE id = v_user;

  IF v_role = 'admin' THEN
    RETURN TRUE;
  END IF;

  IF v_tier = 'premium' AND (v_sub_end IS NULL OR v_sub_end > NOW()) THEN
    RETURN TRUE;
  END IF;

  -- Free / premium kedaluwarsa: kunci baris agar request konkuren
  -- tidak bisa saling menimpa hitungan (lost update).
  SELECT
    CASE WHEN p_kind = 'chat' THEN ai_chat_count_today ELSE ai_summary_count_today END,
    CASE WHEN p_kind = 'chat' THEN ai_chat_reset_at ELSE ai_summary_reset_at END
  INTO v_count, v_reset
  FROM profiles WHERE id = v_user
  FOR UPDATE;

  IF v_reset IS DISTINCT FROM v_today THEN
    v_count := 0;
  END IF;

  IF v_count >= v_limit THEN
    RETURN FALSE;
  END IF;

  IF p_kind = 'chat' THEN
    UPDATE profiles
    SET ai_chat_count_today = v_count + 1, ai_chat_reset_at = v_today
    WHERE id = v_user;
  ELSE
    UPDATE profiles
    SET ai_summary_count_today = v_count + 1, ai_summary_reset_at = v_today
    WHERE id = v_user;
  END IF;

  RETURN TRUE;
END;
$$;
