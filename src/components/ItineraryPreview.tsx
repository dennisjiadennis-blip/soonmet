/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { GeneratedItinerary } from "@/lib/generator";
import { 
  Download, 
  Copy, 
  Loader2, 
  Train, 
  MapPin, 
  MessageCircle, 
  ExternalLink,
  Megaphone,
  Bot,
  ShoppingBag,
  Star,
  Coins,
  Bus,
  Clock,
  Calendar,
  Users,
  CheckCircle,
  ShieldCheck
} from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { THEME_TAGS } from "@/lib/theme-tags";
import { InteractiveMap } from "./InteractiveMap";

interface ItineraryPreviewProps {
  data: GeneratedItinerary;
}

export function ItineraryPreview({ data }: ItineraryPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const LABELS = {
    Japan: {
      secretGuide: "地元民の秘密ガイド",
      verifiedHost: "本人確認済み",
      curatedRoute: "厳選ルート",
      bilingualSupport: "バイリンガル対応",
      proTip: "地元民の秘密（プロのコツ）",
      nearestStation: "最寄駅",
      googleMaps: "Googleマップ",
      openLocation: "場所を開く",
      googleMapsHighlight: "Googleマップのハイライト",
      footer: "GuideCrafter AIで作成 • 地元民による検証済みコンテンツ",
      exportCenter: "エクスポートセンター",
      readyMessage: "プロダクトの準備ができました。PDFをダウンロードして、マーケティング素材をコピーしてください。",
      downloadPdf: "プロダクトをダウンロード (PDF)",
      generating: "生成中...",
      plateA: "プレートA: プロダクト (PDFプレビュー)",
      plateASub: "顧客が受け取る内容です",
      plateB: "プレートB: ポスター用プロンプト",
      plateBSub: "Midjourney / SNS用",
      plateC: "プレートC: 観光エージェント用プロンプト",
      plateCSub: "顧客に送信してください",
      gumroad: "Gumroad説明文",
      gumroadSub: "貼り付け可能なセールスコピー",
      posterPrompt: "ポスター用プロンプト",
      agentPrompt: "エージェント用プロンプト",
      gumroadDesc: "Gumroad説明文",
      copied: "クリップボードにコピーしました！",
      estCost: "現地費用目安",
      estGuestExpense: "ゲスト実費目安",
      whyRecommend: "おすすめの理由",
      locationInfo: "基本情報",
      timeInfo: "日時・集合場所",
      pricingInfo: "費用について",
      hostFee: "Hostガイド料",
      guestExpense: "ゲスト実費目安",
      totalPrice: "合計金額",
      included: "料金に含まれるもの",
      maxGroup: "最大人数",
      startDate: "開始日",
      duration: "所要時間",
      meetingPoint: "集合場所",
      policiesTitle: "重要事項・キャンセル規定",
      policyVisitorCancel: "ゲストキャンセル：24時間前まで全額返金",
      policyVisitorPayment: "ゲスト支払い：予約時に事前決済",
      policyHostPayout: "報酬受取：ゲストの「集合コード」確認後に送金",
      policyHostCancel: "ホストキャンセル：48時間前までに要連絡",
      policyHostCancelPath: "キャンセル方法：運営LINEへ連絡",
      aboutHost: "ホストについて"
    },
    Other: {
      secretGuide: "Local's Secret Guide",
      verifiedHost: "Verified Host",
      curatedRoute: "Curated Route",
      bilingualSupport: "Bilingual Support",
      proTip: "Local's Secret (Pro Tip)",
      nearestStation: "Nearest Station",
      googleMaps: "Google Maps",
      openLocation: "Open Location",
      googleMapsHighlight: "Google Maps Highlight",
      footer: "Created with GuideCrafter AI • Verified Local Content",
      exportCenter: "Export Center",
      readyMessage: "Your product is ready. Download the PDF and copy the marketing assets.",
      downloadPdf: "Download Product (PDF)",
      generating: "Generating PDF...",
      plateA: "Plate A: The Product (PDF Preview)",
      plateASub: "This is what your customers receive",
      aboutHost: "About Your Host",
      plateB: "Plate B: Poster Prompt",
      plateBSub: "For Midjourney / Social Media",
      plateC: "Plate C: Tourist Agent Prompt",
      plateCSub: "Send this to your customers",
      gumroad: "Gumroad Description",
      gumroadSub: "Ready-to-paste sales copy",
      posterPrompt: "Poster Prompt",
      agentPrompt: "Agent Prompt",
      gumroadDesc: "Gumroad Description",
      copied: "copied to clipboard!",
      estCost: "Est. Guest Cost",
      whyRecommend: "Why I Recommend",
      locationInfo: "Key Details",
      timeInfo: "Time & Meeting Point",
      pricingInfo: "Pricing & Costs",
      hostFee: "Host Fee",
      guestExpense: "Est. Guest Expense",
      included: "Included",
      maxGroup: "Max Group Size",
      startDate: "Start Date",
      duration: "Duration",
      meetingPoint: "Meeting Point",
      policiesTitle: "Policies & Important Notes",
      policyVisitorCancel: "Visitor Cancel: Full refund up to 24h before",
      policyVisitorPayment: "Visitor Payment: 100% Prepayment",
      policyHostPayout: "Payout: Released after verifying 'Meetup Code'",
      policyHostCancel: "Host Cancel: Must notify 48h in advance",
      policyHostCancelPath: "How to Cancel: Contact Support via LINE"
    }
  };

  const labels = data.language === "Japan" ? LABELS.Japan : LABELS.Other;

  // Collect all images for the Hero Gallery
  // Prioritize user uploaded images (node.images), fall back to node.imageUrl (Unsplash)
  const allImages = data.route.flatMap(node => node.images && node.images.length > 0 ? node.images : [node.imageUrl]).filter(Boolean);
  // Take top 5 for the gallery
  const heroImages = allImages.slice(0, 5);

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    
    setIsDownloading(true);
    try {
      console.log("Starting PDF generation...");
      
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, 
        backgroundColor: "#ffffff", 
        useCORS: true, 
        logging: true, 
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${data.title.english.replace(/\s+/g, "_")}_Guide.pdf`);
    } catch (error) {
      console.error("PDF Generation failed:", error);
      alert(`Failed to generate PDF. Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsDownloading(false);
    }
  };

  // Stable timestamp for cache busting images
  const [timestamp] = useState(Date.now());

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} ${labels.copied}`);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {labels.exportCenter}
          </h2>
          <p className="text-sm text-zinc-500">
            {labels.readyMessage}
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20"
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isDownloading ? labels.generating : labels.downloadPdf}
        </button>
      </div>

      {/* PLATE A: The PDF Product */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">{labels.plateA}</h3>
          <span className="text-xs text-zinc-400">{labels.plateASub}</span>
        </div>
        
        <div 
          ref={contentRef}
          className="overflow-hidden rounded-xl bg-white shadow-xl dark:bg-zinc-950 dark:text-zinc-100 border-2 border-orange-400 dark:border-orange-500 max-w-3xl mx-auto"
        >
          {/* Cover Header */}
          <div className="bg-zinc-900 px-8 py-16 text-white">
            {/* Hero Gallery (Host Uploaded Images) */}
            {heroImages.length > 0 && (
              <div className={`mb-16 grid gap-2 overflow-hidden rounded-2xl ${heroImages.length === 1 ? 'h-96 grid-cols-1' : 'h-96 grid-cols-4'}`}>
                {heroImages.length === 1 ? (
                   <div className="relative h-full w-full">
                      <img src={heroImages[0]} className="h-full w-full object-cover" alt="Hero" />
                   </div>
                ) : (
                   <>
                      {/* Main Image */}
                      <div className="col-span-2 row-span-2 relative">
                          <img src={heroImages[0]} className="h-full w-full object-cover" alt="Hero 1" />
                      </div>
                      {/* Grid for others */}
                      <div className="col-span-2 row-span-2 grid grid-cols-2 grid-rows-2 gap-2">
                          {[1, 2, 3, 4].map(idx => (
                              <div key={idx} className="relative overflow-hidden bg-zinc-800">
                                  {heroImages[idx] && (
                                     <img src={heroImages[idx]} className="h-full w-full object-cover" alt={`Hero ${idx+1}`} />
                                  )}
                              </div>
                          ))}
                      </div>
                   </>
                )}
              </div>
            )}

            <div className="text-center mb-16">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-4 py-1.5 text-sm font-bold text-amber-400 uppercase tracking-wider border border-amber-500/30">
                <Star className="h-4 w-4 fill-current" />
                {labels.secretGuide}
              </div>
              <h1 className="mb-4 text-4xl font-black tracking-tight sm:text-5xl leading-tight">
                {data.language === "Other" ? data.title.english : data.title.original}
              </h1>
              <p className="text-xl text-zinc-300 font-medium">
                {data.language === "Other" ? data.title.original : data.title.english}
              </p>
            </div>

            {/* 2. Recommendation Reasons */}
            <div className="mb-16 max-w-3xl mx-auto">
              <h3 className="text-amber-400 font-bold uppercase tracking-wider mb-6 text-center text-sm">
                {labels.whyRecommend}
              </h3>

              {/* Theme Tags */}
              {data.hostTags && data.hostTags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {data.hostTags.map(tagValue => {
                     const tagDef = THEME_TAGS.find(t => t.value === tagValue);
                     const label = tagDef 
                       ? (data.language === "Japan" ? tagDef.label.ja : tagDef.label.en)
                       : tagValue;
                     return (
                       <span key={tagValue} className="px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/50 text-sm font-medium shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                         {label}
                       </span>
                     )
                  })}
                </div>
              )}

              <div className="space-y-3 text-lg text-zinc-200 text-center leading-relaxed">
                {data.details.recommendationReasons.map((reason, idx) => (
                  <p key={idx} className="text-left md:text-center">{reason}</p>
                ))}
              </div>
            </div>

            {/* 2.5 About Host (Praise) */}
            {data.details.hostPraise && (
              <div className="mb-16 max-w-3xl mx-auto bg-zinc-800/50 p-8 rounded-xl border border-zinc-700">
                 <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-amber-500/10 rounded-full">
                        <Star className="w-6 h-6 text-amber-400 fill-current" />
                    </div>
                    <h3 className="text-amber-400 font-bold uppercase tracking-wider mb-4 text-sm">
                      {labels.aboutHost}
                    </h3>
                    <p className="text-lg text-zinc-300 italic font-serif leading-relaxed">
                      &quot;{data.details.hostPraise}&quot;
                    </p>
                 </div>
              </div>
            )}

            {/* 3. Time & Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto mb-16 border-t border-b border-zinc-800 py-12">
              {/* Location Column */}
              <div className="space-y-6">
                <h4 className="text-zinc-500 font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {labels.locationInfo}
                </h4>
                <div className="space-y-4">
                   <div>
                      <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">Area</p>
                      <p className="font-bold text-lg">{data.details.location}</p>
                   </div>
                   <div>
                      <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">{labels.maxGroup}</p>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-zinc-500" />
                        <p className="font-bold text-lg">{data.details.maxGroupSize} People</p>
                      </div>
                   </div>
                   <div>
                      <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">{labels.startDate}</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-zinc-500" />
                        <p className="font-bold text-lg">{data.details.startDate}</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Time Column */}
              <div className="space-y-6">
                <h4 className="text-zinc-500 font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {labels.timeInfo}
                </h4>
                <div className="space-y-4">
                   <div>
                      <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">{labels.duration}</p>
                      <p className="font-bold text-lg">{data.details.duration}</p>
                   </div>
                   <div>
                      <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">Availability</p>
                      <p className="font-bold text-lg">{data.details.availability}</p>
                   </div>
                   <div>
                      <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">{labels.meetingPoint}</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-zinc-500" />
                        <p className="font-bold text-lg">{data.details.meetingPoint}</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* 4. Price */}
            <div className="text-center max-w-2xl mx-auto bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700/50">
              <h4 className="text-zinc-400 font-bold uppercase tracking-wider text-xs mb-6 flex items-center justify-center gap-2">
                <Coins className="h-4 w-4" />
                {labels.pricingInfo}
              </h4>
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 items-center mb-6">
                <div className="text-center">
                   <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">{labels.hostFee}</p>
                   <p className="text-2xl font-bold text-white">{data.monetization.meetupPrice}</p>
                </div>
                <div className="w-px h-12 bg-zinc-700 hidden sm:block"></div>
                <div className="text-center">
                   <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">{labels.guestExpense}</p>
                   <p className="text-2xl font-bold text-zinc-300">{data.monetization.guestTotalCost}</p>
                </div>
              </div>
              
              {data.details.includedItems.length > 0 && (
                <div className="mt-6 pt-6 border-t border-zinc-700/50">
                   <p className="text-zinc-500 text-xs uppercase tracking-wide mb-3">{labels.included}</p>
                   <div className="flex flex-wrap justify-center gap-3">
                      {data.details.includedItems.map((item, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                          <CheckCircle className="h-3 w-3" />
                          {item}
                        </span>
                      ))}
                   </div>
                </div>
              )}
            </div>

            {/* 5. Policies */}
            <div className="mt-12 max-w-2xl mx-auto border-t border-zinc-800 pt-8 pb-8">
               <h4 className="text-zinc-500 font-bold uppercase tracking-wider text-xs mb-6 flex items-center justify-center gap-2">
                 <ShieldCheck className="h-4 w-4" />
                 {labels.policiesTitle}
               </h4>
               <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                 <li className="flex items-start gap-3 bg-zinc-800/30 p-3 rounded-lg border border-zinc-800">
                   <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                   <span className="text-sm text-zinc-300">{labels.policyVisitorCancel}</span>
                 </li>
                 <li className="flex items-start gap-3 bg-zinc-800/30 p-3 rounded-lg border border-zinc-800">
                   <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                   <span className="text-sm text-zinc-300">{labels.policyVisitorPayment}</span>
                 </li>
                 <li className="flex items-start gap-3 bg-zinc-800/30 p-3 rounded-lg border border-zinc-800">
                   <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
                   <span className="text-sm text-zinc-300">{labels.policyHostPayout}</span>
                 </li>
                 <li className="flex items-start gap-3 bg-zinc-800/30 p-3 rounded-lg border border-zinc-800">
                   <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                   <span className="text-sm text-zinc-300">{labels.policyHostCancel}</span>
                 </li>
                 <li className="flex items-start gap-3 bg-zinc-800/30 p-3 rounded-lg border border-zinc-800 md:col-span-2">
                   <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                   <span className="text-sm text-zinc-300">{labels.policyHostCancelPath}</span>
                 </li>
               </ul>
            </div>
          </div>

          {/* Route Content */}
          <div className="px-8 py-12 bg-zinc-50 dark:bg-zinc-950">
            
            {/* Interactive Map */}
            <div className="mb-12 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
               <InteractiveMap locations={data.route.map(node => ({
                 name: node.location,
                 address: node.address,
                 latitude: node.latitude || 0,
                 longitude: node.longitude || 0,
                 features: node.description,
                 tags: node.tags
               })).filter(l => l.latitude !== 0 && l.longitude !== 0)} />
            </div>

            <div className="space-y-16 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
              {data.route.map((node, idx) => (
                <div key={idx} className="relative pl-12">
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-1.5 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-indigo-600 text-sm font-bold text-white shadow-sm dark:border-zinc-950 z-10">
                    {idx + 1}
                  </div>
                  
                  {/* Node Header */}
                  <div className="mb-6">
                    {/* STOP Label & AI Slogan */}
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                        STOP {idx + 1}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                        <Bot className="h-3 w-3" />
                        {node.slogan}
                      </span>
                    </div>

                    <span className="mb-1 block text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {node.time}
                    </span>
                    <h4 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                      {node.location}
                    </h4>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {node.address}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                        <Coins className="h-4 w-4" />
                        {node.price}
                      </div>
                      {node.transport && (
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                          <Bus className="h-4 w-4" />
                          {node.transport}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Main Visual Card */}
                  <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    {/* Image */}
                    <div className="relative w-full overflow-hidden">
                      {node.images && node.images.length > 0 ? (
                        <div className={`grid gap-0.5 ${node.images.length === 1 ? 'h-56 grid-cols-1' : node.images.length === 2 ? 'h-56 grid-cols-2' : 'h-64 grid-cols-2'}`}>
                          {node.images.map((img, i) => (
                            <div key={i} className="relative h-full w-full overflow-hidden">
                              <img 
                                src={img}
                                alt={`${node.location} ${i+1}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-56 w-full">
                          <img 
                            src={`${node.imageUrl}${node.imageUrl.includes('?') ? '&' : '?'}t=${timestamp}`}
                            alt={node.location}
                            className="h-full w-full object-cover"
                            crossOrigin="anonymous" 
                          />
                        </div>
                      )}
                    </div>

                    {/* Pro Tip - The "Sell" */}
                    <div className="border-b border-zinc-100 bg-amber-50/50 p-6 dark:border-zinc-800 dark:bg-amber-900/10">
                      <div className="flex gap-3">
                        <div className="mt-1 flex-shrink-0">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                            <Star className="h-3.5 w-3.5 fill-current" />
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide mb-1">
                            {labels.proTip}
                          </h5>
                          <p className="text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                            {node.insiderTip}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Description */}
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {node.description}
                      </p>

                      {/* Navigation & Station */}
                      <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex gap-3">
                          <Train className="h-5 w-5 text-zinc-400 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-zinc-500 uppercase">{labels.nearestStation}</p>
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                              {node.station.name}
                            </p>
                            <p className="text-xs text-zinc-500">{node.station.exit}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <ExternalLink className="h-5 w-5 text-zinc-400 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-zinc-500 uppercase">{labels.googleMaps}</p>
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(node.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                            >
                              {labels.openLocation}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Reviews */}
                      {node.googleReviews.length > 0 && (
                        <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
                          <div className="flex items-start gap-3">
                            <MessageCircle className="h-4 w-4 text-zinc-400 mt-1" />
                            <div>
                              <p className="text-xs font-bold text-zinc-500 uppercase mb-2">{labels.googleMapsHighlight}</p>
                              <div className="text-sm text-zinc-600 dark:text-zinc-400 italic bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg">
                                &quot;{node.googleReviews[0].text}&quot;
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="mt-16 border-t border-zinc-200 pt-8 text-center dark:border-zinc-800">
              <p className="text-sm text-zinc-400">
                {labels.footer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HOST ASSETS SECTION */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Plate B: Poster Prompt */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
                <Megaphone className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{labels.plateB}</h3>
                <p className="text-xs text-zinc-500">{labels.plateBSub}</p>
              </div>
            </div>
            <button 
              onClick={() => copyToClipboard(data.posterPrompt, labels.posterPrompt)}
              className="rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4 text-xs font-mono text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800 h-48 overflow-y-auto">
            {data.posterPrompt}
          </div>
        </div>

        {/* Plate C: Agent Prompt */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{labels.plateC}</h3>
                <p className="text-xs text-zinc-500">{labels.plateCSub}</p>
              </div>
            </div>
            <button 
              onClick={() => copyToClipboard(data.agentPrompt, labels.agentPrompt)}
              className="rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4 text-xs font-mono text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800 h-48 overflow-y-auto">
            {data.agentPrompt}
          </div>
        </div>

        {/* Gumroad Description */}
        <div className="col-span-1 lg:col-span-2 rounded-xl bg-white p-6 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{labels.gumroad}</h3>
                <p className="text-xs text-zinc-500">{labels.gumroadSub}</p>
              </div>
            </div>
            <button 
              onClick={() => copyToClipboard(data.monetization.gumroadDescription, labels.gumroadDesc)}
              className="rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4 text-xs font-mono text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800 max-h-64 overflow-y-auto whitespace-pre-wrap">
            {data.monetization.gumroadDescription}
          </div>
        </div>
      </div>
    </div>
  );
}
