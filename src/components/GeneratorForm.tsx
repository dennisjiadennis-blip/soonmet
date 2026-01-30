"use client";

import { useState, useEffect } from "react";
import { GeneratorInput, LocationInput, CostItem } from "@/lib/generator";
import { Loader2, MapPin, Lightbulb, DollarSign, PenTool, Plus, Trash2, ArrowRight, Wallet, CheckCircle2, Globe, Calendar, ShieldCheck, Receipt, AlertTriangle, Info, QrCode, X, User, Phone, Clock, Mail, Camera } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DatePicker } from "@/components/DatePicker";

interface GeneratorFormProps {
  onGenerate: (input: GeneratorInput) => void;
  isGenerating: boolean;
  initialData?: GeneratorInput;
  initialEmail?: string;
}

const TEXTS = {
  ja: {
    intro: {
      title: "観光ガイド作成フロー",
      desc1: "1. あなたの「ローカル知識」を入力",
      desc2: "2. AIが「販売用コンテンツ」を自動生成（翻訳・要約・デザイン）",
      desc3: "3. デジタルガイド販売 ＆ ツアー開催で収益化",
      start: "作成を開始する",
      targetLangLabel: "ターゲット言語 (出力されるPDFの言語)",
      targetLangHint: "外国人観光客向けなら英語推奨",
      emailLabel: "メールアドレス (Email)",
      emailPlaceholder: "example@email.com"
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
      nameLabel: "店名・場所 (Name)",
      namePlaceholder: "例：ブルーボトル青山",
      addressLabel: "住所 (Address)",
      addressPlaceholder: "例：東京都港区南青山3-13-14",
      transportLabel: "交通 (Transport)", 
      transportPlaceholder: "可选项，用自然语言去描述最近的地铁站后如何到达集合地点", 
      featuresLabel: "特徴 (Features) - タグを選択または入力",
      featuresPlaceholder: "タグを選択して特徴を入力...",
      costLabel: "ゲスト予算 (Guest Cost)",
      costPlaceholder: "例：1200",
      addLocation: "次のスポットを追加",
      prevStop: "前のスポット",
      nextStop: "次のスポット",
      removeLocation: "削除",
      finish: "終了して価格設定へ",
      vibeTagsLabel: "🏷️ バイブスタグ (特徴を選択)",
      vibeTagsHint: "クリックして特徴を自動入力",
      photosLabel: "写真 (任意)",
      photosHint: "最大4枚までアップロード可能。魅力的な写真はゲストを惹きつけます！",
      uploadBtn: "写真をアップロード",
      photosCount: "/ 4枚"
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
      
      hostFeeLabel: "Host サービス料 (Host Fee)",
      hostFeeDesc: "あなたのガイド料です",
      
      productPriceDesc: "此guide 可以作为旅游攻略电子产品委托tatami labs 平台进行销售",
      
      sectionPayout: "B. 受取設定 (Payout)",
      sectionService: "C. サービス提供 (Service)",
      sectionProfile: "D. ホスト情報 (Profile)",
      sectionStandards: "E. 基準と確認 (Standards)",
      
      guestExpenseLabel: "ゲスト実費見積 (Est. Visitor Expense)",
      guestExpenseDesc: "交通費、食費、チケット代など",
      addItem: "項目を追加",
      itemName: "項目名",
      itemAmount: "金額",
      shared: "ゲストがホスト分も負担 (Guest Treats)",
      personal: "ゲストは自分の分のみ負担 (Guest Only)",
      totalGuest: "ゲスト負担合計",
      
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
      verificationStep3: "3. 報酬支払い実行"
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
      targetLangLabel: "Target Language (PDF Output)",
      targetLangHint: "English recommended for international tourists",
      emailLabel: "Email Address",
      emailPlaceholder: "example@email.com"
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
      nameLabel: "Name",
      namePlaceholder: "e.g. Blue Bottle Aoyama",
      addressLabel: "Address",
      addressPlaceholder: "e.g. 3-13-14 Minami-Aoyama",
      transportLabel: "Transport", 
      transportPlaceholder: "Optional: Describe how to reach the meeting point from the nearest station", 
      featuresLabel: "Features - Select Tags or Type",
      featuresPlaceholder: "Select tags to fill...",
      costLabel: "Guest Cost (JPY)",
      costPlaceholder: "e.g. 1200",
      addLocation: "Add Next Stop",
      prevStop: "Previous Stop",
      nextStop: "Next Stop",
      removeLocation: "Remove",
      finish: "Finish & Set Price",
      vibeTagsLabel: "🏷️ Vibe Tags",
      vibeTagsHint: "Click to auto-fill features",
      photosLabel: "Photos (Optional)",
      photosHint: "Upload up to 4 photos. Good photos attract more guests!",
      uploadBtn: "Upload Photos",
      photosCount: "/ 4 Photos"
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
      
      productPriceDesc: "This guide can be entrusted to the Tatami Labs platform for sale as a digital travel product",

      sectionPayout: "B. Payout Config",
      sectionService: "C. Service & Availability",
      sectionProfile: "D. Host Profile",
      sectionStandards: "E. Service Standards",
      
      hostFeeLabel: "Host Fee",
      hostFeeDesc: "Your earning for the service",
      
      guestExpenseLabel: "Est. Visitor Expense",
      guestExpenseDesc: "Food, Tickets, Transport, etc.",
      addItem: "Add Item",
      itemName: "Item Name",
      itemAmount: "Amount",
      shared: "Guest covers Host & Self",
      personal: "Guest pays Self only",
      totalGuest: "Total Est. Expense",
      
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
      verificationStep3: "3. Payout Released"
    },
    loading: "Submitting...",
    tryExample: "✨ Try Example (Auto-Fill)"
  }
};

