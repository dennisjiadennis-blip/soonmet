import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles, MapPin, Heart, RefreshCw, Headphones, Zap, Users, X, MessageCircle, Clock, User, Star, Share, ChevronDown, Check } from "lucide-react";
import { BookingButton } from "@/components/BookingButton";
import { Host, Activity } from "@/lib/data";

interface HostDetailViewProps {
  host: Host;
  onClose?: () => void;
  onChatStart?: () => void;
}

export function HostDetailView({ host, onClose, onChatStart }: HostDetailViewProps) {
  // Use the first activity as the main focus for this view, or aggregate if needed.
  // For Airbnb style, we usually focus on one "Experience".
  const mainActivity = host.activities[0];
  const productTitle = mainActivity?.title || host.productTitle || `${host.name}: ${host.role}`;
  const galleryPhotos = host.photos && host.photos.length > 0 ? host.photos : [host.imageUrl];
  // Ensure we have at least 5 photos for the grid if possible, or repeat/fallback
  const displayPhotos = [...galleryPhotos, mainActivity?.imageUrl].filter(Boolean).slice(0, 5);
  
  const hostTags = host.hostTags || host.tags.slice(0, 3);
  const guestTags = host.guestTags || ["Open Minded", "Curious"];

  const handleBack = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleChatStart = () => {
    if (onChatStart) {
      onChatStart();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div className="h-screen w-full flex flex-col relative bg-white dark:bg-zinc-950 overflow-hidden animate-in fade-in duration-500">
      
      {/* 1. Navigation (Sticky Top) */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          {onClose ? (
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
            </button>
          ) : (
            <Link href="/" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
            </Link>
          )}
          {/* Mobile Title (Hidden on desktop if desired, or shown on scroll) */}
          <span className="font-semibold text-sm hidden md:block text-zinc-900 dark:text-zinc-100 truncate max-w-xs">
            {productTitle}
          </span>
        </div>

        <div className="flex gap-3">
          <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-600 dark:text-zinc-400">
            <Share className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-600 dark:text-zinc-400">
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* 2. Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
          
          {/* Header Section */}
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 leading-tight">
              {productTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
               <div className="flex items-center gap-1">
                 <Star className="h-4 w-4 fill-zinc-900 text-zinc-900 dark:fill-zinc-100 dark:text-zinc-100" />
                 <span className="font-medium text-zinc-900 dark:text-zinc-100">4.96</span>
                 <span className="text-zinc-400">·</span>
                 <span className="underline decoration-zinc-300 underline-offset-2">128 reviews</span>
               </div>
               <span className="hidden sm:inline">·</span>
               <div className="flex items-center gap-1">
                 <MapPin className="h-4 w-4" />
                 <span className="underline decoration-zinc-300 underline-offset-2">{mainActivity?.location || "Tokyo, Japan"}</span>
               </div>
            </div>
          </header>

          {/* Photo Grid (Airbnb Style) */}
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-10 relative group">
            {/* Main Image (Large) */}
            <div className="col-span-2 row-span-2 relative bg-zinc-100 dark:bg-zinc-800">
               {displayPhotos[0] && (
                 <Image 
                   src={displayPhotos[0]} 
                   alt="Main view" 
                   fill 
                   className="object-cover hover:scale-105 transition-transform duration-700"
                 />
               )}
            </div>
            
            {/* Secondary Images */}
            <div className="hidden md:block relative bg-zinc-100 dark:bg-zinc-800">
              {displayPhotos[1] && <Image src={displayPhotos[1]} alt="View 2" fill className="object-cover hover:scale-105 transition-transform duration-700" />}
            </div>
            <div className="hidden md:block relative bg-zinc-100 dark:bg-zinc-800 rounded-tr-xl">
              {displayPhotos[2] && <Image src={displayPhotos[2]} alt="View 3" fill className="object-cover hover:scale-105 transition-transform duration-700" />}
            </div>
            <div className="hidden md:block relative bg-zinc-100 dark:bg-zinc-800">
              {displayPhotos[3] && <Image src={displayPhotos[3]} alt="View 4" fill className="object-cover hover:scale-105 transition-transform duration-700" />}
            </div>
            <div className="hidden md:block relative bg-zinc-100 dark:bg-zinc-800 rounded-br-xl">
              {displayPhotos[4] && <Image src={displayPhotos[4]} alt="View 5" fill className="object-cover hover:scale-105 transition-transform duration-700" />}
              
              <button className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-center gap-2 hover:scale-105 transition-transform">
                <Sparkles className="h-3 w-3" />
                Show all photos
              </button>
            </div>
          </div>

          {/* Main Content Layout: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 relative">
            
            {/* LEFT COLUMN: Experience Details */}
            <div className="space-y-10">
              
              {/* Host Intro */}
              <div className="flex items-start justify-between pb-8 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    Hosted by {host.name}
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">
                    {host.role} · {host.nationality}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {hostTags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-md font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative h-14 w-14 md:h-16 md:w-16 flex-shrink-0">
                  <Image 
                    src={host.imageUrl} 
                    alt={host.name} 
                    fill 
                    className="rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-950 p-1 rounded-full">
                     <ShieldCheck className="h-4 w-4 text-indigo-500 fill-indigo-100 dark:fill-indigo-900/30" />
                  </div>
                </div>
              </div>

              {/* What you'll do (Timeline) */}
              <div className="pb-8 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
                  What you'll do
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-8">
                  {mainActivity?.description || host.offerDescription}
                </p>

                {mainActivity?.routeNodes && (
                  <div className="space-y-8 relative pl-4">
                    {/* Vertical connecting line */}
                    <div className="absolute left-[54px] top-4 bottom-4 w-px bg-zinc-200 dark:bg-zinc-800" />
                    
                    {mainActivity.routeNodes.map((node, idx) => (
                      <div key={idx} className="relative flex gap-6 group">
                        {/* Image/Icon Node */}
                        <div className="relative z-10 flex-shrink-0">
                           <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-4 border-white dark:border-zinc-950 shadow-sm">
                             {node.imageUrl ? (
                               <Image src={node.imageUrl} alt={node.locationName} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                 <MapPin className="h-8 w-8" />
                               </div>
                             )}
                           </div>
                           <div className="absolute -top-2 -right-2 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800 rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                             {idx + 1}
                           </div>
                        </div>

                        {/* Content */}
                        <div className="py-1">
                          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg mb-1">
                            {node.locationName}
                          </h4>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 font-medium">
                            {node.startTime} - {node.endTime}
                          </p>
                          <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                            {node.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Host Message/Vibe */}
              <div className="pb-8 border-b border-zinc-100 dark:border-zinc-800">
                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      Why I host this
                    </h3>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-300 italic leading-relaxed">
                    &quot;{host.stories || host.expectations}&quot;
                  </p>
                  
                  {host.instagramAnalysis?.summary && (
                    <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                       <div className="flex items-center gap-2 mb-2">
                         <div className="text-xs font-bold px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded">
                           AI Insight
                         </div>
                         <span className="text-xs text-zinc-400 uppercase tracking-wider">Based on Instagram Analysis</span>
                       </div>
                       <p className="text-sm text-zinc-500 dark:text-zinc-400">
                         {host.instagramAnalysis.summary}
                       </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              {host.reviews && host.reviews.length > 0 && (
                <div className="pb-8 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 mb-6">
                    <Star className="h-5 w-5 fill-zinc-900 text-zinc-900 dark:fill-zinc-100 dark:text-zinc-100" />
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {host.reviews.length} reviews
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {host.reviews.map((review) => (
                      <div key={review.id} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 flex-shrink-0">
                            <Image 
                              src={review.authorAvatar} 
                              alt={review.authorName} 
                              fill 
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                              {review.authorName}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                              {review.date}
                            </div>
                          </div>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Sticky Booking Widget */}
            <div className="relative">
              <div className="sticky top-24">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none p-6 space-y-6">
                  
                  {/* Price Header */}
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">¥{host.price.toLocaleString()}</span>
                      <span className="text-zinc-500 text-sm"> / person</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-zinc-500">
                       <Star className="h-3 w-3 fill-zinc-900 text-zinc-900 dark:fill-zinc-100 dark:text-zinc-100" />
                       <span className="text-zinc-900 dark:text-zinc-100">4.96</span>
                       <span>(128)</span>
                    </div>
                  </div>

                  {/* Date Selector (Mock) */}
                  <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-zinc-700 border-b border-zinc-200 dark:border-zinc-700">
                      <div className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
                        <span className="block text-[10px] uppercase font-bold text-zinc-400">Date</span>
                        <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                           {mainActivity?.nextAvailable || "Add dates"}
                        </span>
                      </div>
                      <div className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors">
                        <span className="block text-[10px] uppercase font-bold text-zinc-400">Time</span>
                        <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                           {mainActivity?.duration || "2 Hours"}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors flex items-center justify-between">
                       <div>
                         <span className="block text-[10px] uppercase font-bold text-zinc-400">Guests</span>
                         <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">1 guest</span>
                       </div>
                       <ChevronDown className="h-4 w-4 text-zinc-400" />
                    </div>
                  </div>

                  {/* CTA Button */}
                  <BookingButton host={host} className="w-full py-3 text-base" />

                  {/* Price Breakdown */}
                  <div className="space-y-3 pt-2">
                     <div className="flex items-center justify-between text-sm text-zinc-500">
                       <span className="underline decoration-zinc-300">Host Fee</span>
                       <span>¥{host.price.toLocaleString()}</span>
                     </div>
                     {mainActivity?.estimatedExpenseCap && (
                       <div className="flex items-center justify-between text-sm text-zinc-500">
                         <span className="underline decoration-zinc-300">Est. Expenses</span>
                         <span>¥{mainActivity.estimatedExpenseCap.toLocaleString()}</span>
                       </div>
                     )}
                     <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3 flex items-center justify-between font-bold text-zinc-900 dark:text-zinc-100">
                        <span>Total (Est.)</span>
                        <span>¥{((host.price || 0) + (mainActivity?.estimatedExpenseCap || 0)).toLocaleString()}</span>
                     </div>
                  </div>

                  {/* Chat Option */}
                  {onChatStart && (
                    <button 
                      onClick={handleChatStart}
                      className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat with {host.name}
                    </button>
                  )}
                  
                  <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 font-medium pt-2">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Free cancellation up to 24h before</span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}