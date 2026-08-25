"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";

// Ganti password lewat Supabase auth (bukan tabel profiles).
export function PasswordForm({ isID }: { isID: boolean }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (password.length < 8) {
      setError(isID ? "Password minimal 8 karakter." : "Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError(isID ? "Konfirmasi password tidak cocok." : "Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
        return;
      }
      setPassword("");
      setConfirm("");
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new-password">
          {isID ? "Password Baru" : "New Password"}
        </Label>
        <Input
          id="new-password"
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setSuccess(false) }}
          placeholder="••••••••"
          required
          minLength={8}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">
          {isID ? "Konfirmasi Password" : "Confirm Password"}
        </Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setSuccess(false) }}
          placeholder="••••••••"
          required
          minLength={8}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-600">
          {isID ? "Password berhasil diubah." : "Password updated successfully."}
        </p>
      )}
      <Button type="submit" disabled={loading} variant="outline" className="w-full">
        {loading && <Loader2 className="size-4 animate-spin mr-2" />}
        {isID ? "Ubah Password" : "Change Password"}
      </Button>
    </form>
  );
}

// Hapus akun permanen via service-role (menghapus auth.users; data lain
// ikut terhapus lewat ON DELETE CASCADE). Wajib konfirmasi dua langkah.
export function DeleteAccountSection({ locale, email, isID }: { locale: string; email: string; isID: boolean }) {
  const router = useRouter();
  const [confirmEmail, setConfirmEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/delete-account", { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || (isID ? "Gagal menghapus akun." : "Failed to delete account."));
        return;
      }
      await fetch("/api/auth/logout", { method: "POST" });
      router.push(`/${locale}/login?deleted=1`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
          {isID ? "Hapus Akun" : "Delete Account"}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <ShieldAlert className="size-5" />
            {isID ? "Hapus Akun Permanen?" : "Delete Account Permanently?"}
          </DialogTitle>
          <DialogDescription>
            {isID
              ? "Seluruh data Anda — profil, bookmark, riwayat chat AI — akan dihapus permanen dan tidak bisa dikembalikan."
              : "All of your data — profile, bookmarks, AI chat history — will be permanently deleted and cannot be recovered."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="confirm-delete-email">
            {isID
              ? `Ketik "${email}" untuk konfirmasi`
              : `Type "${email}" to confirm`}
          </Label>
          <Input
            id="confirm-delete-email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder={email}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" className="border-input" type="button">
            {isID ? "Batal" : "Cancel"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading || confirmEmail !== email}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : (
              <LogOut className="size-4 mr-2" />
            )}
            {isID ? "Ya, Hapus Akun Saya" : "Yes, Delete My Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