const VIBE_TAGS = [
  { label: "匠と対話 (Deep Talk)", value: "日本の有名な匠と深い対話ができる" },
  { label: "工房見学 (Studio Visit)", value: "百年以上の歴史を持つ職人の工房を見学" },
  { label: "地元居酒屋 (Local Izakaya)", value: "地元民しか知らない本格居酒屋" },
  { label: "地酒の聖地 (Secret Sake)", value: "地元の酒好きが集う隠れ家日本酒バー" },
  { label: "模型の聖地 (Otaku Model)", value: "マニアしか知らない老舗模型店" },
  { label: "国際交流 (English Hub)", value: "英語が飛び交う地元民の社交場" },
  { label: "看板なし (Hidden Ramen)", value: "看板のない地元民専用ラーメン店" },
  { label: "レトロ喫茶 (Retro Cafe)", value: "昭和の時間が流れる純喫茶" },
  { label: "地下ジャズ (Underground)", value: "地下にある秘密のジャズバー" },
  { label: "秘密の温泉 (Secret Onsen)", value: "地元民に愛される隠れ銭湯" },
  { label: "夜景独占 (Night View)", value: "観光客がいない夜景スポット" },
  { label: "職人技 (Chef's Table)", value: "職人の技を間近で見られるカウンター席" },
  { label: "その他 (Other)", value: "" }
];

const VIBE_TAGS_EN = [
  { label: "Deep Talk w/ Artisan", value: "Deep conversation with a famous Japanese artisan" },
  { label: "Visit Artisan Studio", value: "Visit the studio of a century-old master craftsman" },
  { label: "Local Izakaya", value: "Authentic Izakaya only locals know" },
  { label: "Secret Sake", value: "Premium Sake bar only locals know" },
  { label: "Hobby Hidden Gem", value: "Rare Model shop only locals know" },
  { label: "English Social", value: "English-speaking social hub for locals" },
  { label: "Hidden Ramen", value: "No-sign Ramen shop only locals know" },
  { label: "Retro Cafe", value: "Showa-era Cafe only locals know" },
  { label: "Underground Bar", value: "Underground Jazz bar only locals know" },
  { label: "Secret Onsen", value: "Local hot spring hidden from tourists" },
  { label: "Night View", value: "Secret City View spot only locals know" },
  { label: "Art Spot", value: "Avant-garde Art space only locals know" },
  { label: "Other", value: "" }
];

const REASON_TAGS = [
  { label: "行きつけ (Regular)", value: "私の行きつけ：週に1回は通う場所" },
  { label: "庭 (My Backyard)", value: "庭みたいな場所：地図なしで歩けるエリア" },
  { label: "歴史 (Historical)", value: "歴史がある：創業50年以上の老舗" },
  { label: "コスパ (Value)", value: "コスパ最高：1000円で大満足" },
  { label: "地元民 (Locals)", value: "地元民のみ：観光客はほぼゼロ" },
  { label: "店主 (Master)", value: "店主が最高：話しかけると面白い" },
  { label: "雰囲気 (Vibe)", value: "雰囲気が良い：落ち着いた大人の空間" },
  { label: "一人 (Solo)", value: "一人でも安心：カウンター席が充実" },
  { label: "英語 (English)", value: "英語OK：メニューもスタッフも対応可" },
  { label: "穴場 (Hidden)", value: "穴場スポット：看板が出ていない隠れ家" },
  { label: "深夜 (Late)", value: "深夜営業：朝までやっている" },
  { label: "デート (Date)", value: "デートに最適：薄暗くてロマンチック" },
  { label: "本場 (Authentic)", value: "本場の味：日本人も唸る味" },
  { label: "映え (Photo)", value: "映える：どこを撮っても絵になる" },
  { label: "静寂 (Quiet)", value: "静かな空間：都会の喧騒を忘れる" }
];

