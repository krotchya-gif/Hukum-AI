-- =====================================================
-- HUKUMAI PLATFORM - Complete Seed Data
-- Run this AFTER running 002_complete_schema.sql
-- =====================================================

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
  ('Kriminal', 'Criminal', 'kriminal', '#6366f1'),
  ('Hukum Perdata', 'Civil Law', 'hukum-perdata', '#f97316'),
  ('Hukum Tata Negara', 'Constitutional Law', 'hukum-tata-negara', '#06b6d4')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SEED DATA - Tags
-- =====================================================

INSERT INTO tags (name, slug) VALUES
  ('UU', 'uu'),
  ('PP', 'pp'),
  ('Perda', 'perda'),
  ('Permen', 'permen'),
  ('Putusan', 'putusan'),
  ('Berlaku', 'berlaku'),
  ('Diubah', 'diubah'),
  ('Dicabut', 'dicabut'),
  ('Ketenagakerjaan', 'ketenagakerjaan'),
  ('Hak Cipta', 'hak-cipta'),
  ('Pertanahan', 'pertanahan'),
  ('Pajak', 'pajak'),
  ('Korporasi', 'korporasi'),
  ('Lingkungan', 'lingkungan'),
  ('PIDANA', 'pidana'),
  ('SIPIL', 'sipil')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SEED DATA - Regulations
-- =====================================================

INSERT INTO regulations (type, number, title_id, title_en, slug, about_id, about_en, status, issued_date, effective_date, issuing_body, is_published) VALUES

-- UU ITE
(
  'uu', 'UU No. 11 Tahun 2008',
  'Undang-Undang Republik Indonesia Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik',
  'Law of the Republic of Indonesia Number 11 of 2008 concerning Electronic Information and Transactions',
  'uu-ite-11-2008',
  'UU ITE mengatur tentang informasi elektronik dan transaksi elektronik di Indonesia. UU ini sering digunakan untuk menangani kasus pencemaran nama baik di media sosial, penipuan online, dan kejahatan siber lainnya.',
  'ITE Law regulates electronic information and transactions in Indonesia. This law is often used to handle defamation cases on social media, online fraud, and other cyber crimes.',
  'berlaku', '2008-04-21', '2009-04-21', 'Presiden Republik Indonesia', TRUE
),

-- UU Ketenagakerjaan
(
  'uu', 'UU No. 13 Tahun 2003',
  'Undang-Undang Republik Indonesia Nomor 13 Tahun 2003 tentang Ketenagakerjaan',
  'Law of the Republic of Indonesia Number 13 of 2003 concerning Manpower',
  'uu-ketenagakerjaan-13-2003',
  'UU Ketenagakerjaan mengatur tentang perlindungan hak-hak pekerja/buruh di Indonesia, termasuk ketentuan upah, jamsostek, cuti, dan PHK. Ini merupakan UU utama yang mengatur hubungan industrial di Indonesia.',
  'Manpower Law regulates the protection of worker rights in Indonesia, including provisions for wages, social security, leave, and termination. This is the main law regulating industrial relations in Indonesia.',
  'berlaku', '2003-03-25', '2003-03-25', 'Presiden Republik Indonesia', TRUE
),

-- UU Kewarganegaraan
(
  'uu', 'UU No. 12 Tahun 2006',
  'Undang-Undang Republik Indonesia Nomor 12 Tahun 2006 tentang Kewarganegaraan',
  'Law of the Republic of Indonesia Number 12 of 2006 concerning Citizenship',
  'uu-kewarganegaraan-12-2006',
  'UU Kewarganegaraan mengatur tentang syarat-syarat menjadi warga negara Indonesia, cara memperoleh dan kehilangan kewarganegaraan, serta hak dan kewajiban warga negara.',
  'Citizenship Law regulates the requirements for becoming an Indonesian citizen, ways to obtain and lose citizenship, as well as the rights and obligations of citizens.',
  'berlaku', '2006-07-04', '2006-07-04', 'Presiden Republik Indonesia', TRUE
),

