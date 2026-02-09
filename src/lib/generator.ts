
export interface LocationInput {
  name: string;
  address: string;
  features: string;
  cost: string;
  transport?: string; // New: Transport Info
  tags?: string[]; // New: Vibe Tags
  images?: string[]; // New: User uploaded photos (max 10)
  imageAlts?: string[]; // New: Alt Text for SEO
  videoUrl?: string; // New: Video URL for Bokun SEO
  description?: string; // New: AI Generated Lush Narrative
  visualHook?: string; // New: AI Generated Visual Hook
  latitude?: number; // New: Bokun Sync
  longitude?: number; // New: Bokun Sync
  
  // New: Google Maps Rich Data
  googlePlaceId?: string;
  googleRating?: number;
  googleUserRatingsTotal?: number;
  googleReviews?: {
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }[];
  googleTypes?: string[];
  googleWebsite?: string;
  googlePriceLevel?: number; // New: Google Price Level (0-4)
  googlePhotos?: string[]; // New: Google Places Photos (URLs)
}

export interface CostItem {
  id: string;
  name: string;
  amount: number;
  type: 'shared' | 'personal'; // shared: Visitor pays for everyone; personal: Visitor pays for themselves
}

export interface GeneratorInput {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  theme?: string; // New: Theme
  locations: LocationInput[];
  duration: string; // New: Tour Duration
  durationMinutes?: number; // New: Bokun Sync (calculated)
  bokunCategory?: string; // New: Bokun Category (mapped from tags)
  meetingPoint: string; // New: Meeting Point
  productPrice: string | number; // Digital Guide Price
  meetupPrice: string | number; // In-person Guide Price (Host Fee)
  
  // New: Cost Breakdown
  guestCostBreakdown: CostItem[];
  
  // New: Host Profile
  hostProfile: {
    email: string;
    fullName: string; // Real Name (Private)
    nickname: string; // New: Host Nickname (Public)
    bio?: string; // New: Host Bio / Description
    phone: string;
    country?: string; // New: Host Country
    gender?: 'male' | 'female'; // New: Host Gender
    ageRange?: string; // New: Host Age Range
    universityName?: string; // New: University Name
    universityEmail?: string; // New: University Email
    lineId: string;
    whatsapp?: string; // New: WhatsApp
    snsAccounts?: string; // New: SNS Accounts
    isPublicIg?: boolean; // New: Instagram Public to Visitors
    sheerIdVerified?: boolean; // New: SheerID Verification Result
    avatarUrl?: string; // New: Profile Photo
    specialTags?: string[]; // New: Host Special Tags (L3)
    preferredContactTime: string; // e.g. "Weekdays 9-18"
  };

  maxGroupSize?: number; // New: Maximum Group Size

  // New: Payout & Service
  payoutId: string; // PayPay ID
  // serviceFrequency: number; // Deprecated: Replaced by detailed availability
  availability: {
    dayOfWeek: string; // "Mon", "Tue", etc.
    enabled: boolean;
    startTime: string; // "09:00"
    endTime: string; // "17:00"
  }[];
  earliestServiceDate: string; // YYYY-MM-DD
  
  // New: Service Standards
  standards: {
    noDiscrimination: boolean;
    boundaryConfirmed: boolean;
    refundPolicyConfirmed: boolean;
    instantConfirmation: boolean; // New: Bokun Ranking Factor
    cancellationPolicy: "24h" | "48h" | "strict"; // New: Bokun Ranking Factor
  };

  language?: "Japan" | "Other"; // Legacy
  targetLanguage?: string[]; // New: Specific Target Language (Multi-select)
  enableOfflineService?: boolean; // New: Willing to provide offline guide service
  includedItems?: string[]; // New: Inclusions list
  // airbnbUrl?: string; // Removed: Replaced by distributionChannels
  distributionChannels?: string[]; // New: Selected platforms (e.g. ['Airbnb', 'Klook'])
}

export interface RouteNode {
  time: string;
  location: string;
  address: string;
  price: string;
  slogan: string;
  insiderTip: string;
  description: string;
  imageUrl: string;
  tags?: string[]; // New: Tags to display
  images?: string[]; // New: User uploaded photos
  transport?: string; // New: Transport Info
  
  // Detailed Navigation
  station: {
    name: string;
    kanji: string;
    number: string;
    exit: string;
  };
  navigation: {
    distanceToNext: string;
    googleMapsQuery: string;
  };

  // Coordinates for Map
  latitude?: number;
  longitude?: number;
  
  // Google Maps Integration
  googleReviews: {
    author: string;
    rating: number;
    text: string;
  }[];
}

