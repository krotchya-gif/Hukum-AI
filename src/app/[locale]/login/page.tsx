"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/navigation";
import { Gavel, Loader2 } from "lucide-react";

export default function LoginPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  // useSearchParams memerlukan Suspense boundary saat prerender
  return (
    <Suspense fallback={null}>
      <LoginForm locale={locale} />
    </Suspense>
  );
}

function LoginForm({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";
  const isID = locale === "id";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to dashboard after successful login
        window.location.href = `/${locale}/dashboard/profil`;
      } else {
        setError(data.error || (isID ? "Login gagal" : "Login failed"));
      }
    } catch {
      setError(isID ? "Terjadi kesalahan" : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl border shadow-xl animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg mb-6">
            <Gavel className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-primary uppercase">
            {isID ? "Masuk ke" : "Sign in to"}
          </h2>
          <p className="mt-2 text-muted-foreground font-medium">
            HukumAI <span className="text-accent underline decoration-accent/30 underline-offset-4">Platform</span>
          </p>
        </div>

        {justRegistered && !error && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
            {isID
              ? "Registrasi berhasil! Silakan cek email Anda untuk verifikasi, lalu masuk di sini."
              : "Registration successful! Please check your email for verification, then sign in."}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">
              {isID ? "Email" : "Email Address"}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-bold text-gray-700">
                {isID ? "Kata Sandi" : "Password"}
              </label>
              <Link
                href={`/${locale}/forgot-password`}
                className="text-xs font-semibold text-accent hover:underline"
              >
                {isID ? "Lupa sandi?" : "Forgot password?"}
              </Link>
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-lg font-bold shadow-md"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin mr-2" />
            ) : null}
            {loading
              ? isID
                ? "Memproses..."
                : "Processing..."
              : isID
                ? "Masuk Sekarang"
                : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 font-bold text-muted-foreground/60">
              {isID ? "Atau masuk dengan" : "Or continue with"}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            // TODO: Google OAuth integration
            alert(
              isID
                ? "Google OAuth belum dikonfigurasi"
                : "Google OAuth not configured yet"
            );
          }}
          className="w-full h-12 gap-3 hover:bg-gray-50 border-gray-200 font-semibold"
        >
          <svg className="size-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Button>

        <p className="text-center text-sm font-medium text-muted-foreground">
          {isID ? "Belum punya akun?" : "Don't have an account?"}{" "}
          <Link
            href="/register"
            className="font-bold text-accent hover:underline"
          >
            {isID ? "Daftar di sini" : "Register here"}
          </Link>
        </p>
      </div>
    </div>
  );
}
