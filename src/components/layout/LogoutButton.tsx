"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  locale: string;
  label: string;
  className?: string;
}

// Logout harus lewat POST ke /api/auth/logout — endpoint ini tidak bisa
// diakses via <Link> (GET) karena hanya mendukung POST.
export function LogoutButton({ locale, label, className }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${locale}/login`);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
        className
      )}
    >
      <LogOut className="size-4" />
      <span>{label}</span>
    </button>
  );
}
