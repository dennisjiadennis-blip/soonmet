"use client";

import { useState, useEffect, useCallback } from "react";
import { verifyVisitorCode } from "@/lib/generator";
import { Plus, Map, Calendar, DollarSign, UserCheck, BarChart3, Clock, Wallet, CheckCircle2, Edit2, Mail, Phone, MessageCircle, MessageSquare, User, AlertCircle, Globe, MapPin, X, Lightbulb } from "lucide-react";
import { HostCreditTierCards } from "./HostCreditTierCards";
import { useLanguage } from "@/contexts/LanguageContext";
import { THEME_TAGS } from "@/lib/theme-tags";
import { GLOBAL_EXPERTISE_TAGS, COUNTRY_SPECIFIC_TAGS } from "@/lib/expertise-tags";

interface GuideSummary {
  id: string;
  title: string;
  status: string;
  views: number;
  sales: number;
  lastUpdated: string;
  nextServiceDate?: string;
}

interface VerifiedData {
  visitorName: string;
  amount: number;
  tourTitle?: string;
  date?: string;
}

interface HostDashboardProps {
  onCreateGuide: () => void;
  onEditGuide: (guideId: string) => void;
  onSimulateApproval?: (guideId: string) => void;
  hostEmail: string;
  guides: GuideSummary[];
}

interface HostProfile {
  hostId: string;
  currentLevel: number;
  guideCount: number;
  nickname?: string;
  country?: string;
  gender?: string;
  paypayId?: string;
  realName?: string;
  phone?: string;
  email?: string;
  universityName?: string;
  universityEmail?: string;
  lineId?: string;
  whatsapp?: string;
  snsAccounts?: string;
  specialTags?: string[];
  sheerIdVerified?: boolean;
  avatarUrl?: string; // Level 2
  isPublicIg?: boolean; // Level 2
}

