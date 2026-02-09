
"use client";

import { useState } from "react";
import { Shield, CheckCircle, Lock, Smartphone, User, Camera, Zap, Loader2 } from "lucide-react";
import { CreditLevel, HostCreditProfile, CREDIT_LEVELS, AIEvaluationResult } from "@/lib/credit-types";

// Mock AI Evaluation Function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const evaluateSocialMedia = async (bio: string, posts: string[]): Promise<AIEvaluationResult> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock response based on input (or random if empty)
  return {
    authenticityScore: 0.95,
    personalityTags: ["Art Lover", "Foodie", "Tokyo Expert"],
    vibeSummary: "Host shows strong engagement with local art scenes and culinary experiences. Authentic interactions and consistent posting history suggest a reliable and personable character.",
    evaluatedAt: new Date().toISOString(),
  };
};

export function CreditSystem() {
  // Mock Initial State (Level 1)
  const [profile, setProfile] = useState<HostCreditProfile>({
    level: 1,
    maxPrice: 3000,
    isIdentityVerified: false,
    isBiometricVerified: false,
    socialMediaConnected: false,
    legendStatus: "NOT_APPLIED",
  });

  const [isLoading, setIsLoading] = useState(false);
  // const [showAiResult, setShowAiResult] = useState(false);

  // Handlers for Upgrades
  const handleLevel2Upgrade = async () => {
    setIsLoading(true);
    try {
      // Simulate OAuth and AI Analysis
      const result = await evaluateSocialMedia("My bio...", ["Post 1", "Post 2"]);
      setProfile((prev) => ({
        ...prev,
        level: 2,
        maxPrice: 5000,
        socialMediaConnected: true,
        aiEvaluation: result,
      }));
      // setShowAiResult(true);
    } catch (error) {
      console.error("AI Evaluation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLevel3Upgrade = async () => {
    setIsLoading(true);
    // Simulate Secure Upload
    setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        level: 3,
        maxPrice: 8000,
        isIdentityVerified: true,
      }));
      setIsLoading(false);
    }, 1500);
  };

  const handleLevel4Upgrade = async () => {
    setIsLoading(true);
    // Simulate Liveness Check
    setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        level: 4,
        maxPrice: Infinity, // Uncapped
        isBiometricVerified: true,
      }));
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header / Current Status */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className={`h-6 w-6 ${getLevelColor(profile.level)}`} />
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Level {profile.level}: {CREDIT_LEVELS[profile.level].title}
              </h2>
            </div>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400">
              Current Pricing Cap: <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {profile.level === 4 ? "Uncapped" : `¥${CREDIT_LEVELS[profile.level].maxPrice.toLocaleString()} / hour`}
              </span>
            </p>
          </div>
          
          {/* Progress Bar or Next Step Hint */}
          {profile.level < 4 && (
            <div className="flex items-center gap-4 rounded-lg bg-indigo-50 px-4 py-3 dark:bg-indigo-900/20">
              <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
                  Unlock Level {profile.level + 1}
                </p>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  Increase cap to {profile.level === 3 ? "Uncapped" : `¥${CREDIT_LEVELS[(profile.level + 1) as CreditLevel].maxPrice.toLocaleString()}`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Evaluation Result Card (Visible if Level 2+) */}
      {profile.aiEvaluation && (
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/50 p-6 shadow-sm dark:border-indigo-900/30 dark:from-zinc-900 dark:to-indigo-900/10">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
              <User className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">AI Vibe Check Result</h3>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Vibe Summary</p>
              <p className="mt-2 text-sm italic text-zinc-700 dark:text-zinc-300">
                &quot;{profile.aiEvaluation.vibeSummary}&quot;
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Personality Tags</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.aiEvaluation.personalityTags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-indigo-600 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-indigo-400 dark:ring-zinc-700">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div 
                    className="h-full bg-green-500 transition-all duration-1000" 
                    style={{ width: `${profile.aiEvaluation.authenticityScore * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  {Math.round(profile.aiEvaluation.authenticityScore * 100)}% Authentic
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Stepper */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Verification Steps</h3>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          
          {/* Level 1 */}
          <StepItem 
            level={1}
            currentLevel={profile.level}
            title="Basic Verification"
            description="Email & Phone Number verified during registration."
            icon={<Smartphone className="h-5 w-5" />}
            isCompleted={true}
          />

          {/* Level 2 */}
          <StepItem 
            level={2}
            currentLevel={profile.level}
            title="Social Media AI Insights"
            description="Connect your social account for AI analysis of your vibe and authenticity."
            icon={<User className="h-5 w-5" />}
            isCompleted={profile.level >= 2}
            isLoading={isLoading && profile.level === 1}
            onAction={handleLevel2Upgrade}
            actionLabel="Connect Social Media"
          />

          {/* Level 3 */}
          <StepItem 
            level={3}
            currentLevel={profile.level}
            title="Government Identity"
            description="Securely upload your ID/Passport. Documents are encrypted and never shown to visitors."
            icon={<Lock className="h-5 w-5" />}
            isCompleted={profile.level >= 3}
            isLoading={isLoading && profile.level === 2}
            onAction={handleLevel3Upgrade}
            actionLabel="Upload ID Document"
            isLocked={profile.level < 2}
            showPrivacyNotice
          />

          {/* Level 4 */}
          <StepItem 
            level={4}
            currentLevel={profile.level}
            title="Biometric Live-Action"
            description="Complete a quick face scan to verify you are a real person."
            icon={<Camera className="h-5 w-5" />}
            isCompleted={profile.level >= 4}
            isLoading={isLoading && profile.level === 3}
            onAction={handleLevel4Upgrade}
            actionLabel="Start Face Scan"
            isLocked={profile.level < 3}
          />

        </div>
      </div>
    </div>
  );
}

// Sub-component for individual steps
interface StepItemProps {
  level: number;
  currentLevel: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  isLoading?: boolean;
  onAction?: () => void;
  actionLabel?: string;
  isLocked?: boolean;
  showPrivacyNotice?: boolean;
}

function StepItem({ 
  level, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentLevel, 
  title, 
  description, 
  icon, 
  isCompleted, 
  isLoading, 
  onAction, 
  actionLabel, 
  isLocked,
  showPrivacyNotice 
}: StepItemProps) {
  return (
    <div className={`p-6 transition-colors ${isLocked ? 'opacity-50 grayscale' : ''}`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          isCompleted 
            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
        }`}>
          {isCompleted ? <CheckCircle className="h-5 w-5" /> : icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Level {level}: {title}</h4>
            {isCompleted && <span className="text-xs font-bold text-green-600 dark:text-green-400">COMPLETED</span>}
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
          
          {showPrivacyNotice && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-500">
              <Lock className="h-3 w-3" />
              <span>Documents are encrypted and stored securely.</span>
            </div>
          )}

          {!isCompleted && !isLocked && onAction && (
            <button
              onClick={onAction}
              disabled={isLoading}
              className="mt-4 flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function getLevelColor(level: number) {
  switch (level) {
    case 1: return "text-zinc-500";
    case 2: return "text-blue-500";
    case 3: return "text-indigo-500";
    case 4: return "text-amber-500";
    default: return "text-zinc-500";
  }
}
