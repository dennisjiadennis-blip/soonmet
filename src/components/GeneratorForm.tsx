/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GeneratorInput, LocationInput } from "@/lib/generator";
import { mapVibeToBokunCategory, parseDurationToMinutes } from "@/lib/bokun-mapper";
import { THEME_TAGS } from "@/lib/theme-tags";
import { Loader2, MapPin, Lightbulb, DollarSign, PenTool, Plus, Trash2, ArrowRight, ArrowLeft, Wallet, Globe, Clock, Mail, CheckCircle2, Calendar, ShieldCheck, Receipt, AlertTriangle, Info, QrCode, X, User, Phone, Sparkles, Flag, ChevronDown, Map, ZoomIn, Check, Search, Camera } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency, getCurrencySymbol } from "@/lib/currency";
import { DatePicker } from "@/components/DatePicker";
import { PriceInputWithValidation } from "@/components/PriceInputWithValidation";
import { TIER_CONFIG } from "@/lib/credit-types";
import { SnsVerificationInputs } from "@/components/SnsVerificationInputs";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { InteractiveMap } from "@/components/InteractiveMap";

interface GeneratorFormProps {
  onGenerate?: (input: GeneratorInput) => void;
  isGenerating: boolean;
  initialData?: GeneratorInput;
  initialEmail?: string;
  existingPayPayId?: string | null;
  hostLevel?: number;
  initialNickname?: string;
  initialCountry?: string;
  initialRealName?: string;
  initialPhone?: string;
  initialLineId?: string;
  initialWhatsapp?: string;
  initialUniversityName?: string;
  initialUniversityEmail?: string;
  initialGender?: string;
  initialAgeRange?: string;
  initialSnsAccounts?: string;
  initialSpecialTags?: string[];
  initialSheerIdVerified?: boolean;
  initialAvatarUrl?: string;
  initialIsPublicIg?: boolean;
  initialBio?: string;
  currentStep?: number;
  onStepChange?: (step: number) => void;
}

const TEXTS = {
  ja: {
    intro: {
      title: "観光ガイド作成フロー",
      desc1: "1. あなたの「ローカル知識」を入力",
      desc2: "2. AIが「販売用コンテンツ」を自動生成（翻訳・要約・デザイン）",
      desc3: "3. デジタルガイド販売 ＆ ツアー開催で収益化",
      start: "作成を開始する",
      targetLangLabel: "あなたの国 (Country)",
      targetLangHint: "観光収入トップ20カ国から選択",
      emailLabel: "メールアドレス (Email)",
      emailPlaceholder: "example@email.com",
      nicknameLabel: "ニックネーム (English Nickname)",
      nicknamePlaceholder: "例：Taro",
      bioLabel: "自己紹介 (Bio / Intro)",
      bioPlaceholder: "あなたのユニークな背景や、ゲストへの想いを書いてください...",
      bioHint: "※ AIが自動生成した「在地领路人」プロフィールがここに入ります",
    },
    stepLanguage: {
      title: "ターゲット言語 (Target Language)",
      label: "どの言語圏の旅行者をターゲットにしますか？",
      next: "次へ：テーマ設定"
    },
    step1: {
      title: "ガイドのテーマ (Title)",
      label: "観光客向けではない「フック」を作成してください",
      bad: "悪い例：東京ガイド",
      good: "良い例：秋叶原裏世界：レトロ模型店 + メイドカフェ + 英語OKなバー",
      placeholder: "例：京都の夜：ジャズバーと深夜のラーメン",
      next: "次へ：スポット登録"
    },
    step2: {
      title: "スポット登録 (Stops)",
      label: "隠れ家スポットを順番に追加",
      stopTitle: "スポット",
      nameLabel: "店名・場所・施設名 (Location Name)",
      namePlaceholder: "例：ブルーボトル青山",
      addressLabel: "住所 (Address)",
      addressPlaceholder: "例：東京都港区南青山3-13-14",
      // transportLabel: "交通 (Transport)", 
      // transportPlaceholder: "可选项，用自然语言去描述最近的地铁站后如何到达集合地点", 
      featuresLabel: "特徴 (Features) - タグを選択または入力",
      featuresPlaceholder: "タグを選択するか、独自の特徴を入力してください...",
      costLabel: "ゲスト予算 (Guest Cost)",
      costPlaceholder: "例：1200",
      addLocation: "次のスポットを追加",
      prevStop: "前のスポット",
      nextStop: "次のスポット",
      removeLocation: "削除",
      finish: "終了して価格設定へ",
      vibeTagsLabel: "🏷️ ここを推薦する強い理由",
      vibeTagsHint: "クリックして特徴を自動入力",
      photosLabel: "写真 (必須)",
      photosHint: "横長の写真をアップロードしてください（6枚以上）。AIが16:9に最適化します。楽しそうな雰囲気で、人々が笑い合っている写真を選んでください。",
      uploadBtn: "写真をアップロード",
      photosCount: "/ 6枚",
      altTextLabel: "代替テキスト (SEO)",
      altTextPlaceholder: "Google検索用に画像の説明を入力...",
      videoUrlLabel: "紹介動画URL (YouTube/Vimeo) [任意]",
      videoUrlPlaceholder: "https://youtube.com/watch?v=...",
      videoUrlHint: "動画があるとBókunでの成約率が大幅に向上します",
    },
    step3: {
      title: "収益化設定 (Monetization)",
      tourDetailsTitle: "ツアー詳細 (Tour Details)",
      durationLabel: "所要時間 (Duration)",
      durationPlaceholder: "例：3時間",
      meetingPointLabel: "集合場所 (Meeting Point)",
      meetingPointPlaceholder: "例：新宿駅東口 交番前（正確な場所を入力）",
      pricingTitle: "価格設定 (Pricing)",
      productPriceLabel: "1. ガイド販売価格 (Digital Guide Price)",
      meetupPriceLabel: "2. ツアー同行価格 (Meetup Price / Hour)", 
      guestCostLabel: "3. ゲストの実費合計 (Est. Guest Expense)",
      placeholder: "例：1000",
      submit: "審査に提出する (Submit for Review)",
      submittedMessage: "谢谢上传，我们正在审核，可能需要4个工作日，并会通过邮件以及客服line 与您联系",
      back: "戻って修正",
      // New Step 3 Texts
      sectionCost: "A. 収益と費用 (Pricing & Cost)",
      
      offlineServiceLabel: "オフラインガイド (Offline Service)",
      offlineServiceDesc: "我愿意提供线下的导览服务并赚取佣金 (I am willing to provide offline tour services)",
      
      instantConfLabel: "即時予約確定 (Instant Confirmation)",
      instantConfDesc: "予約を自動承認して掲載順位をアップ (Boost Ranking)",
      cancelPolicyLabel: "キャンセルポリシー (Cancellation Policy)",
      cancelPolicy24: "24時間前まで無料キャンセル (推奨)",
      cancelPolicy48: "48時間前まで無料キャンセル",
      cancelPolicyStrict: "厳格 (返金なし)",
      
      hostFeeLabel: "Host サービス料 (Host Fee)",
      hostFeeDesc: "あなたのガイド料です (1時間あたり)",
      inclusionsLabel: "費用に含まれるもの (Guide Fee Only)",
      inclusionsDesc: "※ 交通費・食事代・チケット代は一切含まれません",
      
      productPriceDesc: "此guide 将作为高端电子旅游产品，在全球OTA平台（TripAdvisor, Viator等）上架销售。",
      
      sectionPayout: "B. 受取設定 (Payout)",
      sectionService: "C. サービス提供 (Service)",
      sectionProfile: "D. ホスト情報 (Profile)",
      sectionStandards: "E. 基準と確認 (Standards)",
      
      guestExpenseLabel: "ゲスト実費見積 (1人あたり)",
      guestExpenseDesc: "交通費、食費、チケット代など (0円も可)",
      addItem: "項目を追加",
      itemName: "項目名",
      itemAmount: "金額",
      shared: "ゲストがホスト分も負担 (Guest Treats)",
      personal: "ゲストは自分の分のみ負担 (Guest Only)",
      totalGuest: "ゲスト負担合計",
      
      maxGroupSizeLabel: "最大グループ人数 (Max Group Size)",
      
      paypayId: "PayPay ID",
      paypayQr: "PayPay QRコード画像",
      uploadQr: "QR画像をアップロード",
      
      frequency: "週間稼働日数",
      daysPerWeek: "日 / 週",
      startDate: "サービス開始可能日",
      auditNote: "※ 審査に3日 + 準備に1日かかります",
      
      standardsTitle: "サービス基準確認",
      stdDiscrim: "差別的言動を行いません (No Discrimination)",
      stdBoundaries: "サービスの境界線を理解しています (Boundaries)",
      stdRefund: "返金ポリシーに同意します (Refund Policy)",
      
      verificationTitle: "当日の消込フロー",
      verificationStep1: "1. ゲストが確認コードを提示",
      verificationStep2: "2. Hostがアプリに入力",
      verificationStep3: "3. 報酬支払い実行",
      yes: "はい",
      no: "いいえ",
      selectType: "タイプを選択",
      
      policiesTitle: "重要事項・キャンセル規定",
      policyVisitorCancel: "ゲストキャンセル：24時間前まで全額返金",
      policyVisitorPayment: "ゲスト支払い：予約時に事前決済",
      policyHostPayout: "報酬受取：ゲストの「集合コード」確認後に送金",
      policyHostCancel: "ホストキャンセル：48時間前までに要連絡",
      policyHostCancelPath: "キャンセル方法：運営LINEへ連絡",

      weekdays: {
        Mon: "月",
        Tue: "火",
        Wed: "水",
        Thu: "木",
        Fri: "金",
        Sat: "土",
        Sun: "日"
      }
    },
    loading: "審査へ提出中...",
    tryExample: "✨ 良い例を試す (Auto-Fill)"
  },
  en: {
    intro: {
      title: "Guide Creation Flow",
      desc1: "1. Input your 'Local Knowledge'",
      desc2: "2. AI generates 'Sales Content' (Translate/Format)",
      desc3: "3. Earn from Digital Guides & Meetups",
      start: "Start Creating",
      targetLangLabel: "Your Country",
      targetLangHint: "Select from top 20 tourism countries",
      emailLabel: "Email Address",
      emailPlaceholder: "example@email.com",
      nicknameLabel: "Nickname (English)",
      nicknamePlaceholder: "e.g. Taro",
      bioLabel: "Bio / Self Intro",
      bioPlaceholder: "Share your unique background and passion for hosting...",
      bioHint: "* AI-generated 'Local Insider' profile will appear here",
    },
    stepLanguage: {
      title: "Target Language",
      label: "Which language speakers do you want to host?",
      next: "Next: Guide Theme"
    },
    step1: {
      title: "Guide Theme (Title)",
      label: "Choose or write a super attractive travel guide name",
      bad: "Bad: \"Tokyo Guide\"",
      good: "Good: \"Nakameguro Late Night: Craft Beer...\"",
      placeholder: "e.g. Shibuya Back Alley Seafood...",
      next: "Next: Add Stops"
    },
    step2: {
      title: "Add Stops",
      label: "Add locations in order",
      stopTitle: "Stop",
      nameLabel: "Location Name (Shop / Place Name)",
      namePlaceholder: "e.g. Blue Bottle Aoyama",
      addressLabel: "Address",
      addressPlaceholder: "e.g. 3-13-14 Minami-Aoyama",
      // transportLabel: "Transport", 
      // transportPlaceholder: "Optional: Describe how to reach the meeting point from the nearest station", 
      featuresLabel: "Features - Select Tags or Type",
      featuresPlaceholder: "Select tags above or type your own custom features here...",
      costLabel: "Guest Cost (JPY)",
      costPlaceholder: "e.g. 1200",
      addLocation: "Add Next Stop",
      prevStop: "Previous Stop",
      nextStop: "Next Stop",
      removeLocation: "Remove",
      finish: "Finish & Set Price",
      vibeTagsLabel: "🏷️ Strong Reasons to Recommend",
      vibeTagsHint: "Click to auto-fill features",
      photosLabel: "Photos (Required)",
      photosHint: "Please upload landscape photos (6+). AI optimizes to 16:9. Choose joyful photos with people laughing together.",
      uploadBtn: "Upload Photos",
      photosCount: "Photos (Min 6)",
      altTextLabel: "Alt Text (SEO)",
      altTextPlaceholder: "Describe photo for Google...",
      videoUrlLabel: "Video URL (YouTube/Vimeo) [Optional]",
      videoUrlPlaceholder: "https://youtube.com/watch?v=...",
      videoUrlHint: "Video significantly boosts conversion on Bókun",
    },
    step3: {
      title: "Monetization",
      tourDetailsTitle: "Tour Details",
      durationLabel: "Duration (Hours)",
      durationPlaceholder: "e.g. 3 Hours",
      meetingPointLabel: "Meeting Point",
      meetingPointPlaceholder: "e.g. Shinjuku Station East Exit (Be specific)",
      pricingTitle: "Pricing",
      productPriceLabel: "1. Digital Guide Price",
      meetupPriceLabel: "2. Meetup Price / Hour", 
      guestCostLabel: "3. Est. Guest Expense (Total)",
      placeholder: "e.g. 1000",
      submit: "Submit for Review",
      submittedMessage: "Thank you for uploading. We are reviewing your submission. It may take 4 business days. We will contact you via email and Line.",
      back: "Back",
      // New Step 3 Texts
      sectionCost: "A. Pricing & Cost",
      
      offlineServiceLabel: "Offline Guide Service",
      offlineServiceDesc: "I am willing to provide offline tour services and earn commissions",
      
      instantConfLabel: "Instant Confirmation",
      instantConfDesc: "Boost ranking by auto-confirming bookings",
      cancelPolicyLabel: "Cancellation Policy",
      cancelPolicy24: "Free cancel up to 24h before (Recommended)",
      cancelPolicy48: "Free cancel up to 48h before",
      cancelPolicyStrict: "Strict (No refund)",
      
      productPriceDesc: "This guide will be listed on global OTAs (TripAdvisor, Viator, etc.) as a premium digital product.",
      
      sectionPayout: "B. Payout Config",
      sectionService: "C. Service & Availability",
      sectionProfile: "D. Host Profile",
      sectionStandards: "E. Service Standards",
      
      hostFeeLabel: "Host Fee",
      hostFeeDesc: "Your earning for the service (per hour)",
      inclusionsLabel: "Inclusions (Guide Fee Only)",
      inclusionsDesc: "※ Transport, Meals, and Tickets are NOT included.",
      
      guestExpenseLabel: "Est. Visitor Expense (Per Person)",
      guestExpenseDesc: "Food, Tickets, Transport, etc. (Can be 0)",
      addItem: "Add Item",
      itemName: "Item Name",
      itemAmount: "Amount",
      shared: "Guest covers Host & Self",
      personal: "Guest pays Self only",
      totalGuest: "Total Est. Expense",
      
      maxGroupSizeLabel: "Max Group Size",
      
      paypayId: "PayPay ID",
      paypayQr: "PayPay QR Code",
      uploadQr: "Upload QR Image",
      
      frequency: "Weekly Availability",
      daysPerWeek: "days / week",
      startDate: "Earliest Start Date",
      auditNote: "* Requires 3 days for audit + 1 day prep",
      
      standardsTitle: "Standards Confirmation",
      stdDiscrim: "I agree to the Anti-Discrimination Policy",
      stdBoundaries: "I understand Service Boundaries",
      stdRefund: "I agree to the Refund Policy",
      
      verificationTitle: "Verification Flow",
      verificationStep1: "1. Visitor shows Code",
      verificationStep2: "2. Host enters Code",
      verificationStep3: "3. Payout Released",
      yes: "Yes",
      no: "No",
      selectType: "Select Type",

      policiesTitle: "Policies & Important Notes",
      policyVisitorCancel: "Visitor Cancel: Full refund up to 24h before",
      policyVisitorPayment: "Visitor Payment: 100% Prepayment",
      policyHostPayout: "Payout: Released after verifying 'Meetup Code'",
      policyHostCancel: "Host Cancel: Must notify 48h in advance",
      policyHostCancelPath: "How to Cancel: Contact Support via LINE",
      
      weekdays: {
        Mon: "Mon",
        Tue: "Tue",
        Wed: "Wed",
        Thu: "Thu",
        Fri: "Fri",
        Sat: "Sat",
        Sun: "Sun"
      }
    },
    loading: "Submitting...",
    tryExample: "✨ Try Example (Auto-Fill)"
  }
};







