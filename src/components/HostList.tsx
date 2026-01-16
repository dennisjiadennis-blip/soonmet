import { HostCard } from "./HostCard";
import { HOSTS } from "@/lib/data";

interface HostListProps {
  query?: string;
}

export function HostList({ query }: HostListProps) {
  const filteredHosts = query
    ? HOSTS.filter(host => 
        host.name.toLowerCase().includes(query.toLowerCase()) ||
        host.role.toLowerCase().includes(query.toLowerCase()) ||
        host.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        host.activities.some(act => act.title.toLowerCase().includes(query.toLowerCase()))
      )
    : HOSTS;

  return (
    <div id="host-list" className="w-full max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-light mb-12 text-center text-gray-800 dark:text-gray-100">
        {query ? `Search results for "${query}"` : "Discover Interesting Souls"}
      </h2>
      
      {filteredHosts.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          <p className="text-xl">No friends found matching your search.</p>
          <p className="mt-2">Try searching for &quot;Coffee&quot;, &quot;Art&quot;, or &quot;Student&quot;.</p>
        </div>
      ) : (
        /* Masonry Layout using CSS columns */
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredHosts.map((host) => (
            <div key={host.id} className="break-inside-avoid">
              <HostCard host={host} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
