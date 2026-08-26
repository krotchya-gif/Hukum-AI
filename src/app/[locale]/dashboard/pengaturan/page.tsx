import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Link } from "@/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordForm, DeleteAccountSection } from "@/components/dashboard/AccountActions";

export default async function PengaturanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const isID = locale === "id";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          {isID ? "Pengaturan" : "Settings"}
        </h1>
        <p className="text-muted-foreground">
          {isID
            ? "Kelola preferensi akun dan aplikasi Anda."
            : "Manage your account and application preferences."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Bahasa */}
        <Card>
          <CardHeader>
            <CardTitle>{isID ? "Bahasa" : "Language"}</CardTitle>
            <CardDescription>
              {isID
                ? "Pilih bahasa antarmuka"
                : "Choose interface language"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Link href="/dashboard/pengaturan" locale="id">
              <span
                className={`inline-block px-4 py-2 text-sm rounded-lg transition-colors ${
                  locale === "id"
                    ? "bg-primary text-white font-semibold"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Indonesia
              </span>
            </Link>
            <Link href="/dashboard/pengaturan" locale="en">
              <span
                className={`inline-block px-4 py-2 text-sm rounded-lg transition-colors ${
                  locale === "en"
                    ? "bg-primary text-white font-semibold"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                English
              </span>
            </Link>
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle>{isID ? "Ganti Password" : "Change Password"}</CardTitle>
            <CardDescription>
              {isID
                ? "Perbarui password akun Anda secara berkala."
                : "Update your account password regularly."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm isID={isID} />
          </CardContent>
        </Card>
      </div>

      {/* Zona Berbahaya */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 text-red-600">
          {isID ? "Zona Berbahaya" : "Danger Zone"}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border border-red-100 rounded-lg p-4 bg-red-50/30">
            <div>
              <p className="font-medium text-red-700">
                {isID ? "Hapus Akun" : "Delete Account"}
              </p>
              <p className="text-sm text-red-600/80">
                {isID
                  ? "Permanen menghapus akun dan semua data Anda"
                  : "Permanently delete your account and all your data"}
              </p>
            </div>
            <DeleteAccountSection locale={locale} email={user.email ?? ""} isID={isID} />
          </div>
        </div>
      </div>
    </div>
  );
}
