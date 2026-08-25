import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { Gavel } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Gavel className="size-8 text-primary" />
      </div>
      <h1 className="text-6xl font-display font-bold text-primary mb-4">404</h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        Halaman yang Anda cari tidak ditemukan atau sudah dipindahkan.
        <br />
        <span className="opacity-70">The page you are looking for could not be found.</span>
      </p>
      <Link href="/">
        <Button className="bg-primary hover:bg-primary/90">
          Kembali ke Beranda
        </Button>
      </Link>
    </div>
  );
}
