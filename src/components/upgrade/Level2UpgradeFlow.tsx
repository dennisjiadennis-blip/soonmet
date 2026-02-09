
"use client";

import { useState } from "react";
import { Loader2, CheckCircle, Upload, X } from "lucide-react";
import { AIEvaluationResult } from "@/lib/credit-types";

interface Level2UpgradeFlowProps {
  onComplete: (result: AIEvaluationResult, data: { avatarUrl: string; isPublicIg: boolean; realName: string }) => void;
  onCancel: () => void;
}

interface AIResponse {
  audit_result: {
    status: string;
    target_level: string;
    suggested_hourly_rate: string;
  };
  content_score: {
    vibe_score: number;
    safety_check: string;
    risks: string;
  };
  optimized_content: {
    english_headline: string;
    english_bio: string;
  };
  action_items: string[];
}

export function Level2UpgradeFlow({ onComplete, onCancel }: Level2UpgradeFlowProps) {
  const [step, setStep] = useState<"connect" | "analyzing" | "result">("connect");
  const [realName, setRealName] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [bio, setBio] = useState("");
  const [isPublicIg, setIsPublicIg] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);

  const handleConnect = async () => {
    if (!realName.trim()) {
      alert("Please enter your real name first.");
      return;
    }
    if (photos.length < 3) {
      alert("Please upload at least 3 photos to show your vibe.");
      return;
    }
    if (!bio.trim()) {
      alert("Please enter a short bio about yourself.");
      return;
    }
    if (!isPublicIg) {
      alert("You must agree to make your Instagram public to visitors.");
      return;
    }

    setStep("analyzing");

    try {
      // Convert photos to base64
      const imagePromises = photos.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);

      const response = await fetch('/api/ai/evaluate-host', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio,
          images: base64Images,
          level: 'L2',
          realName
        }),
      });

      const result = await response.json();
      setAiResult(result);
      setStep("result");

    } catch (error) {
      console.error("Evaluation failed", error);
      alert("AI Evaluation failed. Please try again.");
      setStep("connect");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...newFiles].slice(0, 3));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900 overflow-y-auto max-h-[90vh]">
        {step === "connect" && (
          <>
            <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">Apply for Social Host (L2)</h3>
            <p className="mb-6 text-sm text-zinc-500">
              Upgrade to L2 (¥3,500/hr) by verifying your social vibe. Our AI curator will audit your profile.
            </p>
            
            <div className="space-y-4 mb-6">
              {/* Real Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Real Name (Private) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  placeholder="Official name on ID"
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Your Bio <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800"
                />
                <p className="text-xs text-zinc-500">AI will optimize this for Western tourists.</p>
              </div>

              {/* Photos Upload */}
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Upload 3 Vibe Photos <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
                      <img src={URL.createObjectURL(photo)} alt="preview" className="h-full w-full object-cover" />
                      <button 
                        onClick={() => removePhoto(idx)}
                        className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 3 && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
                      <Upload className="h-6 w-6 text-zinc-400" />
                      <span className="mt-1 text-xs text-zinc-500">Add Photo</span>
                      <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
                    </label>
                  )}
                </div>
                <p className="mt-1 text-xs text-zinc-500">Show us your local vibe. No stock photos.</p>
              </div>

              {/* Public Instagram Toggle */}
              <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <input 
                    type="checkbox" 
                    id="public-ig" 
                    checked={isPublicIg} 
                    onChange={(e) => setIsPublicIg(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="public-ig" className="text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">Make Instagram Public to Visitors</span>
                    <br />
                    I agree to allow verified visitors to view my Instagram profile to build trust.
                </label>
              </div>
            </div>

            <button 
              onClick={handleConnect} 
              disabled={photos.length < 3 || !realName || !bio || !isPublicIg}
              className="w-full rounded-lg bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Start AI Audit
            </button>
            <button onClick={onCancel} className="mt-4 w-full text-sm text-zinc-500 hover:underline">Cancel</button>
          </>
        )}

        {step === "analyzing" && (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-indigo-600" />
            <h3 className="mb-2 text-lg font-bold">AI Curator is Auditing...</h3>
            <p className="text-center text-sm text-zinc-500">
              Analyzing visual authenticity and optimizing your bio...
            </p>
          </div>
        )}

        {step === "result" && aiResult && (
          <div>
             <div className="mb-6 flex flex-col items-center text-center">
                <div className={`mb-4 rounded-full p-3 ${aiResult.audit_result?.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">{aiResult.audit_result?.status === 'Approved' ? 'Approved!' : 'Pending Review'}</h3>
                <p className="text-zinc-500">Target Level: {aiResult.audit_result?.target_level}</p>
             </div>

             <div className="mb-4 space-y-4">
                {/* Vibe Score */}
                <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
                   <div className="flex items-center justify-between">
                     <span className="font-semibold">Vibe Score</span>
                     <span className="text-xl font-bold text-indigo-600">{aiResult.content_score?.vibe_score}/10</span>
                   </div>
                   <div className="mt-2 text-xs text-zinc-500">
                     Safety Check: {aiResult.content_score?.safety_check}
                   </div>
                </div>

                {/* Optimized Content */}
                <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900/50 dark:bg-indigo-900/20">
                   <h4 className="mb-2 text-sm font-bold text-indigo-900 dark:text-indigo-100">✨ AI Optimized Bio</h4>
                   <p className="mb-1 text-sm font-semibold text-indigo-800 dark:text-indigo-200">{aiResult.optimized_content?.english_headline}</p>
                   <p className="text-sm italic text-indigo-700 dark:text-indigo-300">&quot;{aiResult.optimized_content?.english_bio}&quot;</p>
                </div>

                {/* Action Items */}
                {aiResult.action_items && aiResult.action_items.length > 0 && (
                  <div className="rounded-lg bg-orange-50 p-4 text-sm text-orange-800 dark:bg-orange-900/20 dark:text-orange-200">
                    <p className="font-bold mb-1">Curator Suggestions:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {aiResult.action_items.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
             </div>

             <button 
               onClick={() => {
                 // Create a fake URL for the avatar (use the first photo)
                 const avatarUrl = photos.length > 0 ? URL.createObjectURL(photos[0]) : "";
                 
                 const result: AIEvaluationResult = {
                    authenticityScore: aiResult.content_score?.vibe_score ? aiResult.content_score.vibe_score / 10 : 0.8,
                    personalityTags: ["Vibe Verified", "Local"],
                    vibeSummary: aiResult.optimized_content?.english_bio || "Verified Host",
                    evaluatedAt: new Date().toISOString()
                 };

                 onComplete(result, {
                   avatarUrl,
                   isPublicIg,
                   realName
                 });
               }}
               className="w-full rounded-lg bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700"
             >
               Confirm & Upgrade
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