export interface GeneratedItinerary {
  language?: "Japan" | "Other"; // New: Output Language
  title: {
    original: string;
    english: string;
  };
  // New: Structured Details for Preview UI
  details: {
    recommendationReasons: string[];
    location: string;
    maxGroupSize: number;
    startDate: string;
    availability: string;
    duration: string;
    meetingPoint: string;
    includedItems: string[];
    hostPraise?: string;
    shortDescription?: string; // New: Bokun SEO Short Description
    fullDescription?: string; // New: Bokun SEO Full Description
    instantConfirmation?: boolean;
    cancellationPolicy?: string;
  };
  monetization: {
    productPrice: string; // Digital Guide
    meetupPrice: string; // In-person Experience
    guestTotalCost: string; // Estimated Guest Expenses
    gumroadDescription: string;
    // airbnbUrl?: string; // Removed
    distributionChannels?: string[]; // New: Selected Platforms
  };
  route: RouteNode[];
  
  // Deliverables
  posterPrompt: string;
  agentPrompt: string;
  hostTags?: string[]; // New: Tags passed to output
}

// Mock Image Selection Logic
const LOCATION_IMAGES: Record<string, string> = {
  default: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2994&auto=format&fit=crop", 
  cafe: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2947&auto=format&fit=crop",
  food: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=2825&auto=format&fit=crop", 
  shopping: "https://images.unsplash.com/photo-1481438549483-387c513302b7?q=80&w=2940&auto=format&fit=crop",
  art: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=2966&auto=format&fit=crop", 
  temple: "https://images.unsplash.com/photo-1583766395091-2eb9994ed094?q=80&w=2787&auto=format&fit=crop",
};

function getImageForLocation(location: string, description: string): string {
  const text = (location + " " + description).toLowerCase();
  
  if (text.includes("cafe") || text.includes("coffee") || text.includes("tea")) return LOCATION_IMAGES.cafe;
  if (text.includes("food") || text.includes("lunch") || text.includes("dinner") || text.includes("sushi") || text.includes("eat")) return LOCATION_IMAGES.food;
  if (text.includes("shop") || text.includes("store") || text.includes("buy") || text.includes("vintage")) return LOCATION_IMAGES.shopping;
  if (text.includes("art") || text.includes("gallery") || text.includes("museum")) return LOCATION_IMAGES.art;
  if (text.includes("temple") || text.includes("shrine")) return LOCATION_IMAGES.temple;
  
  return LOCATION_IMAGES.default;
}

function generateMockSlogan(features: string): string {
  // Try to extract a catchy slogan from the features
  // 1. If it contains a colon (common in Vibe Tags), take the part after it
  const parts = features.split(/[:：]/);
  if (parts.length > 1 && parts[1].trim().length > 0) {
    return parts[1].trim();
  }
  // 2. Otherwise, take the first segment before punctuation
  const segment = features.split(/[、,。.]/)[0];
  return segment.length > 30 ? segment.substring(0, 30) + "..." : segment;
}

