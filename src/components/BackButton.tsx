"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton({ className = "", onClick, label = "Back" }: { className?: string; onClick?: () => void; label?: string }) {
  const router = useRouter();

  return (
    <button
      onClick={onClick || (() => router.back())}
      className={`flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-zinc-900/80 hover:bg-white dark:hover:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg transition-colors backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-sm ${className}`}
    >
      <ArrowLeft className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
}
