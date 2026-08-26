import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | HukumAI",
  description: "Ketentuan penggunaan platform HukumAI.",
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isID = locale === "id";

  return (
    <div className="container py-12 max-w-3xl mx-auto prose prose-slate">
      <h1 className="text-4xl font-display font-bold text-primary mb-8">
        {isID ? "Syarat & Ketentuan" : "Terms & Conditions"}
      </h1>
      <p className="text-sm text-muted-foreground">
        {isID ? "Terakhir diperbarui: April 2026" : "Last updated: April 2026"}
      </p>

      {isID ? (
        <>
          <h2>1. Penerimaan Ketentuan</h2>
          <p>
            Dengan mendaftar dan menggunakan HukumAI, Anda menyetujui syarat dan
            ketentuan ini. Jika Anda tidak setuju dengan salah satu ketentuan, Mohon
            tidak menggunakan platform ini.
          </p>
          <h2>2. Batasan Layanan — Bukan Nasihat Hukum</h2>
          <p>
            Seluruh konten di HukumAI — termasuk jawaban asisten AI, ringkasan
            regulasi, dan artikel — bersifat informasi hukum umum dan{" "}
            <strong>bukan nasihat hukum profesional</strong>. Untuk kasus hukum
            spesifik, selalu konsultasikan dengan advokat atau konsultan hukum
            berlisensi.
          </p>
          <h2>3. Akun Pengguna</h2>
          <p>
            Anda bertanggung jawab menjaga kerahasiaan kredensial akun Anda. Dilarang
            menggunakan platform untuk aktivitas ilegal, mencoba mengakses sistem atau
            akun lain tanpa izin, ataupun menyalahgunakan kuota API secara otomatis.
          </p>
          <h2>4. Langganan & Pembayaran</h2>
          <p>
            Paket Premium ditagih melalui mitra pembayaran kami (Xendit). Langganan
            bulanan seharga Rp 49.000/bulan dan tahunan Rp 399.000/tahun. Harga dapat
            berubah dengan pemberitahuan sebelumnya. Pembayaran yang telah dilakukan
            untuk periode berjalan tidak dapat dikembalikan, kecuali diwajibkan oleh
            hukum.
          </p>
          <h2>5. Hak Kekayaan Intelektual</h2>
          <p>
            Peraturan perundang-undangan Indonesia adalah milik publik. Penyusunan,
            ringkasan AI, artikel, dan desain platform merupakan milik HukumAI dan
            dilindungi hak cipta. Anda tidak boleh menyalin ulang konten berbayar
            untuk didistribusikan.
          </p>
          <h2>6. Pengakhiran</h2>
          <p>
            Kami dapat menangguhkan akun yang melanggar ketentuan ini. Anda dapat
            menghapus akun kapan saja melalui halaman Pengaturan.
          </p>
          <h2>7. Perubahan Ketentuan</h2>
          <p>
            Ketentuan ini dapat diperbarui dari waktu ke waktu; perubahan signifikan
            akan diinformasikan melalui platform.
          </p>
        </>
      ) : (
        <>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By registering for and using HukumAI you agree to these terms and
            conditions. If you do not agree with any provision, please do not use the
            platform.
          </p>
          <h2>2. Service Limitations — Not Legal Advice</h2>
          <p>
            All content on HukumAI — including AI assistant answers, regulation
            summaries, and articles — constitutes general legal information and{" "}
            <strong>is not professional legal advice</strong>. For specific legal
            matters, always consult a licensed attorney or legal consultant.
          </p>
          <h2>3. User Accounts</h2>
          <p>
            You are responsible for keeping your credentials confidential. You may
            not use the platform for illegal activity, attempt unauthorized access to
            systems or other accounts, or abuse API quotas through automation.
          </p>
          <h2>4. Subscriptions & Payments</h2>
          <p>
            Premium plans are billed through our payment partner (Xendit): Rp 49,000
            per month or Rp 399,000 per year. Prices may change with prior notice.
            Payments for the current period are non-refundable except where required
            by law.
          </p>
          <h2>5. Intellectual Property</h2>
          <p>
            Indonesian laws and regulations are public property. The compilation, AI
            summaries, articles, and platform design are owned by HukumAI and
            protected by copyright. You may not redistribute paid content.
          </p>
          <h2>6. Termination</h2>
          <p>
            We may suspend accounts that violate these terms. You may delete your
            account at any time from the Settings page.
          </p>
          <h2>7. Changes to Terms</h2>
          <p>
            These terms may be updated over time; significant changes will be
            announced through the platform.
          </p>
        </>
      )}
    </div>
  );
}
