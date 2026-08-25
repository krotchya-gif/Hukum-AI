"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  Bot,
  History,
  Plus,
  Lightbulb,
  ShieldAlert,
  Scale,
  Crown,
  Loader2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SESSION_STORAGE_KEY = "hukumai-chat-session-id";

function getOrCreateSessionId(): string {
  let id = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_STORAGE_KEY, id);
  }
  return id;
}

export default function TanyaAIPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const isID = locale === "id";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quotaReached, setQuotaReached] = useState(false);
  // '' = belum terinisialisasi di client (hindari mismatch SSR)
  const [sessionId, setSessionId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = isID
    ? [
        "Apa hukuman untuk pencemaran nama baik?",
        "Cara membuat surat perjanjian sewa menyewa",
        "Hak karyawan yang terkena PHK sepihak",
        "Prosedur pendaftaran hak cipta logo",
      ]
    : [
        "What is the penalty for defamation?",
        "How to draft a rental agreement",
        "Employee rights for unfair dismissal",
        "Copyright registration procedure for a logo",
      ];

  // Ambil/buat sessionId, lalu muat riwayat sesi berjalan dari server.
  useEffect(() => {
    const id = getOrCreateSessionId();
    setSessionId(id);
    fetch(`/api/ai/chat?sessionId=${encodeURIComponent(id)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data?.data) && data.data.length > 0) {
          setMessages(
            data.data.map((turn: { role: Message["role"]; content: string }) => ({
              role: turn.role,
              content: turn.content,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  // Gulir ke pesan terbaru
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  const startNewChat = useCallback(() => {
    const id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_STORAGE_KEY, id);
    setSessionId(id);
    setMessages([]);
    setQuotaReached(false);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !sessionId) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          sessionId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuotaReached(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content },
        ]);
      } else if (res.status === 429) {
        setQuotaReached(true);
      } else if (res.status === 401) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: isID
              ? "Sesi Anda telah berakhir. Silakan masuk kembali untuk melanjutkan."
              : "Your session has expired. Please sign in again to continue.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: isID
              ? "Maaf, terjadi kesalahan. Silakan coba lagi."
              : "Sorry, an error occurred. Please try again.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isID
            ? "Maaf, saya tidak dapat menjawab saat ini."
            : "Sorry, I cannot answer at the moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  // Topik percakapan berjalan untuk panel riwayat
  const topics = messages
    .filter((m) => m.role === "user")
    .slice(-8)
    .reverse();

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-50/50">
      {/* Sidebar - Riwayat percakapan berjalan */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r shrink-0">
        <div className="p-4 border-b">
          <Button
            onClick={startNewChat}
            className="w-full justify-start gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="size-4" />
            {isID ? "Chat Baru" : "New Chat"}
          </Button>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              {isID ? "Percakapan Ini" : "This Conversation"}
            </div>
            {topics.length > 0 ? (
              topics.map((topic, idx) => (
                <div
                  key={idx}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-default transition-colors border border-transparent hover:border-gray-200"
                >
                  <History className="size-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium text-gray-700 line-clamp-1">
                    {topic.content}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground px-1">
                {isID
                  ? "Belum ada pertanyaan di sesi ini."
                  : "No questions in this session yet."}
              </p>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-gray-50/50">
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <ShieldAlert className="size-5 text-amber-600 shrink-0" />
            <div className="text-xs text-amber-800">
              {isID
                ? "Gunakan akun Premium untuk akses tanpa batas."
                : "Use Premium account for unlimited access."}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
              <Bot className="size-6" />
            </div>
            <div>
              <h2 className="font-bold text-primary">Asisten Hukum AI</h2>
              <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                Online
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={startNewChat} className="gap-2 hidden sm:flex">
            <Plus className="size-4" />
            {isID ? "Chat Baru" : "New Chat"}
          </Button>
        </div>

        {/* Message List */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-8 pb-10">
            {messages.length === 0 ? (
              <>
                {/* Welcome Message */}
                <div className="flex gap-4 items-start">
                  <div className="size-10 rounded-xl bg-primary/10 shrink-0 flex items-center justify-center text-primary border border-primary/20">
                    <Bot className="size-6" />
                  </div>
                  <div className="flex flex-col gap-3 max-w-[85%]">
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-5 text-gray-800 leading-relaxed shadow-sm">
                      {isID
                        ? "Halo! Saya Asisten Hukum AI. Saya dapat membantu menjelaskan regulasi, memberikan ringkasan hukum, atau membantu menyusun kerangka dokumen hukum. Apa yang ingin Anda tanyakan hari ini?"
                        : "Hello! I am Legal AI Assistant. I can help explain regulations, provide legal summaries, or assist in drafting legal document frameworks. What would you like to ask today?"}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <div className="text-xs font-bold text-muted-foreground uppercase w-full mb-1 flex items-center gap-1">
                        <Lightbulb className="size-3" />
                        {isID ? "Saran Pertanyaan" : "Suggested Questions"}
                      </div>
                      {suggestions.map((s, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(s)}
                          className="rounded-full text-xs hover:border-accent hover:text-accent font-medium"
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-4 items-start",
                    msg.role === "user" && "flex-row-reverse"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div className="size-10 rounded-xl bg-primary/10 shrink-0 flex items-center justify-center text-primary border border-primary/20">
                      <Bot className="size-6" />
                    </div>
                  )}
                  {msg.role === "user" && (
                    <div className="size-10 rounded-xl bg-accent shrink-0 flex items-center justify-center text-white">
                      <span className="text-sm font-bold">U</span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "flex flex-col gap-3 max-w-[85%]",
                      msg.role === "user" && "items-end"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl p-5 leading-relaxed shadow-sm whitespace-pre-line",
                        msg.role === "user"
                          ? "bg-primary text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-4 items-start">
                <div className="size-10 rounded-xl bg-primary/10 shrink-0 flex items-center justify-center text-primary border border-primary/20">
                  <Bot className="size-6" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-5 shadow-sm">
                  <Loader2 className="size-6 animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Banner batas harian */}
        {quotaReached && (
          <div className="mx-auto w-full max-w-3xl px-6">
            <div className="mb-2 flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="size-5 shrink-0 text-amber-600" />
                <p className="text-sm text-amber-800">
                  {isID
                    ? "Anda telah mencapai batas 5 pertanyaan gratis hari ini."
                    : "You have reached your limit of 5 free questions today."}
                </p>
              </div>
              <Link href={`/${locale}/dashboard/langganan`}>
                <Button size="sm" className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white gap-1.5">
                  <Crown className="size-4" />
                  {isID ? "Upgrade Premium" : "Upgrade Premium"}
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-6 border-t bg-gray-50/30">
          <div className="max-w-3xl mx-auto relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isID
                  ? "Ketik pertanyaan hukum Anda di sini..."
                  : "Type your legal question here..."
              }
              className="h-14 pr-16 pl-6 rounded-2xl bg-white border-gray-200 shadow-sm focus-visible:ring-primary text-base"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-xl bg-primary hover:bg-primary/90"
              size="icon"
            >
              <Send className="size-5" />
            </Button>
            <p className="text-[10px] text-center text-muted-foreground mt-3 flex items-center justify-center gap-1">
              <Scale className="size-3" />
              {isID
                ? "AI dapat melakukan kesalahan. Harap verifikasi jawaban dengan ahli hukum profesional."
                : "AI can make mistakes. Please verify answers with a professional legal expert."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
