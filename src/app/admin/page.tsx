"use client";

import { useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Shield, User, MapPin, Sparkles, FileText, Search } from "lucide-react";
import Image from "next/image";

// Mock Pending Data
const PENDING_HOSTS = [
  {
    id: "p1",
    name: "Kenji Tanaka",
    location: "Osaka, Japan",
    appliedDate: "2 hours ago",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3000&auto=format&fit=crop",
    idVerified: true, // ID Card uploaded and matched
    socialConnected: true,
    aiRiskScore: 12, // Low risk
    aiVibeCheck: "High Match",
    bio: "I'm a street food lover in Osaka. I want to take people to the best Takoyaki stands that aren't on Google Maps.",
    activity: {
      title: "Osaka Street Food Crawl",
      description: "We will eat until we drop. Dotonbori is for tourists, I'll take you to the real places.",
      price: 2500
    }
  },
  {
    id: "p2",
    name: "Sarah Smith",
    location: "Tokyo, Japan",
    appliedDate: "5 hours ago",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3270&auto=format&fit=crop",
    idVerified: false, // ID mismatch or pending
    socialConnected: false,
    aiRiskScore: 85, // High risk
    aiVibeCheck: "Low Match",
    bio: "Professional tour guide service. I offer luxury private tours for VIP clients. $500 per hour minimum.",
    activity: {
      title: "VIP Tokyo Tour",
      description: "Exclusive access to high-end venues. Professional service guaranteed.",
      price: 50000
    }
  }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'hosts' | 'activities'>('hosts');
  const [selectedHost, setSelectedHost] = useState<typeof PENDING_HOSTS[0] | null>(null);

  const handleApprove = (id: string) => {
    alert(`Approved host ${id}`);
    // In real app, this would call API
    setSelectedHost(null);
  };

  const handleReject = (id: string) => {
    alert(`Rejected host ${id}`);
    // In real app, this would call API
    setSelectedHost(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="h-8 w-8 text-indigo-500" />
              Trust & Safety Center
            </h1>
            <p className="text-zinc-500 mt-2">AI-Powered Verification & Review System</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium">AI Sentinel Active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex gap-2 p-1 bg-zinc-200 dark:bg-zinc-900 rounded-lg mb-4">
              <button 
                onClick={() => setActiveTab('hosts')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'hosts' ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'text-zinc-500'}`}
              >
                Pending Hosts (2)
              </button>
              <button 
                onClick={() => setActiveTab('activities')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'activities' ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'text-zinc-500'}`}
              >
                Flagged Activities (0)
              </button>
            </div>

            <div className="space-y-3">
              {PENDING_HOSTS.map((host) => (
                <div 
                  key={host.id}
                  onClick={() => setSelectedHost(host)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-indigo-500 ${
                    selectedHost?.id === host.id 
                      ? 'bg-white dark:bg-zinc-900 border-indigo-500 ring-1 ring-indigo-500' 
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image src={host.avatar} alt={host.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{host.name}</h3>
                        <span className="text-xs text-zinc-500">{host.appliedDate}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          host.aiRiskScore > 50 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                          Risk: {host.aiRiskScore}%
                        </span>
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {host.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Column */}
          <div className="lg:col-span-8">
            {selectedHost ? (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                {/* AI Analysis Header */}
                <div className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                    AI Analysis Report
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Identity Check</div>
                      <div className="flex items-center gap-2 font-semibold">
                        {selectedHost.idVerified ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            <span>Pending/Failed</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Vibe Match</div>
                      <div className="flex items-center gap-2 font-semibold">
                         {selectedHost.aiVibeCheck === "High Match" ? (
                            <span className="text-green-600">High Match</span>
                         ) : (
                            <span className="text-red-500">Low Match</span>
                         )}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Commercial Intent</div>
                      <div className="flex items-center gap-2 font-semibold">
                        {selectedHost.aiRiskScore > 50 ? (
                           <span className="text-red-500">Detected</span>
                        ) : (
                           <span className="text-green-600">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Host Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <User className="h-5 w-5 text-zinc-400" />
                      Applicant Profile
                    </h3>
                    <div className="grid gap-6 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950/30">
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-wider">Bio</label>
                        <p className="mt-1 text-lg">{selectedHost.bio}</p>
                        {selectedHost.aiRiskScore > 50 && (
                          <div className="mt-2 text-sm text-red-500 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            AI Flag: Commercial keywords detected ("Professional tour guide", "$500")
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Activity Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-zinc-400" />
                      Proposed Activity
                    </h3>
                    <div className="grid gap-6 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950/30">
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-wider">Title</label>
                        <p className="font-semibold">{selectedHost.activity.title}</p>
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-wider">Description</label>
                        <p className="mt-1">{selectedHost.activity.description}</p>
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 uppercase tracking-wider">Price</label>
                        <p className="font-mono">¥{selectedHost.activity.price}</p>
                        {selectedHost.activity.price > 10000 && (
                          <div className="mt-2 text-sm text-red-500 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            AI Flag: Price unusually high for connection fee
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-4">
                    <button 
                      onClick={() => handleReject(selectedHost.id)}
                      className="px-6 py-3 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
                    >
                      <XCircle className="h-5 w-5" />
                      Reject Application
                    </button>
                    <button 
                      onClick={() => handleApprove(selectedHost.id)}
                      className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Approve & Verify
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                <Search className="h-16 w-16 mb-4 opacity-20" />
                <p>Select an application to review</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}