"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Gavel, Newspaper, MessageSquare, ShieldCheck, Download, Users } from "lucide-react";
import Link from "next/link";

interface HomePageProps {
  params: { locale: string };
}

export default function HomePage({ params: { locale } }: HomePageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const isID = locale === "id";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/regulasi?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/${locale}/regulasi`);
    }
  };

  const quickLinks = [
    { icon: Gavel, label: isID ? "Regulasi" : "Regulations", href: `/${locale}/regulasi` },
    { icon: Newspaper, label: isID ? "Berita" : "News", href: `/${locale}/berita` },
    { icon: MessageSquare, label: isID ? "Tanya AI" : "Ask AI", href: `/${locale}/tanya-ai` },
    { icon: ShieldCheck, label: isID ? "Premium" : "Premium", href: `/${locale}/dashboard/langganan` },
  ];

  const features = [
    {
      title: isID ? "Database Lengkap" : "Complete Database",
      desc: isID
        ? "Akses ribuan regulasi mulai dari UU hingga Perda yang selalu diperbarui."
        : "Access thousands of regulations from Laws to Regional Regulations that are always updated.",
      icon: Download,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: isID ? "Asisten Hukum AI" : "AI Legal Assistant",
      desc: isID
        ? "Dapatkan jawaban cepat untuk pertanyaan hukum umum kapanpun Anda butuh."
        : "Get quick answers to general legal questions whenever you need.",
      icon: MessageSquare,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: isID ? "Keluarga Besar HRP" : "Large HRP Community",
      desc: isID
        ? "Terhubung dengan komunitas hukum terbesar dan terpercaya di Indonesia."
        : "Connect with the largest and most trusted legal community in Indonesia.",
      icon: Users,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-[#0a0f1e] text-white py-20 px-4 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#f59e0b,transparent_70%)] opacity-20" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            {isID ? "Akses Hukum Kini Lebih Mudah" : "Legal Access Made Easier"}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            {isID
              ? "Platform hukum digital terpercaya untuk masyarakat Indonesia. Cari regulasi, baca berita hukum, dan konsultasi dengan AI Hukum kami."
              : "Indonesia's trusted digital legal platform. Search regulations, read legal news, and consult with our Legal AI."}
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col md:flex-row gap-2 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isID
                    ? "Cari peraturan, UU, atau artikel hukum..."
                    : "Search for regulations, laws, or legal articles..."
                }
                className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-amber-500"
              />
            </div>
            <Button type="submit" className="h-12 px-8 bg-amber-500 hover:bg-amber-600 text-[#0a0f1e] font-bold">
              {isID ? "Cari Sekarang" : "Search Now"}
            </Button>
          </form>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {quickLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <item.icon className="size-8 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-200">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-[#0a0f1e] mb-4">
              {isID ? "Kenapa Memilih HukumAI?" : "Why Choose HukumAI?"}
            </h2>
            <div className="w-20 h-1.5 bg-amber-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow bg-gray-50/30"
              >
                <div
                  className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6`}
                >
                  <feature.icon className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0a0f1e] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
