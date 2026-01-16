import { Hero } from "@/components/Hero";
import { HostList } from "@/components/HostList";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface HomeProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { q } = await searchParams;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Hero />
      <HostList query={q} />

      {/* Browse Activities Section */}
      <div className="w-full max-w-7xl mx-auto px-4 py-12 border-t border-zinc-200 dark:border-zinc-800 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-zinc-100 dark:bg-zinc-800/50 p-8 rounded-3xl">
          <div>
            <h3 className="text-2xl font-bold mb-2">Discover Local Life Moments</h3>
            <p className="text-zinc-500 dark:text-zinc-400">
              Connect with locals through shared activities, not just tours.
            </p>
          </div>
          <Link 
            href="/activities"
            className="px-8 py-4 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all whitespace-nowrap"
          >
            Explore Life Moments
          </Link>
        </div>
      </div>
    </main>
  );
}
