"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HOSTS } from "@/lib/data";
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare } from "lucide-react";
import Image from "next/image";

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<'waiting' | 'connecting' | 'connected'>('waiting');
  const [countdown, setCountdown] = useState(5); // 5 seconds for demo

  // Find host based on ID
  const host = HOSTS.find(h => h.id === params.id);

  useEffect(() => {
    if (!host) return;

    // Simulate waiting room logic
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('connecting');
          setTimeout(() => setStatus('connected'), 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [host]);

  if (!host) return <div className="p-10 text-center">Host not found</div>;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      
      {/* Connected State (Zoom UI) */}
      {status === 'connected' && (
        <div className="flex-1 relative flex flex-col">
          {/* Main Video Area (Host) */}
          <div className="flex-1 relative bg-zinc-900 overflow-hidden">
            <Image
              src={host.imageUrl}
              alt={host.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded text-sm backdrop-blur-sm">
              {host.name}
            </div>
          </div>

          {/* Self View (Small) */}
          <div className="absolute top-4 right-4 w-32 h-48 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 shadow-xl">
            <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-400">
              You
            </div>
          </div>

          {/* Controls Bar */}
          <div className="h-20 bg-zinc-900 border-t border-zinc-800 flex items-center justify-center gap-6">
            <button className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors">
              <Mic className="h-5 w-5" />
            </button>
            <button className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors">
              <Video className="h-5 w-5" />
            </button>
            <button 
              onClick={() => router.push('/')}
              className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium transition-colors flex items-center gap-2"
            >
              <PhoneOff className="h-4 w-4" />
              End
            </button>
            <button className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors">
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Waiting / Connecting State */}
      {status !== 'connected' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2994&auto=format&fit=crop')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          <div className="relative z-10 max-w-md w-full bg-black/40 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <Image
                src={host.imageUrl}
                alt={host.name}
                fill
                className="rounded-full object-cover border-4 border-white/20"
              />
              <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 border-4 border-black"></div>
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {status === 'waiting' ? 'Waiting for host...' : 'Connecting...'}
            </h2>
            <p className="text-white/70 mb-8">
              {host.name} is getting ready for your session.
            </p>

            {status === 'waiting' && (
              <div className="text-5xl font-mono font-light tracking-widest mb-8">
                00:0{countdown}
              </div>
            )}

            {status === 'connecting' && (
              <div className="flex justify-center gap-2 mb-8">
                <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-3 h-3 bg-white rounded-full animate-bounce"></span>
              </div>
            )}

            <div className="text-sm text-white/50">
              Your payment is held securely until the session ends.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