const TARGET_LANGUAGES = [
  { value: "English", label: "English (英語)", icon: "🇺🇸" },
  { value: "French", label: "French (フランス語)", icon: "🇫🇷" },
  { value: "Spanish", label: "Spanish (スペイン語)", icon: "🇪🇸" },
  { value: "Korean", label: "Korean (韓国語)", icon: "🇰🇷" },
  { value: "Chinese", label: "Chinese (中国語)", icon: "🇨🇳" },
  { value: "Any", label: "Any Visitor (AI Translated)", icon: "🤖" }
];

const TOP_COUNTRIES = [
  "United States", "Spain", "France", "Thailand", "United Kingdom",
  "Italy", "Australia", "Germany", "Japan", "China",
  "Turkey", "Mexico", "Canada", "Hong Kong", "India",
  "Austria", "Portugal", "Greece", "Malaysia", "Netherlands"
];

// const COUNTRY_TO_LANG: Record<string, string> = {
//   "United States": "English",
//   "United Kingdom": "English",
//   "Australia": "English",
//   "Canada": "English",
//   "New Zealand": "English",
//   "Japan": "Japanese",
//   "China": "Chinese",
//   "Hong Kong": "Chinese",
//   "Taiwan": "Chinese",
//   "France": "French",
//   "Spain": "Spanish",
//   "Mexico": "Spanish",
//   "Germany": "German",
//   "Italy": "Italian",
//   "Korea": "Korean"
// };

