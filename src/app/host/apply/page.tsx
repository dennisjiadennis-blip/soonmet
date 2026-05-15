"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MapPin, User, CheckCircle, Instagram, Sparkles, MessageSquare, Video, Wallet, ArrowRight, Coffee, ShoppingBag, Utensils, Footprints, Plus, Trash2, Clock, Image as ImageIcon } from "lucide-react";

export default function BecomeHostPage() {
  const router = useRouter();
  const { isLoggedIn, setShowLoginModal } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Auth Check
  useEffect(() => {
    // Small delay to allow hydration
    const timer = setTimeout(() => {
      if (!isLoggedIn) {
        setShowLoginModal(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [isLoggedIn, setShowLoginModal]);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // AI Copilot State
  const [activeField, setActiveField] = useState<string>("default");
  
  // Instagram & AI State
  const [isConnectingInsta, setIsConnectingInsta] = useState(false);
  const [instaConnected, setInstaConnected] = useState(false);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [showFollowCheck, setShowFollowCheck] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<null | {
    summary: string;
    strengths: string[];
    suggestedTagline: string;
    suggestedBio: string;
  }>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    tagline: "✨ Connect Instagram to auto-generate your unique vibe.",
    bio: "🚀 Connect your Instagram to let our AI analyze your vibe and craft a perfect bio for you. It's 10x faster and attracts more guests!",
    rate: "",
    location: "",
    activityTitle: "",
    activityTypes: [] as string[],
    activityDesc: "",
    activityDuration: "60",
    activityPrice: "",
    guestExpenseCap: "",
    zoomMeeting: false,
    routeNodes: [
      { startTime: "14:00", endTime: "15:00", locationName: "", description: "" }
    ]
  });

  // Calculate total duration in hours based on route nodes
  const calculateTotalHours = () => {
    let totalMinutes = 0;
    
    formData.routeNodes.forEach(node => {
      if (!node.startTime || !node.endTime) return;
      
      const parseTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return (hours * 60) + (minutes || 0);
      };

      const start = parseTime(node.startTime);
      const end = parseTime(node.endTime);
      
      if (end > start) {
        totalMinutes += (end - start);
      }
    });

    return Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal
  };

  // Calculate total host fee
  const totalHostFee = () => {
    const hours = calculateTotalHours();
    const rate = Number(formData.rate) || 0;
    return Math.round(hours * rate);
  };

  const addRouteNode = () => {
    setFormData(prev => ({
      ...prev,
      routeNodes: [...prev.routeNodes, { startTime: "", endTime: "", locationName: "", description: "" }]
    }));
  };

  const removeRouteNode = (index: number) => {
    setFormData(prev => ({
      ...prev,
      routeNodes: prev.routeNodes.filter((_, i) => i !== index)
    }));
  };

  const handleRouteNodeChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      routeNodes: prev.routeNodes.map((node, i) =>
        i === index ? { ...node, [field]: value } : node
      )
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFocus = (field: string) => {
    setActiveField(field);
  };

  const startAiAnalysis = () => {
    setIsConnectingInsta(true);
    // Simulate API call to Instagram and AI processing
    setTimeout(() => {
      setInstaConnected(true);
      setAiAnalysis({
        summary: "You have a vibrant aesthetic! Your frequent posts about hidden jazz bars and vintage clothing suggest you'd be a perfect 'Tokyo Nightlife & Vintage Guide'.",
        strengths: ["Vintage Fashion", "Jazz Bars", "Film Photography", "Nightlife"],
        suggestedTagline: "Tokyo Nightlife & Vintage Curator",
        suggestedBio: "Hi, I'm a vintage lover living in Shimokitazawa. I spend my weekends hunting for rare vinyl records and exploring hidden jazz kissaten. Join me for a tour of Tokyo's retro side!"
      });
      
      // Auto-fill form
      setFormData(prev => ({
        ...prev,
        fullName: "Yuki Sato", // Simulated name from Insta
        tagline: "Tokyo Nightlife & Vintage Curator",
        bio: "Hi, I'm a vintage lover living in Shimokitazawa. I spend my weekends hunting for rare vinyl records and exploring hidden jazz kissaten. Join me for a tour of Tokyo's retro side!",
        location: "Tokyo, Japan"
      }));
      
      setIsConnectingInsta(false);
      setActiveField("analysis_complete");
    }, 2500);
  };

  const handleConnectClick = () => {
    if (!hasFollowed) {
      setShowFollowCheck(true);
    } else {
      startAiAnalysis();
    }
  };

  const handleFollowConfirmation = () => {
    setHasFollowed(true);
    setShowFollowCheck(false);
    startAiAnalysis();
  };

  const handleToggleChange = (name: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  // AI Guidance Content
  const getAiGuidance = () => {
    if (instaConnected && activeField === 'analysis_complete') {
      return {
        title: "Profile Analyzed!",
        content: "I've drafted a persona based on your Instagram. Feel free to tweak the Tagline and Bio to better fit your voice.",
        suggestion: "Tip: Adding specific neighborhoods you love makes your profile more authentic."
      };
    }

    switch (activeField) {
      case 'fullName':
        return {
          title: "What should we call you?",
          content: "Use your real name or the name you go by with friends. This builds trust with guests.",
          suggestion: "Example: 'Dennis' or 'Dennis Jia'"
        };
      case 'tagline':
        return {
          title: "Your Headline",
          content: "Think of this as your newspaper headline. What's your unique selling point?",
          suggestion: "Examples:\n• 'Tokyo Coffee Hunter'\n• 'Vintage Vinyl Expert'\n• 'Harajuku Street Style Guide'"
        };
      case 'bio':
        return {
          title: "Tell your story",
          content: "Don't be shy! Share why you love your city. What's your secret spot? Travelers love passion.",
          suggestion: "Template: 'Hi, I'm [Name]. I love [Hobby] and exploring [Area]. Ask me about [Topic]!'"
        };
      case 'rate':
        return {
          title: "Set your rate",
          content: "You keep 100% of your tips! We handle the payments securely.",
          suggestion: "Did you know? You'll get instant notifications when funds are ready to collect."
        };
      case 'location':
        return {
          title: "Where are you based?",
          content: "Guests want to know where you can meet up or which area you know best.",
          suggestion: "Example: 'Shibuya, Tokyo' or 'Brooklyn, NY'"
        };
      case 'activityTitle':
        return {
          title: "Create your first Event",
          content: "It doesn't have to be a grand tour! Simple, authentic experiences are what locals do best.",
          suggestion: "Great examples:\n• 'Coffee with me at a hidden cafe'\n• 'Study with me in the library'\n• 'Quick lunch chat'"
        };
      case 'activityDesc':
        return {
          title: "Describe the vibe",
          content: "Just be yourself. Explain what you'll do together in 1-2 sentences.",
          suggestion: "Example: 'I'll take you to my favorite quiet cafe where we can work or study together for an hour. Good wifi and great matcha!'"
        };
      default:
        return {
          title: "Hi! I'm your Host Coach.",
          content: "I'm here to help you build a profile that stands out. Click on any field to get started, or connect Instagram for a head start.",
          suggestion: "Pro Tip: Hosts with clear photos get 3x more bookings."
        };
    }
  };

  const aiGuide = getAiGuidance();

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="mx-auto h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold">Application Received!</h2>
          <p className="text-zinc-400">
            Thanks for applying to become a host. We&apos;ll review your profile and get back to you within 24 hours.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Side: Form */}
          <div className="lg:col-span-6 space-y-12">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Share your world.
                <br />
                Earn on your terms.
              </h1>
              <p className="text-xl text-zinc-400 max-w-2xl">
                Join our community of hosts and start connecting with travelers from around the globe.
              </p>
            </div>

            {/* AI Connect Section */}
            {!instaConnected && !isConnectingInsta && !showFollowCheck && (
              <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Fast-track with Instagram</h3>
                    <p className="text-zinc-300">
                      Let AI analyze your vibe and auto-build your profile.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleConnectClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors"
                >
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Connect & Analyze
                </button>
              </div>
            )}

            {/* Follow Requirement Check */}
            {!instaConnected && !isConnectingInsta && showFollowCheck && (
               <div className="bg-gradient-to-br from-pink-900/40 to-rose-900/40 border border-pink-500/30 rounded-3xl p-8 space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Step 1: Follow Official Account</h3>
                     <p className="text-zinc-300">
                      To use AI analysis, please follow our official Instagram first.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                   <a 
                     href="https://www.instagram.com/soonmet_official" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="w-full flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:opacity-90 transition-opacity"
                   >
                     <Instagram className="h-5 w-5" />
                     Follow @soonmet_official
                   </a>
                   
                   <button
                      type="button"
                      onClick={handleFollowConfirmation}
                      className="w-full flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors border border-white/10"
                   >
                     <CheckCircle className="h-5 w-5 text-green-400" />
                     I have followed
                   </button>
                </div>
               </div>
            )}

            {isConnectingInsta && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex items-center gap-6">
                <div className="relative h-12 w-12 flex-shrink-0">
                  <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div>
                  <h3 className="text-lg font-bold animate-pulse">Analyzing your profile...</h3>
                  <p className="text-zinc-400 text-sm">Reading bio, analyzing photo aesthetics...</p>
                </div>
              </div>
            )}

            {/* AI Analysis Result */}
            {instaConnected && aiAnalysis && (
              <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-indigo-500/30 rounded-3xl p-8 space-y-4 animate-in slide-in-from-bottom-10 fade-in duration-700">
                <div className="flex items-center gap-3">
                   <Sparkles className="h-5 w-5 text-indigo-400" />
                   <h3 className="text-lg font-bold text-indigo-200">AI Vibe Check</h3>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  {aiAnalysis.summary}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {aiAnalysis.strengths.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-xs text-indigo-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Main Form */}
            <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-400" />
                      AI-Crafted Profile
                    </h3>
                    <p className="text-sm text-zinc-400">
                      Connect Instagram to let AI write this for you. We highly recommend using AI for the best results!
                      <br/>
                      <span className="text-xs text-zinc-500">(Manual entry is available if you skip AI, but you might miss out on the magic ✨)</span>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Full Name</label>
                      <input 
                        required
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('fullName')}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="e.g. Dennis Jia"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Tagline (AI Generated)</label>
                      <div className="relative">
                        <input 
                          required
                          type="text"
                          name="tagline"
                          value={formData.tagline}
                          onChange={handleInputChange}
                          onFocus={() => handleFocus('tagline')}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          placeholder="e.g. Coffee enthusiast & Tokyo local"
                        />
                        {instaConnected && (
                          <Sparkles className="absolute right-4 top-3.5 h-4 w-4 text-indigo-400" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Bio (AI Generated)</label>
                      <div className="relative">
                        <textarea 
                          required
                          rows={4}
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          onFocus={() => handleFocus('bio')}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          placeholder="Tell us about yourself..."
                        />
                         {instaConnected && (
                            <Sparkles className="absolute right-4 top-4 h-4 w-4 text-indigo-400" />
                          )}
                      </div>
                    </div>
                  </div>
                </div>



                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-400" />
                      Create Exp Local with Locals Event
                    </h3>
                    <p className="text-sm text-zinc-400">
                      Make friends globally and earn while having fun
                    </p>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Experience Title</label>
                      <input 
                        required
                        type="text"
                        name="activityTitle"
                        value={formData.activityTitle}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('activityTitle')}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="e.g. Tokyo Analog Underground"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-zinc-400">
                        Get Inspired! <span className="text-zinc-500 font-normal">(If your idea isn't listed, you're just too creative!)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Local Supermarket", "Walk Dog", "Flea Market", "Model Shop",
                          "Internet Cafe", "Gaming Arcade", "Coffee Chat", "Izakaya",
                          "Manga Cafe", "Home Visit", "Art Gallery", "Karaoke",
                          "Thrift Shop", "Bookstore", "Park Picnic", "Street Food",
                          "Record Store", "Shrine Walk", "Ramen Hunt", "Konbini Run",
                          "Board Games", "Jazz Bar", "Cycling", "DIY Workshop",
                          "More Creative Item"
                        ].map((type) => {
                          const isSelected = formData.activityTypes.includes(type);
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                setFormData(prev => {
                                  const current = prev.activityTypes;
                                  if (current.includes(type)) {
                                    return { ...prev, activityTypes: current.filter(t => t !== type) };
                                  } else {
                                    return { ...prev, activityTypes: [...current, type] };
                                  }
                                });
                              }}
                              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                                isSelected
                                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-105'
                                  : 'bg-zinc-800/50 border-white/10 text-zinc-300 hover:bg-zinc-700 hover:text-white hover:border-white/30'
                              }`}
                            >
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Route Builder */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-zinc-400">Experience Route (Itinerary)</label>
                      </div>
                      
                      {formData.routeNodes.map((node, index) => (
                        <div key={index} className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-3 relative group">
                          {/* Remove Button */}
                          {formData.routeNodes.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => removeRouteNode(index)}
                              className="absolute right-2 top-2 p-1.5 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}

                          {/* Header with Number */}
                          <div className="flex items-center gap-2 mb-2">
                             <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/30">
                               {index + 1}
                             </div>
                             <span className="text-xs font-medium text-zinc-400">Route Segment</span>
                          </div>

                          {/* Time & Location */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-xs text-zinc-500">Time (Start - End)</label>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-zinc-600" />
                                <input 
                                  type="text" 
                                  placeholder="14:00" 
                                  className="w-full bg-transparent border-b border-white/10 focus:border-indigo-500 outline-none text-sm py-1"
                                  value={node.startTime}
                                  onChange={(e) => handleRouteNodeChange(index, 'startTime', e.target.value)}
                                />
                                <span className="text-zinc-600">-</span>
                                <input 
                                  type="text" 
                                  placeholder="15:00" 
                                  className="w-full bg-transparent border-b border-white/10 focus:border-indigo-500 outline-none text-sm py-1"
                                  value={node.endTime}
                                  onChange={(e) => handleRouteNodeChange(index, 'endTime', e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <label className="text-xs text-zinc-500">Location Name</label>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-zinc-600" />
                                <input 
                                  type="text" 
                                  placeholder="e.g. Hidden Jazz Bar" 
                                  className="w-full bg-transparent border-b border-white/10 focus:border-indigo-500 outline-none text-sm py-1"
                                  value={node.locationName}
                                  onChange={(e) => handleRouteNodeChange(index, 'locationName', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="space-y-1">
                            <label className="text-xs text-zinc-500">What we'll do here</label>
                            <textarea 
                              rows={2}
                              placeholder="Describe the activity..." 
                              className="w-full bg-black/20 rounded-lg border border-white/5 p-2 text-sm focus:outline-none focus:border-indigo-500/50"
                              value={node.description}
                              onChange={(e) => handleRouteNodeChange(index, 'description', e.target.value)}
                            />
                          </div>

                          {/* Image Placeholder */}
                          <div className="flex items-center gap-2 text-xs text-zinc-500 cursor-pointer hover:text-indigo-400 transition-colors border border-dashed border-zinc-700 rounded-lg p-2 justify-center hover:border-indigo-500/50 hover:bg-indigo-500/5">
                            <ImageIcon className="h-4 w-4" />
                            <span>Add Photo of this spot</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addRouteNode}
                      className="w-full py-4 rounded-xl border-2 border-dashed border-zinc-700 text-zinc-400 font-semibold hover:border-indigo-500 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2 group"
                    >
                      <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      Add Another Stop
                    </button>

                    {/* Summary & Pricing Card */}
                    <div className="bg-black/40 rounded-xl p-6 border border-white/10 space-y-6">
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-indigo-400" />
                        Cost & Duration Summary
                      </h4>

                      {/* Calculated Duration */}
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                        <div>
                          <p className="text-sm text-zinc-400">Total Duration</p>
                          <p className="text-2xl font-bold text-white">{calculateTotalHours()} Hours</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-zinc-500">Based on your route times</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Hourly Rate Input */}
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-zinc-400">Host Hourly Rate (¥)</label>
                           <input
                             required
                             type="number"
                             min="1000"
                             name="rate"
                             value={formData.rate}
                             onChange={handleInputChange}
                             className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                             placeholder="4000"
                           />
                        </div>

                        {/* Guest Expense Cap */}
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-zinc-400">Visitor Estimated Extra Cost (¥)</label>
                           <input
                             type="number"
                             name="guestExpenseCap"
                             value={formData.guestExpenseCap}
                             onChange={handleInputChange}
                             className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                             placeholder="e.g. 2000"
                           />
                           <p className="text-xs text-zinc-500 mt-1">Estimated cost for food, coffee, tickets, etc. (Paid by Visitor)</p>
                        </div>
                      </div>

                      {/* Total Host Fee Display */}
                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-zinc-400">Total Host Earnings</p>
                            <p className="text-xs text-zinc-500">¥{formData.rate || 0} x {calculateTotalHours()} hrs (Exclusive of visitor's extra costs)</p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-indigo-400">
                              ¥{totalHostFee().toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${formData.zoomMeeting ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-500'}`}>
                            <Video className="h-5 w-5" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-white">Enable Pre-trip Zoom Consultation</p>
                            <p className="text-xs text-zinc-400">Earn ¥1,500/hr for chatting with future guests</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            handleToggleChange('zoomMeeting', !formData.zoomMeeting);
                            handleFocus('zoomMeeting');
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.zoomMeeting ? 'bg-indigo-500' : 'bg-zinc-700'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.zoomMeeting ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>

                      {formData.zoomMeeting && (
                        <div className="bg-white/5 rounded-lg p-4 space-y-3 animate-in slide-in-from-top-2 fade-in duration-300">
                          <h5 className="text-sm font-semibold text-white flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            Policy & Pricing
                          </h5>
                          <ul className="space-y-2 text-xs text-zinc-400">
                            <li className="flex items-start gap-2">
                              <span className="text-indigo-400 font-bold">•</span>
                              <span><strong className="text-zinc-300">Fixed Rate:</strong> ¥1,500 per hour (Pre-paid by visitor).</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-indigo-400 font-bold">•</span>
                              <span><strong className="text-zinc-300">Process:</strong> Requires appointment. Email notifications sent to both parties.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-indigo-400 font-bold">•</span>
                              <span><strong className="text-zinc-300">Refund Policy:</strong> Full refund to visitor if you (Host) are a no-show or if system confirmation fails.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-indigo-400 font-bold">•</span>
                              <span><strong className="text-zinc-300">Cancellation:</strong> No refund to visitor if they are a no-show (You get paid).</span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-lg hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side: AI Assistant (Sticky) */}
          <div className="hidden lg:block lg:col-span-6 relative">
            <div className="sticky top-28 space-y-6">
              {/* AI Avatar */}
              <div className="flex items-center gap-4 mb-2">
                <div className="relative">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-white/20 shadow-lg shadow-indigo-500/20">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-4 border-black"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">SoonMet Coach</h3>
                  <p className="text-sm text-zinc-400">Real-time Assistant</p>
                </div>
              </div>

              {/* Chat Bubble */}
              <div className="relative">
                <div className="absolute -left-2 top-6 w-4 h-4 bg-zinc-800 transform rotate-45 border-l border-b border-zinc-700"></div>
                <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-tl-none p-6 shadow-xl transition-all duration-300">
                  <h4 className="text-indigo-400 font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {aiGuide.title}
                  </h4>
                  <p className="text-zinc-200 leading-relaxed mb-4">
                    {aiGuide.content}
                  </p>
                  
                  {aiGuide.suggestion && (
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-700/50">
                      <p className="text-sm text-zinc-400 whitespace-pre-line">
                        {aiGuide.suggestion}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-6">
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Host Dashboard Preview</h4>
                
                {/* Simulated Notification 1: Zoom */}
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex items-start gap-4 animate-in slide-in-from-right fade-in duration-700 delay-150">
                   <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                     <Video className="h-5 w-5 text-blue-400" />
                   </div>
                   <div className="space-y-1">
                     <div className="flex items-center justify-between gap-2">
                       <p className="font-medium text-sm text-zinc-200">New Booking: Zoom Ready</p>
                       <span className="text-xs text-zinc-500">Just now</span>
                     </div>
                     <p className="text-xs text-zinc-400">
                       &quot;Tokyo Coffee Chat&quot; with Sarah starts in 15 mins. Link generated.
                     </p>
                     <div className="pt-2">
                       <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md border border-blue-500/20">
                         Join Meeting
                       </span>
                     </div>
                   </div>
                </div>

                {/* Simulated Notification 2: Earnings */}
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex items-start gap-4 animate-in slide-in-from-right fade-in duration-700 delay-300">
                   <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                     <Wallet className="h-5 w-5 text-green-400" />
                   </div>
                   <div className="space-y-1 w-full">
                     <div className="flex items-center justify-between gap-2">
                       <p className="font-medium text-sm text-zinc-200">Payment Available</p>
                       <span className="text-xs text-zinc-500">2m ago</span>
                     </div>
                     <p className="text-xs text-zinc-400">
                       You have <span className="text-green-400 font-bold">¥4,500</span> ready to collect from yesterday&apos;s session.
                     </p>
                     <button className="mt-2 w-full flex items-center justify-center gap-2 py-1.5 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg text-xs font-medium text-green-400 transition-colors">
                        Collect Money <ArrowRight className="h-3 w-3" />
                     </button>
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
