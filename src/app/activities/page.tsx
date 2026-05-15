"use client";

import { useState, useMemo } from 'react';
import { getAllActivities, getHostById } from "@/lib/data";
import { ActivityCard } from "@/components/ActivityCard";
import Link from "next/link";
import { ArrowLeft, ArrowDownUp, ArrowUp, ArrowDown } from "lucide-react";

export default function ActivitiesPage() {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const activities = getAllActivities();

  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      const costA = a.price + (a.estimatedExpenseCap || 0);
      const costB = b.price + (b.estimatedExpenseCap || 0);
      return sortOrder === 'asc' ? costA - costB : costB - costA;
    });
  }, [activities, sortOrder]);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      {/* Immersive Banner Header */}
      <div className="relative bg-zinc-900 text-white pt-32 pb-16 px-4 overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                Exp Local with Locals
              </h1>
              <p className="text-lg text-zinc-400 font-light leading-relaxed">
                Discover the city's hidden pulse. From vintage shopping in Shimokitazawa to meditation with a monk.
                Connect with locals through shared interests.
              </p>
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-1.5 rounded-xl border border-white/10">
              <button
                onClick={() => setSortOrder('asc')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  sortOrder === 'asc' 
                    ? 'bg-white text-black shadow-lg' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-xs uppercase tracking-wider">Price</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSortOrder('desc')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  sortOrder === 'desc' 
                    ? 'bg-white text-black shadow-lg' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                 <span className="text-xs uppercase tracking-wider">Price</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
           <p className="text-sm text-zinc-500 dark:text-zinc-400">
             Showing {sortedActivities.length} experiences
           </p>
           <div className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800">
             Total Price = Host Fee + Est. Guest Expense
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedActivities.map((activity) => {
            const host = getHostById(activity.hostId);
            return (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                showHost={true}
                host={host}
                hostAiVibe={host?.instagramAnalysis?.summary}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
