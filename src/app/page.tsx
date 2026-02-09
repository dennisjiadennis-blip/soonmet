"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { ItineraryPreview } from "@/components/ItineraryPreview";
import { generateItinerary, GeneratedItinerary, GeneratorInput } from "@/lib/generator";
import { 
  X, Star, Home as HomeIcon, Wine, Utensils, 
  GripHorizontal, Leaf, ShoppingBag, Search, User, Zap
} from "lucide-react";
import Link from "next/link";

interface StoredGuide {
  id: string;
  data?: GeneratorInput;
  generatedResult?: GeneratedItinerary;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function Home() {
  const [guides, setGuides] = useState<StoredGuide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<GeneratedItinerary | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);

  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Mock data to ensure the "Trending Vibes" section looks populated initially
  const MOCK_GUIDES = [
    {
      id: "mock-1",
      title: "NEON Nights in SHINJUKU (The Insider's Guide)",
      hostName: "Kenji",
      age: "22",
      university: "Waseda Univ.",
      price: "¥1500",
      expense: "¥400",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2994&auto=format&fit=crop",
      tag: "Local Experience"
    },
    {
      id: "mock-2",
      title: "HIDDEN SAKE BAR",
      hostName: "Finn Choon",
      age: "24",
      university: "Univ. of Tokyo",
      price: "¥2000",
      expense: "¥3000",
      image: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?q=80&w=2884&auto=format&fit=crop",
      tag: "Nightlife",
      aiVerified: true
    }
  ];

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
          const processed = await Promise.all(parsed.map(async (g: StoredGuide) => {
            if (g.generatedResult) return g;
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
          setGuides(processed.filter((g: StoredGuide) => g.generatedResult));
        } catch (e) {
          console.error("Failed to load guides", e);
        }
      }
      setIsLoading(false);
    };

