"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/navigation";
import { Mail, Lock, User, ShieldCheck, Loader2 } from "lucide-react";

export default function RegisterPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const router = useRouter();
  const isID = locale === "id";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError(isID ? "Anda harus menyetujui Syarat & Ketentuan" : "You must agree to Terms & Conditions");
      return;
    }

    if (password.length < 8) {
      setError(isID ? "Password minimal 8 karakter" : "Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });

      if (res.ok) {
        router.push(`/${locale}/login?registered=true`);
      } else {
        const data = await res.json();
        setError(data.error || (isID ? "Registrasi gagal" : "Registration failed"));
      }
    } catch {
      setError(isID ? "Terjadi kesalahan" : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50/50 p-4 py-20">
      <div className="w-full max-w-lg space-y-8 bg-white p-10 md:p-14 rounded-[2rem] border shadow-2xl animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg mb-6 rotate-3">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-primary uppercase">
            {isID ? "Bergabung dengan" : "Join the"}
          </h2>
          <p className="mt-2 text-xl font-display font-bold text-primary">
            HukumAI <span className="text-accent underline decoration-accent/30 underline-offset-4 tracking-tighter">Platform</span>
          </p>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs mx-auto">
            {isID
              ? "Dapatkan akses ke ribuan regulasi dan asisten hukum AI terlengkap di Indonesia."
              : "Get access to thousands of regulations and the most comprehensive legal AI assistant in Indonesia."}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-primary ml-1 flex items-center gap-2">
              <User className="size-4 opacity-50" />
              {isID ? "Nama Lengkap" : "Full Name"}
            </label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Budi Santoso"
              required
              className="h-12 bg-gray-50 border-gray-100 focus:bg-white transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-primary ml-1 flex items-center gap-2">
              <Mail className="size-4 opacity-50" />
              {isID ? "Email" : "Email Address"}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              className="h-12 bg-gray-50 border-gray-100 focus:bg-white transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-primary ml-1 flex items-center gap-2">
              <Lock className="size-4 opacity-50" />
              {isID ? "Kata Sandi" : "Password"}
            </label>
            <div className="relative">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="h-12 bg-gray-50 border-gray-100 focus:bg-white transition-colors"
              />
            </div>
            <p className="text-[10px] text-muted-foreground ml-1">
              * {isID ? "Minimal 8 karakter dengan kombinasi huruf dan angka." : "At least 8 characters with letters and numbers."}
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <p className="text-xs text-primary leading-tight font-medium">
              {isID
                ? "Saya setuju dengan Syarat & Ketentuan serta Kebijakan Privasi HukumAI Platform."
                : "I agree to the Terms & Conditions and Privacy Policy of HukumAI Platform."}
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-lg font-bold shadow-lg shadow-primary/20"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin mr-2" />
            ) : null}
            {loading
              ? isID
                ? "Memproses..."
                : "Processing..."
              : isID
                ? "Daftar Sekarang"
                : "Register Now"}
          </Button>
        </form>

        <div className="text-center pt-4 border-t border-dashed">
          <p className="text-sm font-medium text-muted-foreground">
            {isID ? "Sudah punya akun?" : "Already have an account?"}{" "}
            <Link
              href="/login"
              className="font-bold text-accent hover:underline"
            >
              {isID ? "Masuk di sini" : "Sign in here"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
