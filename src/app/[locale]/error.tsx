'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Locale Error]', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-display font-bold text-primary mb-4">
        Terjadi Kesalahan
      </h1>
      <p className="text-muted-foreground max-w-md mb-2">
        Maaf, ada yang tidak beres saat memuat halaman ini.
      </p>
      <p className="text-sm text-muted-foreground/70 max-w-md mb-8">
        Sorry, something went wrong while loading this page.
      </p>
      <Button onClick={reset} className="bg-primary hover:bg-primary/90">
        Coba Lagi
      </Button>
    </div>
  );
}
