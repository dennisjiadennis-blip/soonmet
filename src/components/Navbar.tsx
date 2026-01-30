
"use client";

import Link from 'next/link';
import { MapPin, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "ja" ? "en" : "ja");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <MapPin className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            localfriend
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/dashboard" 
            className="text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
          >
            {t("nav.personal_center")}
          </Link>
          <Link 
            href="/gallery" 
            className="text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
          >
            {t("nav.gallery")}
          </Link>
          <Link 
            href="/about" 
            className="text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
          >
            {t("nav.about")}
          </Link>
          {/* <Link 
            href="/dashboard" 
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            {t("nav.dashboard")}
          </Link> */}
          
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Globe className="h-4 w-4" />
            {language === "ja" ? "English" : "日本語"}
          </button>
        </div>
      </div>
    </nav>
  );
}
