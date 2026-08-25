"use client";

import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="font-display font-bold text-lg text-primary">
                {t("site.name")}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              {t("site.description")}
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              {t("site.disclaimer")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-primary">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/regulasi" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.regulasi")}
                </Link>
              </li>
              <li>
                <Link href="/berita" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.berita")}
                </Link>
              </li>
              <li>
                <Link href="/tanya-ai" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.tanyaAi")}
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.tentang")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-primary">
              {t("footer.legal")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/kebijakan-privasi" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/syarat-ketentuan" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.termsOfService")}
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {t("site.name")}. {t("footer.rightsReserved")}
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-xs">
              {t("footer.privacyPolicy")}
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-xs">
              {t("footer.termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