const REASON_TAGS_EN = [
  { label: "Regular Spot", value: "My Regular Spot: I come here every week" },
  { label: "Know It Well", value: "I Know It Well: I can walk here without a map" },
  { label: "Historical", value: "Historical: Established over 50 years ago" },
  { label: "Affordable", value: "Affordable: Great value for money" },
  { label: "Locals Only", value: "Locals Only: Almost zero tourists" },
  { label: "Friendly Owner", value: "Friendly Owner: Very welcoming to everyone" },
  { label: "Great Vibe", value: "Great Vibe: Relaxed and mature atmosphere" },
  { label: "Solo Friendly", value: "Solo Friendly: Great counter seats for one" },
  { label: "English OK", value: "English OK: English menu and staff available" },
  { label: "Hidden Gem", value: "Hidden Gem: No sign, hard to find" },
  { label: "Late Night", value: "Late Night: Open until morning" },
  { label: "Date Spot", value: "Date Spot: Romantic and dimly lit" },
  { label: "Authentic", value: "Authentic: Real local taste" },
  { label: "Photogenic", value: "Photogenic: Every corner is Instagrammable" },
  { label: "Quiet Space", value: "Quiet Space: Escape the city noise" }
];

const EXPENSE_TYPES = [
  { value: "ticket", label: "Ticket / Admission (門票)" },
  { value: "food", label: "Food & Drinks (飲食)" },
  { value: "transport", label: "Transport (交通)" },
  { value: "service", label: "Service Fee (サービス料)" },
  { value: "experience", label: "Experience / Activity (体験料)" },
  { value: "shopping", label: "Shopping (買い物)" },
  { value: "rental", label: "Rental (レンタル)" },
  { value: "other", label: "Other (その他)" }
];

const TARGET_LANGUAGES = [
  { value: "English", label: "English (英語)", icon: "🇺🇸" },
  { value: "French", label: "French (フランス語)", icon: "🇫🇷" },
  { value: "Spanish", label: "Spanish (スペイン語)", icon: "🇪🇸" },
  { value: "Korean", label: "Korean (韓国語)", icon: "🇰🇷" },
  { value: "Chinese", label: "Chinese (中国語)", icon: "🇨🇳" },
  { value: "Any", label: "Any Visitor (AI Translated)", icon: "🤖" }
];