export async function generateItinerary(input: GeneratorInput): Promise<GeneratedItinerary> {
  // Simulate AI latency
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const { 
    title, 
    locations, 
    duration, 
    meetingPoint, 
    productPrice, 
    meetupPrice, 
    // Force English output structure regardless of input preference for the "Global" version
    // language = "Other", // Unused
    theme,
    hostProfile,
    standards,
    guestCostBreakdown,
    maxGroupSize,
    earliestServiceDate,
    availability,
    includedItems,
    distributionChannels
  } = input;
  
  // Helper to simulate translation of user input
  // In a real production app, this would be an LLM call to translate Japanese -> English
  const toEnglish = (text: string) => {
    if (!text) return "";
    // If text contains Japanese characters, append (Translated) to simulate AI translation
    if (/[一-龠]+|[ぁ-ん]+|[ァ-ヴー]+/.test(text)) {
       // Simple mock translation for demo purposes
       return `${text} (Translated)`; 
    }
    return text;
  };

  // Use user-provided locations or fallback to empty array
  const validLocations = locations.length > 0 ? locations : [
    { name: "Hidden Cafe Base", address: "3-14-2 Minami-Aoyama", features: "Authentic atmosphere", cost: "1200", transport: "5 min from Omotesando", tags: ["Cozy"] }
  ];

  // Calculate Total Guest Cost
  let totalGuestCost = 0;
  if (guestCostBreakdown && guestCostBreakdown.length > 0) {
    totalGuestCost = guestCostBreakdown.reduce((sum, item) => sum + item.amount, 0);
  } else {
    totalGuestCost = validLocations.reduce((sum, loc) => {
      // Handle ranges like "3,000 - 5,000"
      const rangeMatch = loc.cost.toString().match(/(\d+(?:,\d+)*)\s*[-~]\s*(\d+(?:,\d+)*)/);
      if (rangeMatch) {
        const min = parseInt(rangeMatch[1].replace(/,/g, ''), 10);
        const max = parseInt(rangeMatch[2].replace(/,/g, ''), 10);
        if (!isNaN(min) && !isNaN(max)) {
           return sum + Math.round((min + max) / 2);
        }
      }

      // Handle single values
      const match = loc.cost.toString().match(/(\d+(?:,\d+)*)/);
      if (match) {
        const val = parseInt(match[1].replace(/,/g, ''), 10);
        return sum + (isNaN(val) ? 0 : val);
      }
      return sum;
    }, 0);
  }

  // Call AI for Recommendation and SEO Title
  let recommendationReasons: string[] = [];
  let generatedTitle = "";
  let generatedHostPraise = "";
  let generatedShortDescription = "";
  let generatedFullDescription = "";

  try {
    const aiResponse = await fetch('/api/ai/recommendation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        locations: validLocations,
        hostProfile: hostProfile,
        originalTitle: title, // Pass the user's messy concatenated title as context
        theme: input.theme // Pass theme for keyword injection
      })
    });
    
    if (aiResponse.ok) {
        const data = await aiResponse.json();
        if (data.recommendation) {
            // Split by double newline to form paragraphs
            recommendationReasons = data.recommendation.split(/\n\s*\n/).filter((line: string) => line.trim().length > 0);
        }
        if (data.seoTitle) {
            generatedTitle = data.seoTitle;
        }
        if (data.hostPraise) {
            generatedHostPraise = data.hostPraise;
        }
        if (data.shortDescription) {
            generatedShortDescription = data.shortDescription;
        }
        if (data.fullDescription) {
            generatedFullDescription = data.fullDescription;
        }
    }
  } catch (error) {
    console.error("Failed to fetch AI recommendation", error);
  }

  // Fallback if AI fails
  if (recommendationReasons.length === 0) {
      recommendationReasons = validLocations.map(l => `${toEnglish(l.name)}: ${toEnglish(l.features)}`);
  }

  // Use AI title or fallback to cleaned version
  const englishTitle = generatedTitle || `Hidden Gems: ${toEnglish(title)} (The Insider's Guide)`;

  // Generate RouteNodes from user input
  const generatedNodes: Omit<RouteNode, 'imageUrl'>[] = validLocations.map((loc, index) => {
    // Generate mock time based on index
    const hour = 10 + (index * 2);
    const time = `${hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
    
    // Create a richer description combining features and tags
    const richDescription = `
${toEnglish(loc.features)}
${loc.tags && loc.tags.length > 0 ? `\nVibe: ${loc.tags.map(t => toEnglish(t)).join(", ")}` : ""}
${loc.transport ? `\nAccess: ${toEnglish(loc.transport)}` : ""}
    `.trim();

    return {
      time: time,
      location: toEnglish(loc.name),
      address: toEnglish(loc.address),
      price: `¥${loc.cost}`,
      slogan: generateMockSlogan(toEnglish(loc.features)),
      insiderTip: `Host's Note: ${toEnglish(loc.features)}`, // Explicitly label as Host's Note
      description: richDescription,
      tags: loc.tags?.map(t => toEnglish(t)), // Pass tags through
      images: loc.images, // Pass user photos through
      transport: toEnglish(loc.transport || ""), // Pass transport info through
      latitude: loc.latitude,
      longitude: loc.longitude,
      
      // Detailed Navigation
      station: {
        name: "Nearby Station",
        kanji: "最寄駅",
        number: "XX00",
        exit: "Exit 1"
      },
      navigation: {
        distanceToNext: toEnglish(loc.transport || (index < validLocations.length - 1 ? "15 min walk" : "End of Route")),
        googleMapsQuery: `${loc.name} ${loc.address} Tokyo`
      },
      googleReviews: [
        { author: "Local Guide", rating: 5, text: "Exactly as described. A true hidden gem." },
        { author: "Visitor", rating: 4, text: "Hard to find but worth it." },
        { author: "Tokyo Fan", rating: 5, text: "The atmosphere is unmatched." }
      ]
    };
  });

  // Format Availability
  const availabilityText = availability
    .filter(a => a.enabled)
    .map(a => `${toEnglish(a.dayOfWeek)} ${a.startTime}-${a.endTime}`)
    .join(", ");

  const hostIntro = hostProfile 
    ? `Host: ${toEnglish(hostProfile.nickname)} (${hostProfile.gender || 'Local Buddy'} from ${toEnglish(hostProfile.country || 'Tokyo')})`
    : "Host: Local Buddy";

  // Always use English Template for Gumroad
  const gumroadDescription = `
# ${englishTitle}
**${hostIntro}**

${theme ? `**Theme**: ${toEnglish(theme)}` : ""}

**Why I recommend this:**
Unlock the side of Tokyo that tourists never see. This curated itinerary takes you through ${validLocations.length} unique spots known only to locals.
${validLocations.map(l => `- ${toEnglish(l.name)}: ${toEnglish(l.features)}`).join("\n")}

**Key Details:**
📍 **Location**: Around ${toEnglish(validLocations[0]?.address || "Tokyo")}
👥 **Max Group Size**: Up to ${maxGroupSize || 4} people
📅 **Available From**: ${earliestServiceDate}
🕒 **Schedule**: ${availabilityText || "Flexible"}
⏱️ **Duration**: ${duration || "3 Hours"}
🚩 **Meeting Point**: ${toEnglish(meetingPoint)}

**Pricing & Costs:**
💰 **Host Fee**: ¥${meetupPrice}/hour
🎁 **Included**: ${includedItems && includedItems.length > 0 ? includedItems.map(i => toEnglish(i)).join(", ") : "Guiding Fee Only"}
🧾 **Est. Guest Expense**: ¥${totalGuestCost} (Transport, Food, Tickets, etc.)

**What's Inside (Digital Guide):**
✅ **Exact Coordinates**: Google Maps links for every spot.
✅ **Step-by-Step Navigation**: Station exits, walking times.

**Digital Guide Price**: ¥${productPrice || "1000"}
*Instant PDF Download*
${distributionChannels && distributionChannels.length > 0 ? `\n\n**Also Available On:**\n${distributionChannels.join(", ")}` : ""}
    `.trim();

  return {
    language: "Other", // Force English output
    title: {
      original: title,
      english: englishTitle
    },
    hostTags: hostProfile.specialTags, // Pass host tags to output
    details: {
      recommendationReasons: recommendationReasons,
      location: `${toEnglish(validLocations[0]?.address || "Tokyo")}`,
      maxGroupSize: maxGroupSize || 4,
      startDate: earliestServiceDate,
      availability: availabilityText || "Flexible",
      duration: duration || "3 Hours",
      meetingPoint: toEnglish(meetingPoint),
      includedItems: includedItems ? includedItems.map(i => toEnglish(i)) : [],
      hostPraise: generatedHostPraise,
      shortDescription: generatedShortDescription,
      fullDescription: generatedFullDescription
    },
    monetization: {
      productPrice: `¥${productPrice || "1000"}`,
      meetupPrice: `¥${meetupPrice || "5000"}/hour`, // Added /hour
      guestTotalCost: `¥${totalGuestCost}`,
      gumroadDescription: gumroadDescription,
      distributionChannels: distributionChannels || []
    },
    route: generatedNodes.map(node => ({
      ...node,
      imageUrl: (node.images && node.images.length > 0) 
        ? node.images[0] 
        : getImageForLocation(node.location, node.description)
    })),
    
    // Deliverables
    posterPrompt: `
**Midjourney Prompt:**
/imagine prompt: magazine photography of Tokyo street life, ${validLocations[0].name} in background, warm natural lighting, golden hour, cinematic depth of field, 35mm film grain, modern japanese typography overlay, elegant, minimal, lifestyle aesthetic, 8k resolution, photorealistic, style of Popeye Magazine or Brutus --ar 4:5 --v 6.0
    `.trim(),
    agentPrompt: `
You are my personal Tokyo Guide Assistant. I have purchased the "${englishTitle}" guide.
My itinerary includes: ${validLocations.map(l => l.name).join(", ")}.

**Host Persona:**
Name: ${hostProfile?.nickname || "Buddy"}
From: ${hostProfile?.country || "Japan"}
Gender: ${hostProfile?.gender || "Neutral"}
Tone: Friendly, Local, Knowledgeable.
Specialties: ${hostProfile?.specialTags ? hostProfile.specialTags.join(", ") : "General"}

**Tour Logistics:**
Duration: ${duration}
Meeting Point: ${meetingPoint}

**Service Standards:**
${standards?.noDiscrimination ? "- LGBTQ+ Friendly & No Discrimination" : ""}
${standards?.boundaryConfirmed ? "- Respectful of personal boundaries" : ""}

Your role:
    1. **Insider Knowledge**: You know EXACTLY why these spots are special (e.g. celebrity favorites, hidden menus). Share this trivia when asked.
    2. **Translate**: Help me read menus or signs at these locations.
    3. **Navigate**: If I get lost, guide me back.
    4. **Context**: Tell me more about the history of these specific spots.

    Please stay in character as ${hostProfile?.nickname || "a local friend"}, a helpful, knowledgeable local friend who knows the "Real Tokyo".
        `.trim()
  };
}

// API Functions
export async function submitHostApplication(data: GeneratorInput) {
  const response = await fetch('/api/guide/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Submission failed');
  }
  
  return response.json();
}

export async function verifyVisitorCode(code: string, hostId: string) {
  const response = await fetch('/api/host/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, hostId }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Verification failed');
  }
  
  return response.json();
}
