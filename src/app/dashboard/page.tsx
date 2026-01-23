"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { User, MapPin, Calendar, Star, Plus, Settings, ShieldCheck, Heart, DollarSign, BarChart3, Clock, Camera, Coffee, Link as LinkIcon, FileText, Send, Sparkles, TrendingUp, RefreshCw, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") === "hosting" ? "hosting" : "traveling";
  const [bookings, setBookings] = useState<any[]>([]);
  const [isVerifiedHost, setIsVerifiedHost] = useState(false);
  
  // Trust Score State
  const [trustScore, setTrustScore] = useState(0);
  const [urlInput, setUrlInput] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isScanningSNS, setIsScanningSNS] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<{score: number, message: string} | null>(null);

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('soonmet_bookings') || '[]');
    setBookings(savedBookings);
    const verified = localStorage.getItem('soonmet_is_verified_host') === 'true';
    setIsVerifiedHost(verified);
    
    // Load trust score or default to base score
    const savedScore = parseInt(localStorage.getItem('soonmet_trust_score') || '650');
    setTrustScore(savedScore);
    
    // Pre-fill URL if saved
    const savedUrl = localStorage.getItem('soonmet_host_sns_url');
    if (savedUrl) setUrlInput(savedUrl);
  }, []);

  const handleAIReview = async (type: 'content' | 'sns' | 'photos') => {
    const isSNS = type === 'sns';
    if (isSNS) {
      if (!urlInput) return;
      setIsScanningSNS(true);
      // Save URL
      localStorage.setItem('soonmet_host_sns_url', urlInput);
    } else {
      if (type === 'content' && !contentInput) return;
      setIsAnalyzing(true);
    }
    
    setAiFeedback(null);
    
    // Simulate AI Processing
    setTimeout(() => {
      let scoreIncrease = 0;
      let message = "";

      if (type === 'sns') {
        scoreIncrease = Math.floor(Math.random() * 15) + 10;
        message = "Found 3 new posts and updated activity. Your social presence is active!";
      } else if (type === 'photos') {
        scoreIncrease = Math.floor(Math.random() * 10) + 5;
        message = "Photos analyzed. Visual verification score increased.";
      } else {
        scoreIncrease = Math.floor(Math.random() * 8) + 3;
        message = "Knowledge entry verified. Your expertise adds value to the community.";
      }

      const newScore = trustScore + scoreIncrease;
      setTrustScore(newScore);
      localStorage.setItem('soonmet_trust_score', newScore.toString());
      
      setAiFeedback({
        score: scoreIncrease,
        message: message
      });
      
      if (type === 'content') setContentInput("");
      
      setIsAnalyzing(false);
      setIsScanningSNS(false);
    }, 2500);
  };

  const handleTabChange = (tab: string) => {
    router.push(`/dashboard?tab=${tab}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Profile Header - Unified Identity */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              DJ
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm text-zinc-500 hover:text-indigo-500 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Dennis Jia</h1>
              <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium rounded-full border border-green-500/20 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Verified ID
              </span>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Tokyo, Japan · Joined January 2026
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">
                <strong className="text-zinc-900 dark:text-white">12</strong> Trips
              </span>
              <span className="text-zinc-600 dark:text-zinc-300">
                <strong className="text-zinc-900 dark:text-white">48</strong> Reviews
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              Edit Profile
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-xl hover:opacity-90 transition-opacity">
              Settings
            </button>
          </div>
        </div>

        {/* Unified Tabs */}
        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl w-full sm:w-fit border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => handleTabChange('traveling')}
            className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'traveling'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
            }`}
          >
            <Calendar className="h-4 w-4" />
            Traveling
          </button>
          <button
            onClick={() => handleTabChange('hosting')}
            className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'hosting'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
            }`}
          >
            <Star className="h-4 w-4" />
            Hosting
          </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'traveling' ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Upcoming Trips */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Upcoming Trips</h2>
                
                {bookings.length === 0 && (
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 text-center text-zinc-500">
                    <p>No upcoming trips yet.</p>
                    <Link href="/activities" className="text-indigo-600 font-medium mt-2 inline-block">Explore experiences</Link>
                  </div>
                )}

                {bookings.map((booking) => (
                  <div key={booking.id} className="mb-4 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex gap-6">
                      <div className="relative h-32 w-48 shrink-0 rounded-xl overflow-hidden hidden sm:block">
                        <Image 
                          src={booking.hostImage}
                          alt="Trip"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{booking.date}</span>
                            <h3 className="text-lg font-bold mt-1 group-hover:text-indigo-500 transition-colors">Meeting with {booking.hostName}</h3>
                            <p className="text-zinc-500 text-sm mt-1">{booking.time} - Zoom</p>
                          </div>
                          <div className="bg-indigo-50 dark:bg-indigo-500/10 p-2 rounded-full">
                            <Coffee className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                          <button 
                            onClick={() => router.push(`/meeting/${booking.hostId}`)}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            Join Zoom Meeting
                          </button>
                          <button className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300">
                            Message Host
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* Saved */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Saved Experiences</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 group">
                      <div className="h-40 bg-zinc-100 dark:bg-zinc-800 relative">
                        <div className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full">
                          <Heart className="h-4 w-4 text-white fill-white" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Hidden Jazz Bars</h4>
                        <p className="text-sm text-zinc-500">Shinjuku • $45</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Host Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Trust Score Card */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl border border-indigo-400/20 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldCheck className="w-24 h-24 rotate-12" />
                  </div>
                  <div className="flex items-center gap-3 mb-2 relative z-10">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-indigo-100">Trust Score</span>
                  </div>
                  <div className="text-3xl font-black tracking-tight relative z-10 flex items-end gap-2">
                    {trustScore}
                    <span className="text-sm font-medium text-indigo-200 mb-1">/ 1000</span>
                  </div>
                  <div className="mt-2 text-xs text-indigo-100 relative z-10">
                    Top 5% of hosts
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 dark:bg-green-500/10 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-zinc-500">Total Earnings</span>
                  </div>
                  <div className="text-2xl font-bold">¥180,000</div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-zinc-500">Views (30d)</span>
                  </div>
                  <div className="text-2xl font-bold">842</div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 dark:bg-purple-500/10 rounded-lg">
                      <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-zinc-500">Rating</span>
                  </div>
                  <div className="text-2xl font-bold">4.9</div>
                </div>
              </div>

              {/* Trust & Credit Builder Section */}
              <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        Build Your Host Credit
                      </h2>
                      <p className="text-zinc-500 text-sm mt-1">
                        Add more details about yourself to increase your Trust Score. AI evaluates your content daily.
                      </p>
                    </div>
                    {aiFeedback && (
                      <div className="bg-green-500/10 text-green-600 border border-green-500/20 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-right">
                        <TrendingUp className="w-4 h-4" />
                        +{aiFeedback.score} Points: {aiFeedback.message}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 1. Knowledge & Skills */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Knowledge & Experience
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
                        <textarea 
                          placeholder="Share unique skills, local secrets, or past experiences..."
                          value={contentInput}
                          onChange={(e) => setContentInput(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all min-h-[100px] resize-none"
                        />
                      </div>
                      <button
                        onClick={() => handleAIReview('content')}
                        disabled={isAnalyzing || !contentInput}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-all"
                      >
                        {isAnalyzing ? "Analyzing..." : "Submit Experience"}
                      </button>
                    </div>

                    {/* 2. Visual Story (Photos) */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Visual Verification
                      </label>
                      <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group" onClick={() => handleAIReview('photos')}>
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-full group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-6 h-6 text-indigo-500" />
                        </div>
                        <p className="text-sm text-zinc-500">
                          Upload recent photos to verify your lifestyle
                        </p>
                      </div>
                      <button
                        onClick={() => handleAIReview('photos')}
                        disabled={isAnalyzing}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg font-medium text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                      >
                        <Camera className="w-4 h-4" />
                        Upload & Scan
                      </button>
                    </div>

                    {/* 3. Social Presence (SNS) */}
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Social Presence
                      </label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                          type="url" 
                          placeholder="Instagram / Twitter / Blog"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <button
                        onClick={() => handleAIReview('sns')}
                        disabled={isScanningSNS || !urlInput}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          isScanningSNS 
                            ? 'bg-indigo-100 text-indigo-600' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {isScanningSNS ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Scanning Updates...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            {localStorage.getItem('soonmet_host_sns_url') ? 'Re-Scan for Updates' : 'Connect & Scan'}
                          </>
                        )}
                      </button>
                      <p className="text-xs text-zinc-400 text-center">
                        AI periodically checks for new posts
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Your Listings */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Your Listings</h2>
                  <Link 
                    href="/host/apply"
                    className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                  >
                    <Plus className="h-4 w-4" />
                    Create New
                  </Link>
                </div>
                
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex gap-6 items-center">
                    <div className="h-24 w-24 rounded-xl bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                       <Image 
                        src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=3247&auto=format&fit=crop"
                        alt="Listing"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold">Coffee & Tech Talk</h3>
                          <p className="text-zinc-500 text-sm">Shibuya • 1hr</p>
                        </div>
                        <span className="px-3 py-1 bg-green-500/10 text-green-600 text-xs font-bold rounded-full">
                          Active
                        </span>
                      </div>
                      <div className="mt-4 flex gap-4 text-sm text-zinc-500">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Next session: Tomorrow</span>
                        <span className="flex items-center gap-1"><User className="h-3 w-3" /> 2 guests booked</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 px-8">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}