export function GeneratorForm({ 
  isGenerating, 
  initialData, 
  initialEmail, 
  onGenerate, 
  existingPayPayId, 
  hostLevel = 0,
  initialNickname,
  initialCountry,
  initialRealName,
  initialPhone,
  initialLineId,
  initialWhatsapp,
  initialUniversityName,
  initialUniversityEmail,
  initialGender,
  initialAgeRange,
  initialSnsAccounts,
  initialSpecialTags,
  initialSheerIdVerified,
  initialAvatarUrl,
  initialIsPublicIg,
  initialBio,
  currentStep,
  onStepChange
}: GeneratorFormProps) {
  const { language } = useLanguage(); // Global UI language
  const [outputLanguage, setOutputLanguage] = useState<"Japan" | "Other">("Other"); // PDF Output Language (Default English)
  
  const [internalStep, setInternalStep] = useState<number>(0);
  const step = currentStep !== undefined ? currentStep : internalStep;

  const setStep = useCallback((value: number | ((prev: number) => number)) => {
    const nextStep = typeof value === 'function' ? value(step) : value;
    if (onStepChange) {
      onStepChange(nextStep);
    } else {
      setInternalStep(nextStep);
    }
  }, [step, onStepChange]);

  // const [isInclusionsOpen, setIsInclusionsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // AI Magic Note State
  const [magicNotes, setMagicNotes] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  // Check if profile is pre-filled
  const isProfilePreFilled = !!(initialNickname && initialCountry && initialRealName && initialPhone);
  
  // SNS State
  const [snsUrls, setSnsUrls] = useState<{ [key: string]: string }>({
    facebook: "",
    instagram: "",
    linkedin: "",
    tiktok: ""
  });
  
  const [formData, setFormData] = useState<GeneratorInput>({
    title: "",
    targetLanguage: ["English"], // Default
    enableOfflineService: true, // Default to true
    locations: [],
    duration: "",
    meetingPoint: "",
    productPrice: "1000",
    meetupPrice: "5000",
    guestCostBreakdown: [],
    payoutId: existingPayPayId || "",
    includedItems: [],
    earliestServiceDate: "",
    // serviceFrequency: 2, // Deprecated
    availability: [
      { dayOfWeek: "Mon", enabled: false, startTime: "09:00", endTime: "18:00" },
      { dayOfWeek: "Tue", enabled: false, startTime: "09:00", endTime: "18:00" },
      { dayOfWeek: "Wed", enabled: false, startTime: "09:00", endTime: "18:00" },
      { dayOfWeek: "Thu", enabled: false, startTime: "09:00", endTime: "18:00" },
      { dayOfWeek: "Fri", enabled: true, startTime: "18:00", endTime: "22:00" },
      { dayOfWeek: "Sat", enabled: true, startTime: "10:00", endTime: "22:00" },
      { dayOfWeek: "Sun", enabled: true, startTime: "10:00", endTime: "22:00" },
    ],
    hostProfile: {
      email: initialEmail || "",
      fullName: initialRealName || "",
      nickname: initialNickname || "",
      phone: initialPhone || "",
      lineId: initialLineId || "",
      whatsapp: initialWhatsapp || "",
      universityName: initialUniversityName || "",
      universityEmail: initialUniversityEmail || "",
      country: initialCountry || "",
      gender: initialGender as 'male' | 'female',
      ageRange: initialAgeRange,
      snsAccounts: initialSnsAccounts,
      sheerIdVerified: initialSheerIdVerified,
      avatarUrl: initialAvatarUrl,
      isPublicIg: initialIsPublicIg,
      specialTags: initialSpecialTags,
      bio: initialBio,
      preferredContactTime: ""
    },
    standards: {
      noDiscrimination: true,
      boundaryConfirmed: true,
      refundPolicyConfirmed: true,
      instantConfirmation: true, // Default
      cancellationPolicy: "24h" // Default
    }
  });

  // AI Title Generation State
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [titleCandidates, setTitleCandidates] = useState<any[]>([]);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [showTitleCandidates, setShowTitleCandidates] = useState(false);
  
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isEstimatingCost, setIsEstimatingCost] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState<Record<number, boolean>>({});
  const [aiError, setAiError] = useState<{index: number, message: string, details?: string} | null>(null);
  const [photoError, setPhotoError] = useState<{index: number, message: string} | null>(null);
  const [isFetchingPhotos, setIsFetchingPhotos] = useState<Record<number, boolean>>({});
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isFindingStation, setIsFindingStation] = useState(false);

  const findNearestSubwayExit = () => {
    if (!window.google) return;
    
    // Use the first location as the reference point
    const targetLoc = formData.locations[0];
    if (!targetLoc || (!targetLoc.name && !targetLoc.address)) {
        alert(language === "ja" ? "先にスポットを追加してください" : "Please add a stop first");
        return;
    }

    setIsFindingStation(true);
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    
    const searchForStation = (location: google.maps.LatLng) => {
        const request: google.maps.places.PlaceSearchRequest = {
            location: location,
            rankBy: window.google.maps.places.RankBy.DISTANCE,
            type: 'subway_station'
        };

        const formatMeetingPoint = (station: google.maps.places.PlaceResult) => {
            const stationName = station.name || "";
            const stationVicinity = station.vicinity || "";
            const targetName = targetLoc.name || (language === "ja" ? "目的地" : "Destination");
            
            if (language === "ja") {
                return `${stationName} (${stationVicinity}) - ${targetName}に一番近い出口`;
            } else {
                return `${stationName} (${stationVicinity}) - Nearest Exit to ${targetName}`;
            }
        };

        const findExitAndSetState = (station: google.maps.places.PlaceResult) => {
            const stationName = station.name || "";
            // Clean name: remove (Japan), (Tokyo), and "Sta."/"Station" suffix for better keyword matching
            const cleanName = stationName
                .replace(/\(.*\)/g, '')
                .replace(/Sta\.?$/i, '')
                .replace(/Station$/i, '')
                .trim();
            
            const exitKeyword = language === "ja" ? `${cleanName} 出口` : `${cleanName} Exit`;
            
            const exitRequest: google.maps.places.PlaceSearchRequest = {
                location: location, // Search relative to the TARGET location, not the station
                rankBy: window.google.maps.places.RankBy.DISTANCE,
                keyword: exitKeyword
            };

            service.nearbySearch(exitRequest, (exitResults, exitStatus) => {
                if (exitStatus === window.google.maps.places.PlacesServiceStatus.OK && exitResults && exitResults.length > 0) {
                    // Found a specific exit POI!
                    const bestExit = exitResults[0];
                    let exitName = bestExit.name || "";
                    const address = bestExit.vicinity || "";

                    // Ensure Station Name is included for clarity if missing
                    // e.g. "Exit A1" -> "Shinjuku Station Exit A1"
                    if (!exitName.toLowerCase().includes(cleanName.toLowerCase())) {
                        exitName = `${cleanName} ${exitName}`;
                    }
                    
                    // Construct a very specific street-level meeting point description
                    let meetingPoint = "";
                    
                    if (language === "ja") {
                        // Japanese: [Exit Name] 地上出口前 (住所: [Address])
                        meetingPoint = `${exitName} 地上出口前 (住所: ${address})`;
                    } else {
                        // English: Ground Level at [Exit Name] (Address: [Address])
                        meetingPoint = `Ground Level at ${exitName} (Address: ${address})`;
                    }
                    
                    setFormData(prev => ({ ...prev, meetingPoint }));
                } else {
                    // Fallback to generic description if no specific exit POI found
                    const meetingPoint = formatMeetingPoint(station);
                    setFormData(prev => ({ ...prev, meetingPoint }));
                }
                setIsFindingStation(false);
            });
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                findExitAndSetState(results[0]);
            } else {
                 const trainRequest: google.maps.places.PlaceSearchRequest = {
                    location: location,
                    rankBy: window.google.maps.places.RankBy.DISTANCE,
                    type: 'train_station'
                };
                service.nearbySearch(trainRequest, (trainResults, trainStatus) => {
                     if (trainStatus === window.google.maps.places.PlacesServiceStatus.OK && trainResults && trainResults.length > 0) {
                        findExitAndSetState(trainResults[0]);
                     } else {
                         alert(language === "ja" ? "近くの駅が見つかりませんでした" : "No nearby station found");
                         setIsFindingStation(false);
                     }
                });
            }
        });
    };

    if (targetLoc.latitude && targetLoc.longitude) {
        searchForStation(new window.google.maps.LatLng(targetLoc.latitude, targetLoc.longitude));
    } else {
        const query = [targetLoc.name, targetLoc.address].filter(Boolean).join(" ");
        service.textSearch({ query }, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                const geometry = results[0].geometry;
                if (geometry && geometry.location) {
                    searchForStation(geometry.location);
                } else {
                    setIsFindingStation(false);
                     alert(language === "ja" ? "場所の位置情報が取得できませんでした" : "Could not determine location coordinates");
                }
            } else {
                setIsFindingStation(false);
                alert(language === "ja" ? "場所が見つかりませんでした" : "Location not found");
            }
        });
    }
  };

  const calculateTotalGuestExpense = () => {
    return formData.locations.reduce((total, loc) => {
      if (!loc.cost) return total;
      
      // Handle ranges like "3,000 - 5,000"
      const rangeMatch = loc.cost.toString().match(/(\d+(?:,\d+)*)\s*[-~]\s*(\d+(?:,\d+)*)/);
      if (rangeMatch) {
        const min = parseInt(rangeMatch[1].replace(/,/g, ''), 10);
        const max = parseInt(rangeMatch[2].replace(/,/g, ''), 10);
        if (!isNaN(min) && !isNaN(max)) {
           return total + Math.round((min + max) / 2);
        }
      }

      // Handle single values
      const match = loc.cost.toString().match(/(\d+(?:,\d+)*)/);
      if (match) {
        const val = parseInt(match[1].replace(/,/g, ''), 10);
        return total + (isNaN(val) ? 0 : val);
      }
      return total;
    }, 0);
  };

  const fetchPhotosByTextSearch = (index: number, query: string) => {
    if (!window.google) {
        setPhotoError({ index, message: "Google Maps API not loaded" });
        return;
    }
    
    if (!query) {
        setPhotoError({ index, message: language === "ja" ? "店名または住所が空です" : "Name/Address is empty" });
        return;
    }
    
    setIsFetchingPhotos(prev => ({ ...prev, [index]: true }));
    setPhotoError(null);

    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    
    service.textSearch({ query }, (results, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !results || results.length === 0) {
            setIsFetchingPhotos(prev => ({ ...prev, [index]: false }));
            setPhotoError({
                index,
                message: language === "ja" 
                  ? `検索失敗 (${status})` 
                  : `Search failed (${status})`
            });
            return;
        }

        // Try to find the best candidate (preferably one with photos already visible)
        // If not, take the first one.
        const candidate = results.find(r => r.photos && r.photos.length > 0) || results[0];
        
        if (!candidate.place_id) {
            setIsFetchingPhotos(prev => ({ ...prev, [index]: false }));
            setPhotoError({
                index,
                message: language === "ja" ? "場所IDが見つかりませんでした" : "No Place ID found"
            });
            return;
        }

        // Always fetch details to ensure we get the full photo list (TextSearch often returns limited photos)
        service.getDetails({
            placeId: candidate.place_id,
            fields: ['photos', 'rating', 'user_ratings_total', 'reviews', 'types', 'price_level']
        }, (place, detailStatus) => {
            setIsFetchingPhotos(prev => ({ ...prev, [index]: false }));

            if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK && place) {
                 if (place.rating) updateLocation(index, "googleRating", place.rating);
                 if (place.user_ratings_total) updateLocation(index, "googleUserRatingsTotal", place.user_ratings_total);
                 if (place.reviews) updateLocation(index, "googleReviews", place.reviews);
                 if (place.types) updateLocation(index, "googleTypes", place.types);
                 if (place.price_level) updateLocation(index, "googlePriceLevel", place.price_level);
            }

            if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK && place && place.photos && place.photos.length > 0) {
                const photoUrls = place.photos.map(p => {
                    if (p && typeof p.getUrl === 'function') {
                        return p.getUrl({ maxWidth: 1200, maxHeight: 1200 });
                    }
                    return null;
                }).filter(Boolean) as string[];

                if (photoUrls.length > 0) {
                    updateLocation(index, "googlePhotos", photoUrls);
                    updateLocation(index, "images", photoUrls.slice(0, 10));
                    updateLocation(index, "imageAlts", new Array(photoUrls.slice(0, 10).length).fill(""));
                    updateLocation(index, "googlePlaceId", candidate.place_id);
                    estimateLocationCost(index, true);
                    return;
                }
            }

            // Fallback: If getDetails failed but we had photos in the original search result, use those
            if (candidate.photos && candidate.photos.length > 0) {
                 const photoUrls = candidate.photos.map(p => {
                    if (p && typeof p.getUrl === 'function') {
                        return p.getUrl({ maxWidth: 1200, maxHeight: 1200 });
                    }
                    return null;
                }).filter(Boolean) as string[];

                if (photoUrls.length > 0) {
                    updateLocation(index, "googlePhotos", photoUrls);
                    updateLocation(index, "images", photoUrls.slice(0, 10));
                    updateLocation(index, "imageAlts", new Array(photoUrls.slice(0, 10).length).fill(""));
                    updateLocation(index, "googlePlaceId", candidate.place_id);
                    estimateLocationCost(index, true);
                    return;
                }
            }

            setPhotoError({
                index,
                message: language === "ja" 
                  ? `写真が見つかりませんでした (DetailStatus: ${detailStatus})` 
                  : `No photos found (DetailStatus: ${detailStatus})`
            });
        });
    });
  };

  const estimateLocationCost = async (index: number, silent = false) => {
    const loc = formData.locations[index];
    // Relaxed check: Only name is strictly required. Address defaults to Tokyo if missing.
    if (!loc.name) {
       if (!silent) alert(language === "ja" ? "先に場所名を入力してください" : "Please enter a location name first");
       return;
    }
    
    setIsEstimatingCost(true);
    try {
      const addressToUse = loc.address || "Tokyo, Japan";
      
      // Re-use the same API but focus on cost
      const res = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationName: loc.name,
          address: addressToUse,
          language: language, // Pass current UI language
          googleData: {
             reviews: loc.googleReviews || [],
             types: loc.googleTypes || [],
             price_level: loc.googlePriceLevel || undefined,
             editorial_summary: ""
          }
        })
      });
      const data = await res.json();
      console.log(`[Cost Estimate] Location: ${loc.name}, Estimate: ${data.price_estimate}`);
      
      if (data.price_estimate) {
        updateLocation(index, "cost", data.price_estimate);
      } else {
         console.warn(`[Cost Estimate] No price estimate returned for ${loc.name}`);
      }
    } catch (e) {
      console.error("Cost estimation failed", e);
    } finally {
      setIsEstimatingCost(false);
    }
  };

  const analyzeLocation = async (index: number) => {
    const loc = formData.locations[index];
    if (!loc.name || !loc.address) {
       alert(language === "ja" ? "先に場所名と住所を入力してください" : "Please enter a location name and address first");
       return;
    }

    setIsAnalyzing(prev => ({ ...prev, [index]: true }));
    setAiError(null); // Clear previous errors

    // Clear previous AI results to avoid confusion
    const tempLocs = [...formData.locations];
    tempLocs[index].description = "Generating lush narrative..."; // Placeholder
    tempLocs[index].visualHook = "";
    setFormData({ ...formData, locations: tempLocs });

    try {
      // Extract Host Persona for AI
      const hostPersona = {
        nickname: formData.hostProfile?.nickname || "Local Host",
        gender: formData.hostProfile?.gender || "Guide",
        age: formData.hostProfile?.ageRange || "20s",
        tags: formData.hostProfile?.specialTags || [],
        country: formData.hostProfile?.country || "Japan"
      };

      // Extract Photos for Visual AI Analysis
      let photoUrlsForAnalysis: string[] = [];
      if (loc.googlePhotos && loc.googlePhotos.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          photoUrlsForAnalysis = loc.googlePhotos.map((p: any) => {
             if (typeof p === 'string') return p;
             if (p && typeof p.getUrl === 'function') {
                 return p.getUrl({ maxWidth: 1200, maxHeight: 1200 });
             }
             return null;
          }).filter(Boolean) as string[];
      }

      const res = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationName: loc.name,
          address: loc.address,
          language, // Pass current language (ja/zh/en)
          hostProfile: hostPersona, // Pass Host Persona
          googlePhotos: photoUrlsForAnalysis.slice(0, 10), // Pass up to 10 photos for gallery
          googleData: {
             reviews: loc.googleReviews,
             types: loc.googleTypes,
             price_level: loc.googlePriceLevel,
             rating: loc.googleRating,
             user_ratings_total: loc.googleUserRatingsTotal,
             editorial_summary: "",
             distance: loc.transport // Pass calculated distance
          },
          theme: formData.theme,
          tags: loc.tags || [],
          userFeatures: loc.features || ""
        })
      });
      
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      // Update Location
      const newLocs = [...formData.locations];
      if (data.price_estimate) newLocs[index].cost = data.price_estimate;
      if (data.description) newLocs[index].description = data.description;
      if (data.visual_hook) newLocs[index].visualHook = data.visual_hook;
      if (data.tags && Array.isArray(data.tags)) {
         const currentTags = newLocs[index].features ? newLocs[index].features.split(", ") : [];
         const newTags = [...new Set([...currentTags, ...data.tags])];
         newLocs[index].features = newTags.join(", ");
         newLocs[index].tags = newTags;
      }

      if (data.image_alts && Array.isArray(data.image_alts)) {
         newLocs[index].imageAlts = data.image_alts;
      }

      // Force Frontend Logic: Pure Authenticity (No Mock/Stock Images)
      // Only use Real Google Photos found locally. If none, leave empty for user upload.
      
      let finalImages: string[] = [];
      
      // 1. Extract Local Google Photos
      if (loc.googlePhotos && loc.googlePhotos.length > 0) {
          try {
             console.log(`[Frontend] Found ${loc.googlePhotos.length} local Google Photos for ${loc.name}`);
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             finalImages = loc.googlePhotos.map((p: any) => {
                 if (typeof p === 'string') return p;
                 if (p && typeof p.getUrl === 'function') {
                     return p.getUrl({ maxWidth: 1200, maxHeight: 1200 });
                 }
                 return null;
             }).filter(Boolean) as string[];
             console.log(`[Frontend] Extracted ${finalImages.length} valid local photo URLs`);
          } catch (e) {
             console.warn("Error extracting local Google Photos:", e);
          }
      } else {
          console.log(`[Frontend] No local Google Photos found. Keeping images empty for user upload.`);
      }

      // 2. Assign (Empty if no real photos found)
      newLocs[index].images = finalImages;
      
      setFormData({ ...formData, locations: newLocs });

    } catch (error: unknown) {
      console.error("Analysis failed", error);
      
      const errorMessage = (error as Error).message || "AI Analysis Failed";
      setAiError({
        index,
        message: errorMessage,
        details: errorMessage?.includes("API Not Enabled") 
          ? "https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=55493777054" 
          : undefined
      });
      
      // FALLBACK: Even if AI fails, try to load images from Google Maps
      const errLocs = [...formData.locations];
      errLocs[index].description = ""; // Reset placeholder
      
      // Try Real Google Photos (FORCE EXTRACT)
      let photoUrls: string[] = [];
      if (loc.googlePhotos && loc.googlePhotos.length > 0) {
         try {
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             photoUrls = loc.googlePhotos.map((p: any) => {
                 if (typeof p === 'string') return p;
                 if (p && typeof p.getUrl === 'function') {
                     return p.getUrl({ maxWidth: 1200, maxHeight: 1200 });
                 }
                 return null;
             }).filter(Boolean) as string[];
         } catch (e) {
             console.warn("Error fetching Google Photos URLs in fallback", e);
         }
      }

      // Fallback / Fill with Stock Photos if < 6
      if (photoUrls.length < 6) {
         const FALLBACK_IMAGES = [
            "https://images.unsplash.com/photo-1540959733-3246671c662e?w=800&q=80",
            "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80",
            "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
            "https://images.unsplash.com/photo-1606756817161-63f1d10831d1?w=800&q=80",
            "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80",
            "https://images.unsplash.com/photo-1493936734716-77ba6da663d6?w=800&q=80",
            "https://images.unsplash.com/photo-1554797589-7241bb691973?w=800&q=80",
            "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
            "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
         ];
         let i = 0;
         while (photoUrls.length < 6) {
             photoUrls.push(FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]);
             i++;
         }
      }
      errLocs[index].images = photoUrls;
      setFormData({ ...formData, locations: errLocs });
      
    } finally {
      setIsAnalyzing(prev => ({ ...prev, [index]: false }));
    }
  };



  const animateTitleTyping = (targetTitle: string) => {
    // Clear previous typing
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setShowTitleCandidates(false);
    let current = "";
    let index = 0;
    
    // Clear title first
    setFormData(prev => ({ ...prev, title: "" }));

    const typeNext = () => {
      if (index < targetTitle.length) {
        current += targetTitle[index];
        setFormData(prev => ({ ...prev, title: current }));
        index++;
        // Random delay for "AI typing" feel (30-80ms)
        typingTimeoutRef.current = setTimeout(typeNext, 30 + Math.random() * 50);
      } else {
        typingTimeoutRef.current = null;
      }
    };
    
    // Start typing after a brief pause
    typingTimeoutRef.current = setTimeout(typeNext, 100);
  };

  const generateTitleCandidates = async () => {
    setIsGeneratingTitle(true);
    setShowTitleCandidates(false);
    try {
      // Gather rich context for AI
      const stopsData = formData.locations.map(l => ({
        name: l.name,
        features: l.features, // User recommended reasons/tags
        photoCount: l.images?.length || 0
      })).filter(l => l.name);

      // Use special tags or fallback to a default tag based on stops or random
      const tags = formData.hostProfile?.specialTags && formData.hostProfile.specialTags.length > 0 
        ? formData.hostProfile.specialTags.join(", ") 
        : "Tokyo Hidden Gems";

      const res = await fetch('/api/ai/generate-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tags,
          city: "Tokyo",
          audience: "Western Gen Z",
          stops: stopsData
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setTitleCandidates(data.candidates || []);
        setShowTitleCandidates(true);
      }
    } catch (e) {
      console.error("Failed to generate titles", e);
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  useEffect(() => {
    if (existingPayPayId) {
      setFormData(prev => ({ ...prev, payoutId: existingPayPayId }));
    }
  }, [existingPayPayId]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setStep(1); // Skip intro if editing
      
      // Sync SNS
      if (initialData.hostProfile?.snsAccounts) {
        try {
          const parsed = JSON.parse(initialData.hostProfile.snsAccounts);
          if (typeof parsed === 'object') {
             setSnsUrls(prev => ({ ...prev, ...parsed }));
          }
        } catch {
          // ignore legacy
        }
      }
    } else if (initialEmail) {
      let preferredTime = "";
      
      if (initialSnsAccounts) {
        try {
          const parsed = JSON.parse(initialSnsAccounts);
          if (typeof parsed === 'object') {
             const { _preferredContactTime, ...restSns } = parsed;
             setSnsUrls(prev => ({ ...prev, ...restSns }));
             if (_preferredContactTime) preferredTime = _preferredContactTime;
          }
        } catch (e) {
          console.error("Failed to parse initialSnsAccounts", e);
        }
      }

      setFormData(prev => ({
        ...prev,
        hostProfile: {
          ...prev.hostProfile!,
          email: initialEmail,
          nickname: initialNickname || prev.hostProfile?.nickname || "",
          country: initialCountry || prev.hostProfile?.country || "",
          fullName: initialRealName || prev.hostProfile?.fullName || "",
          phone: initialPhone || prev.hostProfile?.phone || "",
          lineId: initialLineId || prev.hostProfile?.lineId || "",
          whatsapp: initialWhatsapp || prev.hostProfile?.whatsapp || "",
          universityName: initialUniversityName || prev.hostProfile?.universityName || "",
          universityEmail: initialUniversityEmail || prev.hostProfile?.universityEmail || "",
          gender: (initialGender as 'male' | 'female') || prev.hostProfile?.gender,
          ageRange: initialAgeRange || prev.hostProfile?.ageRange,
          sheerIdVerified: initialSheerIdVerified !== undefined ? initialSheerIdVerified : prev.hostProfile?.sheerIdVerified,
          avatarUrl: initialAvatarUrl || prev.hostProfile?.avatarUrl,
          isPublicIg: initialIsPublicIg !== undefined ? initialIsPublicIg : prev.hostProfile?.isPublicIg,
          bio: initialBio || prev.hostProfile?.bio,
          preferredContactTime: preferredTime || prev.hostProfile?.preferredContactTime || "",
          specialTags: initialSpecialTags || prev.hostProfile?.specialTags || []
        }
      }));
      
      if (initialCountry) {
        setOutputLanguage(initialCountry === "Japan" ? "Japan" : "Other");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, initialEmail, initialNickname, initialCountry, initialRealName, initialPhone, initialLineId, initialWhatsapp, initialUniversityName, initialUniversityEmail, initialGender, initialAgeRange, initialSheerIdVerified, initialAvatarUrl, initialIsPublicIg, initialBio, initialSnsAccounts, initialSpecialTags, setStep]);

  // Sync SNS State -> FormData
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      hostProfile: {
        ...prev.hostProfile!,
        snsAccounts: JSON.stringify(snsUrls)
      }
    }));
  }, [snsUrls]);

  // Ensure one default cost item exists when entering step 4
  useEffect(() => {
    if (step === 4 && (!formData.guestCostBreakdown || formData.guestCostBreakdown.length === 0)) {
      setFormData(prev => ({
        ...prev,
        guestCostBreakdown: [{
          id: Math.random().toString(36).substr(2, 9),
          name: "",
          amount: 0,
          type: "personal"
        }]
      }));
    }
  }, [step, formData.guestCostBreakdown]);
  
  // Track which stop is currently being edited in Step 2
  const [currentStopIndex, setCurrentStopIndex] = useState<number>(0);
  const [customTheme, setCustomTheme] = useState("");

  const t = TEXTS[language];
  const vibeTags = THEME_TAGS.map(t => ({
    label: language === "ja" ? t.label.ja : t.label.en,
    value: t.value,
    category: t.category
  }));

  const fillExample = () => {
    // Fill example based on UI language preference, but we can also respect output language context if needed.
    // For now, let's keep it consistent with UI language for the input fields.
    if (language === "ja") {
      setFormData({
        title: "渋谷裏路地海鮮：Kaikaya by the Sea（好莱坞明星常客） + 下午5点后本地人才知道的鲜鱼半价时段",
        locations: [
          {
            name: "Kaikaya by the Sea",
            address: "東京都渋谷区円山町23-7",
            features: "好莱坞明星常客，海鲜非常新鲜，氛围热闹",
            cost: "5000",
            transport: "神泉駅から徒歩3分"
          },
          {
            name: "Shibuya Nonbei Yokocho",
            address: "東京都渋谷区渋谷1-25",
            features: "昭和复古风情，体验地道日本居酒屋文化",
            cost: "3000",
            transport: "渋谷駅ハチ公口から徒歩2分"
          },
          {
            name: "Uobei Sushi Shibuya",
            address: "東京都渋谷区道玄坂2-29-11",
            features: "高科技回转寿司，性价比极高",
            cost: "1500",
            transport: "渋谷駅A0出口から徒歩5分"
          }
        ],
        duration: "3時間",
        meetingPoint: "渋谷駅ハチ公口 交番前",
        productPrice: "1500",
        meetupPrice: "8000",
        guestCostBreakdown: [
          { id: "1", name: "food", amount: 5000, type: "shared" },
          { id: "2", name: "transport", amount: 3000, type: "personal" }
        ],
        payoutId: "my_paypay_id",
        availability: [
          { dayOfWeek: "Mon", enabled: false, startTime: "09:00", endTime: "18:00" },
          { dayOfWeek: "Tue", enabled: false, startTime: "09:00", endTime: "18:00" },
          { dayOfWeek: "Wed", enabled: false, startTime: "09:00", endTime: "18:00" },
          { dayOfWeek: "Thu", enabled: false, startTime: "09:00", endTime: "18:00" },
          { dayOfWeek: "Fri", enabled: true, startTime: "18:00", endTime: "22:00" },
          { dayOfWeek: "Sat", enabled: true, startTime: "10:00", endTime: "22:00" },
          { dayOfWeek: "Sun", enabled: true, startTime: "10:00", endTime: "22:00" },
        ],
        hostProfile: {
          email: "demo@example.com",
          fullName: "山田 太郎",
          nickname: "Taro",
          phone: "090-1234-5678",
          lineId: "taro_line",
          preferredContactTime: "平日 18:00-21:00"
        },
        earliestServiceDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        standards: {
          noDiscrimination: true,
          boundaryConfirmed: true,
          refundPolicyConfirmed: true,
          instantConfirmation: true,
          cancellationPolicy: "24h"
        }
      });
    } else {
      setFormData({
        title: "Shibuya Back Alley Seafood: Kaikaya by the Sea (Hollywood Celeb Favorite) + 5PM Locals Only Half-Price Deal",
        locations: [
          {
            name: "Kaikaya by the Sea",
            address: "23-7 Maruyamacho, Shibuya City, Tokyo",
            features: "Hollywood celeb favorite, fresh seafood, lively atmosphere",
            cost: "5000",
            transport: "3 min walk from Shinsen Station"
          },
          {
            name: "Shibuya Nonbei Yokocho",
            address: "1-25 Shibuya, Shibuya City, Tokyo",
            features: "Showa retro vibe, authentic Izakaya culture",
            cost: "3000",
            transport: "2 min walk from Shibuya Station Hachiko Exit"
          },
          {
            name: "Uobei Sushi Shibuya",
            address: "2-29-11 Dogenzaka, Shibuya City, Tokyo",
            features: "High-tech conveyor belt sushi, great value",
            cost: "1500",
            transport: "5 min walk from Shibuya Station Exit A0"
          }
        ],
        duration: "3 Hours",
        meetingPoint: "Shibuya Station Hachiko Exit Police Box",
        productPrice: "1500",
        meetupPrice: "8000",
        guestCostBreakdown: [
          { id: "1", name: "food", amount: 5000, type: "shared" },
          { id: "2", name: "transport", amount: 3000, type: "personal" }
        ],
        payoutId: "my_paypay_id",
        availability: [
          { dayOfWeek: "Mon", enabled: false, startTime: "09:00", endTime: "18:00" },
          { dayOfWeek: "Tue", enabled: false, startTime: "09:00", endTime: "18:00" },
          { dayOfWeek: "Wed", enabled: false, startTime: "09:00", endTime: "18:00" },
          { dayOfWeek: "Thu", enabled: false, startTime: "09:00", endTime: "18:00" },
          { dayOfWeek: "Fri", enabled: true, startTime: "18:00", endTime: "22:00" },
          { dayOfWeek: "Sat", enabled: true, startTime: "10:00", endTime: "22:00" },
          { dayOfWeek: "Sun", enabled: true, startTime: "10:00", endTime: "22:00" },
        ],
        hostProfile: {
          email: "demo@example.com",
          fullName: "Taro Yamada",
          nickname: "Taro",
          phone: "090-1234-5678",
          lineId: "taro_line",
          preferredContactTime: "Weekdays 18:00-21:00"
        },
        earliestServiceDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        standards: {
          noDiscrimination: true,
          boundaryConfirmed: true,
          refundPolicyConfirmed: true,
          instantConfirmation: true,
          cancellationPolicy: "24h"
        }
      });
    }
    setStep(3);
  };

  const toggleThemeTag = (themeValue: string) => {
    if (!themeValue) return;
    
    // Strong Reasons Templates
    const TEMPLATES: Record<string, { en: string; ja: string }> = {
      // 1. Taste & Price
      "Super Cheap (Under 1000¥)": {
        en: "Tokyo Budget Eats: Super Cheap Gems (Under 1000¥) with a Student",
        ja: "東京バジェットグルメ：1000円以下の絶品店を大学生と巡る"
      },
      "Insanely Fresh": {
        en: "Tokyo Fresh Catch: Insanely Fresh Seafood from Market to Table",
        ja: "東京鮮度革命：築地・豊洲直送の極上食材を味わう旅"
      },
      "Authentic Local Taste": {
        en: "Real Tokyo Flavor: Authentic Local Taste No Tourists Know",
        ja: "本物の東京の味：観光客の知らない地元民の行きつけ"
      },
      "Spicy Lovers": {
        en: "Tokyo Spice Challenge: Best Spicy Eats for Heat Lovers",
        ja: "東京激辛探訪：辛党必見の旨辛グルメツアー"
      },
      "Masterpiece Dish": {
        en: "One-Bite Wonder: Tokyo's Masterpiece Dishes You Must Try",
        ja: "一口の感動：東京で絶対食べるべき至高の逸品"
      },
      "Generous Portions": {
        en: "Tokyo Big Eats: Generous Portions for Hungry Travelers",
        ja: "東京デカ盛り：腹ペコ旅行者のためのボリューム満点グルメ"
      },
      "Hidden Culinary Gem": {
        en: "Secret Tokyo Eats: Hidden Culinary Gems with a Local Foodie",
        ja: "東京隠れ家グルメ：食通のみぞ知る名店探し"
      },

      // 2. People & Vibe
      "Eye Candy (Staff/Guests)": {
        en: "Tokyo Trendy Spots: Eye Candy Staff & Guests Vibe",
        ja: "東京トレンド最前線：美男美女が集まるおしゃれスポット"
      },
      "Super Friendly Owner": {
        en: "Warm Tokyo: Meet the Super Friendly Owners of Local Shops",
        ja: "人情東京：名物店主と語らう心温まるひととき"
      },
      "English/Chinese Friendly": {
        en: "Language-Free Tokyo: English/Chinese Friendly Spots",
        ja: "言葉の壁なし：英語・中国語OKな安心スポット巡り"
      },
      "Young Creative Crowd": {
        en: "Tokyo Creative Scene: Hangout with Young Artists & Creators",
        ja: "東京クリエイティブ：若き才能が集まる刺激的な場所"
      },
      "Fashionista Hub": {
        en: "Style Tokyo: Where the Fashionistas & Trendsetters Go",
        ja: "東京スタイル：ファッショニスタが出没するエリア散策"
      },
      "Social & Lively": {
        en: "Social Tokyo: Lively Spots to Make New Friends",
        ja: "社交的東京：新しい出会いがある賑やかなスポット"
      },

      // 3. Design & Pedigree
      "Legendary Designer": {
        en: "Tokyo Design Tour: Spaces by Legendary Architects",
        ja: "東京建築巡礼：巨匠が手掛けた名建築と空間"
      },
      "Emerging Local Designer": {
        en: "New Wave Design: Emerging Local Designers of Tokyo",
        ja: "東京ニューウェーブ：新進気鋭のデザイナーを訪ねて"
      },
      "Century-Old History": {
        en: "Timeless Tokyo: Century-Old Shops with Deep History",
        ja: "老舗の東京：創業100年を超える歴史と物語"
      },
      "Instagrammable View": {
        en: "Insta-Ready Tokyo: Most Photogenic & Instagrammable Spots",
        ja: "映える東京：どこを撮っても絵になるフォトジェニックツアー"
      },
      "Brutalist / Minimalist": {
        en: "Tokyo Minimalism: Brutalist & Minimalist Aesthetics",
        ja: "東京ミニマリズム：極限まで削ぎ落とした美学に触れる"
      },
      "Analog & Vinyl": {
        en: "Analog Tokyo: Vinyl Bars & Retro Vibes",
        ja: "アナログ東京：レコードの音色に浸るレトロな時間"
      },

      // 4. Experience & Utility
      "Artisan Spirit": {
        en: "Tokyo Craftsmanship: Witness the Artisan Spirit",
        ja: "東京の職人魂：一筋の道を極める匠の技"
      },
      "Perfect for Solo": {
        en: "Solo Tokyo: Best Spots to Enjoy Alone",
        ja: "ソロ活東京：一人でも最高に楽しめるスポット"
      },
      "Off the Beaten Path": {
        en: "Deep Tokyo: Off the Beaten Path Adventures",
        ja: "裏東京探検：ガイドブックには載らない穴場へ"
      },
      "Best Sunset Spot": {
        en: "Golden Hour Tokyo: The Best Sunset Spots",
        ja: "東京マジックアワー：夕日が最も美しく見える場所"
      },
      "Late Night Soul": {
        en: "Midnight Tokyo: Late Night Sanctuaries for the Soul",
        ja: "真夜中の東京：眠らない街の深夜の避難所"
      },
      "Limited Edition Only": {
        en: "Exclusive Tokyo: Limited Edition Experiences Only Now",
        ja: "今だけの東京：期間限定・数量限定の特別体験"
      }
    };

    setFormData(prev => {
      const currentTags = prev.hostProfile?.specialTags || [];
      const isSelected = currentTags.includes(themeValue);
      let newTags: string[];
      
      if (isSelected) {
        newTags = currentTags.filter(t => t !== themeValue);
      } else {
        newTags = [...currentTags, themeValue];
      }

      const updates: Partial<typeof prev> = {};

      // Update title only if selecting (adding) a new tag
      if (!isSelected) {
        // Fallback for custom tags or missing mappings
        const defaultTemplate = {
          en: `Tokyo ${themeValue}: Explore with a Local Student`,
          ja: `東京の${themeValue}：現役大学生と巡るローカル体験`
        };

        const template = TEMPLATES[themeValue] || defaultTemplate;
        const newTitle = language === "ja" ? template.ja : template.en;
        updates.title = newTitle;
        updates.theme = themeValue;
      }

      return {
        ...prev,
        ...updates,
        hostProfile: {
          ...prev.hostProfile!,
          specialTags: newTags
        }
      };
    });
  };

  // Auto-generate title on Step 2 entry if empty
  useEffect(() => {
    if (step === 2 && !formData.title && formData.hostProfile?.specialTags?.[0]) {
      toggleThemeTag(formData.hostProfile.specialTags[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleMagicParse = async () => {
    if (!magicNotes.trim()) return;
    setIsParsing(true);
    try {
      const response = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: magicNotes }),
      });
      
      if (!response.ok) throw new Error('Parse failed');
      
      const data = await response.json();
      
      // Calculate total duration from itinerary
      const totalDurationMins = data.itinerary?.reduce((acc: number, item: { duration_minutes?: number }) => acc + (item.duration_minutes || 0), 0) || 120;
      
      // Auto-fill form data
      setFormData(prev => ({
        ...prev,
        title: data.externalName || prev.title,
        hostProfile: {
          ...prev.hostProfile!, // Assert non-null as initialized
          bio: data.hostProfile || prev.hostProfile?.bio || ""
        },
        duration: `${Math.ceil(totalDurationMins / 60)} Hours`,
        // Default prices (AI prompt doesn't return price explicitly)
        productPrice: "1000", 
        meetupPrice: "5000",
        // Use first stop as meeting point hint
        meetingPoint: data.itinerary?.[0]?.address ? `${data.itinerary[0].title} (${data.itinerary[0].address})` : prev.meetingPoint,
        locations: data.itinerary?.map((item: { title: string; address: string; description: string; type: string }) => ({
             name: item.title,
             address: item.address,
             features: item.description, // Use sensory description as features
             cost: "2000", // Default per stop cost estimate
             transport: "Walking", // Default
             tags: [item.type] // Use type as tag
        })) || []
      }));
      
      // Move to Review Step (Step 3: Monetization/Review)
      setStep(3);
      
    } catch (error) {
      console.error("Magic Parse Error:", error);
      alert("Failed to parse notes. Please try again.");
    } finally {
      setIsParsing(false);
    }
  };

  const addLocation = () => {
    setFormData(prev => ({
      ...prev,
      locations: [
        ...prev.locations,
        { name: "", address: "", features: "", cost: "", transport: "" }
      ]
    }));
    // Switch to editing the new location
    setCurrentStopIndex(formData.locations.length);
  };

  const removeLocation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
    // Adjust current index if needed
    if (currentStopIndex >= index && currentStopIndex > 0) {
      setCurrentStopIndex(currentStopIndex - 1);
    } else if (currentStopIndex >= index && currentStopIndex === 0 && formData.locations.length <= 1) {
      // If we deleted the only item, reset to 0 (length will be 0)
      setCurrentStopIndex(0);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateLocation = (index: number, field: keyof LocationInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.map((loc, i) => 
        i === index ? { ...loc, [field]: value } : loc
      )
    }));
  };

  const appendFeature = (index: number, feature: string) => {
    if (!feature) return;
    setFormData(prev => {
      const currentLocation = prev.locations[index];
      const currentFeatures = currentLocation.features || "";
      const currentTags = currentLocation.tags || [];

      // Avoid duplicates in features string
      let newFeatures = currentFeatures;
      if (!currentFeatures.includes(feature)) {
        newFeatures = currentFeatures ? `${currentFeatures}, ${feature}` : feature;
      }

      // Avoid duplicates in tags array
      let newTags = currentTags;
      if (!currentTags.includes(feature)) {
        newTags = [...currentTags, feature];
      }
      
      return {
        ...prev,
        locations: prev.locations.map((loc, i) => 
          i === index ? { ...loc, features: newFeatures, tags: newTags } : loc
        )
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Level 0 Check moved to Final Submit (Step 5)


    // Price Guard Check
    const currentMaxPrice = TIER_CONFIG[hostLevel]?.maxPrice || 0;
    const requestedPrice = Number(formData.meetupPrice);
    if (formData.enableOfflineService && requestedPrice > currentMaxPrice) {
      alert(language === "ja" 
        ? `設定価格が現在のランク上限（¥${currentMaxPrice}）を超えています。` 
        : `Price exceeds your current tier limit (¥${currentMaxPrice}).`);
      return;
    }
    
    // Validation
    if (!formData.payoutId) {
      alert(language === "ja" ? "PayPay IDを入力してください" : "Please enter your PayPay ID");
      return;
    }
    
    if (!formData.earliestServiceDate) {
      alert(language === "ja" ? "サービス開始日を選択してください" : "Please select a start date");
      return;
    }

    // Submit to Parent for Preview (Directly trigger generation)
    await handleFinalSubmit();
  };

  const handleFinalSubmit = async () => {
    // Level 0 Check removed to allow preview first
    // Activation will happen at the final confirmation step in Dashboard

    if (onGenerate) {
      setIsSubmitted(true);

      // Calculate Bokun fields
      const allTags = formData.locations.flatMap(loc => loc.tags || []);
      const category = mapVibeToBokunCategory(allTags);
      const durationMins = parseDurationToMinutes(formData.duration);

      await onGenerate({
        ...formData, 
        language: outputLanguage,
        bokunCategory: category,
        durationMinutes: durationMins
      });
      setIsSubmitted(false);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  const currentLocation = formData.locations[currentStopIndex];

  // Step 0: Intro

  if (step === 0) {
    return (
      <div className="space-y-8 rounded-xl bg-white p-8 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-center">
        
        {isProfilePreFilled ? (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-xl mb-8 border border-indigo-100 dark:border-indigo-800/50">
             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 mb-6">
                <User className="h-8 w-8" />
             </div>
             <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-300 mb-2">
               Welcome back, {initialNickname}!
             </h3>
             <p className="text-base text-indigo-700 dark:text-indigo-400 mb-8">
               Your profile ({initialCountry}) is ready. Let&apos;s create a new guide.
             </p>
             <button
                onClick={() => setStep(1)}
                className="w-full max-w-sm rounded-lg bg-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <span>Start Creating</span>
                <ArrowRight className="h-5 w-5" />
              </button>
          </div>
        ) : (
          <>
        <div className="flex justify-center mb-6">
            <div className="p-4 bg-zinc-50 rounded-lg dark:bg-zinc-800/50 w-full max-w-md">
                <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                    {t.intro.targetLangLabel}
                </label>
                <div className="relative">
                     <Globe className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                     <select
                        className="w-full appearance-none rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                        value={formData.hostProfile?.country || ""}
                        onChange={(e) => {
                            const selectedCountry = e.target.value;
                            setFormData({
                                ...formData,
                                hostProfile: { ...formData.hostProfile!, country: selectedCountry }
                            });
                            setOutputLanguage(selectedCountry === "Japan" ? "Japan" : "Other");
                        }}
                     >
                        <option value="" disabled>{language === "ja" ? "国を選択" : "Select Country"}</option>
                        {TOP_COUNTRIES.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                     </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                     </div>
                </div>
                <p className="text-[10px] text-zinc-400 mt-2">
                    {t.intro.targetLangHint}
                </p>
            </div>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-xl mb-8 text-left border border-indigo-100 dark:border-indigo-800/50">
          <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2 text-sm">
            <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Start Hosting in 5 Minutes
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-indigo-800 dark:text-indigo-300">
            <li className="flex gap-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span><strong>5分钟</strong> 即可创建一个旅游攻略</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span><strong>AI Agent</strong> 自动生成适合各大旅游平台的产品文案</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span>自动推送到 <strong>2600+</strong> 旅游平台进行上架</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span>您的<strong>个人信息</strong>非常重要，请耐心填写（AI会阅读您的SNS帮您写出漂亮的个人介绍）</span>
            </li>
          </ul>
        </div>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 mb-6">
          <Wallet className="h-8 w-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
          {t.intro.title}
        </h2>
        
        <div className="space-y-4 max-w-md mx-auto text-left mb-8">
          <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg dark:bg-zinc-800/50">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">1</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">{t.intro.desc1}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg dark:bg-zinc-800/50">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">2</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">{t.intro.desc2}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg dark:bg-zinc-800/50">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">3</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">{t.intro.desc3}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 max-w-md mx-auto">
          {/* Email Registration */}
          <div className="text-left">
            <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                {t.intro.emailLabel}
            </label>
            <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                    type="email"
                    required
                    className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                    placeholder={t.intro.emailPlaceholder}
                    value={formData.hostProfile?.email || ""}
                    onChange={(e) => setFormData({ 
                        ...formData, 
                        hostProfile: { ...formData.hostProfile!, email: e.target.value } 
                    })}
                />
            </div>
          </div>

          {/* Nickname Input */}
          <div className="text-left">
            <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                {t.intro.nicknameLabel}
            </label>
            <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                    placeholder={t.intro.nicknamePlaceholder}
                    value={formData.hostProfile?.nickname || ""}
                    onChange={(e) => setFormData({ 
                        ...formData, 
                        hostProfile: { ...formData.hostProfile!, nickname: e.target.value } 
                    })}
                />
            </div>
          </div>

          {/* Bio Input */}
          <div className="text-left">
            <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                {t.intro.bioLabel}
            </label>
            <div className="relative">
                <textarea
                    className="w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm min-h-[100px] focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                    placeholder={t.intro.bioPlaceholder}
                    value={formData.hostProfile?.bio || ""}
                    onChange={(e) => setFormData({ 
                        ...formData, 
                        hostProfile: { ...formData.hostProfile!, bio: e.target.value } 
                    })}
                />
                <p className="text-[10px] text-zinc-400 mt-1">{t.intro.bioHint}</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (!formData.hostProfile?.email) {
                alert("Please enter your email");
                return;
              }
              if (!formData.hostProfile?.nickname) {
                alert("Please enter your nickname");
                return;
              }
              setStep(1);
            }}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-all mt-2"
          >
            {t.intro.start}
          </button>
          
          <button
            type="button"
            onClick={fillExample}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center justify-center gap-1 transition-colors mt-2"
          >
            <Lightbulb className="h-3 w-3" />
            {t.tryExample}
          </button>

          {/* Magic Auto-Fill Section */}
          <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-8">
             <div className="flex items-center justify-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
               <Sparkles className="h-5 w-5" />
               <h3 className="text-sm font-bold uppercase tracking-wider">AI Magic Auto-Fill</h3>
             </div>
             
             <textarea
               className="w-full h-24 rounded-lg border border-zinc-300 bg-white p-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 mb-3"
               placeholder="Paste your rough notes here (e.g. 'Night tour in Shinjuku, visiting Golden Gai and Kabukicho, around 3000 yen...')"
               value={magicNotes}
               onChange={(e) => setMagicNotes(e.target.value)}
             />
             
             <button
                onClick={handleMagicParse}
                disabled={!magicNotes.trim() || isParsing}
                className="w-full rounded-lg border-2 border-indigo-600 bg-transparent px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
             >
                {isParsing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Auto-Fill from Notes</span>
                  </>
                )}
             </button>
          </div>
        </div>
        </>
        )}
      </div>
    );
  }

  // Step 1: Language Selection
  if (step === 1) {
    return (
      <div className="space-y-8 rounded-xl bg-white p-6 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
          <button 
            onClick={prevStep}
            className="mr-1 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">1</div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{t.stepLanguage.title}</h3>
        </div>

        <div>
          <label className="mb-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t.stepLanguage.label}
          </label>
          
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {TARGET_LANGUAGES.map((lang) => {
              const isSelected = (formData.targetLanguage || []).includes(lang.value);
              return (
                <button
                  key={lang.value}
                  onClick={() => {
                    const current = formData.targetLanguage || [];
                    const newLanguages = current.includes(lang.value)
                      ? current.filter(l => l !== lang.value)
                      : [...current, lang.value];
                    setFormData({ ...formData, targetLanguage: newLanguages });
                  }}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
                  }`}
                >
                  <span className="text-2xl">{lang.icon}</span>
                  <span className="text-xs font-bold text-center">{lang.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={prevStep}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {t.step3.back}
          </button>
          <button
            onClick={nextStep}
            disabled={!formData.targetLanguage || formData.targetLanguage.length === 0}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.stepLanguage.next}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Content Creation (Title)
  if (step === 2) {
    return (
      <div className="space-y-8 rounded-xl bg-white p-6 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        
        {/* Header with Back Button */}
        <div className="flex items-start gap-3 border-b border-zinc-100 pb-6 dark:border-zinc-800">
          <button 
            onClick={prevStep}
            className="mt-2 mr-1 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex-1">
             <div className="flex items-center gap-2 mb-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">2</div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {language === "ja" ? "旅のスタイル (Travel Type)" : "Travel Type"}
                </span>
             </div>

             {/* Vibe Tags Selection - Now at Top */}
             <div className="mb-6">
                <div className="flex flex-col gap-4">
                  {(["Taste & Price", "People & Vibe", "Design & Pedigree", "Experience & Utility"] as const).map((category) => {
                    const style = {
                      "Taste & Price": {
                        dot: "bg-rose-400",
                        base: "border-rose-100 bg-rose-50/50 text-rose-600 hover:border-rose-300 hover:bg-rose-100 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-400 dark:hover:border-rose-800",
                        selected: "border-rose-500 bg-rose-100 text-rose-700 dark:border-rose-400 dark:bg-rose-900/50 dark:text-rose-300"
                      },
                      "People & Vibe": {
                        dot: "bg-violet-400",
                        base: "border-violet-100 bg-violet-50/50 text-violet-600 hover:border-violet-300 hover:bg-violet-100 dark:border-violet-900/30 dark:bg-violet-900/10 dark:text-violet-400 dark:hover:border-violet-800",
                        selected: "border-violet-500 bg-violet-100 text-violet-700 dark:border-violet-400 dark:bg-violet-900/50 dark:text-violet-300"
                      },
                      "Design & Pedigree": {
                        dot: "bg-blue-400",
                        base: "border-blue-100 bg-blue-50/50 text-blue-600 hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900/30 dark:bg-blue-900/10 dark:text-blue-400 dark:hover:border-blue-800",
                        selected: "border-blue-500 bg-blue-100 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300"
                      },
                      "Experience & Utility": {
                        dot: "bg-emerald-400",
                        base: "border-emerald-100 bg-emerald-50/50 text-emerald-600 hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-400 dark:hover:border-emerald-800",
                        selected: "border-emerald-500 bg-emerald-100 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-900/50 dark:text-emerald-300"
                      }
                    }[category];

                    return (
                      <div key={category}>
                        <div className="mb-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                          <span className={`w-1 h-1 rounded-full ${style.dot}`}></span>
                          {category}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {vibeTags.filter(t => t.category === category).map((theme, index) => {
                  const isSelected = formData.hostProfile?.specialTags?.includes(theme.value);
                  return (
                    <button
                      key={theme.label}
                      type="button"
                      onClick={() => toggleThemeTag(theme.value)}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-300 animate-in zoom-in-50 fade-in slide-in-from-bottom-2 ${
                                  isSelected ? style.selected : style.base
                                }`}
                                style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'both' }}
                              >
                                {theme.label}
                                {isSelected && <span className="ml-1">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Custom Tag Input */}
                  <div>
                    <div className="mb-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-indigo-300 dark:bg-indigo-600"></span>
                        {language === "ja" ? "その他 (Custom)" : "Custom"}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customTheme}
                        onChange={(e) => setCustomTheme(e.target.value)}
                        placeholder={language === "ja" ? "その他のタグを入力..." : "Type custom tag..."}
                        className="flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (customTheme.trim()) {
                              toggleThemeTag(customTheme.trim());
                              setCustomTheme("");
                            }
                          }
                        }}
                      />
                      <button
                  type="button"
                  onClick={() => {
                    if (customTheme.trim()) {
                      toggleThemeTag(customTheme.trim());
                      setCustomTheme("");
                    }
                  }}
                        className="rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400"
                      >
                        {language === "ja" ? "追加" : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
                
                <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-4">
                  <Sparkles className="h-3 w-3 text-indigo-400" />
                  {language === "ja" ? "タグを選択するとAIがSEOに強いタイトルを生成します" : "Select tags to let AI generate SEO-optimized titles"}
                </p>
             </div>

             {/* Generated Title Display - Now Below Tags */}
             {formData.title && (
               <div className="relative group animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-500 ease-out">
                  <div className="mb-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    {t.step1.title}
                  </div>
                  <textarea
                    required
                    className="w-full bg-transparent text-3xl font-bold text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-0 border-none p-0 dark:text-white pr-12 resize-none"
                    placeholder={t.step1.placeholder}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    rows={2}
                  />
                  
                  <button
                    type="button"
                    onClick={generateTitleCandidates}
                    disabled={isGeneratingTitle}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors disabled:opacity-50"
                    title="Generate AI Titles"
                  >
                    {isGeneratingTitle ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                  </button>

                  <p className="mt-3 text-sm text-indigo-600 font-medium flex items-center gap-1.5 animate-pulse">
                     <ChevronDown className="h-4 w-4" />
                     {language === "ja" ? "このテーマで以下のコンテンツを作成します" : "Content below will be created for this theme"}
                  </p>
               </div>
             )}

             {/* AI Candidates Dropdown */}
             {showTitleCandidates && titleCandidates.length > 0 && (
               <div className="mt-4 rounded-xl border border-indigo-100 bg-white p-4 shadow-xl dark:border-indigo-900 dark:bg-zinc-800 animate-in zoom-in-95 duration-200">
                 <div className="flex items-center justify-between mb-3">
                   <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                     {language === "ja" ? "AI提案タイトル (クリックして適用)" : "AI Suggested Titles (Click to Apply)"}
                   </span>
                   <button onClick={() => setShowTitleCandidates(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                     <X className="h-4 w-4" />
                   </button>
                 </div>
                 <div className="grid gap-3">
                   {titleCandidates.map((c, i) => (
                     <button
                       key={i}
                       type="button"
                       onClick={() => animateTitleTyping(c.title)}
                       className="text-left group relative overflow-hidden rounded-lg border border-indigo-100 bg-indigo-50/50 p-3 hover:border-indigo-300 hover:bg-indigo-100 dark:border-indigo-900/30 dark:bg-indigo-900/10 dark:hover:border-indigo-700 transition-all"
                     >
                       <div className="flex items-start justify-between gap-2">
                         <span className="font-bold text-sm text-indigo-900 dark:text-indigo-200">{c.title}</span>
                         <span className="text-lg">{c.emoji}</span>
                       </div>
                       <p className="mt-1 text-[10px] text-indigo-600/80 dark:text-indigo-400 line-clamp-2">{c.seoLogic}</p>
                     </button>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </div>
        
        <div>
          {/* Examples */}
          <div className="mb-6 rounded-lg bg-zinc-50 p-4 text-xs text-zinc-500 dark:bg-zinc-900/50">
            <div className="mb-1"><span className="font-bold text-zinc-400">{t.step1.bad}</span></div>
            <div><span className="font-bold text-emerald-600">{t.step1.good}</span></div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={prevStep}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {t.step3.back}
          </button>
          <button
            onClick={() => {
              if (formData.locations.length === 0) addLocation();
              nextStep();
            }}
            disabled={!formData.title}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.step1.next}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Stops (Immersive Mode)
  if (step === 3) {
    return (
      <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
          <button 
            onClick={prevStep}
            className="mr-1 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">3</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-zinc-900 dark:text-white">{t.step2.title}</h3>
            <div className="mt-1 rounded-md bg-indigo-50 px-2 py-1 dark:bg-indigo-900/30">
              <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 break-words">
                {formData.title || "(No Title Selected - Please go back to Step 2)"}
              </p>
            </div>
          </div>
        </div>

        {/* Stops Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          {formData.locations.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStopIndex(index)}
              className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                currentStopIndex === index
                  ? "bg-sky-600 text-white shadow-md"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              }`}
            >
              STOP {index + 1}
            </button>
          ))}
          <button
            onClick={addLocation}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-sky-50 text-sky-600 border border-sky-100 hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        {/* Real-time Map Preview */}
        {formData.locations.some(l => l.latitude && l.longitude) && (
           <div className="rounded-xl overflow-hidden border border-zinc-200 shadow-sm dark:border-zinc-800">
              <InteractiveMap 
                locations={formData.locations
                  .filter(l => l.latitude && l.longitude && l.name)
                  .map(l => ({
                    name: l.name,
                    address: l.address,
                    latitude: l.latitude!,
                    longitude: l.longitude!,
                    features: l.features,
                    googleTypes: l.googleTypes,
                    tags: l.tags
                  }))} 
              />
           </div>
        )}

        {/* Current Stop Form */}
        {currentLocation && (
          <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="absolute right-0 top-0">
               <button
                  type="button"
                  onClick={() => removeLocation(currentStopIndex)}
                  className="text-zinc-400 hover:text-red-500 dark:text-white dark:hover:text-red-400 p-2"
                  title={t.step2.removeLocation}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-zinc-600 dark:text-white">{t.step2.nameLabel}</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-amber-400 bg-white py-2.5 px-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-amber-600 dark:bg-zinc-900 dark:text-white"
                    placeholder={t.step2.namePlaceholder}
                    value={currentLocation.name}
                    onChange={(e) => updateLocation(currentStopIndex, "name", e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-zinc-600 dark:text-white">{t.step2.addressLabel}</label>
                  <div className="relative mb-2">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400 dark:text-white z-10" />
                    <AddressAutocomplete
                      value={currentLocation.address || ""}
                      onChange={(val) => {
                          // Update address text
                          updateLocation(currentStopIndex, "address", val);
                          // Clear previous location metadata to avoid stale data
                          updateLocation(currentStopIndex, "googlePhotos", []);
                          updateLocation(currentStopIndex, "images", []); // Also clear visible images
                          updateLocation(currentStopIndex, "imageAlts", []); // Clear alts
                          updateLocation(currentStopIndex, "googleReviews", []);
                          updateLocation(currentStopIndex, "googlePlaceId", undefined);
                          updateLocation(currentStopIndex, "transport", undefined);
                          setPhotoError(null); // Clear previous errors
                      }}
                      onSelect={async (addr, lat, lng, details) => {
                        updateLocation(currentStopIndex, "address", addr);
                        setPhotoError(null); // Clear previous errors
                        updateLocation(currentStopIndex, "latitude", lat);
                        updateLocation(currentStopIndex, "longitude", lng);

                        // Calculate Distance to Nearest Station (Client-Side)
                        if (window.google && window.google.maps) {
                            try {
                                const mapDiv = document.createElement('div');
                                const service = new window.google.maps.places.PlacesService(mapDiv);
                                const dmService = new window.google.maps.DistanceMatrixService();
                                
                                const findStation = (type: string) => new Promise<google.maps.places.PlaceResult | null>((resolve) => {
                                    service.nearbySearch({
                                        location: { lat, lng },
                                        rankBy: window.google.maps.places.RankBy.DISTANCE,
                                        type: type
                                    }, (results, status) => {
                                        if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                                            resolve(results[0]);
                                        } else {
                                            resolve(null);
                                        }
                                    });
                                });

                                let station = await findStation('subway_station');
                                if (!station) station = await findStation('train_station');

                                if (station && station.geometry && station.geometry.location) {
                                    const dmResult = await dmService.getDistanceMatrix({
                                        origins: [{ lat, lng }],
                                        destinations: [station.geometry.location],
                                        travelMode: window.google.maps.TravelMode.WALKING
                                    });
                                    
                                    if (dmResult.rows?.[0]?.elements?.[0]?.status === "OK") {
                                        const mins = Math.ceil(dmResult.rows[0].elements[0].duration.value / 60);
                                        const transportStr = `${mins} mins walk from ${station.name}`;
                                        updateLocation(currentStopIndex, "transport", transportStr);
                                        console.log("Calculated distance:", transportStr);
                                    }
                                }
                            } catch (e) {
                                console.error("Error calculating distance:", e);
                            }
                        }

                        if (details) {
                           updateLocation(currentStopIndex, "googlePlaceId", details.place_id);
                           updateLocation(currentStopIndex, "googleRating", details.rating);
                           updateLocation(currentStopIndex, "googleUserRatingsTotal", details.user_ratings_total);
                           if (details.reviews) {
                             updateLocation(currentStopIndex, "googleReviews", details.reviews.map(r => ({
                               author_name: r.author_name,
                               rating: r.rating,
                               text: r.text,
                               time: r.time
                             })));
                           }
                           updateLocation(currentStopIndex, "googleTypes", details.types);
                           updateLocation(currentStopIndex, "googleWebsite", details.website);
                           updateLocation(currentStopIndex, "googlePriceLevel", details.price_level);
                          
                          if (details.photos && details.photos.length > 0) {
                              // Extract URLs immediately to avoid state serialization issues
                              const photoUrls = details.photos.map(p => {
                                  if (p && typeof p.getUrl === 'function') {
                                      return p.getUrl({ maxWidth: 1200, maxHeight: 1200 });
                                  }
                                  return null;
                              }).filter(Boolean) as string[];
                              
                              console.log(`[AddressAutocomplete] Found ${photoUrls.length} photos`);
                              updateLocation(currentStopIndex, "googlePhotos", photoUrls);
                              
                              // Immediately show photos to user (don't wait for AI analysis)
                              const initialImages = photoUrls.slice(0, 10);
                              updateLocation(currentStopIndex, "images", initialImages);
                              // Reset alt texts
                              updateLocation(currentStopIndex, "imageAlts", new Array(initialImages.length).fill(""));
                          } else {
                             console.log("[AddressAutocomplete] No photos found in details", details);
                             setPhotoError({
                                index: currentStopIndex,
                                message: language === "ja" 
                                  ? "Google Maps から写真を取得できませんでした。手動でアップロードしてください。" 
                                  : "Could not fetch photos from Google Maps. Please upload manually."
                             });
                          }
                        } else {
                            // Details fetch failed completely
                             setPhotoError({
                                index: currentStopIndex,
                                message: language === "ja" 
                                  ? "場所の詳細情報を取得できませんでした。API制限の可能性があります。" 
                                  : "Could not fetch place details. API might be restricted."
                             });
                        }
                      }}
                      placeholder={t.step2.addressPlaceholder}
                      className="w-full rounded-lg border border-sky-400 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-sky-600 dark:bg-zinc-900 dark:text-white"
                    />
                  </div>
                  
                  {/* Address Mapping (Bokun Sync) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                       <span className="absolute left-2.5 top-2.5 text-[10px] text-zinc-400 dark:text-white font-mono">Lat</span>
                       <input
                          type="number"
                          step="any"
                          placeholder="35.6895"
                          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-2 text-xs font-mono text-zinc-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                          value={currentLocation.latitude || ""}
                          onChange={(e) => updateLocation(currentStopIndex, "latitude", parseFloat(e.target.value))}
                       />
                    </div>
                    <div className="relative">
                       <span className="absolute left-2.5 top-2.5 text-[10px] text-zinc-400 dark:text-white font-mono">Lng</span>
                       <input
                          type="number"
                          step="any"
                          placeholder="139.6917"
                          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-2 text-xs font-mono text-zinc-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                          value={currentLocation.longitude || ""}
                          onChange={(e) => updateLocation(currentStopIndex, "longitude", parseFloat(e.target.value))}
                       />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                          // Simulated Auto-Map: Generate coords based on address hash or random near Tokyo
                          // If address exists, use a simple hash to make it deterministic-ish for demo
                          const baseLat = 35.6895;
                          const baseLng = 139.6917;
                          let latOffset = 0.01;
                          let lngOffset = 0.01;
                          
                          if (currentLocation.address) {
                             // Simple hash for demo consistency
                             const hash = currentLocation.address.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
                             latOffset = (hash % 100) / 10000;
                             lngOffset = (hash % 100) / 10000;
                          } else {
                             latOffset = Math.random() * 0.01;
                             lngOffset = Math.random() * 0.01;
                          }
  
                          // Update both atomically (React batching handles this)
                          updateLocation(currentStopIndex, "latitude", Number((baseLat + latOffset).toFixed(6)));
                          updateLocation(currentStopIndex, "longitude", Number((baseLng + lngOffset).toFixed(6)));
                      }}
                      className="flex-1 flex items-center justify-center gap-1 rounded-md border border-dashed border-sky-300 bg-sky-50 py-1.5 text-[10px] font-bold text-sky-600 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-400"
                    >
                      <Map className="h-3 w-3" />
                      <span>Auto-Map Coordinates (Simulated)</span>
                    </button>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-zinc-600 dark:text-white">
                    {t.step2.featuresLabel}
                  </label>
                  
                  {/* Vibe Tags for Features */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-sky-500 dark:text-sky-400 uppercase tracking-wider">{t.step2.vibeTagsLabel}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-white">({t.step2.vibeTagsHint})</span>
                    </div>
                    <div className="flex flex-col gap-4">
                      {["Taste & Price", "People & Vibe", "Design & Pedigree", "Experience & Utility"].map((category) => {
                        // Color coding based on category
                        let colorClass = "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100";
                        let dotColor = "bg-zinc-300";
                        
                        if (category === "Taste & Price") {
                           colorClass = "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800";
                           dotColor = "bg-rose-400";
                        } else if (category === "People & Vibe") {
                           colorClass = "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 hover:border-violet-300 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800";
                           dotColor = "bg-violet-400";
                        } else if (category === "Design & Pedigree") {
                           colorClass = "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
                           dotColor = "bg-blue-400";
                        } else if (category === "Experience & Utility") {
                           colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
                           dotColor = "bg-emerald-400";
                        }

                        return (
                        <div key={category}>
                          <div className="mb-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                            {category}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {vibeTags.filter(t => t.category === category).map((tag, idx) => (
                              <button
                                key={tag.label}
                                type="button"
                                onClick={() => appendFeature(currentStopIndex, tag.value)}
                                className={`rounded-md border px-2 py-1.5 text-[10px] font-medium text-left transition-all animate-in zoom-in duration-300 fill-mode-backwards ${colorClass}`}
                                style={{ animationDelay: `${idx * 30}ms` }}
                              >
                                {tag.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>

                  <textarea
                    required
                    rows={2}
                    className="w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                    placeholder={t.step2.featuresPlaceholder}
                    value={currentLocation.features}
                    onChange={(e) => updateLocation(currentStopIndex, "features", e.target.value)}
                  />
                </div>

                {/* AI Analysis Section */}
                <div className="col-span-2">
                  <button
                    type="button"
                    onClick={() => analyzeLocation(currentStopIndex)}
                    disabled={isAnalyzing[currentStopIndex]}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 p-3 text-white shadow-lg hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
                  >
                    {isAnalyzing[currentStopIndex] ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Sparkles className="h-5 w-5" />
                    )}
                    <span className="font-bold">LocalVibe 智能餐厅分析 (AI Analyze)</span>
                  </button>
                  <p className="mt-2 text-[10px] text-zinc-500 text-center">
                    {language === "ja" ? "店名と住所から、価格・雰囲気・紹介文を自動生成します" : "Auto-generate price, vibe, and narrative from name & address"}
                  </p>

                  {/* AI Error Display */}
                  {aiError && aiError.index === currentStopIndex && (
                    <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
                       <div className="flex items-start gap-2">
                          <svg className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <div className="flex-1 text-sm">
                             <p className="font-bold">{aiError.message}</p>
                             {aiError.details && (
                                <a 
                                  href={aiError.details}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-1 block font-bold text-red-700 underline hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                >
                                   👉 Enable Gemini API Here (Click Me)
                                </a>
                             )}
                          </div>
                       </div>
                    </div>
                  )}

                  {/* AI Generated Content Display */}
                  {currentLocation.visualHook && (
                    <div className="mt-4 rounded-lg bg-indigo-50 p-3 border border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 animate-in fade-in zoom-in duration-300">
                      <div className="flex items-start gap-2">
                         <Camera className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                         <div>
                           <span className="text-xs font-bold text-indigo-700 block mb-1">Visual Hook (AI)</span>
                           <p className="text-sm text-indigo-900 dark:text-indigo-200 italic">&quot;{currentLocation.visualHook}&quot;</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Description (Lush Narrative) */}
                  <div className="mt-4">
                     <label className="mb-1.5 block text-xs font-bold text-zinc-600 dark:text-white flex items-center gap-1">
                        <PenTool className="h-3 w-3" />
                        Lush Narrative (AI Generated)
                     </label>
                     <textarea
                        className="w-full rounded-lg border border-violet-200 bg-violet-50/30 p-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-violet-900 dark:bg-zinc-900 dark:text-white min-h-[150px]"
                        placeholder="Click 'AI Analyze' to generate a 3-paragraph lush narrative..."
                        value={currentLocation.description || ""}
                        onChange={(e) => updateLocation(currentStopIndex, "description", e.target.value)}
                     />
                  </div>
                </div>

                {/* Cost Estimation */}
                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-zinc-600 dark:text-white">
                    {t.step2.costLabel}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-zinc-500">¥</span>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-8 pr-4 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900"
                        placeholder={t.step2.costPlaceholder}
                        value={currentLocation.cost || ""}
                        onChange={(e) => updateLocation(currentStopIndex, "cost", e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => estimateLocationCost(currentStopIndex)}
                      disabled={isEstimatingCost}
                      className="flex items-center gap-1 rounded-md bg-amber-100 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-200 disabled:opacity-50"
                    >
                      {isEstimatingCost ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                      {language === "ja" ? "AI 見積もり" : "AI Estimate"}
                    </button>
                  </div>
                </div>

{/* Transport input removed */}

                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-zinc-600 dark:text-white">
                    {t.step2.photosLabel}
                  </label>
                  <p className="mb-2 text-[10px] text-zinc-500 dark:text-white">{t.step2.photosHint}</p>
                  
                  {/* Photo Error Message */}
                   {photoError && photoError.index === currentStopIndex && (
                    <div className="mb-3 rounded-md bg-red-50 p-2 text-xs text-red-600 border border-red-100 flex items-center justify-between">
                       <span>{photoError.message}</span>
                       <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                                // Fallback to Text Search with Name + Address for better precision
                                const query = [currentLocation.name, currentLocation.address].filter(Boolean).join(" ");
                                fetchPhotosByTextSearch(currentStopIndex, query);
                            }}
                            className="px-2 py-1 bg-white border border-red-200 rounded hover:bg-red-50 text-[10px] font-bold"
                          >
                            Force Search
                          </button>
                       </div>
                    </div>
                  )}
                  
                  {/* Explicit Fetch Button if Empty */}
                  {(!currentLocation.images || currentLocation.images.length === 0) && !photoError && (
                     <div className="mb-3">
                       <button
                         type="button"
                         onClick={() => {
                            const query = [currentLocation.name, currentLocation.address].filter(Boolean).join(" ");
                            fetchPhotosByTextSearch(currentStopIndex, query);
                         }}
                         disabled={isFetchingPhotos[currentStopIndex]}
                         className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-md text-sky-700 text-xs font-bold hover:bg-sky-100 transition-colors disabled:opacity-50"
                       >
                          {isFetchingPhotos[currentStopIndex] ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Searching...
                              </>
                          ) : (
                              <>
                                <Search className="h-3 w-3" />
                                Find Photos from Map
                              </>
                          )}
                       </button>
                     </div>
                  )}

                  <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
                    {(currentLocation.images || []).map((img, i) => (
                      <div key={i} className="group relative flex flex-col gap-1">
                        {/* Image Container */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                          <img 
                            src={img} 
                            alt={currentLocation.imageAlts?.[i] || `Location Image ${i}`} 
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                          />
                          
                          {/* Zoom Button (Overlay) */}
                          <button
                            type="button"
                            onClick={() => setZoomedImage(img)}
                            className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20 opacity-0 group-hover:opacity-100"
                          >
                             <ZoomIn className="h-6 w-6 text-white drop-shadow-md" />
                          </button>
                        </div>

                        {/* Controls (Check & Cross) */}
                        <div className="flex gap-1">
                           <button
                             type="button"
                             className="flex-1 flex items-center justify-center rounded bg-emerald-50 py-1 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                             title="Keep Photo"
                           >
                             <Check className="h-3 w-3" />
                           </button>
                           <button
                             type="button"
                             onClick={() => {
                                const newImages = (currentLocation.images || []).filter((_, idx) => idx !== i);
                                const newAlts = (currentLocation.imageAlts || []).filter((_, idx) => idx !== i);
                                updateLocation(currentStopIndex, "images", newImages);
                                updateLocation(currentStopIndex, "imageAlts", newAlts);
                             }}
                             className="flex-1 flex items-center justify-center rounded bg-red-50 py-1 text-red-600 hover:bg-red-100 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                             title="Remove Photo"
                           >
                             <X className="h-3 w-3" />
                           </button>
                        </div>

                        {/* Alt Text Display (Tiny) */}
                        {currentLocation.imageAlts?.[i] && (
                           <p className="text-[10px] text-zinc-400 truncate px-1">
                             AI Alt: {currentLocation.imageAlts[i]}
                           </p>
                        )}
                      </div>
                    ))}
                    
                    {(currentLocation.images || []).length < 10 && (
                      <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700">
                        <Camera className="mb-1 h-5 w-5 text-zinc-400 dark:text-white" />
                        <span className="text-[9px] text-zinc-500 dark:text-white">{t.step2.uploadBtn}</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length === 0) return;
                            
                            // Simple URL.createObjectURL for preview. In real app, upload to server here.
                            const newUrls = files.map(f => URL.createObjectURL(f));
                            const currentImages = currentLocation.images || [];
                            // Limit to 10
                            const combined = [...currentImages, ...newUrls].slice(0, 10);
                            
                            // Initialize alt texts if needed
                            const currentAlts = currentLocation.imageAlts || [];
                            const newAlts = new Array(newUrls.length).fill("");
                            const combinedAlts = [...currentAlts, ...newAlts].slice(0, 10);

                            updateLocation(currentStopIndex, "images", combined);
                            updateLocation(currentStopIndex, "imageAlts", combinedAlts);
                          }}
                        />
                      </label>
                    )}
                  </div>
                  
                  {/* Alt Text Inputs for SEO */}
                  {(currentLocation.images || []).length > 0 && (
                    <div className="mt-3 space-y-2">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                         {t.step2.altTextLabel}
                       </label>
                       {(currentLocation.images || []).map((_, i) => (
                         <div key={i} className="flex gap-2 items-center">
                            <span className="text-[10px] text-zinc-400 w-4">{i + 1}.</span>
                            <input 
                              type="text"
                              className="flex-1 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800"
                              placeholder={t.step2.altTextPlaceholder}
                              value={(currentLocation.imageAlts || [])[i] || ""}
                              onChange={(e) => {
                                const newAlts = [...(currentLocation.imageAlts || [])];
                                newAlts[i] = e.target.value;
                                updateLocation(currentStopIndex, "imageAlts", newAlts);
                              }}
                            />
                         </div>
                       ))}
                    </div>
                  )}

                  <div className="mt-1 text-right text-[10px] text-zinc-400 dark:text-white">
                    {(currentLocation.images || []).length} {t.step2.photosCount}
                  </div>
                </div>

                {/* Video URL for Bokun */}
                <div className="col-span-2">
                   <label className="mb-1.5 block text-xs font-bold text-zinc-600 dark:text-white">
                     {t.step2.videoUrlLabel}
                   </label>
                   <input 
                      type="url"
                      className="w-full rounded-lg border border-zinc-300 bg-white p-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-700 dark:bg-zinc-900"
                      placeholder={t.step2.videoUrlPlaceholder}
                      value={currentLocation.videoUrl || ""}
                      onChange={(e) => updateLocation(currentStopIndex, "videoUrl", e.target.value)}
                   />
                   <p className="mt-1 text-[10px] text-zinc-500">{t.step2.videoUrlHint}</p>
                </div>


              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
           {/* Navigation Buttons */}
           <div className="flex gap-2">
              {currentStopIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentStopIndex(prev => prev - 1)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
                >
                  {t.step2.prevStop}
                </button>
              )}
           </div>

           <div className="flex gap-2">
              <button
                type="button"
                onClick={addLocation}
                className="flex items-center gap-2 rounded-lg bg-white border border-sky-200 px-4 py-2 text-sm font-bold text-sky-600 hover:bg-sky-50 dark:bg-zinc-900 dark:border-sky-900 dark:text-sky-400"
              >
                <Plus className="h-4 w-4" />
                {t.step2.addLocation}
              </button>
              
              <button
                type="button"
                onClick={async () => {
                   // Validate photos
                   const invalidIndex = formData.locations.findIndex(l => (l.images?.length || 0) < 6);
                   if (invalidIndex !== -1) {
                     alert(language === "ja" 
                       ? `スポット ${invalidIndex + 1} に写真を6枚以上アップロードしてください。` 
                       : `Please upload at least 6 photos for Stop ${invalidIndex + 1}.`);
                     setCurrentStopIndex(invalidIndex);
                     return;
                   }
                   
                   // Auto-Estimate Costs if missing
                   // This ensures the "Est. Guest Expense" is not 0
                   const missingCostIndices = formData.locations
                      .map((l, i) => (!l.cost && l.name) ? i : -1)
                      .filter(i => i !== -1);
                   
                   if (missingCostIndices.length > 0) {
                      setIsGeneratingTitle(true); // Show loading state
                      await Promise.all(missingCostIndices.map(i => estimateLocationCost(i, true)));
                   }

                   // Trigger AI Title Generation before finishing
                   await generateTitleCandidates();
                   
                   // Move to next step (Monetization)
                   nextStep();
                   
                   // Scroll to top to see candidates in the next step header
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={isGeneratingTitle}
                className="flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-2 text-sm font-bold text-white shadow-md hover:bg-sky-700 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGeneratingTitle ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {language === "ja" ? "AI生成中..." : "Generating..."}
                  </>
                ) : (
                  <>
                    {t.step2.finish}
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                )}
              </button>
           </div>
        </div>
        
        {/* Lightbox Modal */}
        {zoomedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setZoomedImage(null)}
          >
            <button 
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
              onClick={() => setZoomedImage(null)}
            >
              <X className="h-8 w-8" />
            </button>
            <img 
              src={zoomedImage} 
              alt="Zoomed preview" 
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl object-contain animate-in fade-in zoom-in duration-300"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        )}
      </div>
    );
  }

  // Step 4: Finalize & Publish
  if (step === 4) {


    const isUSD = language === "en";
    const EXCHANGE_RATE = 150;

    const toDisplay = (val: string | number) => {
        if (val === "" || val === undefined || val === null) return "";
        const num = Number(val);
        if (isNaN(num)) return "";
        return isUSD ? Math.round(num / EXCHANGE_RATE).toString() : num.toString();
    };

    const toSubmit = (val: string) => {
        const num = parseInt(val) || 0;
        return isUSD ? (num * EXCHANGE_RATE).toString() : val;
    };


    
    // Min date logic: Today + 4 days
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 4);
    // const minDateStr = minDate.toISOString().split('T')[0];
    
    // Max date logic: 3 months from today
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);

    return (
      <form onSubmit={handleSubmit} className="space-y-8 rounded-xl bg-white p-6 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">4</div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{t.step3.title}</h3>
        </div>

        {/* AI Title Selection (Result from Step 2) */}
        {titleCandidates.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 rounded-xl border border-indigo-200 bg-indigo-50/50 p-5 dark:border-indigo-900/50 dark:bg-indigo-900/20">
             <div className="flex items-center gap-2 mb-4">
               <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
               <h3 className="font-bold text-lg text-indigo-900 dark:text-indigo-200">
                 {language === "ja" ? "AIが最適なタイトルを提案しました" : "AI Generated Titles"}
               </h3>
             </div>
             
             {/* Current Title Display */}
             <div className="mb-4">
                <label className="block text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">
                  {language === "ja" ? "現在選択中のタイトル" : "Selected Title"}
                </label>
                <div className="text-xl font-bold text-zinc-900 dark:text-white p-2 border-b-2 border-indigo-500/30 bg-white/50 dark:bg-black/20 rounded-t-md">
                  {formData.title}
                </div>
             </div>

             <div className="grid gap-3">
               {titleCandidates.map((c, i) => (
                 <button
                   key={i}
                   type="button"
                   onClick={() => animateTitleTyping(c.title)}
                   className={`text-left group relative overflow-hidden rounded-lg border p-3 transition-all ${
                     formData.title === c.title 
                       ? "border-indigo-500 bg-white ring-2 ring-indigo-500/20 shadow-md dark:bg-zinc-800"
                       : "border-indigo-100 bg-white/60 hover:border-indigo-300 hover:bg-white dark:border-indigo-800 dark:bg-zinc-800/50"
                   }`}
                 >
                   <div className="flex items-start justify-between gap-2">
                     <span className={`font-bold text-sm ${formData.title === c.title ? "text-indigo-700 dark:text-indigo-300" : "text-zinc-700 dark:text-zinc-300"}`}>
                       {c.title}
                     </span>
                     <span className="text-lg">{c.emoji}</span>
                   </div>
                   <p className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                     <span className="font-semibold text-indigo-500">Why: </span>{c.seoLogic}
                   </p>
                 </button>
               ))}
             </div>
          </div>
        )}

        {/* Section A: Pricing & Cost */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <DollarSign className="h-5 w-5" />
            <h4 className="font-bold text-sm">{t.step3.sectionCost}</h4>
          </div>
          
          {/* Offline Service Toggle */}
          <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex-1">
              <label className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {t.step3.offlineServiceLabel}
              </label>
              <p className="text-xs text-zinc-500">{t.step3.offlineServiceDesc}</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="offlineService"
                  checked={formData.enableOfflineService !== false}
                  onChange={() => setFormData({ ...formData, enableOfflineService: true })}
                  className="h-4 w-4 border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.step3.yes}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="offlineService"
                  checked={formData.enableOfflineService === false}
                  onChange={() => setFormData({ ...formData, enableOfflineService: false })}
                  className="h-4 w-4 border-zinc-300 text-zinc-400 focus:ring-zinc-400"
                />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.step3.no}</span>
              </label>
            </div>
          </div>
          
          {/* Bokun SEO Optimization */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
             <div className="flex items-center gap-2 mb-3">
               <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
               <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">Bókun Ranking Factors</h4>
             </div>
             
             <div className="grid gap-4 sm:grid-cols-2">
               {/* Instant Confirmation */}
               <div className="flex items-start gap-3">
                 <input
                   type="checkbox"
                   checked={formData.standards?.instantConfirmation}
                   onChange={(e) => setFormData({
                     ...formData,
                     standards: { ...formData.standards!, instantConfirmation: e.target.checked }
                   })}
                   className="mt-1 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                 />
                 <div>
                   <label className="block text-sm font-bold text-amber-900 dark:text-amber-100">
                     {t.step3.instantConfLabel}
                   </label>
                   <p className="text-xs text-amber-700 dark:text-amber-300/80">{t.step3.instantConfDesc}</p>
                 </div>
               </div>
               
               {/* Cancellation Policy */}
               <div>
                  <label className="block text-sm font-bold text-amber-900 dark:text-amber-100 mb-1">
                     {t.step3.cancelPolicyLabel}
                   </label>
                  <select
                    value={formData.standards?.cancellationPolicy}
                    onChange={(e) => setFormData({
                      ...formData,
                      standards: { ...formData.standards!, cancellationPolicy: e.target.value as "24h" | "48h" | "strict" }
                    })}
                    className="w-full rounded-md border-amber-300 bg-white py-1.5 text-xs text-amber-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-amber-900/30 dark:text-amber-100"
                  >
                    <option value="24h">{t.step3.cancelPolicy24}</option>
                    <option value="48h">{t.step3.cancelPolicy48}</option>
                    <option value="strict">{t.step3.cancelPolicyStrict}</option>
                  </select>
               </div>
             </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Host Fee */}
            {formData.enableOfflineService !== false && (
              <div>
                <PriceInputWithValidation
                  value={formData.meetupPrice?.toString() || ""}
                  onChange={(val) => setFormData({ ...formData, meetupPrice: val })}
                  currentLevel={hostLevel}
                  label={
                    <span className="flex items-center gap-2">
                      {t.step3.hostFeeLabel}
                      <span className="text-xs font-normal text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                        {language === "ja" ? "ガイド料のみを含む" : "Guide Fee Only Included"}
                      </span>
                    </span>
                  }
                  description={t.step3.hostFeeDesc}
                  placeholder="3000"
                  required
                  step={isUSD ? "1" : "100"}
                />
                
                {/* Pricing Breakdown (Bokun Sync) */}
                <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
                   <h4 className="mb-2 font-bold text-zinc-500 uppercase tracking-wider">Price Breakdown</h4>
                   <div className="space-y-1">
                      <div className="flex justify-between">
                         <span className="text-zinc-500">Host Net (You Earn):</span>
                         <span className="font-medium">{formatCurrency(Number(formData.meetupPrice || 0), language)}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-zinc-500">LocalVibe Fee (10%):</span>
                         <span className="text-zinc-500">+{formatCurrency(Math.round(Number(formData.meetupPrice || 0) * 0.1), language)}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-zinc-500">Bokun/OTA Fee (20%):</span>
                         <span className="text-zinc-500">+{formatCurrency(Math.round(Number(formData.meetupPrice || 0) * 0.2), language)}</span>
                      </div>
                      <div className="my-1 border-t border-zinc-200 dark:border-zinc-700"></div>
                      <div className="flex justify-between font-bold text-indigo-600 dark:text-indigo-400">
                         <span>Final List Price:</span>
                         <span>{formatCurrency(Math.round(Number(formData.meetupPrice || 0) * 1.3), language)}</span>
                      </div>
                   </div>
                </div>


            </div>
            )}

            {/* Digital Guide Price */}
            {formData.enableOfflineService === false && (
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {language === "ja" ? "電子版攻略価格" : "Digital Guide Price"}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-500">{getCurrencySymbol(language)}</span>
                  <input
                    type="number"
                    required
                    className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-8 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                    value={toDisplay(formData.productPrice)}
                    onChange={(e) => setFormData({ ...formData, productPrice: toSubmit(e.target.value) })}
                  />
                </div>
                <p className="mt-2 text-[10px] text-zinc-500 italic">
                  {t.step3.productPriceDesc}
                </p>
              </div>
            )}
          </div>


          
           {/* Tour Details Section */}
           <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
             <MapPin className="h-5 w-5" />
             <h4 className="font-bold text-sm">{t.step3.tourDetailsTitle}</h4>
           </div>

           <div className="grid gap-6 md:grid-cols-2">
             <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  {t.step3.durationLabel}
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                    placeholder={t.step3.durationPlaceholder}
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
             </div>
             <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  {t.step3.maxGroupSizeLabel}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <input
                    type="number"
                    min="1"
                    className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                    placeholder="e.g. 4"
                    value={formData.maxGroupSize || ""}
                    onChange={(e) => setFormData({ ...formData, maxGroupSize: parseInt(e.target.value) || undefined })}
                  />
                </div>
             </div>
             <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-medium text-zinc-500">
                  {t.step3.meetingPointLabel}
                </label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                      placeholder={t.step3.meetingPointPlaceholder}
                      value={formData.meetingPoint}
                      onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={findNearestSubwayExit}
                    disabled={isFindingStation}
                    className="flex items-center gap-2 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-indigo-400 disabled:opacity-50 transition-colors whitespace-nowrap"
                  >
                    {isFindingStation ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    {language === "ja" ? "最寄り駅を探す" : "Find Station"}
                  </button>
                </div>
             </div>

             <div className="md:col-span-2 border-t border-zinc-100 pt-4 mt-2 dark:border-zinc-800">
                <label className="mb-3 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                   {language === "ja" ? "販売チャネル (Distribution Channels)" : "Distribution Channels"}
                </label>
                
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 dark:border-indigo-900/30 dark:bg-indigo-900/20">
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm">
                        <Globe className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                          {language === "ja" ? "世界中の旅行者へ自動配信" : "Global Distribution Network"}
                        </h4>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {language === "ja"
                            ? "AIエージェントおよび2,600以上の提携旅行プラットフォーム（Trip.com, Airbnb, Booking.com 等）を通じて、あなたのガイドを最適なチャネルに自動的に配信します。"
                            : "We partner with over 2,600 travel platforms (Trip.com, Airbnb, Booking.com, etc.) and AI Agents to automatically push your content to the most suitable channels."}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                         {["Trip.com", "Airbnb", "Booking.com", "Expedia", "Klook"].map((brand) => (
                           <span key={brand} className="inline-flex items-center rounded-md bg-white px-2 py-1 text-xs font-medium text-zinc-600 shadow-sm ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
                             {brand}
                           </span>
                         ))}
                         <span className="inline-flex items-center rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                           +2600 More
                         </span>
                      </div>

                      <div className="flex items-start gap-2 rounded-lg bg-white/60 p-3 text-xs text-zinc-600 dark:bg-black/20 dark:text-zinc-400">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <span>
                          {language === "ja"
                            ? "ホストのコンテンツ内容に基づいてAIが最適なプラットフォームを選定・プッシュ通知を行うため、成約率が大幅に向上します。"
                            : "AI analyzes your content to target the most relevant platforms and audiences, significantly increasing your booking success rate."}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
             </div>

           </div>
        </div>





        <div className="border-t border-zinc-100 dark:border-zinc-800"></div>

        {/* Section C: Service & Availability */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Calendar className="h-5 w-5" />
            <h4 className="font-bold text-sm">{t.step3.sectionService}</h4>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
             <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t.step3.frequency}
              </label>
              <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                {(formData.availability || []).map((day, index) => (
                  <div key={day.dayOfWeek} className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                        checked={day.enabled}
                        onChange={(e) => {
                          const newAvailability = [...(formData.availability || [])];
                          newAvailability[index] = { ...day, enabled: e.target.checked };
                          setFormData({ ...formData, availability: newAvailability });
                        }}
                      />
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 w-8">
                        {t.step3.weekdays[day.dayOfWeek as keyof typeof t.step3.weekdays] || day.dayOfWeek}
                      </span>
                    </label>
                    {day.enabled && (
                      <div className="flex items-center gap-1">
                        <input
                          type="time"
                          value={day.startTime}
                          onChange={(e) => {
                            const newAvailability = [...(formData.availability || [])];
                            newAvailability[index] = { ...day, startTime: e.target.value };
                            setFormData({ ...formData, availability: newAvailability });
                          }}
                          className="w-20 rounded border border-zinc-300 px-1 py-0.5 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                        />
                        <span className="text-zinc-400">-</span>
                        <input
                          type="time"
                          value={day.endTime}
                          onChange={(e) => {
                            const newAvailability = [...(formData.availability || [])];
                            newAvailability[index] = { ...day, endTime: e.target.value };
                            setFormData({ ...formData, availability: newAvailability });
                          }}
                          className="w-20 rounded border border-zinc-300 px-1 py-0.5 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t.step3.startDate}
              </label>
              <div className="relative group">
                <DatePicker 
                  date={formData.earliestServiceDate ? new Date(formData.earliestServiceDate) : undefined}
                  setDate={(date) => setFormData({ 
                    ...formData, 
                    earliestServiceDate: date ? date.toISOString().split('T')[0] : "" 
                  })}
                  minDate={minDate}
                  maxDate={maxDate}
                  language={language === "ja" ? "ja" : "en"}
                  placeholder={t.step3.startDate}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full left-0 mb-2 hidden w-48 rounded bg-zinc-800 p-2 text-xs text-white shadow-lg group-hover:block">
                  {t.step3.auditNote}
                </div>
              </div>
              <p className="mt-1 flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-500">
                <AlertTriangle className="h-3 w-3" />
                {t.step3.auditNote}
              </p>
            </div>
          </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-800"></div>

      {/* Section D: Host Profile */}
      {!isProfilePreFilled && (
        <div className="space-y-4">
           <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <User className="h-5 w-5" />
            <h4 className="font-bold text-sm">{t.step3.sectionProfile}</h4>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
             {/* Full Name */}
             <div>
               <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                 Full Name (Kana, Kanji, or Romaji)
               </label>
               <div className="relative">
                 <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                 <input
                   type="text"
                   required
                   className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                   placeholder="山田 太郎 / Taro Yamada"
                   value={formData.hostProfile?.fullName || ""}
                   onChange={(e) => setFormData({ 
                       ...formData, 
                       hostProfile: { ...formData.hostProfile!, fullName: e.target.value } 
                   })}
                 />
               </div>
             </div>

             {/* Gender */}
             <div>
               <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                 Gender
               </label>
               <div className="flex gap-4">
                 <label className="flex items-center gap-2">
                   <input
                     type="radio"
                     name="gender"
                     value="male"
                     checked={formData.hostProfile?.gender === 'male'}
                     onChange={() => setFormData({
                       ...formData,
                       hostProfile: { ...formData.hostProfile!, gender: 'male' }
                     })}
                     className="h-4 w-4 border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                   />
                   <span className="text-sm text-zinc-700 dark:text-zinc-300">Male</span>
                 </label>
                 <label className="flex items-center gap-2">
                   <input
                     type="radio"
                     name="gender"
                     value="female"
                     checked={formData.hostProfile?.gender === 'female'}
                     onChange={() => setFormData({
                       ...formData,
                       hostProfile: { ...formData.hostProfile!, gender: 'female' }
                     })}
                     className="h-4 w-4 border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                   />
                   <span className="text-sm text-zinc-700 dark:text-zinc-300">Female</span>
                 </label>
               </div>
             </div>

             {/* Age Range */}
             <div>
               <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                 Age Range
               </label>
               <div className="relative">
                 <select
                   className="w-full appearance-none rounded-lg border border-zinc-300 bg-white py-2.5 pl-4 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                   value={formData.hostProfile?.ageRange || ""}
                   onChange={(e) => setFormData({ 
                       ...formData, 
                       hostProfile: { ...formData.hostProfile!, ageRange: e.target.value } 
                   })}
                 >
                   <option value="" disabled>Select Age Range</option>
                   <option value="18-20">18-20</option>
                   <option value="20-30">20-30</option>
                   <option value="30-40">30-40</option>
                   <option value="40-50">40-50</option>
                   <option value="50-69">50-69</option>
                 </select>
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                    <ChevronDown className="h-4 w-4" />
                 </div>
               </div>
             </div>

             {/* Phone */}
             <div>
               <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                 Phone Number (Mobile)
               </label>
               <div className="relative">
                 <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                 <input
                   type="tel"
                   required
                   className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                   placeholder="090-1234-5678"
                   value={formData.hostProfile?.phone || ""}
                   onChange={(e) => setFormData({ 
                       ...formData, 
                       hostProfile: { ...formData.hostProfile!, phone: e.target.value } 
                   })}
                 />
               </div>
             </div>

             {/* Line ID */}
             <div>
               <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                 LINE ID (Optional)
               </label>
               <p className="mb-2 text-xs text-zinc-500">
                 For after-sales service, changes, cancellations, and payments.
               </p>
               <div className="relative">
                 <span className="absolute left-3 top-2.5 font-bold text-xs text-zinc-400">ID</span>
                 <input
                   type="text"
                   className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                   placeholder="line_id"
                   value={formData.hostProfile?.lineId || ""}
                   onChange={(e) => setFormData({ 
                       ...formData, 
                       hostProfile: { ...formData.hostProfile!, lineId: e.target.value } 
                   })}
                 />
               </div>
             </div>

             {/* SNS Identity Verification */}
             <div className="col-span-2">
               <SnsVerificationInputs 
                 snsUrls={snsUrls} 
                 onChange={(id, val) => setSnsUrls(prev => ({ ...prev, [id]: val }))} 
               />
             </div>

             {/* Preferred Contact Time */}
             <div className="col-span-2 md:col-span-2">
               <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                 Preferred Contact Time
               </label>
               <div className="relative">
                 <Clock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                 <input
                   type="text"
                   className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                   placeholder="e.g. Weekdays 18:00-21:00"
                   value={formData.hostProfile?.preferredContactTime || ""}
                   onChange={(e) => setFormData({ 
                       ...formData, 
                       hostProfile: { ...formData.hostProfile!, preferredContactTime: e.target.value } 
                   })}
                 />
               </div>
             </div>

             {/* PayPay ID */}
             <div>
               <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                 {t.step3.paypayId}
               </label>
               {existingPayPayId ? (
                 <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 px-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
                   <CheckCircle2 className="h-4 w-4 text-green-500" />
                   <span>{existingPayPayId} (Linked)</span>
                 </div>
               ) : (
                 <div className="relative">
                   <Receipt className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                   <input
                     type="text"
                     className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                     placeholder="paypay_id_example"
                     value={formData.payoutId || ""}
                     onChange={(e) => setFormData({ ...formData, payoutId: e.target.value })}
                   />
                 </div>
               )}
             </div>
             
             {/* PayPay QR Code */}
             <div>
               <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                 {t.step3.paypayQr}
               </label>
               <div className="flex items-center gap-2 rounded-lg border border-dashed border-zinc-300 p-2 dark:border-zinc-700">
                  <QrCode className="h-8 w-8 text-zinc-300" />
                  <button type="button" className="text-xs font-bold text-indigo-600 hover:underline">
                    {t.step3.uploadQr}
                  </button>
               </div>
             </div>

             {/* Availability Fields */}
             <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t.step3.frequency}
              </label>
              <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                {(formData.availability || []).map((day, index) => (
                  <div key={day.dayOfWeek} className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                        checked={day.enabled}
                        onChange={(e) => {
                          const newAvailability = [...(formData.availability || [])];
                          newAvailability[index] = { ...day, enabled: e.target.checked };
                          setFormData({ ...formData, availability: newAvailability });
                        }}
                      />
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 w-8">
                        {t.step3.weekdays[day.dayOfWeek as keyof typeof t.step3.weekdays] || day.dayOfWeek}
                      </span>
                    </label>
                    {day.enabled && (
                      <div className="flex items-center gap-1">
                        <input
                          type="time"
                          value={day.startTime}
                          onChange={(e) => {
                            const newAvailability = [...(formData.availability || [])];
                            newAvailability[index] = { ...day, startTime: e.target.value };
                            setFormData({ ...formData, availability: newAvailability });
                          }}
                          className="w-20 rounded border border-zinc-300 px-1 py-0.5 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                        />
                        <span className="text-zinc-400">-</span>
                        <input
                          type="time"
                          value={day.endTime}
                          onChange={(e) => {
                            const newAvailability = [...(formData.availability || [])];
                            newAvailability[index] = { ...day, endTime: e.target.value };
                            setFormData({ ...formData, availability: newAvailability });
                          }}
                          className="w-20 rounded border border-zinc-300 px-1 py-0.5 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t.step3.startDate}
              </label>
              <div className="relative group">
                <DatePicker 
                  date={formData.earliestServiceDate ? new Date(formData.earliestServiceDate) : undefined}
                  setDate={(date) => setFormData({ 
                    ...formData, 
                    earliestServiceDate: date ? date.toISOString().split('T')[0] : "" 
                  })}
                  minDate={minDate}
                  maxDate={maxDate}
                  language={language === "ja" ? "ja" : "en"}
                  placeholder={t.step3.startDate}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full left-0 mb-2 hidden w-48 rounded bg-zinc-800 p-2 text-xs text-white shadow-lg group-hover:block">
                  {t.step3.auditNote}
                </div>
              </div>
              <p className="mt-1 flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-500">
                <AlertTriangle className="h-3 w-3" />
                {t.step3.auditNote}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-zinc-100 dark:border-zinc-800"></div>

        {/* Section E: Standards */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="h-5 w-5" />
            <h4 className="font-bold text-sm">{t.step3.sectionStandards}</h4>
          </div>
          
          <div className="space-y-3 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900/50">
             <label className="flex items-center gap-3">
               <input 
                 type="checkbox" 
                 className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                 checked={formData.standards?.noDiscrimination || false}
                 onChange={(e) => setFormData({ ...formData, standards: { ...formData.standards!, noDiscrimination: e.target.checked } })}
               />
               <span className="text-sm text-zinc-700 dark:text-zinc-300">{t.step3.stdDiscrim}</span>
             </label>
             <label className="flex items-center gap-3">
               <input 
                 type="checkbox" 
                 className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                 checked={formData.standards?.boundaryConfirmed || false}
                 onChange={(e) => setFormData({ ...formData, standards: { ...formData.standards!, boundaryConfirmed: e.target.checked } })}
               />
               <span className="text-sm text-zinc-700 dark:text-zinc-300">{t.step3.stdBoundaries}</span>
             </label>
             <label className="flex items-center gap-3">
               <input 
                 type="checkbox" 
                 className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                 checked={formData.standards?.refundPolicyConfirmed || false}
                 onChange={(e) => setFormData({ ...formData, standards: { ...formData.standards!, refundPolicyConfirmed: e.target.checked } })}
               />
               <span className="text-sm text-zinc-700 dark:text-zinc-300">{t.step3.stdRefund}</span>
             </label>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-900 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-100">
            <Info className="h-5 w-5 flex-shrink-0 text-blue-500" />
            <div>
              <h5 className="mb-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">{t.step3.verificationTitle}</h5>
              <div className="space-y-1 text-xs">
                <p>{t.step3.verificationStep1}</p>
                <p>{t.step3.verificationStep2}</p>
                <p>{t.step3.verificationStep3}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex gap-3 pt-4">
           <button
            type="button"
            onClick={prevStep}
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {t.step3.back}
          </button>
          <button
            type="submit"
            disabled={isGenerating || isSubmitted || !formData.standards?.noDiscrimination || !formData.standards?.boundaryConfirmed}
            className="flex-[2] rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.loading}
              </span>
            ) : isSubmitted ? (
              t.step3.submittedMessage
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" />
                {language === "ja" ? "AIで旅程を生成する" : "AI Generate Travel Guide"}
              </span>
            )}
          </button>
        </div>
      </form>
    );
  }

  // Step 5: Preview
  if (step === 5) {


     return (
       <div className="space-y-8 rounded-xl bg-white p-6 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
         <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">5</div>
           <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{language === "ja" ? "AIガイドプレビュー" : "AI Guide Preview"}</h3>
         </div>

         {/* Preview Content */}
         <div className="space-y-6">
            {/* Header */}
            <div>
               <div className="mb-2 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {formData.theme}
               </div>
               <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{formData.title}</h2>
               <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {formData.duration}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {formData.locations.length} Stops</span>
                  <span className="flex items-center gap-1"><Flag className="h-4 w-4" /> {formData.meetingPoint}</span>
               </div>
            </div>

            {/* Host Profile */}
            <div className="flex items-center gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50">
               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <User className="h-5 w-5" />
               </div>
               <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">{formData.hostProfile.nickname}</div>
                  <div className="text-xs text-zinc-500">
                     {formData.hostProfile.country} • {formData.hostProfile.gender === 'male' ? (language === 'ja' ? '男性' : 'Male') : (language === 'ja' ? '女性' : 'Female')}
                  </div>
               </div>
            </div>

            {/* Locations */}
            <div className="space-y-4">
               <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 border-b pb-1 border-zinc-100 dark:border-zinc-800">Route</h4>
               <div className="relative border-l-2 border-indigo-100 dark:border-indigo-900/30 ml-2 space-y-6 py-2">
                  {formData.locations.map((loc, i) => (
                    <div key={i} className="relative pl-6">
                       <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white bg-indigo-500 ring-4 ring-indigo-50 dark:border-zinc-900 dark:ring-indigo-900/30" />
                       <div className="space-y-1">
                          <h5 className="font-bold text-zinc-900 dark:text-zinc-100">{loc.name}</h5>
                          <p className="text-xs text-zinc-500">{loc.address}</p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">{loc.features}</p>
                          {loc.images && loc.images.length > 0 && (
                            <div className="flex gap-2 mt-2 overflow-x-auto">
                              {loc.images.map((img, idx) => (
                                <img key={idx} src={img} alt={`Location ${idx + 1}`} className="h-16 w-16 rounded-md object-cover" />
                              ))}
                            </div>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Pricing */}
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{t.step3.hostFeeLabel}</span>
                 <span className="font-bold text-zinc-900 dark:text-zinc-100">{formatCurrency(Number(formData.meetupPrice), language)}</span>
               </div>
               
               <div className="flex justify-between items-center border-t border-zinc-200 pt-2 dark:border-zinc-700">
                 <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {language === "ja" ? "ゲスト実費見積 (AI予測)" : "Est. Guest Expense (AI)"}
                 </span>
                 <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(calculateTotalGuestExpense(), language)}
                 </span>
               </div>
            </div>

            {/* Policies */}
            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
               <h4 className="mb-3 flex items-center gap-2 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                 <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                 {t.step3.policiesTitle}
               </h4>
               <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                 <li className="flex items-start gap-2">
                   <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                   {t.step3.policyVisitorCancel}
                 </li>
                 <li className="flex items-start gap-2">
                   <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                   {t.step3.policyVisitorPayment}
                 </li>
                 <li className="flex items-start gap-2">
                   <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
                   {t.step3.policyHostPayout}
                 </li>
                 <li className="flex items-start gap-2">
                   <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                   {t.step3.policyHostCancel}
                 </li>
                 <li className="flex items-start gap-2">
                   <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                   {t.step3.policyHostCancelPath}
                 </li>
               </ul>
            </div>
         </div>

         {/* Actions */}
         <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
           <button
            type="button"
            onClick={prevStep}
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {t.step3.back}
          </button>
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={isGenerating || isSubmitted}
            className="flex-[2] rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.loading}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" />
                {language === "ja" ? "AIで旅程を生成する" : "AI Generate Travel Guide"}
              </span>
            )}
          </button>
         </div>
       </div>
     );
  }

  return null;
}
