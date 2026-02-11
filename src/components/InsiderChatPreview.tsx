import React from 'react';
import { Globe, Shield, Clock, DollarSign, CheckCircle, AlertTriangle, MessageCircle, MapPin, Star, User, Zap, BookOpen, Smartphone, EyeOff, Bot, Lock } from 'lucide-react';

interface InsiderChatPreviewProps {
  hostName: string;
  country: string;
  tags: string[];
  experience: string;
  images: string[];
  onBroadcast: () => void;
}

export function InsiderChatPreview({
  hostName,
  country,
  tags,
  experience,
  images,
  onBroadcast
}: InsiderChatPreviewProps) {
  // Constants based on business logic (Updated to USD / Daily)
  const GROSS_PRICE_USD = 20.00;
  const PLATFORM_FEE_PERCENT = 0.20;
  
  const platformFee = GROSS_PRICE_USD * PLATFORM_FEE_PERCENT; // $4.00
  const netPayout = GROSS_PRICE_USD - platformFee; // $16.00

  // Mock IDs for Preview (Simulating Database Linkage)
  const productId = `LICS-US-2025-${Math.floor(1000 + Math.random() * 9000)}`;
  const userId = `USR-${Math.floor(10000 + Math.random() * 90000)}`;
  const waId = `WA-LINK-${Math.floor(1000 + Math.random() * 9000)}`;

  const primaryTag = tags[0] || "Local Expert";
  const tagExample1 = tags[1] || "hidden gems";
  const tagExample2 = tags[2] || "local culture";
  
  const productName = `${primaryTag} Insider Chat Support: Daily ${country} Expertise`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header / Context: Product Identity & Linkage */}
      <div className="rounded-xl bg-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Globe className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Bokun Admin View</span>
          </div>
          
          {/* Identity Block */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 rounded bg-slate-800 px-3 py-1.5 border border-slate-700">
               <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">PRODUCT ID</span>
               <span className="font-mono text-sm font-bold text-white tracking-wide">{productId}</span>
            </div>
            <div className="flex items-center gap-2 rounded bg-slate-800 px-3 py-1.5 border border-slate-700" title="Linked User Account">
               <User className="h-3 w-3 text-indigo-400" />
               <span className="font-mono text-xs text-indigo-100">{userId}</span>
            </div>
             <div className="flex items-center gap-2 rounded bg-slate-800 px-3 py-1.5 border border-slate-700" title="WhatsApp Route Active">
               <MessageCircle className="h-3 w-3 text-green-400" />
               <span className="font-mono text-xs text-green-100">{waId}</span>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold leading-tight">{productName}</h2>
        <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
           <span>Daily Rate: <span className="text-white font-semibold">$20.00</span></span>
           <span>•</span>
           <span>Capacity: <span className="text-white font-semibold">Max 70 / Day</span></span>
           <span>•</span>
           <span>Ready for distribution</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Product Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Product Overview */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white mb-4">
              <Star className="h-5 w-5 text-indigo-600" />
              Product Overview
            </h3>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              Unlock the secrets of <strong>{country}</strong> with a dedicated local expert in your pocket. This is a <strong>Daily Pass</strong> access to a Local Insider specializing in <strong>{primaryTag}</strong>. Whether you are looking for <strong>{tagExample1}</strong> or navigating <strong>{tagExample2}</strong>, your Insider provides real-time, high-level consulting via WhatsApp to ensure your day is seamless, authentic, and elite. Buy as many days as you need.
            </p>
          </section>

          {/* 2. What’s Included */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white mb-4">
              <CheckCircle className="h-5 w-5 text-indigo-600" />
              What’s Included (Per Day)
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MessageCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm text-zinc-900 dark:text-white">Unlimited Messaging (12 Hours)</strong>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Reach out via WhatsApp anytime between 8:00 AM - 8:00 PM for advice, translations, or local tips.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <Clock className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm text-zinc-900 dark:text-white">Real-time Dedicated Support</strong>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Enjoy fast response times and deep-dive consulting for your daily itinerary.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm text-zinc-900 dark:text-white">Curated Access</strong>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Receive insider recommendations for hidden spots, private workshops, or exclusive clubs that aren't on Google Maps.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <Shield className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm text-zinc-900 dark:text-white">Safety & Logistics</strong>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Instant "BS-detection" for tourist traps and real-time navigation help for complex local transit.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <BookOpen className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-sm text-zinc-900 dark:text-white">Cultural Context</strong>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Deep insights into local etiquette and history, supported by Tatami Labs video insights.</span>
                </div>
              </li>
            </ul>
          </section>

          {/* 3. Detailed Service Specifications */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
             <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white mb-4">
              <Zap className="h-5 w-5 text-indigo-600" />
              Detailed Service Specifications
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
               <div className="p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Delivery Method</span>
                  <div className="flex items-center gap-2 text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                     <Smartphone className="h-4 w-4 text-indigo-500" />
                     Digital-only via WhatsApp
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">(No physical meeting or transportation)</p>
               </div>
               <div className="p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Daily Capacity</span>
                  <div className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                     Max 70 Travelers / Day
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Strict inventory limit</p>
               </div>
               <div className="p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Response Time</span>
                  <div className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                     Instant / &lt; 15 mins
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">During active hours (8am-8pm)</p>
               </div>
               <div className="p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Language Support</span>
                  <div className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                     Native + English
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Supported by AI translation</p>
               </div>
            </div>
          </section>

          {/* 4. Host's Unique Experience (Dynamic Content) */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white mb-4">
              <User className="h-5 w-5 text-indigo-600" />
              Host's Unique Experience
            </h3>
            
            <div className="mb-6">
               <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">Expert Bio</h4>
               <div className="p-4 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm italic text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                    "{experience || `As a ${primaryTag} in ${country}, I have cultivated a network of... (Host bio placeholder)`}"
                  </p>
               </div>
            </div>

            <div>
               <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">Visuals</h4>
               <div className="grid grid-cols-4 gap-2">
                 {[0, 1, 2, 3].map((i) => (
                   <div key={i} className="aspect-square rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative border border-zinc-200 dark:border-zinc-700">
                     {images[i] ? (
                       <img src={images[i]} alt={`Visual ${i}`} className="h-full w-full object-cover" />
                     ) : (
                       <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-300">
                         <span className="text-xs text-center px-1">High-vibe Image {i+1}</span>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
            </div>
          </section>
          
           {/* 5. Terms & Conditions */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white mb-4">
              <AlertTriangle className="h-5 w-5 text-indigo-600" />
              Terms & Conditions
            </h3>
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
              <li className="flex gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <div>
                  <strong className="text-zinc-900 dark:text-white">Strict No-Meeting Policy:</strong> This is a digital-only consulting service. Any attempt to arrange physical meetings is outside the platform's scope.
                </div>
              </li>
              <li className="flex gap-3">
                 <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <div>
                  <strong className="text-zinc-900 dark:text-white">Non-Refundable:</strong> Once the service is activated on WhatsApp (the first "Welcome" message is sent), the daily fee is non-refundable.
                </div>
              </li>
              <li className="flex gap-3">
                 <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <div>
                  <strong className="text-zinc-900 dark:text-white">Legal Compliance:</strong> No inquiries regarding illegal activities (underground sex industry, illicit substances, etc.) will be answered.
                </div>
              </li>
            </ul>
          </section>

        </div>

        {/* Right Column: Pricing & Action */}
        <div className="space-y-8">
          
          {/* Pricing & Fees (Standardized) */}
          <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
                <DollarSign className="h-5 w-5 text-indigo-600" />
                Pricing & Fees
              </h3>
              <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                <EyeOff className="h-3 w-3" />
                INTERNAL VIEW
              </span>
            </div>
            
            <div className="mb-6 rounded-lg bg-indigo-50 p-4 text-center dark:bg-indigo-900/20">
              <span className="block text-sm text-indigo-600 dark:text-indigo-400 mb-1">Daily Listing Price</span>
              <span className="text-3xl font-black text-indigo-900 dark:text-white">${GROSS_PRICE_USD.toFixed(2)}</span>
              <span className="block text-xs text-indigo-500 mt-1">Inclusive of VAT & Bokun Fees</span>
            </div>

            <div className="space-y-4 text-sm">
               <h4 className="font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">The Breakdown (USD)</h4>
               
              <div className="flex justify-between items-start text-zinc-500">
                <span>Platform & Tech Fee (20%)</span>
                <span>- ${platformFee.toFixed(2)}</span>
              </div>
              <div className="text-xs text-zinc-400 pl-4 -mt-2 mb-2 space-y-1">
                <div className="flex items-start gap-1.5">
                  <Bot className="h-3 w-3 mt-0.5 text-indigo-500 shrink-0" />
                  <span>AI Intermediary Service:</span>
                </div>
                <ul className="list-disc pl-8 space-y-0.5 text-[10px] text-zinc-400/80">
                  <li>Time Control & Auto-Termination</li>
                  <li>End-session reminders</li>
                  <li>Host Privacy Shielding</li>
                  <li>Real-time translation</li>
                </ul>
              </div>
              
              <div className="flex justify-between items-start text-zinc-500">
                 <span>Transaction & Processing</span>
                 <span className="text-xs text-zinc-400 italic">Included</span>
              </div>
               <div className="text-xs text-zinc-400 pl-4 -mt-2 mb-2">
                Bokun transaction fees and local VAT/Consumption Tax.
              </div>
              
              <div className="my-4 border-t border-dashed border-zinc-200 dark:border-zinc-700"></div>
              
              <div className="flex justify-between items-center text-lg font-bold text-emerald-600 dark:text-emerald-400">
                <span>Insider Payout (Net)</span>
                <span>${netPayout.toFixed(2)}</span>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="mt-4 rounded-lg bg-zinc-50 p-3 text-xs text-zinc-500 border border-zinc-100 dark:bg-zinc-800/50 dark:border-zinc-800 relative overflow-hidden">
               {/* Private Badge */}
               <div className="absolute top-0 right-0 rounded-bl-lg bg-rose-100 px-2 py-1 text-[9px] font-bold text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                  PRIVATE • NOT PUBLIC
               </div>

               <div className="flex items-center gap-1.5 mb-1 text-zinc-700 dark:text-zinc-300 font-bold pr-20">
                  <Lock className="h-3 w-3" />
                  <span>Host Privacy Protection</span>
               </div>
               <p className="leading-relaxed">
                  Your personal contact info (Real Name, WhatsApp, Email) is <strong>never revealed</strong> to the guest. All communication is routed through our AI-managed WhatsApp Business API to ensure privacy and boundary control.
               </p>
            </div>

             <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
               <button
                 onClick={onBroadcast}
                 className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
               >
                 <div className="relative z-10 flex items-center justify-center gap-2 font-bold">
                   <Globe className="h-5 w-5 animate-pulse" />
                   Global Broadcast
                 </div>
                 <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
               </button>
               <p className="mt-2 text-center text-[10px] text-zinc-400">
                  Instantly publish to Viator, TripAdvisor, and GetYourGuide.
               </p>
             </div>
          </section>

        </div>
      </div>
    </div>
  );
}
