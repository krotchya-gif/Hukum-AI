"use client";

import { useState } from "react";
import { Bookmark, Check, Loader2, Printer, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Aksi artikel: bagikan (Web Share API dengan fallback copy link) dan cetak.
export function ArticleActions({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [printing, setPrinting] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
        return;
      } catch {
        // dibatalkan user — abaikan
        return;
      }
    }
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    setPrinting(true);
    window.print();
    setTimeout(() => setPrinting(false), 500);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full size-12 shadow-sm hover:border-accent hover:text-accent"
        onClick={handleShare}
        aria-label="Bagikan"
      >
        {copied ? <Check className="size-5 text-emerald-500" /> : <Share2 className="size-5" />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full size-12 shadow-sm hover:border-accent hover:text-accent"
        onClick={handlePrint}
        disabled={printing}
        aria-label="Cetak"
      >
        {printing ? <Loader2 className="size-5 animate-spin" /> : <Printer className="size-5" />}
      </Button>
    </>
  );
}

// Ikon bookmark pada artikel sengaja tidak dipasang: tabel bookmarks
// hanya merujuk regulations, jadi fitur ini belum berlaku untuk artikel.
export function DisabledBookmarkHint() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full size-12 shadow-sm opacity-40 cursor-not-allowed"
      disabled
      aria-label="Bookmark artikel (segera hadir)"
    >
      <Bookmark className="size-5" />
    </Button>
  );
}
