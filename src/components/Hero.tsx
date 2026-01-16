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
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200" />
          <div className="relative flex items-center rounded-full bg-white p-2 shadow-2xl ring-1 ring-black/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg animate-pulse">
              <Sparkles className="h-6 w-6" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 bg-transparent px-6 py-4 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none"
              disabled={isThinking}
            />
            <button 
              onClick={handleAgentAction}
              disabled={isThinking}
              className="mr-1 rounded-full bg-zinc-900 px-8 py-3 font-semibold text-white transition-all hover:bg-zinc-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isThinking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>Ask AI</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
          
          {/* Agent Hints */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-white/80">
            <span className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">Try: "Find a quiet cafe partner"</span>
            <span className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">"I want to learn Tea Ceremony"</span>
            <span className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">"Meet a startup founder"</span>
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
