import { HOSTS, Host } from "@/lib/data";

// Mock API Types
export type AvailabilitySlot = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  isBooked: boolean;
};

// 1. Semantic Search / Recommendation Logic
export async function fetchTopHosts(query: string): Promise<Host[]> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const lowerQuery = query.toLowerCase();

  // Simple scoring algorithm
  const scoredHosts = HOSTS.map(host => {
    let score = 0;
    
    // Check Name
    if (host.name.toLowerCase().includes(lowerQuery)) score += 10;
    
    // Check Role
    if (host.role.toLowerCase().includes(lowerQuery)) score += 5;
    
    // Check Tags
    host.tags.forEach(tag => {
      if (tag.toLowerCase().includes(lowerQuery)) score += 3;
    });

    // Check Stories/Description
    if (host.stories.toLowerCase().includes(lowerQuery)) score += 2;
    
    // Check Activities
    host.activities.forEach(act => {
      if (act.title.toLowerCase().includes(lowerQuery)) score += 2;
      if (act.description.toLowerCase().includes(lowerQuery)) score += 1;
    });

    return { host, score };
  });

  // Sort by score desc
  scoredHosts.sort((a, b) => b.score - a.score);

  // Return top 3, or just first 3 if no query
  if (!query.trim()) return HOSTS.slice(0, 3);
  
  // If no matches found, return a fallback mix
  if (scoredHosts[0].score === 0) return HOSTS.slice(0, 3);

  return scoredHosts.slice(0, 3).map(item => item.host);
}

// 1.5 Semantic Search for Activities (Route-Centric)
export async function searchActivities(query: string) {
  await new Promise(resolve => setTimeout(resolve, 800));
  const lowerQuery = query.toLowerCase();

  const results: { activity: any, host: Host, score: number, matchedNode?: any }[] = [];

  HOSTS.forEach(host => {
    host.activities.forEach(activity => {
      let score = 0;
      let matchedNode = null;

      // Check Title & Description
      if (activity.title.toLowerCase().includes(lowerQuery)) score += 10;
      if (activity.description.toLowerCase().includes(lowerQuery)) score += 5;
      
      // Check Tags
      activity.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(lowerQuery)) score += 5;
      });

      // Check Route Nodes (Deep Search)
      if (activity.routeNodes) {
        activity.routeNodes.forEach(node => {
          if (
            node.description.toLowerCase().includes(lowerQuery) || 
            node.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
            node.locationName.toLowerCase().includes(lowerQuery)
          ) {
            score += 15; // High weight for node match
            matchedNode = node;
          }
        });
      }

      if (score > 0) {
        results.push({ activity, host, score, matchedNode });
      }
    });
  });

  return results.sort((a, b) => b.score - a.score).slice(0, 3);
}

// 2. Get Host Schedule
export async function getHostAvailability(hostId: string): Promise<AvailabilitySlot[]> {
  await new Promise(resolve => setTimeout(resolve, 600));

  // Generate next 3 days of slots
  const slots: AvailabilitySlot[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    // 3 slots per day
    ['14:00', '16:00', '19:00'].forEach((time, idx) => {
      slots.push({
        id: `${dateStr}-${time}`,
        date: dateStr,
        time: time,
        isBooked: Math.random() > 0.7 // Randomly booked
      });
    });
  }

  return slots;
}

// 3. Process Transaction
export async function processTransaction(
  hostId: string, 
  visitorId: string, 
  amount: number, 
  slotId: string
): Promise<{ success: boolean; orderId: string }> {
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    success: true,
    orderId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  };
}
