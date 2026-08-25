"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { Menu, User, LogOut, Crown, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

interface HeaderProps {
  locale: string;
}

const navLinks = [
  { href: "/regulasi", labelKey: "nav.regulasi" },
  { href: "/berita", labelKey: "nav.berita" },
  { href: "/tanya-ai", labelKey: "nav.tanyaAi" },
  { href: "/tentang", labelKey: "nav.tentang" },
];

export function Header({ locale }: HeaderProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string; avatar_url?: string } } | null>(null);
  const [profile, setProfile] = useState<{ tier: string; full_name?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('tier, full_name')
          .eq('id', user.id)
          .single();
        setProfile(profileData);
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/login`);
  };

  const isActive = (href: string) => pathname.includes(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-display font-bold text-lg text-primary hidden sm:block">
              {t("site.name")}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                )}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language Toggle - Simple Button */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
              >
                <Globe className="size-4" />
                {locale.toUpperCase()}
                <ChevronDown className={cn("size-3 transition-transform", langOpen && "rotate-180")} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white border rounded-lg shadow-lg py-1 z-50">
                  <Link
                    href={`/id${pathname.replace(/^\/(id|en)/, "")}`}
                    onClick={() => setLangOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors",
                      locale === "id" && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    Indonesia
                  </Link>
                  <Link
                    href={`/en${pathname.replace(/^\/(id|en)/, "")}`}
                    onClick={() => setLangOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors",
                      locale === "en" && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    English
                  </Link>
                </div>
              )}
            </div>

            {/* User Menu - Simple Dropdown */}
            {user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 hover:bg-muted rounded-full transition-colors"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-white text-sm">
                      {profile?.full_name?.[0] || user.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium">{profile?.full_name || user.email}</p>
                      {profile?.tier === "premium" && (
                        <p className="text-xs flex items-center gap-1 text-amber-600 mt-0.5">
                          <Crown className="size-3" />
                          Premium
                        </p>
                      )}
                    </div>
                    <div className="py-1">
                      <Link
                        href={`/${locale}/dashboard/profil`}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <User className="size-4" />
                        {t("nav.profil")}
                      </Link>
                      <Link
                        href={`/${locale}/dashboard/bookmark`}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <span className="text-base">🔖</span>
                        {t("nav.bookmark")}
                      </Link>
                      <Link
                        href={`/${locale}/dashboard/langganan`}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <Crown className="size-4" />
                        {t("nav.langganan")}
                      </Link>
                    </div>
                    <div className="border-t py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="size-4" />
                        {t("nav.logout")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : !loading ? (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/${locale}/login`}>{t("nav.login")}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/${locale}/register`}>{t("nav.register")}</Link>
                </Button>
              </div>
            ) : null}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-2 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={`/${locale}${link.href}`}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "px-4 py-3 text-sm font-medium rounded-md transition-colors",
                        isActive(link.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-primary hover:bg-muted"
                      )}
                    >
                      {t(link.labelKey)}
                    </Link>
                  ))}
                  {!user && (
                    <>
                      <div className="h-px bg-border my-2" />
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/${locale}/login`} onClick={() => setMobileOpen(false)}>
                          {t("nav.login")}
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/${locale}/register`} onClick={() => setMobileOpen(false)}>
                          {t("nav.register")}
                        </Link>
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
