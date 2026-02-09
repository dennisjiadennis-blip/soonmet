"use client";

import { useState } from "react";
import { User, Phone, Clock, Receipt, CheckCircle2, Loader2, Sparkles, AlertTriangle, ChevronDown } from "lucide-react";
import { SnsVerificationInputs } from "./SnsVerificationInputs";

interface HostProfileData {
  email: string;
  nickname: string;
  country: string;
  fullName: string;
  phone: string;
  lineId: string;
  preferredContactTime: string;
  paypayId: string;
  gender: string;
  ageRange: string;
  snsAccounts: string;
}

interface ProfileCompletionFormProps {
  initialData: {
    email: string;
    nickname: string;
    country: string;
    gender?: string;
    ageRange?: string;
  };
  onComplete: (data: HostProfileData) => void;
}

export function ProfileCompletionForm({ initialData, onComplete }: ProfileCompletionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    lineId: "",
    preferredContactTime: "",
    paypayId: "",
    gender: initialData.gender || "",
    ageRange: initialData.ageRange || "",
  });
  
  const [snsUrls, setSnsUrls] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.fullName || !formData.phone || !formData.paypayId || !formData.gender || !formData.ageRange) {
      setError("Please fill in all required fields. / 必須項目をすべて入力してください。");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const finalData = {
        ...initialData,
        ...formData,
        // Store SNS as JSON string to match GeneratorForm expectation
        // We also stash preferredContactTime here since it's not in Host schema yet
        snsAccounts: JSON.stringify({
          ...snsUrls,
          _preferredContactTime: formData.preferredContactTime
        })
      };

      // Call API to update profile
      const res = await fetch('/api/host/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      onComplete(finalData);
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again. / プロフィールの保存に失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-[#1a1a2e]/80 backdrop-blur-md p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Complete Your Host Profile / ホストプロフィールを完成させる</h2>
        <p className="text-zinc-400 mb-6">
          To ensure quality and trust, please complete the following information. <br />
          <span className="text-sm opacity-70">サービスの質と信頼を確保するため、以下の情報を入力してください。</span>
        </p>
        
        {/* Onboarding Instructions */}
        <div className="bg-indigo-900/30 p-5 rounded-xl text-left border border-indigo-500/30">
          <h3 className="font-bold text-indigo-300 mb-3 flex items-center gap-2 text-sm">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            Start Hosting in 5 Minutes / 5分でホストを始める
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-indigo-200">
            <li className="flex gap-2">
              <span className="text-indigo-400 font-bold">•</span>
              <div className="flex flex-col">
                <span><strong>5 Minutes</strong> to create a travel guide</span>
                <span className="text-indigo-400/70 text-xs"><strong>5分</strong>で旅行ガイドを作成</span>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400 font-bold">•</span>
              <div className="flex flex-col">
                <span><strong>AI Agent</strong> automatically generates product copy</span>
                <span className="text-indigo-400/70 text-xs"><strong>AIエージェント</strong>が商品コピーを自動生成</span>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400 font-bold">•</span>
              <div className="flex flex-col">
                <span>Automatically listed on <strong>2600+</strong> travel platforms</span>
                <span className="text-indigo-400/70 text-xs"><strong>2600+</strong>の旅行プラットフォームに自動掲載</span>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400 font-bold">•</span>
              <div className="flex flex-col">
                <span>Your <strong>Personal Info</strong> is crucial (AI uses it for your bio)</span>
                <span className="text-indigo-400/70 text-xs"><strong>個人情報</strong>は重要です（AIがSNSを参照して自己紹介文を作成）</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-900/20 border border-red-500/50 p-4 flex items-center gap-3 text-red-400">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Full Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Real Name (Kanji / Kana / Romaji) / 本名 <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              required
              className="w-full rounded-lg border border-white/10 bg-black/40 py-2.5 pl-9 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-zinc-600"
              placeholder="山田 太郎 / Taro Yamada"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Gender / 性別 <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="gender"
                value="male"
                required
                checked={formData.gender === 'male'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="h-4 w-4 border-zinc-600 bg-black/40 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-black"
              />
              <span className="text-sm text-zinc-400 group-hover:text-cyan-400 transition-colors">Male / 男性</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="gender"
                value="female"
                required
                checked={formData.gender === 'female'}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="h-4 w-4 border-zinc-600 bg-black/40 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-black"
              />
              <span className="text-sm text-zinc-400 group-hover:text-cyan-400 transition-colors">Female / 女性</span>
            </label>
          </div>
        </div>

        {/* Age Range */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Age Range / 年齢層 <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              required
              className="w-full appearance-none rounded-lg border border-white/10 bg-black/40 py-2.5 pl-4 pr-8 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:bg-zinc-900"
              value={formData.ageRange}
              onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
            >
              <option value="" disabled>Select Age Range / 年齢層を選択</option>
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
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Phone Number / 電話番号 <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="tel"
              required
              className="w-full rounded-lg border border-white/10 bg-black/40 py-2.5 pl-9 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-zinc-600"
              placeholder="090-1234-5678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Line ID */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            LINE ID (Optional / 任意)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 font-bold text-xs text-zinc-500">ID</span>
            <input
              type="text"
              className="w-full rounded-lg border border-white/10 bg-black/40 py-2.5 pl-9 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-zinc-600"
              placeholder="line_id"
              value={formData.lineId}
              onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
            />
          </div>
        </div>

        {/* SNS */}
        <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">SNS / Social Media (AI Reference / AI参照用)</label>
            <SnsVerificationInputs 
                snsUrls={snsUrls} 
                onChange={(id, val) => setSnsUrls(prev => ({ ...prev, [id]: val }))} 
            />
        </div>

        {/* Contact Time */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Preferred Contact Time / 希望連絡時間
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              className="w-full rounded-lg border border-white/10 bg-black/40 py-2.5 pl-9 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-zinc-600"
              placeholder="e.g. Weekdays 18:00-21:00 / 平日 18:00-21:00"
              value={formData.preferredContactTime}
              onChange={(e) => setFormData({ ...formData, preferredContactTime: e.target.value })}
            />
          </div>
        </div>

        {/* PayPay */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            PayPay ID <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Receipt className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              required
              className="w-full rounded-lg border border-white/10 bg-black/40 py-2.5 pl-9 pr-4 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder-zinc-600"
              placeholder="paypay_id"
              value={formData.paypayId}
              onChange={(e) => setFormData({ ...formData, paypayId: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-8 w-full rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 text-sm font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving... / 保存中...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Complete & Continue / 完了して次へ
            </>
          )}
        </button>

      </form>
    </div>
  );
}
