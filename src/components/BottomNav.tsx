"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, MessageSquare, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-lg pb-safe md:hidden">
      <div className="flex items-center justify-around px-2 py-3">
        <Link href="/" className="flex flex-col items-center gap-1">
          <div className={`p-1 rounded-full ${isActive("/") ? "text-red-500" : "text-zinc-400"}`}>
            <Home className="h-6 w-6" />
          </div>
          <span className={`text-[10px] ${isActive("/") ? "text-red-500 font-medium" : "text-zinc-500"}`}>
            Home
          </span>
        </Link>
        
        <Link href="/explore" className="flex flex-col items-center gap-1">
          <div className={`p-1 rounded-full ${isActive("/explore") ? "text-cyan-400" : "text-zinc-400"}`}>
            <Compass className="h-6 w-6" />
          </div>
          <span className={`text-[10px] ${isActive("/explore") ? "text-cyan-400 font-medium" : "text-zinc-500"}`}>
            Explore
          </span>
        </Link>

        <Link href="/saved" className="flex flex-col items-center gap-1">
          <div className={`p-1 rounded-full ${isActive("/saved") ? "text-cyan-400" : "text-zinc-400"}`}>
            <Heart className="h-6 w-6" />
          </div>
          <span className={`text-[10px] ${isActive("/saved") ? "text-cyan-400 font-medium" : "text-zinc-500"}`}>
            Saved
          </span>
        </Link>

        <Link href="/messages" className="flex flex-col items-center gap-1">
          <div className={`p-1 rounded-full ${isActive("/messages") ? "text-cyan-400" : "text-zinc-400"}`}>
            <MessageSquare className="h-6 w-6" />
          </div>
          <span className={`text-[10px] ${isActive("/messages") ? "text-cyan-400 font-medium" : "text-zinc-500"}`}>
            Chat
          </span>
        </Link>

        <Link href="/dashboard" className="flex flex-col items-center gap-1">
          <div className={`p-1 rounded-full ${isActive("/dashboard") ? "text-cyan-400" : "text-zinc-400"}`}>
            <User className="h-6 w-6" />
          </div>
          <span className={`text-[10px] ${isActive("/dashboard") ? "text-cyan-400 font-medium" : "text-zinc-500"}`}>
            Profile
          </span>
        </Link>
      </div>
    </div>
  );
}
