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
    "about.title": "About LocalVibe",
    "about.slogan": "Make a local friend, experience real life.",
    "about.cta": "Become a Host",
    "about.mission": "Connecting local experts with global travelers.",
    "about.desc": "We empower locals to share their hidden gems and earn income by creating unique, curated travel guides for tourists.",
    "about.hero.title": "WHERE CULTURE MEETS CONNECTION.",
    "about.hero.subtitle": "your unique journey starts with a LocalVibe.",
    "about.hero.cta_host": "Become a host",
    "about.hero.cta_gallery": "Locals Show You Around",
    "gallery.title": "Locals Show You Around",
    "gallery.subtitle": "Explore guides created by our local experts.",
    "gallery.empty": "No guides created yet. Be the first!",
    "gallery.price": "Price",
    "gallery.steps": "steps",
    "gallery.view": "View Details",
    "credit.max_price": "Max Price",
    "credit.est_revenue": "Est. Revenue",
    "credit.upgrade_time": "Upgrade Time",
    "credit.requirement": "Requirement",
    "credit.current_level": "Current Level",
    "credit.upgrade_now": "Upgrade Now",
    "credit.locked": "Locked",
    "credit.trust_score": "Trust Score",
    "credit.uncapped": "Uncapped",
    "credit.recommended": "Recommended",
    "credit.high_conversion": "High Conversion",
    "credit.completed": "Completed",
    "credit.invitation_only": "Invitation Only",
    "credit.suggestion": "Suggested Activities",
    
    // Homepage
    "home.ai_active": "AI Agent Active",
    "home.hero.title": "Find a LocalVibe at your destination, make travel easier and more fun.",
    "home.hero.subtitle": "Your intelligent travel companion connecting you with local experts and hidden gems.",
    "home.visitor.title": "Find Your Vibe",
    "home.visitor.desc": "Let our AI agent match you with the perfect local host based on your interests.",
    "home.visitor.cta": "Start Exploring",
    "home.host.title": "Become a Host",
    "home.host.desc": "Share your local world",
    "home.dashboard.title": "Host Center",
    "home.dashboard.desc": "Manage guides & earnings",
    "home.gallery.title": "Locals Show You Around",
    "home.gallery.desc": "Explore community guides",
    "home.meetup.title": "Meetup Confirm",
    "home.meetup.desc": "Verify meeting status",
    "home.footer.powered": "Powered by LocalVibe AI Engine",

    // Registration
    "reg.title": "Join LocalVibe",
    "reg.desc": "Connect with the community. Verify your identity to start.",
    "reg.email": "Gmail Address",
    "reg.nickname": "Nickname",
    "reg.country": "Country",
    "reg.submit": "Verify & Join",
    "reg.gmail_error": "Please use a valid @gmail.com address",
    "reg.welcome": "Welcome back, ",
    "reg.change": "Change Account",

    // Dashboard
    "dashboard.create_guide": "Create New Guide",
    "dashboard.edit_guide": "Edit Guide",
    "dashboard.back": "Back",
    "dashboard.title": "LocalVibe Host Center",
    "dashboard.welcome": "Welcome back, ",
    "dashboard.my_guides": "My Guides",
    "dashboard.service_schedule": "Service Schedule",
    "dashboard.total_income": "Total Income",
    "dashboard.no_guides": "No active guides yet",
    "dashboard.set_availability": "Set your availability in guide settings",
    "dashboard.payout_note": "Payouts processed monthly",
    "dashboard.edit": "Edit",
    "dashboard.gender.male": "Male",
    "dashboard.gender.female": "Female",
    "dashboard.last_updated": "Last updated: ",
    "dashboard.sales": " Sales",
    "dashboard.status.active": "Active",
    
    // Tier 1
    "tier.1.title": "Basic Host",
    "tier.1.description": "Verified Student (.ac.jp). Minimal entry, basic authenticity.",
    "tier.1.time": "Instant",
    "tier.1.process": "SheerID + Basic Info",
    "tier.1.privilege.verified": "Identity & Contact Verified",
    "tier.1.req.0": "University Email",
    "tier.1.req.1": "Nickname",
    "tier.1.suggestion": "Campus tours, cheap eats, student life experiences.",

    // Tier 2
    "tier.2.title": "Social Host",
    "tier.2.description": "Vibe verified. 3 authentic photos required. No stock photos.",
    "tier.2.time": "10 mins (AI)",
    "tier.2.process": "Visual Audit (3 Photos)",
    "tier.2.privilege.social": "Social Media Connected",
    "tier.2.privilege.ai": "Vibe Check Passed",
    "tier.2.req.0": "3 Authentic Photos",
    "tier.2.req.1": "Public Instagram",
    "tier.2.suggestion": "Craftsmanship experiences, familiar places, local eateries, art galleries.",

    // Tier 3
    "tier.3.title": "Verified Host",
    "tier.3.description": "Identity verified via Stripe. Highest legal trust level.",
    "tier.3.time": "1-2 days",
    "tier.3.process": "Stripe Identity",
    "tier.3.privilege.id": "Identity Verified",
    "tier.3.privilege.badge": "Verified Badge",
    "tier.3.req.0": "Real Name Consistency",
    "tier.3.suggestion": "Unique hobbies and skills: Manga, models, amateur theater, private artist visits.",

    // Tier 4
    "tier.4.title": "Expert Host",
    "tier.4.description": "Tatami Labs linked. Cultural Translator capable of deep decoding.",
    "tier.4.time": "Invitation",
    "tier.4.process": "Tatami Labs Content",
    "tier.4.privilege.global": "Cultural Translator",
    "tier.4.privilege.legend": "Expert Badge",
    "tier.4.privilege.uncapped": "High Rate",
    "tier.4.req.0": "Tatami Labs Feature",
    "tier.4.req.1": "Deep Cultural Knowledge",
    "tier.4.suggestion": "Deep cultural immersion, artisan interviews, exclusive access.",

    // Tier 5
    "tier.5.title": "Legend",
    "tier.5.description": "The ultimate local authority. Invitation Only.",
    "tier.5.time": "Years",
    "tier.5.process": "Legacy",
    "tier.5.privilege.uncapped": "Uncapped Pricing",
    "tier.5.req.0": "Legend Status",
    "tier.5.suggestion": "Life-changing experiences.",
  },
  ja: {
    "nav.personal_center": "個人中心",
    "nav.gallery": "ギャラリー",
    "nav.about": "概要",
    "nav.dashboard": "ホストセンター",
    "about.title": "LocalVibeについて",
    "about.slogan": "地元の友達を作り、リアルな生活を体験する。",
    "about.cta": "ホストになる",
    "about.mission": "ローカルの知識を世界へ。",
    "about.desc": "私たちは、地元の人々が隠れた名所を共有し、観光客向けのユニークな旅行ガイドを作成して収益を得ることを支援します。",
    "about.hero.title": "文化と出会う、心がつながる。",
    "about.hero.subtitle": "あなただけの旅は、LocalVibeから始まる。",
    "about.hero.cta_host": "ホストになる",
    "about.hero.cta_gallery": "地元民と巡る",
    "gallery.title": "地元民と巡る",
    "gallery.subtitle": "ローカルエキスパートが作成したガイドを探索しましょう。",
    "gallery.empty": "まだガイドがありません。最初のガイドを作成しましょう！",
    "gallery.price": "価格",
    "gallery.steps": "ステップ",
    "gallery.view": "詳細を見る",
    "credit.max_price": "料金上限",
    "credit.est_revenue": "予想収入",
    "credit.upgrade_time": "昇格時間",
    "credit.requirement": "要件",
    "credit.current_level": "現在のレベル",
    "credit.upgrade_now": "今すぐアップグレード",
    "credit.locked": "ロック中",
    "credit.trust_score": "信頼スコア",
    "credit.uncapped": "無制限",
    "credit.recommended": "推奨",
    "credit.high_conversion": "高成約率",
    "credit.completed": "完了",
    "credit.invitation_only": "完全招待制",
    "credit.suggestion": "おすすめの活動",
    
    // Homepage
    "home.ai_active": "AIエージェント稼働中",
    "home.hero.title": "旅先でLocalVibeを見つけて、旅をもっと手軽に、もっと楽しく。",
    "home.hero.subtitle": "AIエージェントが、あなたにぴったりのローカル体験とホストをマッチングします。",
    "home.visitor.title": "旅を始める",
    "home.visitor.desc": "AIがあなたの好みを分析し、最適なホストとプランを提案します。",
    "home.visitor.cta": "探索する",
    "home.host.title": "ホストになる",
    "home.host.desc": "あなたの知識を価値に変える",
    "home.dashboard.title": "ホストセンター",
    "home.dashboard.desc": "ガイドと収益の管理",
    "home.gallery.title": "地元民と巡る",
    "home.gallery.desc": "コミュニティのガイドを見る",
    "home.meetup.title": "集合確認",
    "home.meetup.desc": "当日のステータス",
    "home.footer.powered": "Powered by LocalVibe AI Engine",

    // Registration
    "reg.title": "LocalVibeに参加",
    "reg.desc": "コミュニティとつながりましょう。本人確認をして始めましょう。",
    "reg.email": "Gmailアドレス",
    "reg.nickname": "ニックネーム",
    "reg.country": "国・地域",
    "reg.submit": "認証して参加",
    "reg.gmail_error": "有効な@gmail.comアドレスを使用してください",
    "reg.welcome": "おかえりなさい、",
    "reg.change": "アカウント切り替え",

    // Dashboard
    "dashboard.create_guide": "新しいガイドを作成",
    "dashboard.edit_guide": "ガイドを編集",
    "dashboard.back": "戻る",
    "dashboard.title": "ホスト個人センター",
    "dashboard.welcome": "おかえりなさい、",
    "dashboard.my_guides": "マイガイド",
    "dashboard.service_schedule": "スケジュール",
    "dashboard.total_income": "総収入",
    "dashboard.no_guides": "まだガイドがありません",
    "dashboard.set_availability": "ガイド設定で稼働日を設定してください",
    "dashboard.payout_note": "支払いは毎月処理されます",
    "dashboard.edit": "編集",
    "dashboard.gender.male": "男性",
    "dashboard.gender.female": "女性",
    "dashboard.last_updated": "最終更新: ",
    "dashboard.sales": " 販売数",
    "dashboard.status.active": "公開中",

    // Tier 1
    "tier.1.title": "ベーシックホスト",
    "tier.1.description": "学生認証済み (.ac.jp)。最低限のエントリー、基本的な信頼性。",
    "tier.1.time": "即時",
    "tier.1.process": "SheerID + 基本情報",
    "tier.1.privilege.verified": "身元・連絡先確認済み",
    "tier.1.req.0": "大学メールアドレス",
    "tier.1.req.1": "ニックネーム",
    "tier.1.suggestion": "キャンパスツアー、安くて美味しい店、学生生活体験。",

    // Tier 2
    "tier.2.title": "ソーシャルホスト",
    "tier.2.description": "Vibe確認済み。3枚の本物の写真が必要。ストックフォト不可。",
    "tier.2.time": "10分 (AI)",
    "tier.2.process": "ビジュアル監査 (写真3枚)",
    "tier.2.privilege.social": "SNS連携済み",
    "tier.2.privilege.ai": "Vibeチェック合格",
    "tier.2.req.0": "本物の写真3枚",
    "tier.2.req.1": "公開Instagram",
    "tier.2.suggestion": "職人体験、馴染みの場所、地元の食堂、アートギャラリー。",

    // Tier 3
    "tier.3.title": "認証ホスト",
    "tier.3.description": "Stripeによる本人確認済み。最高の法的信頼レベル。",
    "tier.3.time": "1-2日",
    "tier.3.process": "Stripe本人確認",
    "tier.3.privilege.id": "本人確認済み",
    "tier.3.privilege.badge": "認証バッジ",
    "tier.3.req.0": "実名の一致",
    "tier.3.suggestion": "ユニークな趣味やスキル：漫画、プラモデル、アマチュア演劇、アーティストのアトリエ訪問。",

    // Tier 4
    "tier.4.title": "エキスパートホスト",
    "tier.4.description": "Tatami Labs連携。日本の職人文化を深く解読できる「文化翻訳者」。",
    "tier.4.time": "招待制",
    "tier.4.process": "Tatami Labsコンテンツ",
    "tier.4.privilege.global": "文化翻訳者",
    "tier.4.privilege.legend": "エキスパートバッジ",
    "tier.4.privilege.uncapped": "高単価設定",
    "tier.4.req.0": "Tatami Labs特集",
    "tier.4.req.1": "深い文化知識",
    "tier.4.suggestion": "深い文化体験、職人インタビュー、特別なアクセス。",

    // Tier 5
    "tier.5.title": "レジェンド",
    "tier.5.description": "究極のローカル権威。完全招待制。",
    "tier.5.time": "数年",
    "tier.5.process": "レガシー",
    "tier.5.privilege.uncapped": "価格無制限",
    "tier.5.req.0": "レジェンドステータス",
    "tier.5.suggestion": "人生を変えるような体験。",
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
