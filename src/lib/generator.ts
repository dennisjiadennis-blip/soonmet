
export interface LocationInput {
  name: string;
  address: string;
  features: string;
  cost: string;
  transport?: string; // New: Transport Info
  tags?: string[]; // New: Vibe Tags
  images?: string[]; // New: User uploaded photos (max 4)
}

export interface CostItem {
  id: string;
  name: string;
  amount: number;
  type: 'shared' | 'personal'; // shared: Visitor pays for everyone; personal: Visitor pays for themselves
}

export interface GeneratorInput {
  title: string;
  locations: LocationInput[];
  duration: string; // New: Tour Duration
  meetingPoint: string; // New: Meeting Point
  // price: string; // Deprecated
  productPrice: string; // Digital Guide Price
  meetupPrice: string; // In-person Guide Price (Host Fee)
  
  // New: Cost Breakdown
  guestCostBreakdown: CostItem[];
  
  // New: Host Profile
  hostProfile: {
    email: string;
    fullName: string;
    nickname: string; // English Nickname
    phone: string;
    lineId: string;
    preferredContactTime: string; // e.g. "Weekdays 9-18"
  };

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
  };

  language?: "Japan" | "Other"; // Legacy
  targetLanguage?: string[]; // New: Specific Target Language (Multi-select)
  enableOfflineService?: boolean; // New: Willing to provide offline guide service
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
  
  // Google Maps Integration
  googleReviews: {
    author: string;
    rating: number;
    text: string;
  }[];

  // Language Support Cards
  japaneseCards: {
    askDirections: {
      japanese: string;
      romaji: string;
      meaning: string;
      label: string;
    };
    askStaff: {
      japanese: string;
      romaji: string;
      meaning: string;
      label: string;
    };
  };
}

export interface GeneratedItinerary {
  language?: "Japan" | "Other"; // New: Output Language
  title: {
    original: string;
    english: string;
  };
  monetization: {
    productPrice: string; // Digital Guide
    meetupPrice: string; // In-person Experience
    guestTotalCost: string; // Estimated Guest Expenses
    gumroadDescription: string;
  };
  route: RouteNode[];
  
  // Deliverables
  posterPrompt: string;
  agentPrompt: string;
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

  const { title, locations, duration, meetingPoint, productPrice, meetupPrice, language = "Japan" } = input;
  
  // Use user-provided locations or fallback to empty array
  const validLocations = locations.length > 0 ? locations : [
    { name: "Hidden Cafe Base", address: "3-14-2 Minami-Aoyama", features: "Authentic atmosphere", cost: "1200", transport: "5 min from Omotesando", tags: ["Cozy"] }
  ];

  // Calculate Total Guest Cost
  const totalGuestCost = validLocations.reduce((sum, loc) => {
    const cost = parseInt(loc.cost.replace(/[^0-9]/g, '') || "0", 10);
    return sum + cost;
  }, 0);

  // Mock Translation Logic (Simple simulation)
  const englishTitle = `Hidden Gems: ${title} (The Insider's Guide)`;

