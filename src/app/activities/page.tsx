import { getAllActivities, getHostById } from "@/lib/data";
import { ActivityCard } from "@/components/ActivityCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ActivitiesPage() {
  const activities = getAllActivities();

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-20">
      <nav className="sticky top-0 z-50 flex items-center p-4 bg-white/80 backdrop-blur-md dark:bg-black/80 border-b border-zinc-100 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back to Home</span>
        </Link>
        <h1 className="ml-auto mr-auto font-semibold text-lg">Curated Experiences</h1>
        <div className="w-20" /> {/* Spacer for centering */}
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-light mb-4 text-zinc-900 dark:text-zinc-50">
            Things Only Locals Know
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            From vintage shopping in Shimokitazawa to meditation with a monk. 
            Connect with locals through shared interests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => {
            const host = getHostById(activity.hostId);
            return (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                hostAiVibe={host?.instagramAnalysis?.summary}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
