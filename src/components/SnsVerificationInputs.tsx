"use client";

import { CheckCircle2, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SnsVerificationInputsProps {
  snsUrls: { [key: string]: string };
  onChange: (id: string, value: string) => void;
}

export function SnsVerificationInputs({ snsUrls, onChange }: SnsVerificationInputsProps) {
  const { language } = useLanguage();
  
  const platforms = [
    { id: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
    { id: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
    { id: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@..." },
    { id: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/..." }
  ];

  const validateUrl = (id: string, url: string) => {
    if (!url) return false;
    // Simple validation: must contain the platform name and be a URL
    return url.includes(id) && url.length > 10;
  };

  const validationStatus: { [key: string]: boolean } = {};
  Object.keys(snsUrls).forEach(key => {
    validationStatus[key] = validateUrl(key, snsUrls[key]);
  });

  const validCount = Object.values(validationStatus).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-indigo-900 dark:text-indigo-100">
            {language === "ja" ? "SNS連携 (任意 - AI活用)" : "Social Media (Optional)"}
          </h3>
        </div>
        <p className="text-xs text-indigo-700 dark:text-indigo-300">
          {language === "ja" 
            ? "Agentがあなたの自媒体を読み、魅力的なプロフィール文を自動作成します。" 
            : "Our agent will read your social media to write a beautiful profile introduction for you."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {platforms.map((platform) => (
          <div key={platform.id}>
            <label className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              {platform.label}
            </label>
            <div className="relative">
              <input
                type="text"
                value={snsUrls[platform.id] || ""}
                onChange={(e) => onChange(platform.id, e.target.value)}
                placeholder={platform.placeholder}
                className={`w-full rounded-lg border py-2 pl-3 pr-9 text-sm focus:outline-none focus:ring-1 ${
                  validationStatus[platform.id]
                    ? "border-green-300 focus:border-green-500 focus:ring-green-500 dark:border-green-800"
                    : "border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                }`}
              />
              {validationStatus[platform.id] && (
                <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-green-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      {validCount > 0 && (
        <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-3 w-3" />
          <span>
            {language === "ja" 
              ? `${validCount}つのアカウントが確認されました` 
              : `${validCount} account(s) verified`}
          </span>
        </div>
      )}
    </div>
  );
}
