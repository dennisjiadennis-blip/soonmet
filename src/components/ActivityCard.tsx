import Image from "next/image";
import Link from "next/link";
import { Activity } from "@/lib/data";
import { Coffee, ShoppingBag, MapPin, Camera, Utensils, Footprints, Sparkles, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  activity: Activity;
  className?: string;
  showHost?: boolean;
  hostAiVibe?: string;
}

const TYPE_ICONS = {
  Coffee: Coffee,
  Shopping: ShoppingBag,
  Art: Camera, // Using Camera for Art/Photography
  Food: Utensils,
  Walk: Footprints,
  Other: MapPin,
};

export function ActivityCard({ activity, className, showHost = false, hostAiVibe }: ActivityCardProps) {
  const Icon = TYPE_ICONS[activity.type] || MapPin;

  return (
    <Link
      href={`/host/${activity.hostId}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 shadow-sm transition-all hover:shadow-md hover:-translate-y-1",
        className
      )}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={activity.imageUrl}
          alt={activity.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105"
        />
        {/* Mysterious Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-700 group-hover:opacity-60" />

        <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-800 backdrop-blur-sm flex items-center gap-1 z-20">
          <Icon className="h-3 w-3" />
          {activity.type}
        </div>
        
        {/* AI Vibe */}
        {hostAiVibe && (
          <div className="absolute top-3 right-3 max-w-[60%] z-20">
             <div className="rounded-xl bg-black/40 backdrop-blur-md p-2 flex items-start gap-2 border border-white/10 shadow-sm">
               <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                 <Instagram className="h-3 w-3 text-white" />
               </div>
               <div>
                 <p className="text-[9px] font-bold text-white/80 uppercase tracking-wide">AI Vibe</p>
                 <p className="text-[10px] text-white font-medium line-clamp-2 leading-tight">{hostAiVibe}</p>
               </div>
            </div>
          </div>
        )}

        {/* Tags Cloud - The "Fog" */}
        {activity.tags && activity.tags.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center p-6 z-10 transition-all duration-700 group-hover:opacity-10 group-hover:scale-110 pointer-events-none">
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-center">
              {activity.tags.map((tag, i) => (
                <span 
                  key={tag} 
                  className={cn(
                    "font-light text-white tracking-wider mix-blend-overlay",
                    i % 3 === 0 ? "text-lg opacity-90" : 
                    i % 3 === 1 ? "text-base opacity-70" : "text-sm opacity-50"
                  )}
                  style={{
                    textShadow: '0 0 8px rgba(255,255,255,0.3)'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-1">
          {activity.title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
          {activity.description}
        </p>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>{activity.duration}</span>
          {activity.price && (
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">${activity.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
