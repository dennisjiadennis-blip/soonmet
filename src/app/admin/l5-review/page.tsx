"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { BackButton } from "@/components/BackButton";

interface PendingHost {
  id: string;
  hostId: string;
  realName: string;
  email: string;
  languages: string[];
  exclusiveNetwork: string;
}

export default function L5ReviewPage() {
  const [hosts, setHosts] = useState<PendingHost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHosts = async () => {
    try {
      const res = await fetch("/api/admin/pending-l5");
      const data = await res.json();
      if (data.hosts) {
        setHosts(data.hosts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHosts();
  }, []);

  const handleAction = async (hostId: string, action: "APPROVE_L5" | "REJECT_L5") => {
    try {
      const res = await fetch("/api/host/tier/update", {
        method: "POST",
        body: JSON.stringify({ hostId, action }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        // Refresh list
        fetchHosts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <BackButton />
      </div>
      <h1 className="mb-6 text-2xl font-bold">Legend Buddy (L5) Applications</h1>
      
      {hosts.length === 0 ? (
        <p className="text-zinc-500">No pending applications.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hosts.map(host => (
            <div key={host.id} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs text-zinc-500">{host.hostId}</span>
                <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-700">PENDING</span>
              </div>
              
              <h3 className="text-lg font-bold">{host.realName || "Unknown Name"}</h3>
              <p className="text-sm text-zinc-500">{host.email}</p>
              
              <div className="my-4 space-y-3">
                <div>
                  <h4 className="text-xs font-bold uppercase text-zinc-400">Languages</h4>
                  <div className="flex flex-wrap gap-1">
                    {host.languages && host.languages.map(lang => (
                      <span key={lang} className="rounded bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">{lang}</span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold uppercase text-zinc-400">Exclusive Network</h4>
                  <p className="text-sm">{host.exclusiveNetwork}</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleAction(host.id, "REJECT_L5")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleAction(host.id, "APPROVE_L5")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-sm font-bold text-white hover:bg-indigo-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
