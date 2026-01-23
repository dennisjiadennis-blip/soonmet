import { AgentChat } from "@/components/AgentChat";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#637C88] flex flex-col items-center relative pb-20">
      {/* Pacific Grey Background - Calm & Sophisticated */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wave-pattern" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
               <path d="M0 20 Q10 5 20 20 T40 20" fill="none" stroke="#e2e8f0" strokeWidth="1.5" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave-pattern)" />
        </svg>
      </div>
      
      {/* Cool Mist Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(226,232,240,0.3)_0%,rgba(99,124,136,0.2)_60%,transparent_100%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#637C88] to-transparent pointer-events-none" />

      {/* Slogan Sticky Header - Always Visible */}
      <div className="sticky top-16 z-40 w-full flex justify-center bg-[#637C88]/80 backdrop-blur-xl py-6 border-b border-white/5 shadow-sm transition-all">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-white tracking-tight drop-shadow-md">
          Tokyo, hosted by locals.
        </h1>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center mt-8 space-y-12">
        
        {/* Agent Chat Interface */}
        <div className="w-full relative z-20">
          <AgentChat />
        </div>

        {/* Explore All Activities Entry - RESTORED BIG CARD */}
        <div className="w-full max-w-3xl px-4 relative z-30 pointer-events-auto pb-12">
          <div className="relative group cursor-pointer z-50">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-200 to-rose-200 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            <Link 
              href="/activities"
              className="relative flex items-center justify-between overflow-hidden p-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl group transform hover:-translate-y-1"
            >
              {/* Passionate Warm Background with Activity Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-rose-500 to-amber-500" />
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="activity-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                       {/* Activity Symbols: Playful shapes representing joy and movement */}
                       <circle cx="10" cy="10" r="3" fill="white" />
                       <path d="M30 10 L40 25 L20 25 Z" fill="white" /> {/* Mountain/Tent */}
                       <rect x="45" y="40" width="8" height="8" transform="rotate(15 49 44)" fill="white" /> {/* Ticket/Photo */}
                       <path d="M10 50 Q25 35 40 50 T70 50" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" /> {/* Streamer/Path */}
                       <circle cx="50" cy="15" r="2" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#activity-pattern)" />
                </svg>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-white/90 font-medium">
                  <Sparkles className="w-5 h-5" />
                  <span>Curated Experiences</span>
                </div>
                <h3 className="text-2xl font-bold text-white drop-shadow-sm">Explore All Activities</h3>
                <p className="text-white/90 font-medium">Browse through our hand-picked collection of local experiences.</p>
              </div>
              
              {/* Arrow Button */}
              <div className="relative z-10 bg-white/20 backdrop-blur-md p-3 rounded-full group-hover:bg-white/30 transition-all border border-white/30 group-hover:scale-110">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
