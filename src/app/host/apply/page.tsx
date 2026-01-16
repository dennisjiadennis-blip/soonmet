"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, MapPin, DollarSign, User, CheckCircle, Instagram, Sparkles, MessageSquare, Video, Wallet, ArrowRight, Coffee, ShoppingBag, Utensils, Footprints } from "lucide-react";

export default function BecomeHostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // AI Copilot State
  const [activeField, setActiveField] = useState<string>("default");
  
  // Instagram & AI State
  const [isConnectingInsta, setIsConnectingInsta] = useState(false);
  const [instaConnected, setInstaConnected] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<null | {
    summary: string;
    strengths: string[];
    suggestedTagline: string;
    suggestedBio: string;
  }>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    tagline: "",
    bio: "",
    rate: "",
    location: "",
    activityTitle: "",
    activityType: "Coffee",
    activityDesc: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFocus = (field: string) => {
    setActiveField(field);
  };

  const connectInstagram = () => {
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
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-black">
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
            {!instaConnected && !isConnectingInsta && (
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
                  onClick={connectInstagram}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors"
                >
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Connect & Analyze
                </button>
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
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <User className="h-5 w-5 text-indigo-400" />
                    Basic Info
                  </h3>
                  
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
                      <label className="text-sm font-medium text-zinc-400">Tagline</label>
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
                      <label className="text-sm font-medium text-zinc-400">Bio</label>
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
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-indigo-400" />
                    Rate & Location
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Hourly Rate ($)</label>
                      <input 
                        required
                        type="number" 
                        min="5"
                        name="rate"
                        value={formData.rate}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('rate')}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="25"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500" />
                        <input 
                          required
                          type="text" 
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          onFocus={() => handleFocus('location')}
                          className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          placeholder="e.g. Tokyo, Japan"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Camera className="h-5 w-5 text-indigo-400" />
                    Profile Photo
                  </h3>
                  
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/5 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="h-8 w-8 text-zinc-400 mb-2" />
                        <p className="text-sm text-zinc-400">Click to upload or drag and drop</p>
                      </div>
                      <input type="file" className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    First &quot;Things Locals Know&quot; Event
                  </h3>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Event Title</label>
                      <input 
                        required
                        type="text"
                        name="activityTitle"
                        value={formData.activityTitle}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('activityTitle')}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="e.g. Coffee with me"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Category</label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {[
                          { id: 'Coffee', icon: Coffee, label: 'Coffee' },
                          { id: 'Food', icon: Utensils, label: 'Food' },
                          { id: 'Shopping', icon: ShoppingBag, label: 'Shop' },
                          { id: 'Walk', icon: Footprints, label: 'Walk' },
                          { id: 'Art', icon: Camera, label: 'Art' },
                        ].map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, activityType: type.id }))}
                            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                              formData.activityType === type.id
                                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                                : 'bg-black/40 border-white/10 text-zinc-400 hover:bg-white/5'
                            }`}
                          >
                            <type.icon className="h-5 w-5" />
                            <span className="text-xs">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-400">Description</label>
                      <textarea 
                        required
                        rows={3}
                        name="activityDesc"
                        value={formData.activityDesc}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('activityDesc')}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="What will you do? e.g. Just hanging out at a cafe..."
                      />
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
                       You have <span className="text-green-400 font-bold">$45.00</span> ready to collect from yesterday&apos;s session.
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
