import { AgentChat } from "@/components/AgentChat";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1a1512] flex flex-col items-center p-4 relative pb-20">
      {/* Warm Artistic Hand-Drawn Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg className="w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="warm-connection-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* Hand-drawn style connections - Sketchy lines */}
              <path d="M20,20 Q60,80 100,20 T180,80" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="5,5" opacity="0.6" />
              <path d="M10,100 C50,150 150,50 190,100" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.5" />
              
              {/* Abstract People/Connection Nodes - Sketchy circles */}
              <circle cx="20" cy="20" r="4" fill="none" stroke="#fcd34d" strokeWidth="1.5" />
              <circle cx="100" cy="20" r="3" fill="#fcd34d" opacity="0.4" />
              <circle cx="180" cy="80" r="5" fill="none" stroke="#fb923c" strokeWidth="1.5" />
              <circle cx="10" cy="100" r="3" fill="#fb923c" opacity="0.4" />
              <circle cx="190" cy="100" r="4" fill="none" stroke="#eab308" strokeWidth="1.5" />
              
              {/* Soft connecting curves */}
              <path d="M20,20 L10,100" stroke="#fcd34d" strokeWidth="0.5" opacity="0.3" />
              <path d="M180,80 L190,100" stroke="#fb923c" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#warm-connection-pattern)" />
        </svg>
      </div>
      
      {/* Warm Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#1a1512_100%)] pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        {/* Slogan */}
        <h1 className="text-4xl md:text-6xl font-bold text-center text-white mb-12 tracking-tight mt-10">
          Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Connection</span> in Tokyo.
        </h1>
        
        {/* Agent Chat Interface */}
        <div className="w-full relative z-20">
          <AgentChat />
        </div>

        {/* Explore All Activities Entry */}
        <div className="mt-24 w-full max-w-3xl px-4 relative z-30 pointer-events-auto">
          <div className="relative group cursor-pointer z-50">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            <Link 
              href="/activities"
              className="relative flex items-center justify-between bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:bg-zinc-800/80 transition-all duration-300"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-indigo-400 font-medium">
                  <Sparkles className="w-5 h-5" />
                  <span>Curated Experiences</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Explore All Activities</h3>
                <p className="text-zinc-400">Browse through our hand-picked collection of local experiences.</p>
              </div>
              <div className="bg-white/10 p-3 rounded-full group-hover:bg-white/20 transition-colors">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
