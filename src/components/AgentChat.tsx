"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, MapPin, User, Calendar, Globe } from "lucide-react";
import { HOSTS, Host, Activity } from "@/lib/data";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type MatchedActivity = Activity & {
  matchReason?: string;
  host: Host;
};

export function AgentChat() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Tell me what kind of person you want to meet in Tokyo. I'll find the perfect match for you.",
    },
  ]);
  const [matchCount, setMatchCount] = useState(853);
  const [displayedCount, setDisplayedCount] = useState(853);
  const [mode, setMode] = useState<"search" | "result">("search");
  const [results, setResults] = useState<MatchedActivity[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isComposing, setIsComposing] = useState(false); // Fix for IME input
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Animated number counter
  useEffect(() => {
    // If we're already at the target, do nothing
    if (displayedCount === matchCount) return;

    // Use requestAnimationFrame for smoother animation and to avoid blocking the main thread
    let animationFrameId: number;
    
    const animate = () => {
      setDisplayedCount(prev => {
        const diff = matchCount - prev;
        
        // If close enough, snap to target
        if (Math.abs(diff) < 1) {
          return matchCount;
        }
        
        // Dynamic step size based on difference
        // Larger difference = larger steps
        const step = diff > 0 
          ? Math.max(1, Math.ceil(diff * 0.1)) 
          : Math.min(-1, Math.floor(diff * 0.1));
          
        return prev + step;
      });

      if (displayedCount !== matchCount) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [matchCount, displayedCount]); // Add displayedCount dependency for smooth animation loop

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    const newQuery = query;
    setQuery("");
    setMessages((prev) => [...prev, { role: "user", content: newQuery }]);
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      let nextCount = matchCount;
      let reply = "";
      let foundActivities: MatchedActivity[] = [];

      if (messages.length === 1) {
        // First filter
        nextCount = 20;
        reply = "I see. You're looking for someone with a unique perspective. I've narrowed it down to 20 people who match that vibe. Can you be more specific about what you want to do together?";
      } else {
        // Final filter
        nextCount = 3;
        reply = "I found 3 perfect matches for you based on your interests in photography and culture.";
        
        // Flatten activities and find matches
        const allActivities = HOSTS.flatMap(host => 
          host.activities.map(activity => ({
            ...activity,
            host: host
          }))
        );

        // Just take first 3 for demo
        foundActivities = allActivities.slice(0, 3).map(activity => ({
          ...activity,
          matchReason: `Matches your interest in ${activity.tags?.[0] || 'Tokyo'} and ${activity.tags?.[1] || 'Culture'}`
        }));

        setResults(foundActivities);
        setMode("result");
      }

      setMatchCount(nextCount);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setIsTyping(false);
    }, 1500);
  };

  const getNumberColor = (count: number) => {
    if (count > 100) return "text-white";
    if (count > 50) return "text-green-500";
    if (count > 20) return "text-red-500";
    if (count > 10) return "text-pink-500";
    return "text-blue-500";
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col">
      {/* 1. Header Area (Top) */}
      <div className="flex-none flex flex-col items-center justify-center pb-4 transition-all duration-500">
        <div className={`text-6xl md:text-8xl font-black leading-none tracking-tighter select-none transition-colors duration-500 ${getNumberColor(displayedCount)}`}>
          {displayedCount}
        </div>
        <p className="text-zinc-400 text-sm font-light tracking-widest uppercase mt-2">
          Potential Matches
        </p>
      </div>

      {/* 2. Chat Area (Middle - Natural Flow) */}
      <div className="w-full px-4 py-4" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Messages - Normal Order (Oldest First) */}
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex w-full ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-6 py-4 text-lg backdrop-blur-sm border ${
                  msg.role === "user"
                    ? "bg-indigo-600/20 border-indigo-500/30 text-white"
                    : "bg-zinc-800/80 border-white/10 text-zinc-200"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start w-full"
            >
              <div className="bg-zinc-800/80 backdrop-blur-md rounded-2xl px-6 py-4 flex gap-2 border border-white/5">
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-200" />
              </div>
            </motion.div>
          )}

          {/* Results List */}
          {mode === "result" && !isTyping && (
            <div className="space-y-4 w-full pt-4 pb-20">
              {results.map((activity) => (
                <div 
                  key={activity.id}
                  className="bg-zinc-900/80 border border-white/10 rounded-3xl p-6 relative hover:border-indigo-500/50 transition-all duration-300"
                >
                  <a 
                    href={`/host/${activity.host.id}#activity-${activity.id}`}
                    className="block w-full h-full cursor-pointer relative z-[9999]"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Activity Image */}
                      <div className="relative w-full md:w-48 h-48 rounded-2xl overflow-hidden shrink-0">
                      <img src={activity.imageUrl} alt={activity.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                        ¥{activity.price || activity.host.price}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                           <div>
                             <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">{activity.title}</h3>
                             <div className="flex items-center gap-2 mt-1">
                               <img src={activity.host.imageUrl} alt={activity.host.name} className="w-5 h-5 rounded-full object-cover" />
                               <p className="text-zinc-400 text-sm">Initiated by <span className="text-zinc-200 font-medium">{activity.host.name}</span></p>
                             </div>
                           </div>
                           <div className="flex flex-col items-end gap-1">
                             <div className="flex items-center gap-1.5 text-xs font-medium bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                               <Sparkles className="w-3 h-3" />
                               98% Match
                             </div>
                           </div>
                        </div>
                        
                        <p className="text-zinc-300 text-sm line-clamp-2 mb-3">{activity.description}</p>
                        
                        {/* Match Reason */}
                        {activity.matchReason && (
                          <div className="mb-4 text-sm text-indigo-200/80 italic">
                            "{activity.matchReason}"
                          </div>
                        )}

                        {/* Detailed Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 mt-2 text-sm text-zinc-400">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-zinc-500" />
                            <span>{activity.host.nationality}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-zinc-500" />
                            <span>{activity.host.gender}</span>
                          </div>
                           <div className="flex items-center gap-2 col-span-2">
                            <Calendar className="w-4 h-4 text-zinc-500" />
                            <span className="truncate">{activity.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Input Area (Bottom) */}
      <div className="flex-none w-full py-6 bg-transparent">
        <div className="relative flex items-center max-w-3xl mx-auto w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isComposing) {
                handleSearch();
              }
            }}
            placeholder="Describe your ideal experience in Tokyo..."
            className="w-full bg-zinc-900/80 backdrop-blur-xl border-2 border-indigo-500/30 text-white rounded-full pl-8 pr-16 py-4 text-lg shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-500"
            autoFocus
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