-- UU Hak Cipta
(
  'uu', 'UU No. 28 Tahun 2014',
  'Undang-Undang Republik Indonesia Nomor 28 Tahun 2014 tentang Hak Cipta',
  'Law of the Republic of Indonesia Number 28 of 2014 concerning Copyright',
  'uu-hak-cipta-28-2014',
  'UU Hak Cipta mengatur tentang perlindungan hak cipta atas karya cipta di bidang ilmu pengetahuan, seni, dan sastra. Termasuk hak cipta atas software, logo, musik, film, dan karya lainnya.',
  'Copyright Law regulates the protection of copyrights over works in science, art, and literature. Including copyrights on software, logos, music, films, and other works.',
  'berlaku', '2014-10-16', '2014-10-16', 'Presiden Republik Indonesia', TRUE
),

-- UU Perlindungan Data Pribadi
(
  'uu', 'UU No. 27 Tahun 2022',
  'Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi',
  'Law of the Republic of Indonesia Number 27 of 2022 concerning Personal Data Protection',
  'uu-pdp-27-2022',
  'UU PDP mengatur tentang pelindungan data pribadi dalam pengolahan data pribadi. UU ini memberikan hak kepada субъект data untuk mengontrol datanya dan mewajibkan pengendali data untuk melindungi data pribadi.',
  'PDP Law regulates the protection of personal data in data processing. This law gives rights to data subjects to control their data and requires data controllers to protect personal data.',
  'berlaku', '2022-10-17', '2024-10-17', 'Presiden Republik Indonesia', TRUE
),

-- UU Perlindungan Anak
(
  'uu', 'UU No. 35 Tahun 2014',
  'Undang-Undang Republik Indonesia Nomor 35 Tahun 2014 tentang Perubahan Atas Undang-Undang Nomor 23 Tahun 2002 tentang Perlindungan Anak',
  'Law of the Republic of Indonesia Number 35 of 2014 concerning Amendment to Law Number 23 of 2002 concerning Child Protection',
  'uu-perlindungan-anak-35-2014',
  'UU Perlindungan Anak mengatur tentang upaya perlindungan khusus anak yang meliputi perlindungan sosial, pendidikan, kesehatan, dan hukum bagi anak.',
  'Child Protection Law regulates special protection for children including social, education, health, and legal protection for children.',
  'berlaku', '2014-07-17', '2014-07-17', 'Presiden Republik Indonesia', TRUE
),

-- UU Cipta Kerja
(
  'uu', 'UU No. 6 Tahun 2023',
  'Undang-Undang Nomor 6 Tahun 2023 tentang Penetapan Peraturan Pemerintah Pengganti Undang-Undang Nomor 2 Tahun 2022 tentang Cipta Kerja menjadi Undang-Undang',
  'Law of the Republic of Indonesia Number 6 of 2023 concerning the Stipulation of Government Regulation in Lieu of Law Number 2 of 2022 concerning Job Creation into Law',
  'uu-cipta-kerja-6-2023',
  'UU Cipta Kerja adalah revisi besar-besaran terhadap UU ketenagakerjaan dan usaha untuk streamlining perizinan dan meningkatkan investasi di Indonesia.',
  'Job Creation Law is a major revision to labor and business laws to streamline permitting and boost investment in Indonesia.',
  'berlaku', '2023-03-31', '2023-03-31', 'Presiden Republik Indonesia', TRUE
),

-- PP OSS
(
  'pp', 'PP No. 24 Tahun 2018',
  'Peraturan Pemerintah Nomor 24 Tahun 2018 tentang Pelayanan Perizinan Berusaha Terintegrasi Elektronik',
  'Government Regulation Number 24 of 2018 concerning Electronic Integrated Business Licensing Services',
  'pp-oss-24-2018',
  'PP OSS mengatur tentang sistem perizinan berusaha yang terintegrasi secara elektronik melalui portal OSS (Online Single Submission). Semua perizinan berusaha harus melalui sistem ini.',
  'OSS PP regulates the electronic integrated business licensing system through the OSS (Online Single Submission) portal. All business licenses must go through this system.',
  'berlaku', '2018-06-21', '2018-06-21', 'Presiden Republik Indonesia', TRUE
),

