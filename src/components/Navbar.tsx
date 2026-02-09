"use client";

import Link from 'next/link';
import { Menu, User, Clock, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Navbar() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "ja" ? "en" : "ja");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0a0a16]/90 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto flex h-14 items-center justify-between px-4">
        {/* Left: Logo */}
        <Link href="/" className="group">
          <div className="flex flex-col items-start">
            <span className="text-xl font-bold tracking-tight text-white">
              LocalVibe
            </span>
            <div className="h-[2px] w-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] rounded-full mt-0.5 opacity-80"></div>
          </div>
        </Link>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-cyan-950/50 border border-cyan-500/30 rounded-full px-3 py-1 mr-2">
            <Clock className="h-3 w-3 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-100">17:15 JST</span>
          </div>

          <button 
            onClick={toggleLanguage}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Switch Language"
          >
            <Globe className="h-5 w-5" />
          </button>

          <Link 
            href="/dashboard"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors relative"
          >
            <User className="h-6 w-6" />
          </Link>

          <button className="p-2 text-white/80 hover:bg-white/10 rounded-full transition-colors ml-1">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
