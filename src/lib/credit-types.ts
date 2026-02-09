
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
  0: {
    maxPrice: 2000,
    label: "Level 0",
    title: "Newcomer",
    description: "Simply register to publish guides. Share local spots you know well.",
    avgWeeklyIncome: 0,
    weeklyRevenue: "¥0",
    upgradeTime: "0 min",
    coreProcess: "Email Registration",
    requirements: ["Email"],
    commissionRate: 0.20,
    guideSuggestion: "Authentic local spots, the more local the better."
  },
  1: {
    maxPrice: 2000,
    label: "L1",
    title: "Student Host",
    description: "Passed SheerID verification. Public profile with nickname, gender, and age.",
    avgWeeklyIncome: 30000,
    weeklyRevenue: "¥30,000",
    upgradeTime: "Instant",
    coreProcess: "SheerID + Basic Info",
    requirements: ["SheerID Verification", "Nickname", "Gender", "Age", "Public Info"],
    commissionRate: 0.20,
    guideSuggestion: "Campus tours, cheap eats, student life experiences."
  },
  2: {
    maxPrice: 5000,
    label: "L2",
    title: "Vibe Host",
    description: "Profile Photo Uploaded. Public Instagram accessible to visitors.",
    avgWeeklyIncome: 50000,
    weeklyRevenue: "¥50,000",
    upgradeTime: "10 mins",
    coreProcess: "Photo + Public SNS",
    requirements: ["Profile Photo", "Public Instagram"],
    commissionRate: 0.20,
    guideSuggestion: "Craftsmanship experiences, familiar places, local eateries, art galleries."
  },
  3: {
    maxPrice: 8000,
    label: "L3",
    title: "Ace Host",
    description: "Completed 5+ Host Services. ID Verified. Specialized in Anime, Gourmet, Fashion.",
    avgWeeklyIncome: 80000,
    weeklyRevenue: "¥80,000",
    upgradeTime: "1-2 days",
    coreProcess: "5+ Services + ID Check",
    requirements: ["5+ Host Services", "ID Verification", "Special Tags"],
    commissionRate: 0.20,
    guideSuggestion: "Unique hobbies and skills: Manga, models, amateur theater, private artist visits."
  },
  4: {
    maxPrice: Infinity,
    label: "L4",
    title: "Maestro Host",
    description: "Completed 20+ Host Services. Invitation Only. Professionals, Celebrities.",
    avgWeeklyIncome: 200000,
    weeklyRevenue: "Uncapped",
    upgradeTime: "Invitation Only",
    coreProcess: "20+ Services + Vetting",
    requirements: ["20+ Host Services", "Invitation Only"],
    commissionRate: 0.20, // Should be scalable but using 0.20 as base
    guideSuggestion: "Master craftsman workshops, unique cultural figures, celebrities."
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