    loadGuides();
  }, []);

  const CATEGORIES = [
    { icon: HomeIcon, label: "Home", active: true },
    { icon: Wine, label: "Drink" },
    { icon: Utensils, label: "Food & Drink" },
    { icon: GripHorizontal, label: "Addl" },
    { icon: Leaf, label: "Nature" },
    { icon: ShoppingBag, label: "Shopping" },
    { icon: Search, label: "Hidden Gems" },
    { icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a16] text-white pb-24 overflow-x-hidden font-sans">
      {/* Space Background Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0a16] to-[#0a0a16]"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-900/10 to-transparent"></div>
        {/* Stars/Dust (Simplified with CSS) */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full opacity-50 animate-pulse delay-75"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-red-400 rounded-full opacity-40 animate-pulse delay-150"></div>
      </div>

      <div className="relative z-10 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Text */}
        <div className="text-center mb-10 mt-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] px-4">
            Safe and Fun.
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-red-200/90 px-4 leading-relaxed max-w-3xl mx-auto">
            The World&apos;s First Verified Student-to-Student Social Travel Community.
          </p>
          
          <div className="mt-8 flex justify-center">
            <Link href="/dashboard" className="group relative inline-flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)]">
              <span>Become a Host</span>
              <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Trending Vibes Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-2xl font-bold text-white">Trending Vibes</h2>
            <div className="flex items-center gap-1 bg-cyan-900/30 border border-cyan-500/30 rounded-full px-3 py-1">
              <span className="text-xs font-bold text-cyan-400">AI Picks</span>
            </div>
          </div>

          <div className="flex flex-col gap-0 border border-gray-800 rounded-lg bg-[#0d1117] overflow-hidden">
            {/* Header Row */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-gray-800">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="text-xs font-mono text-gray-500">trending_vibes.json</div>
            </div>

            {/* List Items */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {[...MOCK_GUIDES, ...guides].map((guide: any, idx) => {
              const isReal = !!guide.generatedResult;
              const data = isReal ? (guide.generatedResult as GeneratedItinerary) : null;
              
              const title = isReal ? data!.title.english : guide.title;
              const price = isReal ? data!.monetization.meetupPrice : guide.price;
              // const expense = isReal ? data!.monetization.guestTotalCost : guide.expense;
              const image = isReal 
                ? ((data!.route[0]?.imageUrl && data!.route[0].imageUrl.length > 10) ? data!.route[0].imageUrl : getRandomPlaceholder(guide.id || title))
                : guide.image;
              const hostName = isReal ? (data!.hostProfile?.nickname || data!.hostProfile?.fullName || "Local Host") : guide.hostName;
              const age = isReal ? (data!.hostProfile?.ageRange || "20s") : guide.age;
              const university = isReal ? (data!.hostProfile?.bio?.match(/University|College/i) ? "Univ. Student" : "Tokyo Student") : guide.university; // Mock fallback for real data if missing
              const tag = isReal ? "Local Experience" : guide.tag;

              return (
                <div 
                  key={isReal ? guide.id : `mock-${idx}`}
                  className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 px-4 py-4 border-b border-gray-800 hover:bg-[#161b22] transition-colors last:border-b-0"
                >
                  {/* Thumbnail */}
                  <div 
                    onClick={(e) => { e.stopPropagation(); setExpandedImage(image); }}
                    className="relative flex-none w-16 h-16 rounded border border-gray-700 overflow-hidden cursor-zoom-in group-hover:border-gray-500 transition-colors"
                  >
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => isReal && setSelectedGuide(data)}>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-blue-400 hover:underline truncate">
                        {title}
                      </h3>
                      <span className="flex-none px-2 py-0.5 rounded-full border border-gray-700 text-[10px] font-medium text-gray-400 bg-gray-800/50">
                        {tag}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-mono mt-1.5">
                       <div className="flex items-center gap-1.5 hover:text-gray-300">
                         <User className="w-3 h-3" />
                         <span>{hostName}</span>
                       </div>
                       <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                       <span>{age} y.o.</span>
                       <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                       <div className="flex items-center gap-1.5 hover:text-gray-300">
                         <HomeIcon className="w-3 h-3" />
                         <span>{university}</span>
                       </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex-none flex flex-col items-end pl-4 border-l border-gray-800/50 sm:border-l-0">
                    <div className="text-lg font-bold text-green-400 font-mono tracking-tight">{price}</div>
                    <div className="text-[10px] text-gray-500 font-mono">HOST FEE</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Image Modal */}
          {expandedImage && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
              onClick={() => setExpandedImage(null)}
            >
              <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
                 <img 
                   src={expandedImage} 
                   alt="Expanded view" 
                   className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl ring-1 ring-white/10"
                 />
                 <button 
                   onClick={() => setExpandedImage(null)}
                   className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors"
                 >
                   <X className="w-6 h-6" />
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Explore by Category */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4 px-2">Explore by Category</h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 px-2">
            {CATEGORIES.map((cat, idx) => {
              const content = (
                <>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border backdrop-blur-sm
                    ${cat.active 
                      ? 'bg-red-900/20 border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' 
                      : 'bg-zinc-900/40 border-cyan-900/30 text-cyan-400/70 hover:border-cyan-400/50 hover:text-cyan-400 hover:bg-cyan-900/10'
                    }`}
                  >
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-medium text-center ${cat.active ? 'text-red-500' : 'text-zinc-500 group-hover:text-cyan-400'}`}>
                    {cat.label}
                  </span>
                </>
              );

              if (cat.label === "Profile") {
                return (
                  <Link href="/dashboard" key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                    {content}
                  </Link>
                );
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full Screen Modal for Preview (Keep existing functionality) */}
      {selectedGuide && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-5xl rounded-3xl bg-[#0a0a16] shadow-2xl border border-white/10 overflow-hidden max-h-[90vh] flex flex-col text-zinc-900">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0a0a16]/90 px-6 py-4 backdrop-blur-md">
              <h2 className="text-lg font-bold truncate pr-4 text-white">{selectedGuide.title.english}</h2>
              <button 
                onClick={() => setSelectedGuide(null)}
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-0 bg-zinc-50 dark:bg-zinc-950">
               <ItineraryPreview data={selectedGuide} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