export function HostDashboard({ onCreateGuide, onEditGuide, onSimulateApproval, hostEmail, guides }: HostDashboardProps) {
  const { t, language } = useLanguage();
  // Verification State
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [verifiedData, setVerifiedData] = useState<VerifiedData | null>(null);
  const [hostProfile, setHostProfile] = useState<HostProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<HostProfile>>({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback(() => {
    if (hostEmail) {
      fetch(`/api/host/profile?email=${hostEmail}`)
        .then(res => res.json())
        .then(data => {
            if (!data.error) {
                setHostProfile(data);
            }
        })
        .catch(err => console.error(err));
    }
  }, [hostEmail]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleEdit = () => {
    if (hostProfile) {
        setEditForm({
            realName: hostProfile.realName,
            nickname: hostProfile.nickname,
            paypayId: hostProfile.paypayId,
            phone: hostProfile.phone,
            lineId: hostProfile.lineId,
            whatsapp: hostProfile.whatsapp,
            universityName: hostProfile.universityName,
            universityEmail: hostProfile.universityEmail,
            snsAccounts: hostProfile.snsAccounts,
            specialTags: hostProfile.specialTags,
            country: hostProfile.country,
            gender: hostProfile.gender,
            avatarUrl: hostProfile.avatarUrl,
            isPublicIg: hostProfile.isPublicIg
        });
        setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
        const res = await fetch('/api/host/profile/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: hostEmail,
                fullName: editForm.realName, // API expects fullName for realName
                ...editForm
            })
        });
        const data = await res.json();
        if (data.success && data.host) {
            // Update local state
            setHostProfile(prev => prev ? ({ ...prev, ...editForm }) : null);
            setIsEditing(false);
        }
    } catch (error) {
        console.error("Failed to update profile", error);
    } finally {
        setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof HostProfile, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleVerify = async () => {
    if (!verificationCode) return;
    setVerificationStatus("verifying");
    try {
        const res = await verifyVisitorCode(verificationCode, "host_123");
        setVerifiedData(res as VerifiedData);
        setVerificationStatus("success");
    } catch {
        setVerificationStatus("error");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white shadow-[0_0_10px_rgba(255,255,255,0.3)]">{t("dashboard.title")}</h2>
          <div className="flex flex-col gap-1">
            <p className="text-zinc-400">
              {t("dashboard.welcome")}<span className="font-semibold text-cyan-400">{hostProfile?.nickname || hostEmail}</span>
            </p>
            {/* Header Badges Removed */}
            
            {/* Slogan */}
            <p className="mt-3 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 max-w-2xl leading-relaxed">
              Leverage your local experience to create amazing guides. We use AI to distribute them to thousands of global platforms for maximum sales.
            </p>
          </div>
        </div>
        <button
          onClick={onCreateGuide}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:from-cyan-500 hover:to-blue-500 transition-all"
        >
          <Plus className="h-4 w-4" />
          {t("dashboard.create_guide")}
        </button>
      </div>

      {/* Credit System & Grading Removed */}
      
      {/* Profile Details Section */}
      <div className="rounded-xl border border-white/10 bg-[#1a1a2e]/60 backdrop-blur-sm p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {hostProfile?.avatarUrl && (
                <img 
                  src={hostProfile.avatarUrl} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                />
              )}
              <h3 className="text-lg font-bold text-white">{language === "ja" ? "プロフィール情報" : "Profile Details"}</h3>
            </div>
            {!isEditing ? (
                <button
                    onClick={handleEdit}
                    className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-all border border-white/10"
                >
                    <Edit2 className="h-4 w-4" />
                    {language === "ja" ? "編集" : "Edit"}
                </button>
            ) : (
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCancel}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                    >
                        {language === "ja" ? "キャンセル" : "Cancel"}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                    >
                        {isSaving ? (
                            <Clock className="h-4 w-4 animate-spin" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4" />
                        )}
                        {language === "ja" ? "保存" : "Save"}
                    </button>
                </div>
            )}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Real Name */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-400 border border-white/5">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                 <p className="text-xs font-medium text-zinc-400">{language === "ja" ? "氏名" : "Real Name"}</p>
                 <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded border border-white/5">Private</span>
              </div>
              {isEditing ? (
                  <input
                    type="text"
                    value={editForm.realName || ""}
                    onChange={(e) => handleInputChange("realName", e.target.value)}
                    className="mt-1 w-full rounded bg-black/40 border border-white/10 px-2 py-1 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
              ) : (
                  <p className="text-sm font-semibold text-white">{hostProfile?.realName || "--"}</p>
              )}
            </div>
          </div>

          {/* Nickname */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-400 border border-white/5">
              <UserCheck className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                 <p className="text-xs font-medium text-zinc-400">{language === "ja" ? "ニックネーム" : "Nickname"}</p>
                 <span className="text-[10px] bg-cyan-900/30 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20">Public</span>
              </div>
              {isEditing ? (
                  <input
                    type="text"
                    value={editForm.nickname || ""}
                    onChange={(e) => handleInputChange("nickname", e.target.value)}
                    className="mt-1 w-full rounded bg-black/40 border border-white/10 px-2 py-1 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
              ) : (
                  <p className="text-sm font-semibold text-white">{hostProfile?.nickname || "--"}</p>
              )}
            </div>
          </div>

          {/* Country */}
          <div className="flex items-start gap-3 col-span-full">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-400 border border-white/5">
              <Globe className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                 <p className="text-xs font-medium text-zinc-400">{language === "ja" ? "国・地域" : "Country / Region"}</p>
                 <span className="text-[10px] bg-cyan-900/30 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20">Public</span>
              </div>
              {isEditing ? (
                  <div className="space-y-6">
                    {/* Multi-select Country Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                      {[
                        { name: "China", flag: "🇨🇳" },
                        { name: "Taiwan", flag: "🇹🇼" },
                        { name: "Thailand", flag: "🇹🇭" },
                        { name: "Malaysia", flag: "🇲🇾" },
                        { name: "Japan", flag: "🇯🇵" },
                        { name: "South Korea", flag: "🇰🇷" },
                        { name: "Australia", flag: "🇦🇺" },
                        { name: "New Zealand", flag: "🇳🇿" },
                        { name: "United Kingdom", flag: "🇬🇧" },
                        { name: "France", flag: "🇫🇷" },
                        { name: "Germany", flag: "🇩🇪" },
                        { name: "Italy", flag: "🇮🇹" },
                        { name: "Spain", flag: "🇪🇸" },
                        { name: "Switzerland", flag: "🇨🇭" },
                        { name: "Netherlands", flag: "🇳🇱" },
                        { name: "Greece", flag: "🇬🇷" },
                        { name: "Portugal", flag: "🇵🇹" },
                        { name: "United States", flag: "🇺🇸" },
                      ].map((c) => {
                        // Parse current countries (stored as comma-separated string)
                        const currentCountries = editForm.country ? editForm.country.split(",").map(s => s.trim()) : [];
                        const isSelected = currentCountries.includes(c.name);
                        
                        return (
                          <button
                            key={c.name}
                            onClick={() => {
                              const newCountries = isSelected 
                                ? currentCountries.filter(n => n !== c.name) 
                                : [...currentCountries, c.name];
                              handleInputChange("country", newCountries.join(", "));

                              // Auto-scroll to the new country's tags if selecting
                              if (!isSelected) {
                                setTimeout(() => {
                                  const element = document.getElementById(`tags-${c.name}`);
                                  if (element) {
                                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                                  } else {
                                    // Fallback: scroll to the tags container if specific tag section not found (e.g. no tags yet)
                                    document.getElementById("expertise-tags-container")?.scrollIntoView({ behavior: "smooth", block: "start" });
                                  }
                                }, 100);
                              }
                            }}
                            className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-all ${
                              isSelected
                                ? "border-cyan-500 bg-cyan-950/30 text-cyan-400"
                                : "border-white/10 bg-black/40 text-zinc-400 hover:bg-white/5"
                            }`}
                          >
                            <span className="text-2xl">{c.flag}</span>
                            <span className="text-xs font-medium text-center">{c.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Expertise Tags Section - Only shows when countries are selected */}
                    {editForm.country && (
                      <div id="expertise-tags-container" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-6">
                        
                        {/* Global Essentials */}
                        <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/10 to-purple-900/10 p-5 overflow-hidden relative">
                          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
                          
                          <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                              <Globe className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-base">
                                {language === "ja" ? "グローバル共通タグ" : "Global Essentials"}
                              </h4>
                              <p className="text-xs text-indigo-200/60 font-medium mt-0.5">
                                {language === "ja" ? "世界中で通用するスキル" : "Universal skills applicable everywhere"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2.5 relative z-10">
                            {GLOBAL_EXPERTISE_TAGS.map((tag) => {
                              const isSelected = (editForm.specialTags || []).includes(tag.value);
                              return (
                                <button
                                  key={tag.id}
                                  onClick={() => {
                                    const current = editForm.specialTags || [];
                                    const newTags = current.includes(tag.value)
                                      ? current.filter((t: string) => t !== tag.value)
                                      : [...current, tag.value];
                                    setEditForm(prev => ({ ...prev, specialTags: newTags }));
                                  }}
                                  className={`group relative px-4 py-2 rounded-lg text-xs font-medium border transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 text-left flex items-center gap-2 overflow-hidden ${
                                    isSelected
                                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                                      : "bg-zinc-900/40 text-zinc-400 border-white/5 hover:bg-indigo-900/20 hover:text-indigo-200 hover:border-indigo-500/30"
                                  }`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isSelected ? "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" : "bg-zinc-600 group-hover:bg-indigo-400/50"}`}></span>
                                  {language === "ja" && tag.label.zh ? tag.label.zh : tag.label.en}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Country Specific Tags */}
                        {editForm.country.split(",").map(c => c.trim()).map(country => {
                          const tags = COUNTRY_SPECIFIC_TAGS[country];
                          if (!tags || tags.length === 0) return null;
                          
                          return (
                            <div id={`tags-${country}`} key={country} className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-900/10 to-teal-900/10 p-5 overflow-hidden relative">
                              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
                              
                              <div className="flex items-center gap-3 mb-4 relative z-10">
                                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                  <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-white text-base">
                                    {country} {language === "ja" ? "限定タグ" : "Expertise"}
                                  </h4>
                                  <p className="text-xs text-emerald-200/60 font-medium mt-0.5">
                                    {language === "ja" ? "地域特有の知識と経験" : "Local knowledge & specialities"}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2.5 relative z-10">
                                {tags.map((tag) => {
                                  const isSelected = (editForm.specialTags || []).includes(tag.value);
                                  return (
                                    <button
                                      key={tag.id}
                                      onClick={() => {
                                        const current = editForm.specialTags || [];
                                        const newTags = current.includes(tag.value)
                                          ? current.filter((t: string) => t !== tag.value)
                                          : [...current, tag.value];
                                        setEditForm(prev => ({ ...prev, specialTags: newTags }));
                                        
                                        // Tatami Labs Video Logic
                                        if (!isSelected && tag.value.includes("Centuries-old Artisan")) {
                                          alert("💡 Pro Tip: Since you selected 'Centuries-old Artisan', consider adding a Tatami Labs video link to boost your profile!");
                                        }
                                      }}
                                      className={`group relative px-4 py-2 rounded-lg text-xs font-medium border transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 text-left flex items-center gap-2 overflow-hidden ${
                                        isSelected
                                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                                          : "bg-zinc-900/40 text-zinc-400 border-white/5 hover:bg-emerald-900/20 hover:text-emerald-200 hover:border-emerald-500/30"
                                      }`}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isSelected ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-zinc-600 group-hover:bg-emerald-400/50"}`}></span>
                                      {language === "ja" && tag.label.zh ? tag.label.zh : tag.label.en}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}

                        {/* Custom Expertise Input */}
                        <div className="rounded-xl border border-white/10 bg-black/20 p-5">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400 border border-white/5">
                              <Lightbulb className="h-5 w-5" />
                            </div>
                            <div>
                              <label className="block font-bold text-white text-base">
                                {language === "ja" ? "その他の専門分野" : "Custom Expertise"}
                              </label>
                              <p className="text-xs text-zinc-500 font-medium mt-0.5">
                                {language === "ja" ? "独自のスキルを追加" : "Add your unique skills"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-4">
                            <div className="relative group">
                              <input
                                type="text"
                                placeholder={language === "ja" ? "例：ビンテージカメラ専門家" : "Type your own expertise here (e.g., 'Vintage Camera Specialist')"}
                                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 placeholder-zinc-600 transition-all pl-11"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = (e.target as HTMLInputElement).value.trim();
                                    if (val) {
                                      // Simple validation check (mock)
                                      const forbidden = ["sex", "escort", "adult", "xxx"];
                                      if (forbidden.some(word => val.toLowerCase().includes(word))) {
                                        alert("⚠️ This tag violates our community guidelines.");
                                        return;
                                      }
                                      
                                      const current = editForm.specialTags || [];
                                      if (!current.includes(val)) {
                                        setEditForm(prev => ({ ...prev, specialTags: [...current, val] }));
                                      }
                                      (e.target as HTMLInputElement).value = "";
                                    }
                                  }
                                }}
                              />
                              <Plus className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                              <div className="absolute right-3 top-3 px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-500 border border-zinc-700">
                                Press Enter ↵
                              </div>
                            </div>

                            {/* Display Custom Tags */}
                            {(editForm.specialTags || []).filter((t: string) => 
                                !GLOBAL_EXPERTISE_TAGS.some(g => g.value === t) && 
                                !Object.values(COUNTRY_SPECIFIC_TAGS).flat().some(c => c.value === t)
                              ).length > 0 && (
                              <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-black/20 border border-white/5">
                                {(editForm.specialTags || [])
                                  .filter((t: string) => 
                                    !GLOBAL_EXPERTISE_TAGS.some(g => g.value === t) && 
                                    !Object.values(COUNTRY_SPECIFIC_TAGS).flat().some(c => c.value === t)
                                  )
                                  .map((tag: string) => (
                                    <span key={tag} className="group inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors hover:border-zinc-500">
                                      {tag}
                                      <button
                                        onClick={() => {
                                          const current = editForm.specialTags || [];
                                          setEditForm(prev => ({ ...prev, specialTags: current.filter((t: string) => t !== tag) }));
                                        }}
                                        className="p-0.5 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all opacity-60 group-hover:opacity-100"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </span>
                                  ))
                                }
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
              ) : (
                  <div>
                    <p className="text-sm font-semibold text-white mb-2">{hostProfile?.country || "--"}</p>
                    {hostProfile?.specialTags && hostProfile.specialTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {hostProfile.specialTags.map(tag => (
                          <span key={tag} className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-950/40 text-cyan-400 border border-cyan-500/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
              )}
            </div>
          </div>

          {/* University */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-400 border border-white/5">
              <Map className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-zinc-400">University</p>
              {isEditing ? (
                  <input
                    type="text"
                    value={editForm.universityName || ""}
                    onChange={(e) => handleInputChange("universityName", e.target.value)}
                    className="mt-1 w-full rounded bg-black/40 border border-white/10 px-2 py-1 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
              ) : (
                  <p className="text-sm font-semibold text-white">{hostProfile?.universityName || "--"}</p>
              )}
            </div>
          </div>

          {/* University Email */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-400 border border-white/5">
              <Mail className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-zinc-400">University Email</p>
              {isEditing ? (
                  <input
                    type="text"
                    value={editForm.universityEmail || ""}
                    onChange={(e) => handleInputChange("universityEmail", e.target.value)}
                    className="mt-1 w-full rounded bg-black/40 border border-white/10 px-2 py-1 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
              ) : (
                  <p className="text-sm font-semibold text-white break-all">{hostProfile?.universityEmail || "--"}</p>
              )}
            </div>
          </div>

          {/* SheerID Verification */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-900/30 text-indigo-400 border border-indigo-500/20">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-zinc-400">SheerID Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm font-semibold ${hostProfile?.sheerIdVerified ? "text-indigo-400" : "text-zinc-500"}`}>
                    {hostProfile?.sheerIdVerified ? "Verified Student" : "Not Verified"}
                </span>
                {hostProfile?.sheerIdVerified && <CheckCircle2 className="h-3 w-3 text-indigo-400" />}
              </div>
            </div>
          </div>

          {/* PayPay */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-950/30 text-red-400 border border-red-500/20">
              <Wallet className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-zinc-400">PayPay ID</p>
              {isEditing ? (
                  <input
                    type="text"
                    value={editForm.paypayId || ""}
                    onChange={(e) => handleInputChange("paypayId", e.target.value)}
                    className="mt-1 w-full rounded bg-black/40 border border-white/10 px-2 py-1 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
              ) : (
                  <p className="text-sm font-semibold text-white">{hostProfile?.paypayId || "--"}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-400 border border-white/5">
              <Phone className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-zinc-400">{language === "ja" ? "電話番号" : "Phone"}</p>
              {isEditing ? (
                  <input
                    type="text"
                    value={editForm.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="mt-1 w-full rounded bg-black/40 border border-white/10 px-2 py-1 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
              ) : (
                  <p className="text-sm font-semibold text-white">{hostProfile?.phone || "--"}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/50 text-zinc-400 border border-white/5">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-400">{language === "ja" ? "メールアドレス" : "Email"}</p>
              <p className="text-sm font-semibold text-white break-all">{hostProfile?.email || hostEmail || "--"}</p>
            </div>
          </div>

          {/* LINE */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-950/30 text-green-400 border border-green-500/20">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-zinc-400">LINE ID</p>
              {isEditing ? (
                  <input
                    type="text"
                    value={editForm.lineId || ""}
                    onChange={(e) => handleInputChange("lineId", e.target.value)}
                    className="mt-1 w-full rounded bg-black/40 border border-white/10 px-2 py-1 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
              ) : (
                  <p className="text-sm font-semibold text-white">{hostProfile?.lineId || "--"}</p>
              )}
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-950/30 text-emerald-400 border border-emerald-500/20">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-zinc-400">WhatsApp</p>
              {isEditing ? (
                  <input
                    type="text"
                    value={editForm.whatsapp || ""}
                    onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                    className="mt-1 w-full rounded bg-black/40 border border-white/10 px-2 py-1 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="+1 234 567 8900"
                  />
              ) : (
                  <p className="text-sm font-semibold text-white">{hostProfile?.whatsapp || "--"}</p>
              )}
            </div>
          </div>

          {/* Theme Tags */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 pt-4 border-t border-white/5">
            <h4 className="text-sm font-medium text-zinc-400 mb-3">{language === "ja" ? "テーマタグ" : "Theme Tags"}</h4>
            <div className="flex flex-wrap gap-2">
              {THEME_TAGS.map(tag => {
                const isSelected = isEditing 
                  ? (editForm.specialTags?.includes(tag.value))
                  : (hostProfile?.specialTags?.includes(tag.value));
                
                if (!isEditing && !isSelected) return null;

                return (
                  <button
                    key={tag.id}
                    onClick={() => {
                      if (!isEditing) return;
                      const currentTags = editForm.specialTags || [];
                      const newTags = currentTags.includes(tag.value)
                        ? currentTags.filter(t => t !== tag.value)
                        : [...currentTags, tag.value];
                      setEditForm(prev => ({ ...prev, specialTags: newTags }));
                    }}
                    disabled={!isEditing}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isSelected 
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/50" 
                        : "bg-zinc-800/50 text-zinc-400 border-white/5 hover:bg-zinc-800"
                    }`}
                  >
                    {language === "ja" ? tag.label.ja : tag.label.en}
                  </button>
                );
              })}
              {(!hostProfile?.specialTags || hostProfile.specialTags.length === 0) && !isEditing && (
                <span className="text-sm text-zinc-500 italic">No tags selected</span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Guides Count */}
        <div className="rounded-xl border border-white/10 bg-[#1a1a2e]/60 backdrop-blur-sm p-6 shadow-lg hover:border-cyan-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-950/30 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
              <Map className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">{t("dashboard.my_guides")}</p>
              <h3 className="text-2xl font-bold text-white">{guides.length}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-zinc-500">
            <BarChart3 className="mr-1 h-3 w-3" />
            <span>{t("dashboard.no_guides")}</span>
          </div>
        </div>

        {/* Schedule */}
        <div className="rounded-xl border border-white/10 bg-[#1a1a2e]/60 backdrop-blur-sm p-6 shadow-lg hover:border-purple-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-950/30 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">{t("dashboard.service_schedule")}</p>
              <h3 className="text-2xl font-bold text-white">
                {guides.find(g => g.status === 'active' && g.nextServiceDate)?.nextServiceDate || "--"}
              </h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-zinc-500">
            <Clock className="mr-1 h-3 w-3" />
            <span>{t("dashboard.set_availability")}</span>
          </div>
        </div>

        {/* Income */}
        <div className="rounded-xl border border-white/10 bg-[#1a1a2e]/60 backdrop-blur-sm p-6 shadow-lg hover:border-emerald-500/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-950/30 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">{t("dashboard.total_income")}</p>
              <h3 className="text-2xl font-bold text-white">¥0</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-zinc-500">
            <DollarSign className="mr-1 h-3 w-3" />
            <span>{t("dashboard.payout_note")}</span>
          </div>
        </div>
      </div>

      {/* My Guides Section */}
      <div className="rounded-xl border border-white/10 bg-[#1a1a2e]/60 backdrop-blur-sm overflow-hidden shadow-lg">
        <div className="border-b border-white/10 bg-black/20 px-6 py-4">
          <h3 className="text-lg font-bold text-white">{t("dashboard.my_guides")}</h3>
        </div>
        
        {guides.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/50 text-zinc-600 border border-white/5">
              <Map className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-white">{t("dashboard.no_guides_yet")}</h3>
            <p className="mt-2 text-zinc-400 max-w-sm mx-auto">
              {t("dashboard.create_first_guide")}
            </p>
            <button
              onClick={onCreateGuide}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600/20 px-4 py-2 text-sm font-semibold text-cyan-400 hover:bg-cyan-600/30 hover:text-cyan-300 transition-all border border-cyan-500/30"
            >
              <Plus className="h-4 w-4" />
              {t("dashboard.create_guide")}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {guides.map((guide) => (
              <div key={guide.id} className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 border border-white/10">
                    <Map className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{guide.title}</h4>
                    <div className="mt-1 flex items-center gap-4 text-sm text-zinc-400">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                        guide.status === 'active' 
                          ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-yellow-950/30 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {guide.status === 'active' ? (
                            <>
                                <CheckCircle2 className="h-3 w-3" />
                                {t("dashboard.status.active")}
                            </>
                        ) : (
                            <>
                                <Clock className="h-3 w-3" />
                                {t("dashboard.status.under_review")}
                            </>
                        )}
                      </span>
                      <span>{t("dashboard.updated")}: {guide.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {onSimulateApproval && guide.status === 'pending' && (
                        <button
                            onClick={() => onSimulateApproval(guide.id)}
                            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-yellow-900/20 px-3 py-1.5 text-xs font-medium text-yellow-500 hover:bg-yellow-900/30 hover:text-yellow-400 border border-yellow-500/20 transition-all"
                        >
                            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                            [Dev] Approve
                        </button>
                    )}
                  <button 
                    onClick={() => onEditGuide(guide.id)}
                    className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <Edit2 className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{t("dashboard.edit")}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visitor Verification */}
      <div className="rounded-xl border border-white/10 bg-[#1a1a2e]/60 backdrop-blur-sm p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-bold text-white">{t("dashboard.verify_visitor")}</h3>
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            placeholder={t("dashboard.enter_code")}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="flex-1 rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <button
            onClick={handleVerify}
            disabled={verificationStatus === 'verifying' || !verificationCode}
            className="rounded-lg bg-zinc-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 border border-white/10 transition-all"
          >
            {verificationStatus === 'verifying' ? t("dashboard.verifying") : t("dashboard.verify")}
          </button>
        </div>

        {verificationStatus === 'success' && verifiedData && (
            <div className="mt-4 rounded-lg bg-emerald-950/20 border border-emerald-500/20 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-emerald-400">{t("dashboard.verification_success")}</h4>
                        <div className="mt-2 space-y-1 text-sm text-emerald-300/80">
                            <p><span className="opacity-70">{t("dashboard.visitor")}:</span> {verifiedData.visitorName}</p>
                            <p><span className="opacity-70">{t("dashboard.amount")}:</span> ¥{verifiedData.amount.toLocaleString()}</p>
                            {verifiedData.tourTitle && <p><span className="opacity-70">{t("dashboard.tour")}:</span> {verifiedData.tourTitle}</p>}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {verificationStatus === 'error' && (
            <div className="mt-4 rounded-lg bg-red-950/20 border border-red-500/20 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <p className="font-medium text-red-400">{t("dashboard.invalid_code")}</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