-- PP Ketenagakerjaan
(
  'pp', 'PP No. 35 Tahun 2021',
  'Peraturan Pemerintah Nomor 35 Tahun 2021 tentang Perjanjian Kerja Waktu Tertentu, Alih Daya, Waktu Kerja dan Waktu Istirahat, dan Pemutusan Hubungan Kerja',
  'Government Regulation Number 35 of 2021 concerning Fixed-Term Contracts, Outsourcing, Working Hours and Rest Hours, and Termination of Employment',
  'pp-ketenagakerjaan-35-2021',
  'PP 35/2021 adalah peraturan turunan UU Cipta Kerja yang mengatur secara detail tentang PKWT, outsourcing, jam kerja, dan PHK.',
  'PP 35/2021 is a derivative regulation of the Job Creation Law that details PKWT, outsourcing, working hours, and termination.',
  'berlaku', '2021-02-02', '2021-02-02', 'Presiden Republik Indonesia', TRUE
),

-- PP Pengelolaan Limbah
(
  'pp', 'PP No. 22 Tahun 2021',
  'Peraturan Pemerintah Nomor 22 Tahun 2021 tentang Penyelenggaraan Perlindungan dan Pengelolaan Lingkungan Hidup',
  'Government Regulation Number 22 of 2021 concerning Environmental Protection and Management',
  'pp-lingkungan-22-2021',
  'PP Pengelolaan Lingkungan Hidup mengatur tentangAMDAL, izin lingkungan, sampah, limbah hazardous, dan sanksi atas pelanggaran lingkungan.',
  'Environmental Management PP regulates AMDAL, environmental permits, waste, hazardous waste, and sanctions for environmental violations.',
  'berlaku', '2021-02-02', '2021-02-02', 'Presiden Republik Indonesia', TRUE
),

-- Perda DKI Jakarta
(
  'perda', 'Perda DKI No. 8 Tahun 2007',
  'Peraturan Daerah Provinsi Daerah Khusus Ibukota Jakarta Nomor 8 Tahun 2007 tentang Ketahanan Pangan',
  'Regional Regulation of Special Capital Region of Jakarta Number 8 of 2007 concerning Food Security',
  'perda-dki-8-2007',
  'Perda Ketahanan Pangan DKI Jakarta mengatur tentang ketersediaan, keterjangkauan, dan keamanan pangan di wilayah DKI Jakarta.',
  'Jakarta Food Security Regional Regulation regulates availability, affordability, and food safety in the Jakarta region.',
  'berlaku', '2007-12-28', '2007-12-28', 'Pemprov DKI Jakarta', TRUE
),

