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
      
      {/* Featured Activities Link */}
      <div className="w-full max-w-7xl mx-auto px-4 mt-12 mb-[-2rem]">
        <Link 
          href="/activities"
          className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Explore Experiences</h3>
              <p className="text-indigo-100">Find activities to do with locals: Coffee, Art, Shopping & more.</p>
            </div>
          </div>
          <span className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-full hover:bg-indigo-50 transition-colors">
            View All
          </span>
        </Link>
      </div>

      <HostList query={q} />
    </main>
  );
}
