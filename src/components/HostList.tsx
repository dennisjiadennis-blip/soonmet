"use client";

import { HostCard } from "./HostCard";
import { HOSTS } from "@/lib/data";
import { Sparkles } from "lucide-react";

interface HostListProps {
  query?: string;
}

export function HostList({ query }: HostListProps) {
  // 1. Filter Hosts
  const filteredHosts = query
    ? HOSTS.filter(host => 
        host.name.toLowerCase().includes(query.toLowerCase()) ||
        host.role.toLowerCase().includes(query.toLowerCase()) ||
        host.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        host.activities.some(act => act.title.toLowerCase().includes(query.toLowerCase()))
      )
    : HOSTS;

  // 2. Limit Results (Simulate AI Curation)
  // If query exists, show top 3 matches. If not, show top 3 featured.
  const displayHosts = filteredHosts.slice(0, 3);

  // 3. Helper to generate "AI Reason"
  const getMatchReason = (host: any) => {
    if (!query) return undefined;
    
    // Simple mock logic for demo
    if (host.role.toLowerCase().includes(query.toLowerCase())) {
      return `Top rated ${host.role} in your area`;
    }
    const matchedTag = host.tags.find((t: string) => t.toLowerCase().includes(query.toLowerCase()));
    if (matchedTag) {
      return `Best match for "${matchedTag}" enthusiasts`;
    }
    return `Highly recommended based on "${query}"`;
  };

  return (
    <div id="host-list" className="w-full max-w-7xl mx-auto px-4 py-16">
      
      {/* Header Section */}
      <div className="text-center mb-12">
        {query ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wide">AI Agent Results</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full mb-4">
            <span className="text-sm font-semibold uppercase tracking-wide">Weekly Selection</span>
          </div>
        )}
        
        <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white">
          {query ? `Top Matches for "${query}"` : "Curated Experiences for You"}
        </h2>
        
        {!query && (
            <p className="mt-4 text-zinc-500 max-w-2xl mx-auto">
                We don't show you everyone. Our AI agent selects 3 unique hosts each week tailored to the community vibe.
            </p>
        )}
      </div>
      
      {/* Results */}
      {displayHosts.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-700">
          <p className="text-xl">No specific matches found yet.</p>
          <p className="mt-2">Try asking for "Coffee", "Art", or "Student".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayHosts.map((host) => (
            <div key={host.id} className="transform transition-all duration-500 hover:scale-[1.02]">
              <HostCard 
                host={host} 
                matchReason={getMatchReason(host)}
              />
            </div>
          ))}
        </div>
      )}

      {/* "Load More" replaced by Agent CTA */}
      <div className="mt-16 text-center">
        <p className="text-sm text-zinc-400 mb-4">Not what you're looking for?</p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
        >
          Ask the Agent again
        </button>
      </div>
    </div>
  );
}
