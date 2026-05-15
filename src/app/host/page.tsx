"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Globe, 
  MapPin, 
  Users, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Zap, 
  MessageCircle, 
  Headphones 
} from "lucide-react";
import Link from "next/link";

export default function HostLandingPage() {
  const router = useRouter();
  const [isHost, setIsHost] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mock data for existing host paths
  const [myPaths, setMyPaths] = useState([
    {
      id: 1,
      title: "The Diplomat's Shadow",
      status: "Live",
      lastUpdated: "2h ago",
      views: 1240,
      description: "Decoding Tokyo's Hidden Power Games in Hiroo."
    }
  ]);

  useEffect(() => {
    // Check if user is a host from localStorage (simulated)
    const isVerified = localStorage.getItem('soonmet_is_verified_host') === 'true';
    setIsHost(isVerified);
    setMounted(true);
  }, []);

  const handleBecomeHost = () => {
    router.push('/host/apply');
  };

  const toggleHostMode = () => {
    const newState = !isHost;
    setIsHost(newState);
    localStorage.setItem('soonmet_is_verified_host', String(newState));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Dev Tool: Toggle Host Mode */}
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={toggleHostMode}
          className="px-4 py-2 bg-zinc-800 text-xs rounded-full border border-zinc-700 hover:bg-zinc-700 transition-colors"
        >
          Dev: Toggle Host Mode ({isHost ? 'ON' : 'OFF'})
        </button>
      </div>

      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
            <Globe className="w-4 h-4" />
            <span>Global Host Community</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500 max-w-4xl mx-auto leading-[1.1]">
            分享你的生活<br />
            成为当地带玩儿的人<br />
            交世界的朋友
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Share your life, become a local guide, and make friends around the world.
            <br />
            Turn your unique local knowledge into a "DeepTalk" experience.
          </p>
        </section>

        {/* Conditional Flow */}
        {!isHost ? (
          /* Non-Host View: Onboarding Call to Action */
          <section className="max-w-2xl mx-auto bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-8 animate-in zoom-in-95 duration-500 delay-200">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center rotate-3 shadow-2xl shadow-indigo-500/20">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">
                Do you want to become a host for your country?
              </h2>
              <p className="text-zinc-400">
                你想成为你的国家的 Host 吗？
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleBecomeHost}
                className="w-full sm:w-auto px-10 py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-zinc-200 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Yes, Start Application
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-10 py-4 bg-transparent border border-white/10 text-zinc-400 text-lg font-medium rounded-xl hover:bg-white/5 transition-all">
                Learn More
              </button>
            </div>

            <div className="pt-8 flex items-center justify-center gap-8 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Verified ID</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Global Reach</span>
              </div>
            </div>
          </section>
        ) : (
          /* Host View: Dashboard & Path Management */
          <section className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  Your DeepTalk Paths
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30 uppercase tracking-wide">
                    Host Dashboard
                  </span>
                </h2>
                <p className="text-zinc-400 mt-2">Manage and update your living experience products.</p>
              </div>
              <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Path
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Existing Path Card */}
              {myPaths.map((path) => (
                <div key={path.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-indigo-500/50 transition-colors">
                  <div className="absolute top-6 right-6 flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-green-500 uppercase tracking-wider">{path.status}</span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {path.title}
                      </h3>
                      <p className="text-zinc-400 text-sm mt-2 line-clamp-2">
                        {path.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4" />
                        <span>Updated {path.lastUpdated}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{path.views} views</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800 flex items-center gap-3">
                      <button className="flex-1 py-2.5 bg-zinc-800 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors">
                        Edit Content
                      </button>
                      <button className="flex-1 py-2.5 bg-zinc-800 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Check Reviews
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Placeholder */}
              <button className="flex flex-col items-center justify-center gap-4 bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-3xl p-6 hover:bg-zinc-900 hover:border-zinc-700 transition-all group">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                  <Plus className="w-8 h-8 text-zinc-400 group-hover:text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-zinc-300 group-hover:text-white">Create New Path</h3>
                  <p className="text-sm text-zinc-500">Share a new side of your city</p>
                </div>
              </button>
            </div>

            {/* Tech & Tools Section */}
            <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-3xl p-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Translation Tools Active</h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    Your "DeepTalk" AI translation is ready. You can host guests from 12+ language backgrounds seamlessly.
                  </p>
                  <button className="mt-4 text-sm font-medium text-indigo-400 hover:text-indigo-300">
                    Configure Settings →
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