  // Generate RouteNodes from user input
  const generatedNodes: Omit<RouteNode, 'imageUrl'>[] = validLocations.map((loc, index) => {
    // Generate mock time based on index
    const hour = 10 + (index * 2);
    const time = `${hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
    
    return {
      time: time,
      location: loc.name,
      address: loc.address,
      price: `¥${loc.cost}`,
      slogan: generateMockSlogan(loc.features),
      insiderTip: loc.features.substring(0, 50) + "...", // Use first part of features as tip
  description: loc.features,
      tags: loc.tags, // Pass tags through
      images: loc.images, // Pass user photos through
      transport: loc.transport, // Pass transport info through
      
      // Detailed Navigation
      station: {
        name: language === "Japan" ? "最寄駅" : "Nearby Station",
        kanji: "最寄駅",
        number: "XX00",
        exit: language === "Japan" ? "出口1" : "Exit 1"
      },
      navigation: {
        distanceToNext: loc.transport || (index < validLocations.length - 1 ? (language === "Japan" ? "徒歩15分" : "15 min walk") : (language === "Japan" ? "ルート終了" : "End of Route")),
        googleMapsQuery: `${loc.name} ${loc.address} Tokyo`
      },
      googleReviews: [
        { author: "Local Guide", rating: 5, text: "Exactly as described. A true hidden gem." },
        { author: "Visitor", rating: 4, text: "Hard to find but worth it." },
        { author: "Tokyo Fan", rating: 5, text: "The atmosphere is unmatched." }
      ],
      japaneseCards: {
        askDirections: {
          japanese: `すみません、${loc.name}はどこですか？`,
          romaji: `Sumimasen, ${loc.name} wa doko desu ka?`,
          meaning: language === "Japan" ? `${loc.name}はどこですか？` : `Excuse me, where is ${loc.name}?`,
          label: language === "Japan" ? "通行人に見せる" : "Show to Pedestrian"
        },
        askStaff: {
          japanese: "おすすめのメニューはありますか？",
          romaji: "Osusume no menyu wa arimasu ka?",
          meaning: language === "Japan" ? "おすすめは何ですか？" : "Do you have any recommendations?",
          label: language === "Japan" ? "店員に見せる" : "Show to Staff"
        }
      }
    };
  });

  const gumroadDescription = language === "Japan" 
    ? `
# ${title}
**地元民が教える東京の隠れ家スポットガイド**

観光客が知らない「本当の東京」を体験しませんか？このガイドでは、地元の人だけが知るユニークなスポット${validLocations.length}箇所を厳選して紹介しています。

**ガイドの内容:**
✅ **正確な場所**: 全スポットのGoogleマップリンク付き
✅ **詳細なナビゲーション**: 駅の出口、徒歩時間、タクシーのヒント
✅ **所要時間**: ${duration || "3時間"}
✅ **集合場所**: ${meetingPoint || "詳細な場所は購入後に表示"}
✅ **会話カード**: 見せるだけで通じる日本語フレーズ集

**デジタルガイド価格**: ¥${productPrice || "1000"}
**ツアー同行価格**: ¥${meetupPrice || "5000"}/時間
**ゲストの実費目安**: ¥${totalGuestCost}
*即時PDFダウンロード*
    `.trim()
    : `
# ${englishTitle}
**The Local's Secret Guide to Tokyo's Hidden Gems**

Unlock the side of Tokyo that tourists never see. This curated itinerary takes you through ${validLocations.length} unique spots known only to locals.

**What's Inside:**
✅ **Exact Coordinates**: Google Maps links for every spot.
**Step-by-Step Navigation**: Station exits, walking times, and taxi tips.
✅ **Duration**: ${duration || "3 Hours"}
✅ **Meeting Point**: ${meetingPoint || "Details after purchase"}
✅ **Language Cards**: "Show & Go" Japanese phrases for smooth interactions.

**Digital Guide Price**: ¥${productPrice || "1000"}
**In-Person Experience**: ¥${meetupPrice || "5000"}/hour
**Est. Guest Expenses**: ¥${totalGuestCost}
*Instant PDF Download*
    `.trim();

  return {
    language,
    title: {
      original: title,
      english: englishTitle
    },
    monetization: {
      productPrice: `¥${productPrice || "1000"}`,
      meetupPrice: `¥${meetupPrice || "5000"}/hour`, // Added /hour
      guestTotalCost: `¥${totalGuestCost}`,
      gumroadDescription: gumroadDescription
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

**Tour Logistics:**
Duration: ${duration}
Meeting Point: ${meetingPoint}

Your role:
    1. **Insider Knowledge**: You know EXACTLY why these spots are special (e.g. celebrity favorites, hidden menus). Share this trivia when asked.
    2. **Translate**: Help me read menus or signs at these locations.
    3. **Navigate**: If I get lost, guide me back.
    4. **Context**: Tell me more about the history of these specific spots.

    Please stay in character as a helpful, knowledgeable local friend who knows the "Real Tokyo".
        `.trim()
  };
}

// API Functions
export async function submitHostApplication(data: GeneratorInput) {
  const response = await fetch('/api/host/submit', {
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
