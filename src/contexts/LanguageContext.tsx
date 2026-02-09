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
    
    // Tier 0
    "tier.0.title": "Newcomer",
    "tier.0.description": "Simply register. Publish guides for spots you know well.",
    "tier.0.time": "0 min",
    "tier.0.process": "Email Registration",
    "tier.0.privilege.email": "Email Registered",
    "tier.0.privilege.draft": "Publish Guides",
    "tier.0.req.0": "Email",
    "tier.0.suggestion": "Authentic local spots, the more local the better.",

    // Tier 1
    "tier.1.title": "Pal Host",
    "tier.1.description": "Real Name, Phone, Line ID, Follow IG. Verified local friend.",
    "tier.1.time": "Instant",
    "tier.1.process": "Profile + SNS Follow",
    "tier.1.privilege.verified": "Identity & Contact Verified",
    "tier.1.req.0": "Real Name",
    "tier.1.req.1": "Phone Number",
    "tier.1.req.2": "Line ID",
    "tier.1.req.3": "Follow Official IG",
    "tier.1.suggestion": "Local cultural spots, hidden dining and drinking spots.",

    // Tier 2
    "tier.2.title": "Vibe Host",
    "tier.2.description": "Real Name, SNS (TikTok/IG). Social transparency building trust.",
    "tier.2.time": "10 mins (AI)",
    "tier.2.process": "SNS Connect + Real Name",
    "tier.2.privilege.social": "Social Media Connected",
    "tier.2.privilege.ai": "Real Name Verified",
    "tier.2.req.0": "Real Name",
    "tier.2.req.1": "SNS Vibe Check",
    "tier.2.suggestion": "Craftsmanship experiences, familiar places, local eateries, art galleries.",

    // Tier 3
    "tier.3.title": "Ace Host",
    "tier.3.description": "ID Verified, Video Interview. Specialized in Anime, Gourmet, Fashion.",
    "tier.3.time": "1-2 days",
    "tier.3.process": "ID + Video + Tagging",
    "tier.3.privilege.id": "ID & Video Verified",
    "tier.3.privilege.badge": "Ace Host Badge",
    "tier.3.req.0": "ID Verification",
    "tier.3.suggestion": "Unique hobbies and skills: Manga, models, amateur theater, private artist visits.",

    // Tier 4
    "tier.4.title": "Maestro Host",
    "tier.4.description": "Invitation Only. Professionals, Celebrities, Artists. Custom pricing.",
    "tier.4.time": "Invitation Only",
    "tier.4.process": "Concierge Onboarding",
    "tier.4.privilege.global": "Global Influence",
    "tier.4.privilege.legend": "Maestro Badge",
    "tier.4.privilege.uncapped": "Uncapped Pricing",
    "tier.4.req.0": "Invitation Only",
    "tier.4.req.1": "Concierge Service",
    "tier.4.req.2": "Translation Support",
    "tier.4.suggestion": "Master craftsman workshops, unique cultural figures, celebrities.",
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

    // Tier 0
    "tier.0.title": "ニューカマー",
    "tier.0.description": "簡単登録。知っている場所のガイドを公開。",
    "tier.0.time": "0分",
    "tier.0.process": "メール登録",
    "tier.0.privilege.email": "メール登録済み",
    "tier.0.privilege.draft": "ガイド公開可能",
    "tier.0.req.0": "メール",
    "tier.0.suggestion": "地元の人が行く本物の場所、ローカルであればあるほど良い。",

    // Tier 1
    "tier.1.title": "パルホスト (Pal Host)",
    "tier.1.description": "実名、電話、LINE ID、公式IGフォロー。信頼できる地元の友達。",
    "tier.1.time": "即時",
    "tier.1.process": "プロフィール + SNSフォロー",
    "tier.1.privilege.verified": "身元・連絡先確認済み",
    "tier.1.req.0": "実名",
    "tier.1.req.1": "電話番号",
    "tier.1.req.2": "LINE ID",
    "tier.1.req.3": "公式IGフォロー",
    "tier.1.suggestion": "地元の文化的な場所、隠れ家的な飲食店。",

    // Tier 2
    "tier.2.title": "バイブホスト (Vibe Host)",
    "tier.2.description": "実名、SNS (TikTok/IG)。信頼を築くソーシャルな透明性。",
    "tier.2.time": "10分 (AI)",
    "tier.2.process": "SNS連携 + 実名",
    "tier.2.privilege.social": "SNS連携済み",
    "tier.2.privilege.ai": "実名認証済み",
    "tier.2.req.0": "実名",
    "tier.2.req.1": "SNS雰囲気チェック",
    "tier.2.suggestion": "手仕事体験、馴染みの場所、地元の小料理屋、美術館。",

    // Tier 3
    "tier.3.title": "エースホスト (Ace Host)",
    "tier.3.description": "身分証確認、ビデオ面接。アニメ、グルメ、ファッションの専門家。",
    "tier.3.time": "1-2日",
    "tier.3.process": "身分証 + ビデオ + タグ",
    "tier.3.privilege.id": "身分証 & ビデオ認証",
    "tier.3.privilege.badge": "エースホストバッジ",
    "tier.3.req.0": "身分証確認",
    "tier.3.suggestion": "独自の趣味や特技：漫画、模型、アマチュア演劇、アーティストのプライベート訪問。",

    // Tier 4
    "tier.4.title": "マエストロ (Maestro)",
    "tier.4.description": "完全招待制。著名人、アーティスト、職人のための特別ランク。カスタム価格。",
    "tier.4.time": "招待のみ",
    "tier.4.process": "コンシェルジュ対応",
    "tier.4.privilege.global": "グローバルな影響力",
    "tier.4.privilege.legend": "マエストロバッジ",
    "tier.4.privilege.uncapped": "価格上限なし",
    "tier.4.req.0": "完全招待制",
    "tier.4.req.1": "コンシェルジュサービス",
    "tier.4.req.2": "翻訳サポート",
    "tier.4.suggestion": "職人の工房、独特な文化人、スター、有名人。",
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
