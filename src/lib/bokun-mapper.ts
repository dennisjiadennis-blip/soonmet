
export const VIBE_TO_BOKUN_CATEGORY: Record<string, string> = {
  "Hidden Gem": "Walking Tour",
  "Nightlife": "Night Tour",
  "Food": "Food Tour",
  "Culture": "Cultural Tour",
  "Shopping": "Shopping Tour",
  "Nature": "Nature & Wildlife",
  "Anime": "Pop Culture",
  "History": "Historical Tour",
  "Bar Hopping": "Bar Crawl",
  "Photography": "Photography Tour"
};

export function mapVibeToBokunCategory(tags: string[] = []): string {
  // Return the first matching category, or default to "Walking Tour"
  for (const tag of tags) {
    if (VIBE_TO_BOKUN_CATEGORY[tag]) {
      return VIBE_TO_BOKUN_CATEGORY[tag];
    }
  }
  return "Walking Tour";
}

export function parseDurationToMinutes(durationStr: string): number {
  // Simple parser: "3 hours" -> 180, "1.5h" -> 90, "30 min" -> 30
  const lower = durationStr.toLowerCase();
  
  // Try to find hours
  const hoursMatch = lower.match(/(\d+(\.\d+)?)\s*(h|hour|hr)/);
  if (hoursMatch) {
    return Math.round(parseFloat(hoursMatch[1]) * 60);
  }
  
  // Try to find minutes
  const minsMatch = lower.match(/(\d+)\s*(m|min)/);
  if (minsMatch) {
    return parseInt(minsMatch[1]);
  }
  
  // Default fallback: try to parse as number (assume hours if small, minutes if large?)
  // Let's assume input is usually hours as per placeholder "3 hours"
  const num = parseFloat(durationStr);
  if (!isNaN(num)) {
    return Math.round(num * 60);
  }
  
  return 120; // Default 2 hours
}
