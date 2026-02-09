"use client";

import { useState } from "react";
import { X, CheckCircle2, ShieldCheck, ArrowRight, Loader2, Sparkles } from "lucide-react";

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: (data: { 
    nickname: string; 
    phone: string; 
    realName: string; 
    lineId: string; 
    whatsapp: string;
    universityEmail: string;
    gender: string; 
    age: string; 
    university: string;
  }) => Promise<void>;
  initialData?: {
    nickname?: string;
    phone?: string;
    realName?: string;
    lineId?: string;
    whatsapp?: string;
    universityEmail?: string;
    gender?: string;
    age?: string;
    university?: string;
  };
}

export function ActivationModal({ isOpen, onClose, onActivate, initialData }: ActivationModalProps) {
  const [nickname, setNickname] = useState(initialData?.nickname || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [realName, setRealName] = useState(initialData?.realName || "");
  const [lineId, setLineId] = useState(initialData?.lineId || "");
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp || "");
  const [universityEmail, setUniversityEmail] = useState(initialData?.universityEmail || "");
  const [gender, setGender] = useState(initialData?.gender || "");
  const [age, setAge] = useState(initialData?.age || "");
  const [university, setUniversity] = useState(initialData?.university || "");
  const [isSheerIdVerified, setIsSheerIdVerified] = useState(false);
  const [isPublicInfoAgreed, setIsPublicInfoAgreed] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Update state when initialData changes or modal opens
  if (initialData && !nickname && !phone && isOpen) {
     if (initialData.nickname) setNickname(initialData.nickname);
     if (initialData.phone) setPhone(initialData.phone);
     if (initialData.realName) setRealName(initialData.realName);
     if (initialData.lineId) setLineId(initialData.lineId);
     if (initialData.whatsapp) setWhatsapp(initialData.whatsapp);
     if (initialData.universityEmail) setUniversityEmail(initialData.universityEmail);
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname || !gender || !age || !university || !universityEmail || !isSheerIdVerified || !isPublicInfoAgreed) {
      setError("Please fill in all required fields and complete verification.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await onActivate({ 
        nickname, 
        phone, 
        realName, 
        lineId, 
        whatsapp,
        universityEmail,
        gender, 
        age, 
        university 
      });
      setIsSuccess(true);
      // Wait for animation
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: unknown) {
      console.error("Activation failed", error);
      const message = error instanceof Error ? error.message : "Activation failed. Please try again.";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
        
        {/* Header with Visual Emphasis */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-1 hover:bg-white/30"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold">Final Step to Launch</h2>
          <p className="mt-1 text-indigo-100">Activate your host account to start earning.</p>
        </div>

        <div className="p-6">
          {!isSuccess ? (
            <>
              <div className="mb-6 rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">Unlock Level 1 Benefits</h3>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                      Completing this form unlocks your ability to set prices up to <span className="font-bold">¥3,000/hour</span>.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Nickname <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      placeholder="Display name"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Real Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={realName}
                      onChange={(e) => setRealName(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      placeholder="For admin only"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    >
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      placeholder="e.g. 21"
                    />
                  </div>
                </div>

                <div>
                   <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                     University / College <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="text"
                     required
                     value={university}
                     onChange={(e) => setUniversity(e.target.value)}
                     className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                     placeholder="e.g. Waseda University"
                   />
                </div>

                <div>
                   <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                     University Email <span className="text-red-500">*</span>
                   </label>
                   <input
                     type="email"
                     required
                     value={universityEmail}
                     onChange={(e) => setUniversityEmail(e.target.value)}
                     className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                     placeholder="e.g. student@waseda.jp"
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      placeholder="+81 90-1234-5678"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      LINE ID
                    </label>
                    <input
                      type="text"
                      value={lineId}
                      onChange={(e) => setLineId(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                   <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                     WhatsApp
                   </label>
                   <input
                     type="text"
                     value={whatsapp}
                     onChange={(e) => setWhatsapp(e.target.value)}
                     className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                     placeholder="Optional"
                   />
                </div>

                <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-800 dark:bg-indigo-900/10 space-y-3">
                   <div className="flex items-center gap-2">
                     <input
                       type="checkbox"
                       id="sheer-id"
                       checked={isSheerIdVerified}
                       onChange={(e) => setIsSheerIdVerified(e.target.checked)}
                       className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                     />
                     <label htmlFor="sheer-id" className="text-sm text-zinc-700 dark:text-zinc-300">
                       I have completed <span className="font-semibold text-indigo-600">SheerID Student Verification</span>
                     </label>
                   </div>
                   <div className="flex items-center gap-2">
                     <input
                       type="checkbox"
                       id="public-info"
                       checked={isPublicInfoAgreed}
                       onChange={(e) => setIsPublicInfoAgreed(e.target.checked)}
                       className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                     />
                     <label htmlFor="public-info" className="text-sm text-zinc-700 dark:text-zinc-300">
                       I agree to make my profile information public
                     </label>
                   </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !isSheerIdVerified || !isPublicInfoAgreed}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Activating...
                    </>
                  ) : (
                    <>
                      Activate Host Account <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center py-8 text-center animate-in fade-in zoom-in duration-300">
              <div className="mb-4 rounded-full bg-green-100 p-4 text-green-600 dark:bg-green-900/30">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">You&apos;re Active!</h3>
              <p className="text-zinc-500">
                Welcome to Level 1. You can now set higher prices and access more features.
              </p>
              <div className="mt-6 w-full rounded-lg bg-zinc-100 p-3 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                Closing...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
