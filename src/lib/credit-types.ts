
export type CreditLevel = 0 | 1 | 2 | 3 | 4 | 5;

export enum HostStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED"
}

export interface AIEvaluationResult {
  authenticityScore: number;
  personalityTags: string[];
  vibeSummary: string;
  evaluatedAt: string;
}

export interface HostCreditProfile {
  hostId?: string; // TATAMI-BUDDY-JP-XXXX (Optional for Level 0)
  level: CreditLevel;
  maxPrice: number; // in JPY
  isIdentityVerified: boolean; // Level 3
  isBiometricVerified: boolean; // Level 4 (or L3 video interview)
  socialMediaConnected: boolean; // Level 2
  avatarUrl?: string; // Level 2
  isPublicIg?: boolean; // Level 2
  legendStatus: "NOT_APPLIED" | "PENDING" | "APPROVED" | "REJECTED"; // Level 5
  aiEvaluation?: AIEvaluationResult;
  status?: HostStatus;
  specialTags?: string[]; // New for Level 3 Ace Host
}

export interface TierConfig {
  maxPrice: number;
  label: string; 
  title: string; 
  description?: string;
  avgWeeklyIncome: number; 
  weeklyRevenue: string; 
  upgradeTime: string;
  coreProcess?: string;
  requirements?: string[];
  commissionRate: number; // New: 0.20
  guideSuggestion?: string;
}

export const TIER_CONFIG: Record<number, TierConfig> = {
  1: {
    maxPrice: Infinity,
    label: "L1",
    title: "Basic Host",
    description: "Verified Student (.ac.jp). Minimal entry, basic authenticity.",
    avgWeeklyIncome: 2000, // Hourly rate ref
    weeklyRevenue: "Uncapped",
    upgradeTime: "Instant",
    coreProcess: "SheerID + Basic Info",
    requirements: ["University Email (.ac.jp)", "Decent Nickname"],
    commissionRate: 0.20,
    guideSuggestion: "Campus tours, cheap eats, student life experiences."
  },
  2: {
    maxPrice: Infinity,
    label: "L2",
    title: "Social Host",
    description: "Vibe verified. 3 authentic photos required. No stock photos.",
    avgWeeklyIncome: 3500, // Hourly rate ref
    weeklyRevenue: "Uncapped",
    upgradeTime: "10 mins",
    coreProcess: "Visual Audit (3 Photos)",
    requirements: ["3 Authentic Photos", "Public Instagram", "Vibe Check"],
    commissionRate: 0.20,
    guideSuggestion: "Craftsmanship experiences, familiar places, local eateries, art galleries."
  },
  3: {
    maxPrice: Infinity,
    label: "L3",
    title: "Verified Host",
    description: "Identity verified via Stripe. Highest legal trust level.",
    avgWeeklyIncome: 5000, // Hourly rate ref
    weeklyRevenue: "Uncapped",
    upgradeTime: "1-2 days",
    coreProcess: "Stripe Identity",
    requirements: ["Real Name Consistency", "Legal Trust"],
    commissionRate: 0.20,
    guideSuggestion: "Unique hobbies and skills: Manga, models, amateur theater, private artist visits."
  },
  4: {
    maxPrice: Infinity,
    label: "PRO",
    title: "Expert Host",
    description: "Tatami Labs linked. Cultural Translator capable of deep decoding.",
    avgWeeklyIncome: 8000, // Hourly rate ref
    weeklyRevenue: "Uncapped",
    upgradeTime: "Invitation",
    coreProcess: "Tatami Labs Content",
    requirements: ["Cultural Translation", "Tatami Labs Feature"],
    commissionRate: 0.20,
    guideSuggestion: "Deep cultural immersion, artisan interviews, exclusive access."
  },
  5: { // Legend/Maestro (Keeping existing logic for 5 if needed, or mapping PRO to 4)
    maxPrice: Infinity,
    label: "Legend",
    title: "Maestro",
    description: "The ultimate local authority.",
    avgWeeklyIncome: 15000,
    weeklyRevenue: "¥15,000+/hr",
    upgradeTime: "Years",
    coreProcess: "Legacy",
    requirements: ["Legend Status"],
    commissionRate: 0.15,
    guideSuggestion: "Life-changing experiences."
  }
};

// Alias for backward compatibility
export const CREDIT_LEVELS = TIER_CONFIG;

// Pricing Helper
export function calculateCommission(price: number): { net: number; commission: number } {
  const rate = 0.20;
  const commission = Math.round(price * rate);
  const net = price - commission;
  return { net, commission };
}
