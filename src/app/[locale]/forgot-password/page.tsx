"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/navigation";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPasswordPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isID = locale === "id";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/${locale}/login?reset=1`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) {
        setError(error.message);
        return;
      }
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl border shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg mb-6">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-display font-bold tracking-tight text-primary">
            {isID ? "Reset Kata Sandi" : "Reset Password"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isID
              ? "Masukkan email Anda dan kami akan mengirim tautan untuk mengatur ulang kata sandi."
              : "Enter your email and we will send you a link to reset your password."}
          </p>
        </div>

        {sent ? (
          <div className="space-y-6 text-center">
            <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
            <p className="text-sm text-muted-foreground">
              {isID
                ? `Tautan reset telah dikirim ke ${email}. Periksa kotak masuk (dan folder spam) Anda.`
                : `A reset link has been sent to ${email}. Check your inbox (and spam folder).`}
            </p>
            <Link href={`/${locale}/login`}>
              <Button variant="outline" className="w-full h-11 gap-2">
                <ArrowLeft className="size-4" />
                {isID ? "Kembali ke Login" : "Back to Login"}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="h-12 bg-gray-50 border-gray-200"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 font-bold shadow-md"
              >
                {loading && <Loader2 className="size-5 animate-spin mr-2" />}
                {isID ? "Kirim Tautan Reset" : "Send Reset Link"}
              </Button>
            </form>
            <p className="text-center text-sm font-medium text-muted-foreground">
              <Link href={`/${locale}/login`} className="font-bold text-accent hover:underline">
                {isID ? "Kembali ke halaman login" : "Back to login"}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
