"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Sparkles, MapPin, User, Calendar, Globe, 
  Zap, CheckCircle2, CreditCard, Clock, ArrowRight, X, Plane, Luggage
} from "lucide-react";
import { Host, HOSTS } from "@/lib/data";
import { fetchTopHosts, getHostAvailability, processTransaction, AvailabilitySlot } from "@/lib/mock-api";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { HostDetailView } from "@/components/HostDetailView";

// --- Types ---
type ChatMode = 'MATCHMAKER' | 'HOST_TWIN';

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  type?: "text" | "host-recommendation" | "schedule-selection" | "payment-confirmation" | "activity-recommendation" | "route-node-card";
  data?: any;
};

// --- Component ---
export function AgentChat() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  // State
  const [mode, setMode] = useState<ChatMode>('MATCHMAKER');
  const [matchCount, setMatchCount] = useState(12840); // Initial pool size
  const [displayedCount, setDisplayedCount] = useState(12840);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      role: "assistant",
      content: "Hi, I'm your AI Travel Agent. Tell me about your hidden interests or what you're looking for in Tokyo.",
      type: "text"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentHost, setCurrentHost] = useState<Host | null>(null);
  const [selectedHostDetail, setSelectedHostDetail] = useState<Host | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [interactionDepth, setInteractionDepth] = useState(0); // Track conversation depth
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Animated Number Logic
  useEffect(() => {
    if (displayedCount === matchCount) return;

    let animationFrameId: number;
    const animate = () => {
      setDisplayedCount(prev => {
        const diff = matchCount - prev;
        if (Math.abs(diff) < 1) return matchCount;
        const step = diff > 0 ? Math.ceil(diff * 0.1) : Math.floor(diff * 0.1);
        return prev + step;
      });
      if (displayedCount !== matchCount) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [matchCount, displayedCount]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, pathname]); // Scroll when changing pages too

  // --- Handlers ---

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // MODE A: MATCHMAKER
    if (mode === 'MATCHMAKER') {
      // 0. Check for Direct Host Mention (e.g., "Hi Saki")
      const lowerInput = userMsg.content.toLowerCase();
      const directMatch = HOSTS.find(h => {
        const nameParts = h.name.toLowerCase().split(' ');
        return nameParts.some(part => part.length > 2 && lowerInput.includes(part));
      });

      if (directMatch) {
        // Direct Connection Logic
        await new Promise(resolve => setTimeout(resolve, 600)); // Brief thinking pause
        setIsTyping(false);

        const bridgeMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `I see you are looking for ${directMatch.name}. Connecting you to her digital twin directly...`,
          type: "text"
        };
        setMessages(prev => [...prev, bridgeMsg]);

        setTimeout(() => {
          handleStartChatWithHost(directMatch);
        }, 1500);
        
        return;
      }

      try {
        // Step 1: Simulate narrowing down
        setMatchCount(prev => Math.floor(prev * 0.1)); // Reduce by 90%
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use new Search Logic (Route-Centric)
        const { searchActivities } = await import('@/lib/mock-api');
        const activityResults = await searchActivities(userMsg.content);
        
        setIsTyping(false);
        
        if (activityResults.length > 0) {
          const topResult = activityResults[0];
          setMatchCount(activityResults.length);

          let content = `I found a unique experience that matches your vibe: "${topResult.activity.title}".`;
          
          if (topResult.matchedNode) {
            content = `I found a specific spot that matches your request: "${topResult.matchedNode.locationName}" inside ${topResult.host.name}'s route.`;
          }

          const responseMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: content,
            type: "activity-recommendation",
            data: { activity: topResult.activity, matchedNode: topResult.matchedNode }
          };
          setMessages(prev => [...prev, responseMsg]);
        } else {
           // Fallback to Host Search
           const hosts = await fetchTopHosts(userMsg.content);
           setMatchCount(hosts.length);

          const responseMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `Based on your interest in "${userMsg.content}", I've narrowed it down to ${hosts.length} insiders who match your vibe.`,
            type: "host-recommendation",
            data: { hosts }
          };
          setMessages(prev => [...prev, responseMsg]);
        }
      } catch (error) {
        setIsTyping(false);
      }
    } 
    // MODE B: HOST TWIN
    else if (mode === 'HOST_TWIN' && currentHost) {
      setInteractionDepth(prev => prev + 1); // Increment depth

      // Simulate Twin Logic
      setTimeout(() => {
        setIsTyping(false);
        
        const userText = userMsg.content.toLowerCase();
        
        // 1. Check for Route/Location Context Injection
        // Logic: If user mentions keywords related to a route node, inject that node's context
        let contextInjectionMsg: Message | null = null;
        
        // Scan current host's activities and nodes
        currentHost.activities.forEach(act => {
          act.routeNodes?.forEach(node => {
            if (
              (userText.includes(node.locationName.toLowerCase()) || 
               userText.includes('place') || 
               userText.includes('spot')) &&
               !userText.includes('book') // Avoid conflict with booking flow
            ) {
               // Found a relevant node context
               contextInjectionMsg = {
                 id: (Date.now() + 50).toString(),
                 role: "assistant",
                 content: node.description,
                 type: "route-node-card",
                 data: { node }
               };
            }
          });
        });

        // Check for strong intent or sufficient depth
        const hasIntent = userText.includes('book') || 
                          userText.includes('schedule') || 
                          userText.includes('price') || 
                          userText.includes('cost') ||
                          userText.includes('time') ||
                          userText.includes('meet');

        const shouldConvert = interactionDepth >= 3 || hasIntent;

        if (shouldConvert) {
           const replyMsg: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: `(Smiling) I feel we have a shared understanding now. If you are ready to make this real, shall we look at the calendar?`,
            type: "schedule-selection"
          };
          setMessages(prev => [...prev, replyMsg]);
        } else if (contextInjectionMsg) {
          // Inject Context Card first
           setMessages(prev => [...prev, contextInjectionMsg!]);
        } else {
          // Normal Twin Chat
           const replyMsg: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: `That's an interesting perspective. ${currentHost.name} often says: "${currentHost.stories.substring(0, 50)}..."`,
            type: "text"
          };
          setMessages(prev => [...prev, replyMsg]);
        }
      }, 1500);
    }
  };

  const handleStartChatWithHost = (host: Host) => {
    setSelectedHostDetail(null); // Close overlay if open
    setCurrentHost(host);
    setMode('HOST_TWIN');
    setInteractionDepth(0); // Reset depth
    
    // Inject Context Animation
    setMessages(prev => [
      ...prev,
      {
        id: `sys-switch-${Date.now()}`,
        role: "system",
        content: `Switching to Host Twin Mode... Loading ${host.name}'s personality matrix...`
      }
    ]);

    setTimeout(() => {
      // Twin Intro - Soft Opening
      const randomVibe = host.dailyVibe 
        ? host.dailyVibe[Math.floor(Math.random() * host.dailyVibe.length)] 
        : "taking a quiet walk";
        
      const introMsg: Message = {
        id: `twin-intro-${Date.now()}`,
        role: "assistant",
        content: `(Softly) Hello there. I am ${host.name}'s digital twin. \n\n${host.name} is currently ${randomVibe}. She just shared a thought with me about "${host.offerTitle || "her current project"}". \n\nShe asked me to see if you share this specific obsession. ${host.expectations || "What brings you here?"}`
      };
      setMessages(prev => [...prev, introMsg]);
      
      // Removed router.push to keep user in the chat interface
    }, 2000);
  };

  const handleSelectHost = (host: Host) => {
    // Just open the detail overlay
    setSelectedHostDetail(host);
  };

  const handleSlotSelect = async (slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
    
    // Show Payment UI
    setMessages(prev => [...prev, {
      id: `payment-req-${Date.now()}`,
      role: "assistant",
      content: "Great choice. Here is the booking summary.",
      type: "payment-confirmation",
      data: { slot, host: currentHost }
    }]);
  };

  const handlePayment = async () => {
    if (!currentHost || !selectedSlot) return;
    
    setMessages(prev => [...prev, {
      id: `processing-${Date.now()}`,
      role: "system",
      content: "Processing payment..."
    }]);

    await processTransaction(currentHost.id, "visitor-1", currentHost.price, selectedSlot.id);

    // Get the first route node for the map link (if available)
    const firstRouteNode = currentHost.activities[0]?.routeNodes?.[0];
    const mapLink = firstRouteNode?.googleMapLink || "https://maps.google.com";
    const locationName = firstRouteNode?.locationName || "Meeting Point";

    // 1. Visitor Confirmation Card
    setMessages(prev => [...prev, {
      id: `confirmed-${Date.now()}`,
      role: "assistant",
      content: `Booking Confirmed! You are meeting ${currentHost.name} on ${selectedSlot.date} at ${selectedSlot.time}. \n\n${
        currentHost.activities[0]?.type === 'Walk' || currentHost.activities[0]?.type === 'Food' || currentHost.activities[0]?.type === 'Shopping'
          ? `📍 Meeting Point: ${locationName} \nGoogle Map: ${mapLink} \n\nDetailed itinerary has been sent to your email.`
          : "📹 Zoom Link: A secure link has been generated. Please prepare your AI Translation Earbuds."
      }`,
      type: "text"
    }]);

    // 2. Simulated Host Summary (Backend Logic)
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: `host-summary-${Date.now()}`,
            role: "system",
            content: `[Backend] Order Summary Generated for Host: \n"Visitor booked 'Shinjuku Visual Walk'. Interest Trigger: ${firstRouteNode?.localAppeal ? 'Private/Scarcity Factor (' + firstRouteNode.localAppeal.substring(0, 15) + '...)' : 'General Interest'}. Availability Slot Locked."`
        }]);
    }, 1000);
  };

  const handleExitTwin = () => {
    setMode('MATCHMAKER');
    setCurrentHost(null);
    setMatchCount(12840); // Reset count
    setMessages(prev => [...prev, {
      id: `reset-${Date.now()}`,
      role: "system",
      content: "Returning to Agent Matchmaker mode."
    }]);
    router.push('/');
  };

  // --- Renderers ---

  const getNumberColor = (count: number) => {
    if (count > 1000) return "text-white";
    if (count > 100) return "text-indigo-400";
    if (count > 10) return "text-purple-400";
    return "text-green-400";
  };

  // Conditional Layout Logic
  const containerClasses = isHome 
    ? "fixed inset-0 z-30 flex flex-col items-center justify-center pointer-events-none" // Home: Full screen, no padding
    : "fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-end pointer-events-none transition-all duration-500";

  const chatBoxClasses = isHome
    ? "flex flex-col w-full max-w-4xl h-full relative overflow-hidden bg-transparent rounded-none md:rounded-3xl pointer-events-auto transition-opacity duration-500"
    : "flex flex-col w-full max-w-4xl max-h-[60vh] relative overflow-hidden pointer-events-auto transition-opacity duration-500";

  const chatAreaClasses = isHome
    ? "relative z-10 flex-1 overflow-y-auto p-4 pt-20 space-y-6"
    : "relative z-10 flex-1 overflow-y-auto p-4 space-y-4 mask-image-linear-gradient-to-t bg-gradient-to-t from-black/90 via-black/80 to-transparent";

  // Only render AgentChat on the Home page to prevent UI overlap on Dashboard/Host pages
  if (!isHome) return null;

  return (
    <div className={containerClasses}>
      
      {/* Host Detail Overlay - Portaled to Body to cover everything */}
      <Portal>
        <AnimatePresence>
          {selectedHostDetail && (
            <motion.div 
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[100] bg-[#0f172a] overflow-hidden pointer-events-auto"
            >
              <HostDetailView 
                host={selectedHostDetail} 
                onClose={() => setSelectedHostDetail(null)}
                onChatStart={() => handleStartChatWithHost(selectedHostDetail)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>

      {/* Chat Box Wrapper */}
      <div className={`${chatBoxClasses} ${selectedHostDetail ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Water Effect Background Layer */}
        {isHome && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 water-caustics opacity-40" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 water-ripple" style={{ animationDelay: '0s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 water-ripple" style={{ animationDelay: '2s' }} />
          </div>
        )}
        
        {/* 2. Chat Area */}
        <div className={chatAreaClasses} ref={scrollRef}>
          
          {/* Header moved inside Scrollable Area */}
          {(isHome || mode === 'HOST_TWIN') && (
            <div className={`relative z-10 p-4 mb-4 border-b transition-colors duration-500 flex items-center justify-between backdrop-blur-xl rounded-t-3xl ${
              mode === 'HOST_TWIN' ? 'bg-indigo-900/40 border-indigo-500/30' : 'bg-transparent border-white/5'
            } ${!isHome ? 'shadow-lg' : ''}`}>
              <div className="flex items-center gap-3">
                {mode === 'MATCHMAKER' ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                       <Image src={currentHost?.imageUrl || ""} alt="Host" width={40} height={40} className="object-cover w-full h-full" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
                  </div>
                )}
                
                <div>
                  <h2 className="font-bold text-white text-lg leading-tight flex items-center gap-2">
                    {mode === 'MATCHMAKER' ? (
                      <>
                        <span>AI Travel Matchmaker</span>
                        <span className="text-sm font-normal text-indigo-200 italic">find a local friend</span>
                      </>
                    ) : (
                      `${currentHost?.name} (AI Twin)`
                    )}
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                    {mode === 'MATCHMAKER' ? 'Mode A: Discovery' : 'Mode B: Deep Talk'}
                  </p>
                </div>
              </div>

              {mode === 'HOST_TWIN' && (
                <button 
                  onClick={handleExitTwin}
                  className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Explore Banner - Integrated into Flow */}
          {mode === 'MATCHMAKER' && (
             <div className="w-full max-w-lg mx-auto mb-6 relative z-20 animate-in fade-in slide-in-from-top-4 duration-700">
               <div className="relative group cursor-pointer">
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-80 transition duration-500" />
                 <Link 
                   href="/search"
                   className="relative flex items-center justify-between bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-full shadow-lg transition-all hover:scale-[1.02] overflow-hidden"
                 >
                   <div className="flex items-center gap-3">
                     <div className="p-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-sm">
                       <Sparkles className="w-3 h-3 text-white" />
                     </div>
                     <div className="flex flex-col items-start">
                       <span className="text-sm font-bold text-white leading-tight">Exp Local with Locals</span>
                       <span className="text-[10px] text-zinc-400 leading-tight">Browse 10,000+ local experiences</span>
                     </div>
                   </div>
                   <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                 </Link>
               </div>
             </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Message Bubble */}
                <div className={`max-w-[85%] ${msg.role === 'system' ? 'w-full flex justify-center' : ''}`}>
                  
                  {msg.role === 'system' && (
                    <div className="text-xs text-indigo-400 font-mono py-2 flex items-center gap-2 bg-black/30 px-3 rounded-full border border-indigo-500/20">
                      <Zap className="w-3 h-3 animate-pulse" />
                      {msg.content}
                    </div>
                  )}

                  {msg.role !== 'system' && (
                    <div className={`p-4 rounded-2xl whitespace-pre-wrap relative z-20 shadow-lg backdrop-blur-md border border-white/20 text-white bg-transparent ${
                      msg.role === 'user' 
                        ? 'rounded-br-none' 
                        : 'rounded-bl-none'
                    }`}>
                      {msg.content}
                    </div>
                  )}

                  {/* Custom Card: Host Recommendation with Humorous Animation */}
                  {msg.type === 'host-recommendation' && msg.data?.hosts && (
                    <motion.div 
                      initial={{ scale: 0.8, y: 50 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="mt-4 relative z-20"
                    >
                      {/* Humorous Float Icon */}
                      <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 z-30 whitespace-nowrap"
                      >
                        <Plane className="w-3 h-3" />
                        Pack your bags!
                      </motion.div>

                      <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
                        {msg.data.hosts.slice(0, 3).map((host: Host) => (
                          <div 
                            key={host.id} 
                            onClick={() => handleSelectHost(host)}
                            className="w-full bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-full p-2 pr-6 flex gap-4 items-center hover:bg-zinc-800/80 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all cursor-pointer group"
                          >
                            {/* Elliptical Card: Avatar */}
                            <div className="w-14 h-14 relative shrink-0 rounded-full overflow-hidden border-2 border-zinc-700 group-hover:border-indigo-400 transition-colors">
                              <Image src={host.imageUrl} alt={host.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            
                            {/* Elliptical Card: Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-white text-base truncate">{host.name}</h3>
                                <span className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] text-zinc-300 uppercase tracking-wider font-medium">
                                  {host.nationality}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400 truncate mt-0.5 font-medium">
                                {host.role}
                              </p>
                            </div>
                            
                            {/* Elliptical Card: Price */}
                            <div className="text-right shrink-0 pl-2 border-l border-white/10">
                              <div className="text-sm font-bold text-emerald-400 font-mono">¥{host.price}</div>
                              <div className="text-[9px] text-zinc-500 uppercase tracking-wider">/session</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Custom Card: Activity Recommendation */}
                  {msg.type === 'activity-recommendation' && msg.data?.activity && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mt-4 relative z-20 w-full max-w-sm"
                    >
                      <div 
                        onClick={() => {
                          const host = HOSTS.find(h => h.id === msg.data.activity.hostId);
                          if (host) handleSelectHost(host);
                        }}
                        className="w-full aspect-square bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col justify-between hover:bg-white/10 hover:border-indigo-500/30 transition-all cursor-pointer group relative overflow-hidden"
                      >
                        {/* Background Image (Optional/Subtle) */}
                        {msg.data.activity.imageUrl && (
                          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                            <Image src={msg.data.activity.imageUrl} alt={msg.data.activity.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                          </div>
                        )}

                        <div className="relative z-10 flex justify-between items-start">
                          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10">
                            {msg.data.activity.type}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                            <ArrowRight className="w-4 h-4 text-white -rotate-45 group-hover:rotate-0 transition-transform" />
                          </div>
                        </div>

                        <div className="relative z-10">
                          <h3 className="text-2xl font-bold text-white leading-tight mb-2 line-clamp-3">
                            {msg.data.activity.title}
                          </h3>
                          {msg.data.matchedNode && (
                             <div className="mb-2 px-2 py-1 bg-indigo-500/20 rounded border-l-2 border-indigo-400 text-xs text-indigo-200">
                               Featured Spot: {msg.data.matchedNode.locationName}
                             </div>
                          )}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                             <div className="flex flex-col">
                               <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium uppercase tracking-wider">
                                 <Clock className="w-3 h-3" />
                                 {msg.data.activity.duration}
                               </div>
                               {msg.data.activity.estimatedExpenseCap && (
                                  <span className="text-[10px] text-zinc-500 mt-0.5">
                                    + Est. expenses ~¥{msg.data.activity.estimatedExpenseCap}
                                  </span>
                               )}
                             </div>
                             <div className="text-right">
                               <div className="text-emerald-400 font-bold font-mono">
                                 ¥{msg.data.activity.price || 'Free'}
                               </div>
                               {msg.data.activity.pricePerHour && (
                                 <div className="text-[9px] text-zinc-500 uppercase tracking-wider">
                                   ¥{msg.data.activity.pricePerHour}/hr
                                 </div>
                               )}
                             </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Custom Card: Route Node Card (Context Injection) */}
                  {msg.type === 'route-node-card' && msg.data?.node && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0, x: -20 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      className="mt-2 mb-2 relative z-20 w-full max-w-[85%]"
                    >
                      <div className="flex gap-3 bg-zinc-900/80 backdrop-blur-md border border-indigo-500/30 rounded-xl p-3 shadow-lg">
                        {/* Small Map/Image Preview */}
                        <div className="w-20 h-20 shrink-0 relative rounded-lg overflow-hidden bg-zinc-800">
                           {msg.data.node.imageUrl ? (
                             <Image src={msg.data.node.imageUrl} alt={msg.data.node.locationName} fill className="object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-zinc-600">
                               <MapPin className="w-6 h-6" />
                             </div>
                           )}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-white text-sm truncate">{msg.data.node.locationName}</h4>
                            <span className="text-[10px] text-zinc-400 font-mono bg-zinc-800 px-1.5 py-0.5 rounded">
                              {msg.data.node.startTime} - {msg.data.node.endTime}
                            </span>
                          </div>
                          
                          <p className="text-xs text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                            {msg.data.node.localAppeal || msg.data.node.description}
                          </p>

                          {msg.data.node.googleMapLink && (
                            <a 
                              href={msg.data.node.googleMapLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-indigo-400 mt-2 hover:text-indigo-300 transition-colors"
                            >
                              <MapPin className="w-3 h-3" />
                              View on Google Maps
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}


                  {/* Custom Card: Schedule Selection */}
                  {msg.type === 'schedule-selection' && (
                    <SchedulePicker hostId={currentHost?.id || ""} onSelect={handleSlotSelect} />
                  )}

                  {/* Custom Card: Payment */}
                  {msg.type === 'payment-confirmation' && msg.data && (
                    <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm relative z-20">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 relative overflow-hidden">
                          <Image src={msg.data.host.imageUrl} alt="Host" fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">Booking with {msg.data.host.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                            <Clock className="w-3 h-3" />
                            {msg.data.slot.date} @ {msg.data.slot.time}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm text-zinc-400">
                          <span>Session Fee ({msg.data.host.activities[0]?.duration || 'Session'})</span>
                          <span>¥{msg.data.host.price}</span>
                        </div>
                        {msg.data.host.activities[0]?.pricePerHour && (
                          <div className="flex justify-end text-[10px] text-zinc-500 -mt-2 mb-2">
                            (¥{msg.data.host.activities[0].pricePerHour}/hr)
                          </div>
                        )}
                        <div className="flex justify-between text-sm text-zinc-400">
                          <span>Service Fee</span>
                          <span>¥500</span>
                        </div>
                        <div className="pt-3 border-t border-zinc-800 flex justify-between font-bold text-white">
                          <span>Total</span>
                          <span>¥{msg.data.host.price + 500}</span>
                        </div>
                        {msg.data.host.activities[0]?.estimatedExpenseCap && (
                          <div className="mt-2 p-2 bg-zinc-800/50 rounded text-xs text-zinc-400 border border-zinc-700/50">
                            <span className="text-yellow-500 font-bold">Note:</span> Food & entry fees are paid by you (est. cap ¥{msg.data.host.activities[0].estimatedExpenseCap}).
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={handlePayment}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                      >
                        <CreditCard className="w-4 h-4" />
                        Confirm & Pay
                      </button>
                    </div>
                  )}

                </div>
              </motion.div>
            ))}
            
            {isTyping && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start w-full">
                 <div className="bg-zinc-800/50 rounded-2xl px-4 py-3 flex gap-1 backdrop-blur-sm">
                   <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                   <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-100" />
                   <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-200" />
                 </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Bottom Stack (Big Number + Input) */}
        <div className={`flex flex-col ${!isHome ? 'rounded-t-none' : 'rounded-b-3xl'}`}>
          
          {/* BIG NUMBER DISPLAY (Moved here - Stacked above input) */}
          {mode === 'MATCHMAKER' && isHome && (
             <div className="w-full flex flex-col items-center justify-center pt-2 pb-1 pointer-events-none">
               <div className={`text-4xl md:text-5xl font-black leading-none tracking-tighter transition-colors duration-500 drop-shadow-2xl ${getNumberColor(displayedCount)}`}>
                 {displayedCount}
               </div>
               <p className="text-zinc-500 text-[9px] font-mono tracking-[0.2em] uppercase mt-0.5">
                 Active Locals
               </p>
             </div>
          )}

          <div className="p-4 pt-2">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={mode === 'MATCHMAKER' ? "Describe your ideal experience..." : `Chat with ${currentHost?.name}...`}
                className="w-full bg-zinc-900/80 backdrop-blur-xl border-2 border-orange-400 text-white rounded-full pl-8 pr-16 py-4 text-lg shadow-2xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-300 transition-all placeholder:text-zinc-500"
                autoFocus
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="absolute right-2 p-2 bg-orange-600 text-white rounded-lg disabled:opacity-50 hover:bg-orange-500 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function SchedulePicker({ hostId, onSelect }: { hostId: string, onSelect: (slot: AvailabilitySlot) => void }) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHostAvailability(hostId).then(data => {
      setSlots(data);
      setLoading(false);
    });
  }, [hostId]);

  if (loading) return <div className="text-zinc-500 text-sm animate-pulse">Checking calendar...</div>;

  return (
    <div className="mt-4 grid grid-cols-3 gap-2 w-full max-w-md relative z-20">
      {slots.map(slot => (
        <button
          key={slot.id}
          disabled={slot.isBooked}
          onClick={() => onSelect(slot)}
          className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
            slot.isBooked 
              ? 'bg-zinc-800/50 border-transparent text-zinc-600 cursor-not-allowed decoration-zinc-600 line-through' 
              : 'bg-zinc-800 border-zinc-700 text-white hover:bg-indigo-600 hover:border-indigo-500'
          }`}
        >
          {slot.date.slice(5)} <br/> {slot.time}
        </button>
      ))}
    </div>
  );
}

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
};
