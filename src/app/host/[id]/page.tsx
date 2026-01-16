import { getHostById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Instagram, Sparkles } from "lucide-react";
import { ActivityCard } from "@/components/ActivityCard";
import { BookingButton } from "@/components/BookingButton";

interface HostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HostPage({ params }: HostPageProps) {
  const { id } = await params;
  const host = getHostById(id);

  if (!host) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black pb-24">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-transparent backdrop-blur-sm">
        <Link href="/" className="p-2 bg-white/50 dark:bg-black/50 rounded-full hover:bg-white dark:hover:bg-zinc-900 transition-colors">
          <ArrowLeft className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
        </Link>
      </nav>

      {/* Hero Image */}
      <div className="relative h-[50vh] w-full">
        <Image
          src={host.imageUrl}
          alt={host.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-black via-transparent to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
        {/* Header Info */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">{host.name}</h1>
            <p className="text-xl text-zinc-500 dark:text-zinc-400">{host.role}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">¥{host.price}<span className="text-lg font-normal text-zinc-500">/hr</span></div>
          </div>
        </div>

        {/* AI Vibe Report */}
        {host.instagramAnalysis && (
          <div className="mb-10 p-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Instagram className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Instagram Vibe Check
                <Sparkles className="h-4 w-4 text-indigo-500" />
              </h2>
            </div>
            
            <p className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed mb-4 font-medium">
              &quot;{host.instagramAnalysis.summary}&quot;
            </p>
            
            <div className="flex flex-wrap gap-2">
              {host.instagramAnalysis.vibeTags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-white/60 dark:bg-white/5 border border-indigo-200 dark:border-indigo-500/30 rounded-full text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  #{tag}
                </span>
              ))}
              <span className="px-3 py-1 bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-zinc-700 rounded-full text-xs font-medium text-zinc-500">
                Aesthetic: {host.instagramAnalysis.aesthetic}
              </span>
            </div>
          </div>
        )}

        {/* Quirks */}
        <div className="mb-10">
          <h2 className="text-sm uppercase tracking-wider text-zinc-400 font-semibold mb-4">The Quirks</h2>
          <div className="flex flex-wrap gap-3">
            {host.quirks.map((tag) => (
              <span key={tag} className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-700 dark:text-zinc-300 font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stories */}
        <div className="mb-12">
          <h2 className="text-sm uppercase tracking-wider text-zinc-400 font-semibold mb-4">My Stories</h2>
          <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
            {host.stories}
          </p>
        </div>

        {/* Activities Section */}
        {host.activities && host.activities.length > 0 && (
          <div id="things-locals-know" className="mb-24">
            <h2 className="text-sm uppercase tracking-wider text-zinc-400 font-semibold mb-6">
              Things Only Locals Know
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {host.activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        )}

        {/* CTA Section - Replaced with Client Component */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black pb-8">
          <div className="max-w-md mx-auto">
            <BookingButton host={host} />
            
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>100% Secure. Full refund if meeting doesn&apos;t happen.</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
