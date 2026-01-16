"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { User, MapPin, Calendar, Star, Plus, Settings, ShieldCheck, Heart, DollarSign, BarChart3, Clock, Camera, Coffee } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") === "hosting" ? "hosting" : "traveling";

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
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex gap-6">
                    <div className="relative h-32 w-48 shrink-0 rounded-xl overflow-hidden hidden sm:block">
                      <Image 
                        src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=3270&auto=format&fit=crop"
                        alt="Trip"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Tomorrow</span>
                          <h3 className="text-lg font-bold mt-1 group-hover:text-indigo-500 transition-colors">Coffee with Saki in Shibuya</h3>
                          <p className="text-zinc-500 text-sm mt-1">Jan 24, 10:00 AM - 11:30 AM</p>
                        </div>
                        <div className="bg-indigo-50 dark:bg-indigo-500/10 p-2 rounded-full">
                          <Coffee className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                          Join Zoom Meeting
                        </button>
                        <button className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300">
                          Message Host
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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