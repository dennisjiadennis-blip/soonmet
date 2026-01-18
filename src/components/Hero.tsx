"use client";

import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export function Hero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isThinking, setIsThinking] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Typewriter effect for placeholder
  useEffect(() => {
    const text = "Tell me what you're looking for... e.g. 'I want to host travelers' or 'Find a coffee buddy'";
    let i = 0;
    const interval = setInterval(() => {
      setPlaceholder(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleAgentAction = async () => {
    if (!query.trim()) return;
    
    setIsThinking(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerQuery = query.toLowerCase();

    // Intent Recognition Logic
    if (
      lowerQuery.includes("host") || 
      lowerQuery.includes("become") || 
      lowerQuery.includes("teach") || 
      lowerQuery.includes("share") ||
      lowerQuery.includes("earn")
    ) {
      // Intent: Registration / Hosting
      router.push('/host/apply');
    } else if (
      lowerQuery.includes("login") || 
      lowerQuery.includes("sign in") || 
      lowerQuery.includes("account")
    ) {
      // Intent: Authentication (Redirect to Dashboard/Login for now)
      router.push('/dashboard');
    } else {
      // Intent: Search / Matchmaking
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", query);
      router.push(`/?${params.toString()}`, { scroll: false });
      
      const listElement = document.getElementById('host-list');
      if (listElement) {
        listElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    setIsThinking(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAgentAction();
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image - Simulating the video/large image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2994&auto=format&fit=crop")',
        }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="mb-8 text-4xl font-light tracking-wide md:text-6xl drop-shadow-lg">
          In Tokyo, you have a friend <br className="hidden md:block" />
          you haven&apos;t met yet.
        </h1>
        
        <p className="mb-12 text-lg font-light opacity-90 md:text-xl">
          在东京，你有一个尚未谋面的朋友。
        </p>

        {/* AI Agent Interface */}
        <div className="relative w-full max-w-3xl group mx-auto">
          {/* Glowing Background Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          
          <div className={`relative flex items-center overflow-hidden rounded-2xl transition-all duration-300 ${
            isThinking 
              ? "bg-white border-2 border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.5)]" 
              : "bg-white/95 border-2 border-transparent hover:scale-[1.01] shadow-2xl"
          }`}>
            
            {/* Icon Status */}
            <div className="pl-6 pr-4">
              {isThinking ? (
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
              ) : (
                <Sparkles className="h-8 w-8 text-rose-500 animate-pulse" />
              )}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isThinking}
              className="h-24 w-full bg-transparent text-xl sm:text-2xl text-zinc-900 placeholder-zinc-400 outline-none font-medium"
            />

            {/* Action Button */}
            <button 
              onClick={handleAgentAction}
              disabled={isThinking || !query.trim()}
              className={`mr-4 p-4 rounded-xl transition-all ${
                query.trim() 
                  ? "bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-lg hover:shadow-rose-500/30 hover:scale-105" 
                  : "bg-zinc-100 text-zinc-300 cursor-not-allowed"
              }`}
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>

          {/* Helper Text */}
          <div className={`absolute -bottom-10 left-0 right-0 transition-opacity duration-300 ${isThinking ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-base text-indigo-200 font-medium flex items-center justify-center gap-2 bg-black/50 py-1 px-4 rounded-full mx-auto w-fit backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              AI Agent is finding your perfect match...
            </p>
          </div>
        </div>

        {/* Dynamic Counter */}
        <div className="absolute bottom-12 flex items-center gap-2 text-sm font-medium tracking-wider text-white/90">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          当前有 42 场跨国 Zoom 友谊正在进行中
        </div>
      </div>
    </div>
  );
}
