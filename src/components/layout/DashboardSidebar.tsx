"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  User,
  Bookmark,
  Crown,
  CreditCard,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  profile: {
    id: string;
    full_name?: string;
    tier: string;
    subscription_end_at?: string;
  };
  locale: string;
}

const menuItems = [
  { href: "/dashboard/profil", icon: User, labelKey: "nav.profil" },
  { href: "/dashboard/bookmark", icon: Bookmark, labelKey: "nav.bookmark", premium: true },
  { href: "/dashboard/langganan", icon: Crown, labelKey: "nav.langganan" },
];

export function DashboardSidebar({ profile, locale }: DashboardSidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();

  const isActive = (href: string) => pathname.includes(href);

  return (
    <aside className="w-full md:w-64 shrink-0 z-10">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden sticky top-20">
        {/* User Info */}
        <div className="p-6 border-b bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarFallback className="bg-primary text-white font-bold">
                {profile.full_name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">
                {profile.full_name || "User"}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                {profile.tier === "premium" ? (
                  <>
                    <Crown className="size-3 text-amber-500" />
                    <span className="text-xs font-medium text-amber-600">Premium</span>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">Free Plan</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const href = `/${locale}${item.href}`;

              return (
                <li key={item.href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:bg-muted hover:text-primary"
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{t(item.labelKey)}</span>
                    {item.premium && profile.tier !== "premium" && (
                      <Crown className="size-3 ml-auto text-amber-500" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="h-px bg-border my-3" />

          {/* Settings */}
          <Link
            href={`/${locale}/dashboard/pengaturan`}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname.includes("/pengaturan")
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted hover:text-primary"
            )}
          >
            <Settings className="size-4" />
            <span>{t("nav.pengaturan")}</span>
          </Link>

          {/* Logout */}
          <LogoutButton locale={locale} label={t("nav.logout")} className="hover:bg-destructive/10 hover:text-destructive" />
        </nav>

        {/* Upgrade CTA for free users */}
        {profile.tier !== "premium" && (
          <div className="p-4 border-t bg-gradient-to-t from-amber-50 to-transparent">
            <div className="text-center">
              <Crown className="size-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-semibold mb-1">Upgrade ke Premium</p>
              <p className="text-xs text-muted-foreground mb-3">
                Akses semua fitur premium dengan harga terjangkau
              </p>
              <Link
                href={`/${locale}/dashboard/langganan`}
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <CreditCard className="size-4 mr-2" />
                Berlangganan
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
