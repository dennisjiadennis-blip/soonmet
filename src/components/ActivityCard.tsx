import Image from "next/image";
import Link from "next/link";
import { Activity, Host } from "@/lib/data";
import { Coffee, ShoppingBag, MapPin, Camera, Utensils, Footprints, Sparkles, Instagram, Video, Clock, Wallet, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  activity: Activity;
  className?: string;
  showHost?: boolean;
  host?: Host;
  hostAiVibe?: string;
}

const TYPE_ICONS = {
  Coffee: Coffee,
  Shopping: ShoppingBag,
  Art: Camera,
  Food: Utensils,
  Walk: Footprints,
  Other: MapPin,
};

export function ActivityCard({ activity, className, showHost = false, host, hostAiVibe }: ActivityCardProps) {
  const Icon = TYPE_ICONS[activity.type] || MapPin;
  const totalPrice = activity.price + (activity.estimatedExpenseCap || 0);

  return (
    <Link
      href={`/host/${activity.hostId}`}
      className={cn(
        "group flex flex-col gap-3 cursor-pointer p-3 -m-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors",
        className
      )}
    >
      {/* Clean Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={activity.imageUrl}
          alt={activity.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center gap-1.5 z-10">
          <Icon className="h-3.5 w-3.5 text-zinc-900" />
          <span className="text-xs font-medium text-zinc-900">{activity.type}</span>
        </div>

        {/* Zoom Badge (if enabled) */}
        {host?.zoomMeeting && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-indigo-500/90 backdrop-blur-md shadow-sm flex items-center gap-1.5 z-10 text-white">
            <Video className="h-3 w-3" />
            <span className="text-[10px] font-medium">Zoom Avail.</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        {/* Host Info & AI Vibe */}
        {host && (
          <div className="flex items-start gap-3">
            <div className="relative h-10 w-10 flex-shrink-0">
               <Image 
                 src={host.imageUrl} 
                 alt={host.name} 
                 fill 
                 className="rounded-full object-cover border border-zinc-200 dark:border-zinc-700" 
               />
               <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-0.5">
                  <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-0.5 rounded-full">
                    <Instagram className="h-2 w-2 text-white" />
                  </div>
               </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                 <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{host.name}</p>
                 {host.zoomMeeting && (
                    <span className="text-[10px] text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-800">
                      Zoom ¥{host.zoomPrice}
                    </span>
                 )}
              </div>
              
              {/* AI Vibe Snippet */}
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <Sparkles className="h-3 w-3 text-indigo-400 flex-shrink-0" />
                <p className="truncate">
                  {host.instagramAnalysis?.summary || hostAiVibe || "AI Analyzing..."}
                </p>
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="font-medium text-lg text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-indigo-600 transition-colors mb-1">
            {activity.title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3 h-10 leading-relaxed">
            {activity.description}
          </p>
          
          <div className="flex flex-col gap-1.5">
            {/* Location & Duration */}
            <div className="flex items-center gap-3 text-xs text-zinc-500">
               <div className="flex items-center gap-1">
                 <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                 <span className="truncate">{activity.location}</span>
               </div>
               <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-700" />
               <div className="flex items-center gap-1">
                 <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                 <span>{activity.duration}</span>
               </div>
            </div>

            {/* Next Available */}
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded w-fit">
              <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Next: {activity.nextAvailable}</span>
            </div>
          </div>
        </div>
        
        {/* Pricing Breakdown Box */}
        <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-lg p-3 space-y-2">
           <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Host Fee</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-300">¥{activity.price.toLocaleString()}</span>
           </div>
           {activity.estimatedExpenseCap && (
             <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Est. Guest Expense</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-300">¥{activity.estimatedExpenseCap.toLocaleString()}</span>
             </div>
           )}
           <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">Total</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">¥{totalPrice.toLocaleString()}</span>
           </div>
        </div>
      </div>
    </Link>
  );
}
