"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

interface DeleteBookmarkButtonProps {
  bookmarkId: string;
}

// Hapus bookmark milik sendiri (RLS membatasi per user), lalu muat ulang daftar.
export function DeleteBookmarkButton({ bookmarkId }: DeleteBookmarkButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.from("bookmarks").delete().eq("id", bookmarkId);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-red-500 hover:bg-red-50 hover:text-red-600"
      onClick={handleDelete}
      disabled={loading}
      aria-label="Hapus bookmark"
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </Button>
  );
}
