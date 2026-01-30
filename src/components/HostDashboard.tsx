"use client";

import { useState } from "react";
import { verifyVisitorCode } from "@/lib/generator";
import { Plus, Map, Calendar, DollarSign, UserCheck, BarChart3, Clock, Wallet, CheckCircle2, Edit2 } from "lucide-react";

interface GuideSummary {
  id: string;
  title: string;
  status: string;
  views: number;
  sales: number;
  lastUpdated: string;
}

interface VerifiedData {
  visitorName: string;
  amount: number;
  tourTitle?: string;
  date?: string;
}

interface HostDashboardProps {
  onCreateGuide: () => void;
  onEditGuide: (guideId: string) => void;
  hostEmail: string;
  guides: GuideSummary[];
}

export function HostDashboard({ onCreateGuide, onEditGuide, hostEmail, guides }: HostDashboardProps) {
  // Verification State
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [verifiedData, setVerifiedData] = useState<VerifiedData | null>(null);

  const handleVerify = async () => {
    if (!verificationCode) return;
    setVerificationStatus("verifying");
    try {
        const res = await verifyVisitorCode(verificationCode, "host_123");
        setVerifiedData(res as VerifiedData);
        setVerificationStatus("success");
    } catch (e) {
        setVerificationStatus("error");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Host Personal Center</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Welcome back, {hostEmail}</p>
        </div>
        <button
          onClick={onCreateGuide}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Plus className="h-4 w-4" />
          Create New Guide
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Guides Count */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <Map className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">My Guides</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{guides.length}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-zinc-500">
            <BarChart3 className="mr-1 h-3 w-3" />
            <span>No active guides yet</span>
          </div>
        </div>

        {/* Schedule */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Service Schedule</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">--</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-zinc-500">
            <Clock className="mr-1 h-3 w-3" />
            <span>Set your availability in guide settings</span>
          </div>
        </div>

        {/* Income */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Income</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">¥0</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-zinc-500">
            <DollarSign className="mr-1 h-3 w-3" />
            <span>Payouts processed monthly</span>
          </div>
        </div>
      </div>

      {/* My Guides Section */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">My Guides ({guides.length})</h3>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {guides.length > 0 ? (
            guides.map((guide) => (
              <div key={guide.id} className="flex items-center justify-between p-6">
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100">{guide.title}</h4>
                  <div className="mt-1 flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <span className={`h-2 w-2 rounded-full ${guide.status === 'active' ? 'bg-green-500' : 'bg-zinc-300'}`} />
                      {guide.status.charAt(0).toUpperCase() + guide.status.slice(1)}
                    </span>
                    <span>Last updated: {guide.lastUpdated}</span>
                    <span>{guide.sales} Sales</span>
                  </div>
                </div>
                <button
                  onClick={() => onEditGuide(guide.id)}
                  className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-zinc-500">
              No guides created yet. Start by clicking &quot;Create New Guide&quot;.
            </div>
          )}
        </div>
      </div>

      {/* Visitor Verification Section */}
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Verify Visitor Meeting</h3>
            <p className="text-sm text-zinc-500">Enter the 6-digit code provided by your visitor to confirm the meeting.</p>
          </div>
        </div>
        
        <div className="max-w-md space-y-4">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Visitor Code (Demo: 123456)
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter 6-digit code" 
              className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-lg tracking-widest focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button 
              onClick={handleVerify}
              disabled={verificationStatus === "verifying"}
              className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {verificationStatus === "verifying" ? "Verifying..." : "Verify"}
            </button>
          </div>
          
          {verificationStatus === "success" && verifiedData && (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300 border border-green-200 dark:border-green-800">
              <p className="mb-1 font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Verification Successful!
              </p>
              <div className="ml-6 space-y-1">
                <p>Visitor: <span className="font-semibold">{verifiedData.visitorName}</span></p>
                <p>Payout Amount: <span className="font-semibold">¥{verifiedData.amount}</span></p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">The payout process has been initiated.</p>
              </div>
            </div>
          )}
          
          {verificationStatus === "error" && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800">
              <p className="font-bold">❌ Invalid Code</p>
              <p className="mt-1">Please check the code and try again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
