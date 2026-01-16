import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Host } from "@/lib/data";
import { Sparkles, Instagram, ShieldCheck } from "lucide-react";

interface HostCardProps {
  host: Host;
  className?: string;
  matchReason?: string;
}

export function HostCard({ host, className, matchReason }: HostCardProps) {
  return (
    <Link 
      href={`/host/${host.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      {/* Match Reason Banner */}
      {matchReason && (
        <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-white/90">AI Match Reason</p>
          <p className="text-sm font-medium text-white">{matchReason}</p>
        </div>
      )}

      {/* Price Bubble - Removed to reduce commercial feel */}
      {/* <div className={cn(
        "absolute top-4 right-4 z-20 rounded-full bg-black/40 px-4 py-2 text-base font-medium text-white backdrop-blur-md border border-white/10",
        matchReason && "top-16" // Push down if banner exists
      )}>
        ¥{host.price}/hr
      </div> */}

      {/* AI & Lifestyle Badge - Large & Bold Overlay */}
      {host.instagramAnalysis && (
        <div className="absolute bottom-28 right-0 z-30 w-full px-6 flex flex-col items-end pointer-events-none">
          {/* Badge Header */}
          <div className="flex flex-col items-end gap-1 mb-4">
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-1.5 text-xs font-bold text-white shadow-xl transform -rotate-2">
              <Instagram className="h-3 w-3" />
              <span>AI INSIGHT</span>
            </div>
            {/* Aesthetic Badge */}
            <div className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-medium text-white/90 border border-white/10 shadow-lg transform rotate-1">
              <Sparkles className="h-2.5 w-2.5 text-yellow-400" />
              <span className="uppercase tracking-wider text-yellow-200/80">Vibe:</span>
              <span>{host.instagramAnalysis.aesthetic}</span>
            </div>
          </div>
          
          {/* Main AI Text - Large & Impactful */}
          <div className="relative">
             <div className="absolute -inset-4 bg-black/60 blur-xl rounded-full opacity-70"></div>
             <p className="relative text-2xl md:text-3xl font-black text-white leading-tight text-right italic drop-shadow-2xl" 
                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400">
                 &quot;
               </span>
               {host.instagramAnalysis.summary}
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400">
                 &quot;
               </span>
             </p>
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={host.imageUrl}
          alt={host.name}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105"
        />
        {/* Mysterious Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-700 group-hover:opacity-60" />
        
        {/* Tags Cloud - The "Fog" */}
        <div className="absolute inset-0 flex items-center justify-center p-8 z-10 transition-all duration-700 group-hover:opacity-10 group-hover:scale-110 pointer-events-none">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-center">
            {host.tags.map((tag, i) => (
              <span 
                key={tag} 
                className={cn(
                  "font-light text-white tracking-wider mix-blend-overlay",
                  i % 3 === 0 ? "text-2xl opacity-90" : 
                  i % 3 === 1 ? "text-xl opacity-70" : "text-lg opacity-50"
                )}
                style={{
                  textShadow: '0 0 10px rgba(255,255,255,0.3)'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Content: Name & Role */}
        <div className="absolute bottom-0 left-0 w-full p-6 text-white z-20 transition-transform duration-500 group-hover:translate-y-2">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-3xl font-bold tracking-tight">{host.name}</span>
            <ShieldCheck className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-lg font-light opacity-90 text-indigo-200">
            {host.role}
          </div>
        </div>
      </div>
    </Link>
  );
}
