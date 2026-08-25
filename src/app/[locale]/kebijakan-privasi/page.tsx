import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | HukumAI",
  description: "Bagaimana HukumAI mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
};

export default function PrivacyPolicyPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isID = locale === "id";

  return (
    <div className="container py-12 max-w-3xl mx-auto prose prose-slate">
      <h1 className="text-4xl font-display font-bold text-primary mb-8">
        {isID ? "Kebijakan Privasi" : "Privacy Policy"}
      </h1>
      <p className="text-sm text-muted-foreground">
        {isID ? "Terakhir diperbarui: April 2026" : "Last updated: April 2026"}
      </p>

      {isID ? (
        <>
          <h2>1. Data yang Kami Kumpulkan</h2>
          <p>
            Kami mengumpulkan informasi berikut saat Anda mendaftar dan menggunakan HukumAI:
            nama lengkap, alamat email, foto profil (opsional), serta aktivitas penggunaan
            platform seperti riwayat percakapan AI, bookmark regulasi, dan statistik baca.
          </p>
          <h2>2. Penggunaan Data</h2>
          <p>
            Data Anda digunakan untuk menyediakan layanan platform (akun, bookmark, riwayat
            AI, ringkasan regulasi), memproses langganan Premium, meningkatkan kualitas
            layanan, dan menghubungi Anda terkait akun atau transaksi.
          </p>
          <h2>3. Berbagi Data dengan Pihak Ketiga</h2>
          <p>
            Kami tidak menjual data pribadi Anda. Data dibagikan hanya kepada penyedia
            layanan pendukung: penyedia hosting database (Supabase), pemroses pembayaran
            (Xendit), dan penyedia model AI untuk menjawab pertanyaan Anda. Konten yang
            Anda kirim ke asisten AI diproses oleh penyedia model tersebut sesuai
            kebijakan privasinya.
          </p>
          <h2>4. Keamanan Data</h2>
          <p>
            Kami menerapkan enkripsi saat transit, kontrol akses berbasis peran, dan
            praktik keamanan standar industri. Password Anda disimpan sebagai hash oleh
            penyedia autentikasi kami dan tidak pernah dapat kami baca.
          </p>
          <h2>5. Hak Anda</h2>
          <p>
            Anda berhak mengakses, memperbaiki, dan menghapus data pribadi Anda kapan
            saja melalui halaman Profil dan Pengaturan, termasuk menghapus akun secara
            permanen. Sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi,
            Anda juga berhak menarik persetujuan pemrosesan data.
          </p>
          <h2>6. Kontak</h2>
          <p>
            Pertanyaan mengenai kebijakan ini dapat dikirim ke{" "}
            <a href="mailto:info@hukumai.id">info@hukumai.id</a>.
          </p>
        </>
      ) : (
        <>
          <h2>1. Data We Collect</h2>
          <p>
            When you register and use HukumAI we collect your full name, email address,
            optional profile photo, and usage activity such as AI chat history,
            regulation bookmarks, and reading statistics.
          </p>
          <h2>2. How We Use Data</h2>
          <p>
            Your data is used to provide platform services (account, bookmarks, AI
            history, regulation summaries), process Premium subscriptions, improve our
            services, and contact you about your account or transactions.
          </p>
          <h2>3. Third-Party Sharing</h2>
          <p>
            We never sell your personal data. Data is shared only with supporting
            providers: our database host (Supabase), payment processor (Xendit), and
            the AI model provider used to answer your questions.
          </p>
          <h2>4. Data Security</h2>
          <p>
            We apply encryption in transit, role-based access control, and industry
            standard security practices. Your password is stored only as a hash by our
            authentication provider and can never be read by us.
          </p>
          <h2>5. Your Rights</h2>
          <p>
            You may access, correct, and delete your personal data at any time via the
            Profile and Settings pages, including permanently deleting your account.
          </p>
          <h2>6. Contact</h2>
          <p>
            Questions about this policy can be sent to{" "}
            <a href="mailto:info@hukumai.id">info@hukumai.id</a>.
          </p>
        </>
      )}
    </div>
  );
}
