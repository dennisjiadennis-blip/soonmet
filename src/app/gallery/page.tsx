/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
// import Image from 'next/image';
import { ItineraryPreview } from "@/components/ItineraryPreview";
import { generateItinerary, GeneratedItinerary, GeneratorInput } from "@/lib/generator";
import { X, MapPin, Star, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BackButton } from "@/components/BackButton";
import { THEME_TAGS } from "@/lib/theme-tags";

interface StoredGuide {
  id: string;
  data?: GeneratorInput;
  generatedResult?: GeneratedItinerary;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function GalleryPage() {
  const { t, language } = useLanguage();
  const [guides, setGuides] = useState<StoredGuide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<GeneratedItinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2994&auto=format&fit=crop", // Tokyo Tower
    "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2787&auto=format&fit=crop", // Cat Street
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop", // Shibuya Crossing
    "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?q=80&w=2884&auto=format&fit=crop", // Lanterns
    "https://images.unsplash.com/photo-1528164344705-4754268798dd?q=80&w=2940&auto=format&fit=crop", // Street Night
    "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=3036&auto=format&fit=crop", // Alley
    "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2940&auto=format&fit=crop", // Cherry Blossoms
    "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=2940&auto=format&fit=crop", // Urban City
  ];

  const getRandomPlaceholder = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % PLACEHOLDER_IMAGES.length;
    return PLACEHOLDER_IMAGES[index];
  };

  useEffect(() => {
    const loadGuides = async () => {
      const saved = localStorage.getItem("my_guides");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Filter out "guide_1" mock if strictly user guides, but user said "All generated guides"
          // We'll process all valid entries
          const processed = await Promise.all(parsed.map(async (g: StoredGuide) => {
            // If already has result, use it
            if (g.generatedResult) return g;
            
            // If has input data but no result, try to regenerate (hydrate)
            if (g.data) {
              try {
                const result = await generateItinerary(g.data);
                return { ...g, generatedResult: result };
              } catch (e) {
                console.error("Failed to hydrate guide", g.id, e);
                return g;
              }
            }
            return g;
          }));
          
          // Only show guides that have a valid generated result
          setGuides(processed.filter((g: StoredGuide) => g.generatedResult));
        } catch (e) {
          console.error("Failed to load guides", e);
        }
      }
      setIsLoading(false);
    };

    loadGuides();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative">
        <BackButton className="absolute top-12 left-4 md:left-8 z-10" />
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            {t("gallery.title") || "Locals Show You Around"}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            {t("gallery.subtitle") || "Explore guides created by our local experts."}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          </div>
        ) : guides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-zinc-100 p-6 dark:bg-zinc-800">
              <MapPin className="h-10 w-10 text-zinc-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {t("gallery.empty") || "No guides yet"}
            </h3>
            <p className="mt-2 text-zinc-500">
              Be the first to create a guide in the Host Center!
            </p>
          </div>
        ) : (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 space-y-6">
            {guides.map((guide) => {
              const data = guide.generatedResult as GeneratedItinerary;
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const hasValidImage = data.route[0]?.imageUrl && !data.route[0]?.imageUrl.includes("unsplash");
              // Use random placeholder if no valid image, otherwise use the existing logic (which might still be a default unsplash link from generator)
              // Actually, generator puts unsplash links too. Let's trust generator's output but if it's missing or empty, use our random one.
              const coverImage = (data.route[0]?.imageUrl && data.route[0].imageUrl.length > 10) 
                ? data.route[0].imageUrl 
                : getRandomPlaceholder(guide.id || data.title.english);
              
              return (
                <div 
                  key={guide.id}
                  onClick={() => setSelectedGuide(data)}
                  className="break-inside-avoid group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                >
                  {/* Cover Image */}
                  <div className="relative w-full overflow-hidden">
                    <img
                      src={coverImage}
                      alt={data.title.english}
                      className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    
                    {/* Host Badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                       <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-zinc-200">
                          {/* Avatar placeholder */}
                          <div className="h-full w-full bg-indigo-500 flex items-center justify-center text-xs text-white font-bold">
                            {data.agentPrompt.match(/Name: (.*?)(\n|$)/)?.[1]?.charAt(0) || "H"}
                          </div>
                       </div>
                       <span className="text-sm font-medium text-white shadow-sm">
                         {data.agentPrompt.match(/Name: (.*?)(\n|$)/)?.[1] || "Local Host"}
                       </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      <Star className="h-3 w-3 fill-current" />
                      <span>Local Experience</span>
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                      {data.title.english}
                    </h3>

                    {/* Host Tags (L3+) */}
                    {data.hostTags && data.hostTags.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {data.hostTags.slice(0, 3).map((tagValue) => {
                          const tagDef = THEME_TAGS.find(t => t.value === tagValue);
                          const displayLabel = tagDef 
                            ? (language === "ja" ? tagDef.label.ja : tagDef.label.en)
                            : tagValue;
                          
                          return (
                            <span 
                              key={tagValue} 
                              className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/20"
                            >
                              #{displayLabel}
                            </span>
                          );
                        })}
                        {data.hostTags.length > 3 && (
                          <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700/20">
                            +{data.hostTags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Price Section */}
                    <div className="flex flex-col gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                      {/* Host Fee */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Host Fee</span>
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          {data.monetization.meetupPrice}
                        </span>
                      </div>
                      
                      {/* Guest Expense */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Est. Guest Expense</span>
                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                          {data.monetization.guestTotalCost}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Screen Modal for Preview */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl dark:bg-zinc-950 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/90 px-6 py-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
              <h2 className="text-lg font-bold truncate pr-4">{selectedGuide.title.english}</h2>
              <button 
                onClick={() => setSelectedGuide(null)}
                className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-0">
               <ItineraryPreview data={selectedGuide} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
