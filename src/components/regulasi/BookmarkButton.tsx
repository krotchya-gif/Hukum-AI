"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { createClient } from "@/utils/supabase/client";

interface BookmarkButtonProps {
  regulationId: string;
  initialSaved: boolean;
  hasActivePremium: boolean;
  isID: boolean;
}

// Toggle simpan/hapus regulasi langsung dari client; akses dibatasi RLS
// per pemilik. Non-premium diarahkan ke halaman langganan.
export function BookmarkButton({ regulationId, initialSaved, hasActivePremium, isID }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  if (!hasActivePremium) {
    return (
      <Link href="/dashboard/langganan">
        <Button variant="outline" className="h-12 w-full gap-2 font-semibold">
          <Crown className="size-4 text-amber-500" />
          {isID ? "Simpan (Premium)" : "Save (Premium)"}
        </Button>
      </Link>
    );
  }

  const toggle = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      if (saved) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("regulation_id", regulationId);
        if (!error) setSaved(false);
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert({ regulation_id: regulationId });
        if (!error) setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="h-12 w-full gap-2 font-semibold"
      onClick={toggle}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : saved ? (
        <BookmarkCheck className="size-4 text-accent" />
      ) : (
        <Bookmark className="size-4" />
      )}
      {saved ? (isID ? "Tersimpan" : "Saved") : isID ? "Simpan" : "Save"}
    </Button>
  );
}
