"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ja";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    "nav.personal_center": "Personal Center",
    "nav.gallery": "Gallery",
    "nav.about": "About",
    "nav.dashboard": "Host Center",
    "about.title": "About localfriend",
    "about.slogan": "Make a local friend, experience real life.",
    "about.cta": "Become a Host",
    "about.mission": "Connecting local experts with global travelers.",
    "about.desc": "We empower locals to share their hidden gems and earn income by creating unique, curated travel guides for tourists.",
    "gallery.title": "Community Gallery",
    "gallery.subtitle": "Explore guides created by our local experts.",
    "gallery.empty": "No guides created yet. Be the first!",
    "gallery.price": "Price",
    "gallery.steps": "steps",
    "gallery.view": "View Details"
  },
  ja: {
    "nav.personal_center": "個人中心",
    "nav.gallery": "ギャラリー",
    "nav.about": "概要",
    "nav.dashboard": "ホストセンター",
    "about.title": "localfriendについて",
    "about.slogan": "地元の友達を作り、リアルな生活を体験する。",
    "about.cta": "ホストになる",
    "about.mission": "ローカルの知識を世界へ。",
    "about.desc": "私たちは、地元の人々が隠れた名所を共有し、観光客向けのユニークな旅行ガイドを作成して収益を得ることを支援します。",
    "gallery.title": "コミュニティギャラリー",
    "gallery.subtitle": "ローカルエキスパートが作成したガイドを探索しましょう。",
    "gallery.empty": "まだガイドがありません。最初のガイドを作成しましょう！",
    "gallery.price": "価格",
    "gallery.steps": "ステップ",
    "gallery.view": "詳細を見る"
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ja"); // Default to Japanese as per user persona

  const t = (key: string) => {
    return TRANSLATIONS[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