-- UU Pajak Penghasilan
(
  'uu', 'UU No. 36 Tahun 2008',
  'Undang-Undang Republik Indonesia Nomor 36 Tahun 2008 tentang Pajak Penghasilan',
  'Law of the Republic of Indonesia Number 36 of 2008 concerning Income Tax',
  'uu-pph-36-2008',
  'UU PPh mengatur tentang pajak penghasilan di Indonesia, termasuk objek pajak, tarif, cara penghitungan, dan hak&Wajib pajak.',
  'Income Tax Law regulates income tax in Indonesia, including tax objects, rates, calculation methods, and taxpayer rights and obligations.',
  'berlaku', '2008-09-12', '2009-01-01', 'Presiden Republik Indonesia', TRUE
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SEED DATA - Articles
-- =====================================================

INSERT INTO articles (title_id, title_en, slug, content_id, content_en, excerpt_id, excerpt_en, category_id, author_name, is_premium, is_published, published_at) VALUES

-- Article 1: PHK
(
  'Memahami Hak Pekerja yang Terkena PHK Menurut UU Ketenagakerjaan',
  'Understanding Worker Rights Upon Termination Under Labor Law',
  'memahami-hak-pekerja-phk',
  'Pemutusan Hubungan Kerja (PHK) merupakan hal yang tidak diinginkan baik oleh pekerja maupun pemberi kerja. Namun, dalam situasi tertentu PHK tidak dapat dihindari.\n\n\nPasal-pasal dalam UU No. 13 Tahun 2003 tentang Ketenagakerjaan memberikan perlindungan yang cukup bagi pekerja yang mengalami PHK.\n\n\nHak-hak yang harus diterima pekerja antara lain:\n\n1. **Uang Pesangon**\n   Dihitung berdasarkan masa kerja: minimum 1 bulan gaji untuk setiap tahun kerja\n\n2. **Uang Penghargaan Masa Kerja (UPMK)**\n   Untuk masa kerja 3 tahun atau lebih\n\n3. **Uang Penggantian Hak (UPH)**\n   Meliputi cuti yang belum diambil, biaya perjalanan pulang untuk pekerja luar kota\n\n\nBesaran masing-masing komponen tergantung pada alasan PHK dan masa kerja pekerja. Jika PHK dilakukan tanpa prosedur yang benar, pekerja dapat mengajukan gugatan ke PHI (Pengadilan Hubungan Industrial).',
  'Termination of Employment (PHK) is something unwanted by both workers and employers. However, in certain situations termination cannot be avoided.\n\nArticles in Law No. 13 of 2003 concerning Manpower provide sufficient protection for workers experiencing termination.\n\nRights that workers must receive include: severance pay, service award money, and compensation for rights.\n\nThe amount of each component depends on the reason for termination and the worker''s length of service.',
  'Berikut panduan lengkap mengenai hak-hak pekerja yang terkena PHK dan cara menghitung kompensasi yang berhak diterima.',
  'A complete guide to worker rights upon termination and how to calculate the compensation you are entitled to.',
  3,
  'Tim Redaksi HukumAI',
  FALSE,
  TRUE,
  NOW() - INTERVAL '1 day'
),

-- Article 2: Hak Cipta Logo
(
  'Prosedur Pendaftaran Hak Cipta Logo di Indonesia',
  'Procedure for Registering Logo Copyright in Indonesia',
  'prosedur-pendaftaran-hak-cipta-logo',
  'Logo merupakan salah satu bentuk karya cipta dalam ranah seni rupa yang dilindungi oleh Undang-Undang Hak Cipta No. 28 Tahun 2014.\n\n\nMeskipun pendaftaran bukan merupakan syarat mutlak untuk mendapatkan perlindungan hak cipta (perlindungan otomatis sejak creations), mendaftarkan logo memiliki beberapa keuntungan hukum.\n\n\n**Keuntungan Mendaftarkan:**\n1. Menjadi bukti kepemilikan yang sah\n2. Mempermudah proses hukum jika terjadi plagiarisme\n3. Bisa digunakan sebagai aset perusahaan\n\n**Prosedur Pendaftaran:**\n\n1. Siapkan file logo (format JPG/PNG) dan deskripsi kreasi\n2. Buka website DJKI: https://e-haki.go.id\n3. Daftar akun terlebih dahulu\n4. Isi formulir pendaftaran hak cipta\n5. Upload file dan bayar PNBP\n6. Tunggu proses review 3-5 hari kerja\n7. Cetak sertifikat hak cipta\n\nBiaya pendaftaran untuk logo biasanya sekitar Rp 300.000.',
  'A logo is a form of copyrightable work protected by Copyright Law No. 28 of 2014. Although registration is not mandatory, it provides legal advantages.\n\n**Registration Procedure:**\n1. Prepare logo file and description\n2. Visit DJKI website\n3. Fill out registration form\n4. Pay PNBP fee\n5. Wait for review\n6. Print certificate',
  'Pelajari langkah-langkah pendaftaran hak cipta logo dan keuntungan mendaftarkan karya Anda.',
  'Learn the steps to register logo copyright and the benefits of registering your work.',
  4,
  'Tim Redaksi HukumAI',
  FALSE,
  TRUE,
  NOW() - INTERVAL '2 days'
),

-- Article 3: Data Pribadi
(
  'Risiko Hukum Penggunaan Data Pribadi Tanpa Izin di Era Digital',
  'Legal Risks of Using Personal Data Without Consent in the Digital Era',
  'risiko-hukum-data-pribadi',
  'Penggunaan data pribadi tanpa izin merupakan pelanggaran yang dapat dikenai sanksi baik secara pidana maupun perdata berdasarkan UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).\n\n**Ketentuan Pidana:**\n- Penjara hingga 6 tahun untuk pelanggaran sistematis\n- Denda hingga miliaran rupiah\n- Penjara 5 tahun untuk mengakses data pribadi secara tidak sah\n\n**Contoh Pelanggaran:**\n1. Membeli data nasabah dari pihak tidak berwenang\n2. Menyebarkan foto seseorang tanpa izin\n3. Menggunakan nomor HP untuk marketing tanpa consent\n\n**Langkah Hukum:**\n1. Melaporkan ke polisi\n2. Mengajukan gugatan perdata ganti rugi\n3. Melaporkan ke DPO\n\nDengan berlakunya UU PDP sejak Oktober 2024, setiap individu memiliki hak lebih besar atas data pribadinya.',
  'The use of personal data without consent is a violation subject to criminal and civil sanctions based on PDP Law.\n\n**Legal Steps Victims Can Take:**\n1. Report to police\n2. File civil lawsuit for compensation\n3. Report to DPO\n\nWith the enactment of the PDP Law since October 2024, every individual has greater rights over their personal data.',
  'Ketahui risiko hukum yang dihadapi jika menggunakan data pribadi orang lain tanpa izin.',
  'Know the legal risks faced if you use other people''s personal data without permission.',
  7,
  'Ahmad Fauzi, S.H.',
  TRUE,
  TRUE,
  NOW() - INTERVAL '3 days'
),

-- Article 4: Tanah
(
  'Mengenal Hak Milik, Hak Guna Bangunan, dan Hak Pakai atas Tanah',
  'Understanding Ownership Rights, Building Rights, and Usage Rights over Land',
  'mengenal-hak-atap-tanah',
  'Dalam hukum pertanahan Indonesia, terdapat beberapa jenis hak atas tanah yang diatur dalam UU No. 5 Tahun 1960 tentang Peraturan Dasar Pokok Agraria (UUPA).\n\n\n**1. Hak Milik**\n- Hak eigen yang strongest над tanah\n- Hanya milik Warga Negara Indonesia\n- Bisa diwariskan\n\n**2. Hak Guna Bangunan (HGB)**\n- Hak untuk membangun dan memiliki bangunan di atas tanah bukan milik sendiri\n- Jangka waktu max 30 tahun, bisa diperpanjang 20 tahun\n- Bisa diagunkan ke bank\n\n**3. Hak Pakai**\n- Hak untuk menggunakan tanah yang dikuasai negara\n- Bisa diberikan kepada WNA dan badan hukum\n\n**Pendaftaran Tanah:**\nPendaftaran tanah dilakukan melalui Kantor Pertanahan dengan proses pengukuran, pendaftaran hak, dan penerbitan sertifikat.',
  'In Indonesian land law, there are several types of rights over land regulated in Law No. 5 of 1960 concerning Basic Agrarian Regulations.\n\n**1. Ownership Rights (Hak Milik)**\n- The strongest right over land\n- Only for Indonesian Citizens\n\n**2. Building Rights (HGB)**\n- Rights to build on land not owned by oneself\n- Maximum 30 years, extendable\n\n**3. Usage Rights (Hak Pakai)**\n- Rights to use state-controlled land',
  'Pelajari perbedaan antara hak milik, hak guna bangunan, dan hak pakai dalam hukum pertanahan Indonesia.',
  'Learn the differences between ownership rights, building rights, and usage rights in Indonesian land law.',
  2,
  'Dr. Budi Santoso, S.H., M.H.',
  TRUE,
  TRUE,
  NOW() - INTERVAL '4 days'
),

-- Article 5: Karhutla
(
  'Aspek Hukum Kebakaran Hutan dan Lahan di Indonesia',
  'Legal Aspects of Forest and Land Fires in Indonesia',
  'aspek-hukum-karhutla',
  'Kebakaran hutan dan lahan (karhutla) merupakan masalah lingkungan yang serius di Indonesia.\n\n**Aspek Hukum:**\n\n1. **UU No. 32 Tahun 2009** - Perlindungan dan Pengelolaan Lingkungan Hidup\n   - Denda max Rp 10 miliar untuk korporasi\n   - Penjara max 10 tahun\n\n2. **UU No. 18 Tahun 2013** - Pencegahan dan Pemberantasan Perusakan Hutan\n   -适用于故意放火烧林\n   - Penjara max 15 tahun dan denda max Rp 5 miliar\n\n3. **PP No. 22 Tahun 2021** - Pengelolaan Lingkungan Hidup\n\n**Pencegahan:**\n- Moratorium Pembukaan Lahan Baru\n- Sistem Monitoring Kebakaran Landsat\n- Kesadaran Masyarakat Lokal',
  'Forest and land fires are a serious environmental problem in Indonesia.\n\n**Legal Aspects:**\n\n1. Law No. 32 of 2009 - Environmental Protection\n2. Law No. 18 of 2013 - Forest Destruction Prevention\n3. PP No. 22 of 2021 - Environmental Management\n\n**Prevention:**\n- New Land Opening Moratorium\n- Landsat Fire Monitoring System',
  'Kenali aspek hukum dan sanksi atas kebakaran hutan dan lahan serta upaya pencegahannya.',
  'Understand the legal aspects and sanctions for forest and land fires as well as prevention efforts.',
  6,
  'Tim Redaksi HukumAI',
  FALSE,
  TRUE,
  NOW() - INTERVAL '5 days'
),

-- Article 6: Korupsi
(
  'Memahami Unsur-Unsur Tindak Pidana Korupsi di Indonesia',
  'Understanding the Elements of Criminal Acts of Corruption in Indonesia',
  'memahami-unsur-pidana-korupsi',
  'Tindak pidana korupsi di Indonesia diatur dalam UU No. 31 Tahun 1999 jo. UU No. 20 Tahun 2001.\n\n**Unsur-Unsur Pasal 3:**\nSetiap orang yang dengan sengaja dan melawan hukum melakukan perbuatan memperkaya diri sendiri atau orang lain yang merugikan keuangan negara, dapat diancam dengan:\n- Penjara maksimal 20 tahun\n- Denda maksimal Rp 1 miliar\n\n**Jenis-Jenis Korupsi:**\n1. **Penggelapan** - Mengambil alih uang/surat bukti milik orang lain\n2. **Pemerasan** - Memaksa seseorang memberikan sesuatu\n3. **Suap** - Memberikan sesuatu kepada pejabat\n\n**Pemberantasan:**\n- Pembentukan KPK (Komisi Pemberantasan Korupsi)\n- Sistem pelaporan LHKPN untuk pejabat\n- Whistleblower System',
  'Criminal acts of corruption in Indonesia are regulated in Law No. 31 of 1999 jo. Law No. 20 of 2001.\n\n**Elements of Article 3:**\nEvery person who intentionally and unlawfully enriches themselves or another person to the detriment of state finances may be threatened with imprisonment up to 20 years and fine up to Rp 1 billion.\n\n**Eradication:**\n- Establishment of KPK\n- LHKPN reporting system\n- Whistleblower System',
  'Pelajari unsur-unsur pidana korupsi dan jenis-jenis korupsi yang sering terjadi di Indonesia.',
  'Learn the elements of corruption crimes and types of corruption that frequently occur in Indonesia.',
  8,
  'Jaksa Agung Muda Bidang Tindak Pidana Khusus',
  TRUE,
  TRUE,
  NOW() - INTERVAL '6 days'
)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- Link Regulations and Tags
-- =====================================================

INSERT INTO regulation_tags (regulation_id, tag_id)
SELECT r.id, t.id
FROM regulations r, tags t
WHERE r.slug = 'uu-ite-11-2008' AND t.slug = 'uu';

INSERT INTO regulation_tags (regulation_id, tag_id)
SELECT r.id, t.id
FROM regulations r, tags t
WHERE r.slug = 'uu-ketenagakerjaan-13-2003' AND t.slug = 'ketenagakerjaan';

INSERT INTO regulation_tags (regulation_id, tag_id)
SELECT r.id, t.id
FROM regulations r, tags t
WHERE r.slug = 'uu-hak-cipta-28-2014' AND t.slug = 'hak-cipta';

INSERT INTO regulation_tags (regulation_id, tag_id)
SELECT r.id, t.id
FROM regulations r, tags t
WHERE r.slug = 'pp-ketenagakerjaan-35-2021' AND t.slug = 'ketenagakerjaan';

-- =====================================================
-- Create Test User (Optional - for development only)
-- =====================================================

-- NOTE: This creates a test user but requires disabling RLS temporarily
-- To test login, use the Supabase Dashboard to create a user manually
-- or use the registration page at /id/register

-- =====================================================
-- VERIFICATION QUERIES (Run to check seed data)
-- =====================================================

-- SELECT 'Categories' as table_name, count(*) as count FROM categories;
-- SELECT 'Regulations' as table_name, count(*) as count FROM regulations;
-- SELECT 'Articles' as table_name, count(*) as count FROM articles;
-- SELECT 'Tags' as table_name, count(*) as count FROM tags;
-- SELECT 'Regulation Tags' as table_name, count(*) as count FROM regulation_tags;

-- List all regulations by type:
-- SELECT type, number, title_id FROM regulations ORDER BY type, issued_date DESC;

-- List published articles:
-- SELECT title_id, is_premium, is_published, published_at FROM articles WHERE is_published = TRUE ORDER BY published_at DESC;