export function GeneratorForm({ onGenerate, isGenerating, initialData, initialEmail }: GeneratorFormProps) {
  const { language } = useLanguage(); // Global UI language
  const [outputLanguage, setOutputLanguage] = useState<"Japan" | "Other">("Other"); // PDF Output Language (Default English)
  
  const [step, setStep] = useState<number>(0); // 0: Intro, 1: Language, 2: Theme, 3: Stops, 4: Monetization
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    payoutId: "",
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
      fullName: "",
      nickname: "",
      phone: "",
      lineId: "",
      preferredContactTime: ""
    },
    standards: {
      noDiscrimination: false,
      boundaryConfirmed: false,
      refundPolicyConfirmed: false
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setStep(1); // Skip intro if editing
    } else if (initialEmail) {
      setFormData(prev => ({
        ...prev,
        hostProfile: {
          ...prev.hostProfile!,
          email: initialEmail
        }
      }));
    }
  }, [initialData, initialEmail]);
  
  // Track which stop is currently being edited in Step 2
  const [currentStopIndex, setCurrentStopIndex] = useState<number>(0);

  const t = TEXTS[language];
  const vibeTags = language === "ja" ? VIBE_TAGS : VIBE_TAGS_EN;
  const reasonTags = language === "ja" ? REASON_TAGS : REASON_TAGS_EN;

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
          refundPolicyConfirmed: true
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
          refundPolicyConfirmed: true
        }
      });
    }
    setStep(3);
  };

  const applyTheme = (themeValue: string) => {
    if (!themeValue) return;
    setFormData(prev => {
      // Append if not empty, otherwise set. Avoid exact duplicates if possible, 
      // but allowing composition is key.
      const newTitle = prev.title 
        ? (prev.title.includes(themeValue) ? prev.title : `${prev.title} + ${themeValue}`)
        : themeValue;
      return { ...prev, title: newTitle };
    });
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

  const updateLocation = (index: number, field: keyof LocationInput, value: string | string[]) => {
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
      const currentFeatures = prev.locations[index].features || "";
      // Avoid duplicates
      if (currentFeatures.includes(feature)) return prev;
      
      const newFeatures = currentFeatures ? `${currentFeatures}, ${feature}` : feature;
      return {
        ...prev,
        locations: prev.locations.map((loc, i) => 
          i === index ? { ...loc, features: newFeatures } : loc
        )
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.payoutId) {
      alert(language === "ja" ? "PayPay IDを入力してください" : "Please enter your PayPay ID");
      return;
    }
    
    if (!formData.earliestServiceDate) {
      alert(language === "ja" ? "サービス開始日を選択してください" : "Please select a start date");
      return;
    }

    onGenerate({ ...formData, language: outputLanguage }); // Pass OUTPUT language selection
    setIsSubmitted(true);
  };

  const calculateTotalGuestCost = () => {
    return formData.locations.reduce((sum, loc) => {
      const cost = parseInt(loc.cost.replace(/[^0-9]/g, '') || "0", 10);
      return sum + cost;
    }, 0);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  
  const currentLocation = formData.locations[currentStopIndex];

  // Step 0: Intro
  if (step === 0) {
    return (
      <div className="space-y-8 rounded-xl bg-white p-8 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-center">
        
        <div className="flex justify-center mb-6">
            <div className="p-4 bg-zinc-50 rounded-lg dark:bg-zinc-800/50 w-full max-w-md">
                <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                    {t.intro.targetLangLabel}
                </label>
                <div className="flex items-center justify-center gap-4">
                     <button
                        onClick={() => setOutputLanguage("Other")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                            outputLanguage === "Other" 
                            ? "bg-indigo-600 text-white shadow-sm" 
                            : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400"
                        }`}
                     >
                        <Globe className="h-4 w-4" />
                        English (Recommended)
                     </button>
                     <button
                        onClick={() => setOutputLanguage("Japan")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                            outputLanguage === "Japan" 
                            ? "bg-indigo-600 text-white shadow-sm" 
                            : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400"
                        }`}
                     >
                        <Globe className="h-4 w-4" />
                        日本語
                     </button>
                </div>
                <p className="text-[10px] text-zinc-400 mt-2">
                    {t.intro.targetLangHint}
                </p>
            </div>
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

          <button
            onClick={() => {
              if (!formData.hostProfile?.email) {
                alert("Please enter your email");
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
        </div>
      </div>
    );
  }

  // Step 1: Language Selection
  if (step === 1) {
    return (
      <div className="space-y-8 rounded-xl bg-white p-6 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
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
        
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">2</div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{t.step1.title}</h3>
        </div>
        
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t.step1.label}
          </label>
          <div className="mb-2 rounded-lg bg-zinc-50 p-3 text-xs text-zinc-500 dark:bg-zinc-900/50">
            <span className="font-bold">{t.step1.bad}</span><br/>
            <span className="font-bold text-emerald-600">{t.step1.good}</span>
          </div>
          
          {/* Vibe Tags for Title Inspiration */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold text-zinc-400 self-center">{t.step2.vibeTagsLabel}:</span>
              {vibeTags.slice(0, 8).map((theme) => (
                <button
                  key={theme.label}
                  type="button"
                  onClick={() => applyTheme(theme.value)}
                  className="rounded-full border border-purple-100 bg-purple-50/50 px-3 py-1 text-xs font-medium text-purple-600 hover:border-purple-300 hover:bg-purple-100 dark:border-purple-900/30 dark:bg-purple-900/10 dark:text-purple-400 dark:hover:border-purple-800"
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <PenTool className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              required
              className="w-full rounded-lg border border-blue-400 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-amber-500 dark:bg-zinc-950 dark:text-zinc-100"
              placeholder={t.step1.placeholder}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
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
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">3</div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{t.step2.title}</h3>
        </div>

        {/* Stops Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          {formData.locations.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStopIndex(index)}
              className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                currentStopIndex === index
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              STOP {index + 1}
            </button>
          ))}
          <button
            onClick={addLocation}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        {/* Current Stop Form */}
        {currentLocation && (
          <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="absolute right-0 top-0">
               <button
                  type="button"
                  onClick={() => removeLocation(currentStopIndex)}
                  className="text-zinc-400 hover:text-red-500 p-2"
                  title={t.step2.removeLocation}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-zinc-600 dark:text-zinc-400">{t.step2.nameLabel}</label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border border-amber-400 bg-white py-2.5 px-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-amber-600 dark:bg-zinc-900"
                    placeholder={t.step2.namePlaceholder}
                    value={currentLocation.name}
                    onChange={(e) => updateLocation(currentStopIndex, "name", e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-zinc-600 dark:text-zinc-400">{t.step2.addressLabel}</label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border border-blue-400 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-blue-600 dark:bg-zinc-900"
                      placeholder={t.step2.addressPlaceholder}
                      value={currentLocation.address}
                      onChange={(e) => updateLocation(currentStopIndex, "address", e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-zinc-600 dark:text-zinc-400">{t.step2.transportLabel}</label>
                  <div className="relative">
                    <ArrowRight className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                      placeholder={t.step2.transportPlaceholder}
                      value={currentLocation.transport || ""}
                      onChange={(e) => updateLocation(currentStopIndex, "transport", e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-zinc-600 dark:text-zinc-400">
                    {t.step2.photosLabel}
                  </label>
                  <p className="mb-2 text-[10px] text-zinc-500">{t.step2.photosHint}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {(currentLocation.images || []).map((img, i) => (
                      <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <img src={img} alt={`Upload ${i}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                             const newImages = (currentLocation.images || []).filter((_, idx) => idx !== i);
                             updateLocation(currentStopIndex, "images", newImages);
                          }}
                          className="absolute right-0 top-0 bg-black/50 p-1 text-white hover:bg-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    
                    {(currentLocation.images || []).length < 4 && (
                      <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700">
                        <Camera className="mb-1 h-5 w-5 text-zinc-400" />
                        <span className="text-[9px] text-zinc-500">{t.step2.uploadBtn}</span>
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
                            // Limit to 4
                            const combined = [...currentImages, ...newUrls].slice(0, 4);
                            
                            updateLocation(currentStopIndex, "images", combined);
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <div className="mt-1 text-right text-[10px] text-zinc-400">
                    {(currentLocation.images || []).length} {t.step2.photosCount}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="mb-1.5 block text-xs font-bold text-zinc-600 dark:text-zinc-400">
                    {t.step2.featuresLabel}
                  </label>
                  
                  {/* Vibe Tags for Features */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">{t.step2.vibeTagsLabel}</span>
                      <span className="text-[10px] text-zinc-400">({t.step2.vibeTagsHint})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {vibeTags.map((tag) => (
                        <button
                          key={tag.label}
                          type="button"
                          onClick={() => appendFeature(currentStopIndex, tag.value)}
                          className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-[10px] font-medium text-zinc-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-indigo-800"
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    required
                    rows={2}
                    className="w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                    placeholder={t.step2.featuresPlaceholder}
                    value={currentLocation.features}
                    onChange={(e) => updateLocation(currentStopIndex, "features", e.target.value)}
                  />
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
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {t.step2.prevStop}
                </button>
              )}
           </div>

           <div className="flex gap-2">
              <button
                type="button"
                onClick={addLocation}
                className="flex items-center gap-2 rounded-lg bg-white border border-indigo-200 px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 dark:bg-zinc-900 dark:border-indigo-900 dark:text-indigo-400"
              >
                <Plus className="h-4 w-4" />
                {t.step2.addLocation}
              </button>
              
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-md hover:bg-indigo-700"
              >
                {t.step2.finish}
                <CheckCircle2 className="h-4 w-4" />
              </button>
           </div>
        </div>
      </div>
    );
  }

  // Step 4: Finalize & Publish
  if (step === 4) {
    // Helper functions for cost items
    const addCostItem = () => {
      const newItem: CostItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: "",
        amount: 0,
        type: "personal"
      };
      setFormData(prev => ({
        ...prev,
        guestCostBreakdown: [...(prev.guestCostBreakdown || []), newItem]
      }));
    };

    const updateCostItem = (id: string, field: keyof CostItem, value: any) => {
      setFormData(prev => ({
        ...prev,
        guestCostBreakdown: (prev.guestCostBreakdown || []).map(item => 
          item.id === id ? { ...item, [field]: value } : item
        )
      }));
    };

    const removeCostItem = (id: string) => {
      setFormData(prev => ({
        ...prev,
        guestCostBreakdown: (prev.guestCostBreakdown || []).filter(item => item.id !== id)
      }));
    };

    const totalGuestCost = (formData.guestCostBreakdown || []).reduce((sum, item) => sum + Number(item.amount), 0);
    
    // Min date logic: Today + 4 days
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 4);
    const minDateStr = minDate.toISOString().split('T')[0];
    
    // Max date logic: 3 months from today
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);

    return (
      <form onSubmit={handleSubmit} className="space-y-8 rounded-xl bg-white p-6 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        
        <div className="flex items-center gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">4</div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{t.step3.title}</h3>
        </div>

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
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="offlineService"
                  checked={formData.enableOfflineService === false}
                  onChange={() => setFormData({ ...formData, enableOfflineService: false })}
                  className="h-4 w-4 border-zinc-300 text-zinc-400 focus:ring-zinc-400"
                />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">No</span>
              </label>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Host Fee */}
            {formData.enableOfflineService !== false && (
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {t.step3.hostFeeLabel}
                </label>
                <p className="mb-2 text-xs text-zinc-500">{t.step3.hostFeeDesc}</p>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-500">¥</span>
                  <input
                    type="number"
                    required
                    className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-8 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                    value={formData.meetupPrice}
                    onChange={(e) => setFormData({ ...formData, meetupPrice: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Digital Guide Price */}
            <div className={formData.enableOfflineService === false ? "col-span-2" : ""}>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t.step3.productPriceLabel}
              </label>
               <p className="mb-2 text-xs text-zinc-500">Digital Asset Price</p>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500">¥</span>
                <input
                  type="number"
                  required
                  className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-8 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                  value={formData.productPrice}
                  onChange={(e) => setFormData({ ...formData, productPrice: e.target.value })}
                />
              </div>
              <p className="mt-2 text-[10px] text-zinc-500 italic">
                {t.step3.productPriceDesc}
              </p>
            </div>
          </div>

          {/* Visitor Expense Estimator */}
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  {t.step3.guestExpenseLabel}
                </label>
                <p className="text-xs text-zinc-500">{t.step3.guestExpenseDesc}</p>
              </div>
              <div className="text-right">
                 <span className="text-xs text-zinc-500 block">{t.step3.totalGuest}</span>
                 <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">¥{totalGuestCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              {(formData.guestCostBreakdown || []).map((item) => (
                <div key={item.id} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <select
                      className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                      value={item.name}
                      onChange={(e) => updateCostItem(item.id, "name", e.target.value)}
                    >
                      <option value="" disabled>Select Type</option>
                      {EXPENSE_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                     <input
                      type="number"
                      step="100"
                      placeholder={t.step3.itemAmount}
                      className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                      value={item.amount}
                      onChange={(e) => updateCostItem(item.id, "amount", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="w-32">
                    <select
                      className="w-full rounded-md border border-zinc-300 px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                      value={item.type}
                      onChange={(e) => updateCostItem(item.id, "type", e.target.value as "shared" | "personal")}
                    >
                      <option value="personal">{t.step3.personal}</option>
                      <option value="shared">{t.step3.shared}</option>
                    </select>
                  </div>
                  <button type="button" onClick={() => removeCostItem(item.id)} className="p-1.5 text-zinc-400 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCostItem}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <Plus className="h-3 w-3" />
                {t.step3.addItem}
              </button>
            </div>
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
                  {t.step3.meetingPointLabel}
                </label>
                <div className="relative">
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
             </div>
           </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800"></div>

        {/* Section B: Payout Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Wallet className="h-5 w-5" />
            <h4 className="font-bold text-sm">{t.step3.sectionPayout}</h4>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t.step3.paypayId}
              </label>
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
            </div>
            
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
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 w-8">{day.dayOfWeek}</span>
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

            {/* Nickname */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nickname (Romaji)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
                  placeholder="e.g. Taro"
                  value={formData.hostProfile?.nickname || ""}
                  onChange={(e) => setFormData({ 
                      ...formData, 
                      hostProfile: { ...formData.hostProfile!, nickname: e.target.value } 
                  })}
                />
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
          </div>
        </div>

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
              t.step3.submit
            )}
          </button>
        </div>
      </form>
    );
  }

  return null;
}
