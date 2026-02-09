"use client";

import React, { useState } from 'react';
import CreditTierCard from './CreditTierCard';
import { Level2UpgradeFlow } from './upgrade/Level2UpgradeFlow';
import { Level3UpgradeFlow } from './upgrade/Level3UpgradeFlow';
import { Level4UpgradeFlow } from './upgrade/Level4UpgradeFlow';
import { ActivationModal } from '@/components/ActivationModal';
import { User } from 'lucide-react';
import { CreditLevel, HostCreditProfile, TIER_CONFIG, AIEvaluationResult } from "@/lib/credit-types";
import { useLanguage } from "@/contexts/LanguageContext";

export interface HostCreditTierCardsProps {
  initialLevel?: number;
  hostId?: string;
  guideCount?: number;
  hostEmail?: string;
}

export function HostCreditTierCards({ initialLevel = 0, hostId, hostEmail }: HostCreditTierCardsProps) {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<HostCreditProfile>({
    hostId: hostId || "PENDING",
    level: initialLevel as CreditLevel,
    maxPrice: TIER_CONFIG[initialLevel as keyof typeof TIER_CONFIG]?.maxPrice || 0,
    isIdentityVerified: initialLevel >= 3,
    isBiometricVerified: initialLevel >= 4,
    socialMediaConnected: initialLevel >= 2,
    legendStatus: "NOT_APPLIED",
  });
  
  // Update local state when props change
  React.useEffect(() => {
    setProfile(prev => ({
        ...prev,
        level: initialLevel as CreditLevel,
        hostId: hostId || prev.hostId,
        maxPrice: TIER_CONFIG[initialLevel as keyof typeof TIER_CONFIG]?.maxPrice || 0
    }));
  }, [initialLevel, hostId]);
  
  const [activeUpgradeFlow, setActiveUpgradeFlow] = useState<number | null>(null);

  const handleUpgradeClick = (targetLevel: number) => {
    setActiveUpgradeFlow(targetLevel);
  };

  const handleActivation = async (data: { nickname: string; phone: string; realName: string; lineId: string }) => {
    try {
      if (!hostEmail) {
        throw new Error("Email is missing. Please contact support.");
      }
      
      const res = await fetch('/api/host/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: hostEmail,
          nickname: data.nickname,
          phone: data.phone,
          realName: data.realName,
          lineId: data.lineId
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Activation failed');
      }

      // Update local state immediately for UI feedback
      setProfile(prev => ({
        ...prev,
        level: 1,
        maxPrice: TIER_CONFIG[1].maxPrice
      }));
      
      // Modal will close itself after animation via its own internal state
      
    } catch (error) {
      console.error(error);
      // alert("Activation failed. Please try again."); // Removed alert
      throw error; // Re-throw so modal can display the error
    }
  };

  const handleUpgradeComplete = (result?: AIEvaluationResult | string[]) => {
    if (activeUpgradeFlow === 2 && result && !Array.isArray(result)) {
       setProfile(prev => ({ ...prev, level: 2, maxPrice: TIER_CONFIG[2].maxPrice, socialMediaConnected: true, aiEvaluation: result as AIEvaluationResult }));
    } else if (activeUpgradeFlow === 3) {
       setProfile(prev => ({ 
         ...prev, 
         level: 3, 
         maxPrice: TIER_CONFIG[3].maxPrice, 
         isIdentityVerified: true,
         specialTags: Array.isArray(result) ? result : []
       }));
    } else if (activeUpgradeFlow === 4) {
       setProfile(prev => ({ 
         ...prev, 
         level: 4, 
         maxPrice: TIER_CONFIG[4].maxPrice, 
         isBiometricVerified: true
       }));
    }
    setActiveUpgradeFlow(null);
  };

  const handleUpgradeCancel = () => {
    setActiveUpgradeFlow(null);
  };

  // Helper to map TIER_CONFIG to UI props
  const getTierProps = (level: number) => {
    const config = TIER_CONFIG[level];
    
    // UI-specific mappings
    const uiConfig: Record<number, { stars: number }> = {
      0: { stars: 0 },
      1: { stars: 1 },
      2: { stars: 2 },
      3: { stars: 3 },
      4: { stars: 5 }
    };

    const ui = uiConfig[level];

    return {
      level: level,
      title: t(`tier.${level}.title`), 
      description: t(`tier.${level}.description`),
      priceCap: config.maxPrice,
      coreProcess: t(`tier.${level}.process`),
      recommendationStars: ui.stars,
      guideSuggestion: t(`tier.${level}.suggestion`),
      // Logic for locking: Unlocked for all except Level 4 (Maestro) which is Invitation Only
      isLocked: level === 4,
      isCompleted: profile.level > level
    };
  };

  const tiers = [0, 1, 2, 3, 4].map(level => getTierProps(level));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {tiers.map((tier) => (
          <CreditTierCard
            key={tier.level}
            level={tier.level}
            title={tier.title}
            description={tier.description}
            priceCap={tier.priceCap}
            coreProcess={tier.coreProcess}
            recommendationStars={tier.recommendationStars}
            guideSuggestion={tier.guideSuggestion}
            isCurrent={profile.level === tier.level}
            isCompleted={tier.isCompleted}
            isLocked={tier.isLocked}
            onUpgradeClick={() => handleUpgradeClick(tier.level)}
          />
        ))}
      </div>
      
      {/* Upgrade Flow Modals */}
      <ActivationModal
        isOpen={activeUpgradeFlow === 1}
        onClose={() => setActiveUpgradeFlow(null)}
        onActivate={handleActivation}
      />

      {activeUpgradeFlow === 2 && (
        <Level2UpgradeFlow 
          onComplete={handleUpgradeComplete} 
          onCancel={handleUpgradeCancel} 
        />
      )}
      
      {activeUpgradeFlow === 3 && (
        <Level3UpgradeFlow 
          hostId={profile.hostId || ""}
          onComplete={handleUpgradeComplete} 
          onCancel={handleUpgradeCancel} 
        />
      )}

      {activeUpgradeFlow === 4 && (
        <Level4UpgradeFlow 
          onComplete={() => handleUpgradeComplete()} 
          onCancel={handleUpgradeCancel} 
        />
      )}


      
      {/* AI Evaluation Result Display (Optional, if Level 2+) */}
      {profile.level >= 2 && profile.aiEvaluation && (
        <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50/50 p-6 dark:border-indigo-900/30 dark:bg-indigo-900/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg dark:bg-indigo-900/50">
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">AI Vibe Check Analysis</h3>
            <div className="ml-auto text-xs text-zinc-500">
              ID: {profile.hostId}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Personality Summary</h4>
              <p className="text-zinc-700 dark:text-zinc-300 italic">&quot;{profile.aiEvaluation.vibeSummary}&quot;</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Vibe Tags</h4>
              <div className="flex flex-wrap gap-2">
                {profile.aiEvaluation.personalityTags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white border border-indigo-200 rounded-full text-xs font-medium text-indigo-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-indigo-300">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HostCreditTierCards;
