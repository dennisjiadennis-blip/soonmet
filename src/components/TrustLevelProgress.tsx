
"use client";

import { CheckCircle2, Lock, Shield, TrendingUp, Clock } from "lucide-react";
import { TIER_CONFIG, CreditLevel } from "@/lib/credit-types";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/lib/currency";

interface TrustLevelProgressProps {
  currentLevel: number;
  onUpgradeClick?: (targetLevel: number) => void;
}

export function TrustLevelProgress({ currentLevel, onUpgradeClick }: TrustLevelProgressProps) {
  const { language, t } = useLanguage();
  
  // Helper to get localized requirements
  const getRequirements = (level: number) => {
    const map: Record<number, string[]> = {
      0: [t("tier.0.req.0")],
      1: [t("tier.1.req.0"), t("tier.1.req.1")],
      2: [t("tier.2.req.0"), t("tier.2.req.1")],
      3: [t("tier.3.req.0")],
      4: [t("tier.4.req.0"), t("tier.4.req.1"), t("tier.4.req.2")],
    };
    return map[level] || [];
  };

  // Convert TIER_CONFIG object to array for mapping
  const tiers = Object.entries(TIER_CONFIG)
    .map(([levelStr, config]) => {
      const level = Number(levelStr);
      return {
        level: level as CreditLevel,
        ...config,
        title: t(`tier.${level}.title`),
        upgradeTime: t(`tier.${level}.time`),
        requirements: getRequirements(level),
        label: language === 'ja' ? `レベル ${level}` : `Level ${level}`
      };
    })
    .sort((a, b) => a.level - b.level);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{t("credit.trust_score")}</h2>
          <p className="text-sm text-zinc-500">{language === 'ja' ? "信頼を築いて収益アップを目指しましょう。" : "Unlock higher earning potential by building trust."}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
          <Shield className="h-3.5 w-3.5" />
          {t("credit.current_level")}: {t(`tier.${currentLevel}.title`)}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {tiers.map((tier) => {
          const isUnlocked = currentLevel >= tier.level;
          const isNext = currentLevel + 1 === tier.level;
          const isLocked = currentLevel < tier.level;

          return (
            <div
              key={tier.level}
              className={cn(
                "relative flex flex-col rounded-xl border p-4 transition-all duration-300",
                isUnlocked
                  ? "border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/50 dark:bg-indigo-900/10"
                  : isNext
                  ? "border-indigo-500 ring-1 ring-indigo-500 shadow-lg scale-[1.02] bg-white dark:bg-zinc-900"
                  : "border-zinc-200 bg-zinc-50 opacity-70 dark:border-zinc-800 dark:bg-zinc-900/50"
              )}
            >
              {/* Header Badge */}
              <div className="mb-3 flex items-center justify-between">
                <span className={cn(
                  "rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                  isUnlocked ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300" 
                  : isNext ? "bg-indigo-600 text-white" 
                  : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                )}>
                  {tier.label}
                </span>
                {isUnlocked ? (
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                ) : isLocked && !isNext ? (
                  <Lock className="h-4 w-4 text-zinc-400" />
                ) : null}
              </div>

              {/* Title & Max Price */}
              <div className="mb-4 text-center">
                <h3 className={cn("font-bold", isNext ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-900 dark:text-zinc-100")}>
                  {tier.title}
                </h3>
                <div className="mt-1 flex items-baseline justify-center gap-1">
                  <span className="text-xs text-zinc-500">{language === 'ja' ? "上限" : "Max"}</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(tier.maxPrice, language)}
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="mb-4 grid grid-cols-2 gap-2 text-[10px]">
                <div className="rounded bg-white/50 p-2 dark:bg-black/20">
                  <div className="mb-1 flex items-center gap-1 text-zinc-500">
                    <TrendingUp className="h-3 w-3" />
                    <span>{t("credit.est_revenue")}</span>
                  </div>
                  <div className="font-bold text-zinc-700 dark:text-zinc-300">
                    {formatCurrency(tier.avgWeeklyIncome, language)}
                  </div>
                </div>
                <div className="rounded bg-white/50 p-2 dark:bg-black/20">
                  <div className="mb-1 flex items-center gap-1 text-zinc-500">
                    <Clock className="h-3 w-3" />
                    <span>{t("credit.upgrade_time")}</span>
                  </div>
                  <div className="font-bold text-zinc-700 dark:text-zinc-300">
                    {tier.upgradeTime}
                  </div>
                </div>
              </div>

              {/* Requirements List */}
              <div className="flex-1">
                <p className="mb-2 text-xs font-medium text-zinc-500">{t("credit.requirement")}:</p>
                <ul className="space-y-1.5">
                  {tier.requirements?.map((req, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              {isNext && (
                <button
                  onClick={() => onUpgradeClick?.(tier.level)}
                  className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  {language === 'ja' ? `${tier.title}へアップグレード` : `Upgrade to ${tier.title}`}
                </button>
              )}
              
              {isUnlocked && tier.level === 5 && (
                <div className="mt-4 text-center text-[10px] text-indigo-600 font-medium">
                  {language === 'ja' ? "レジェンドステータス有効" : "Legend Status Active"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
