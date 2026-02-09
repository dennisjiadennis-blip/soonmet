
"use client";

import { useState } from "react";
import { Loader2, Facebook, Linkedin, Twitter, CheckCircle, Instagram, Upload, Image as ImageIcon } from "lucide-react";
import { AIEvaluationResult } from "@/lib/credit-types";

interface Level2UpgradeFlowProps {
  onComplete: (result: AIEvaluationResult) => void;
  onCancel: () => void;
}

export function Level2UpgradeFlow({ onComplete, onCancel }: Level2UpgradeFlowProps) {
  const [step, setStep] = useState<"connect" | "analyzing" | "result">("connect");
  const [realName, setRealName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isPublicIg, setIsPublicIg] = useState(false);

  const handleConnect = () => {
    if (!realName.trim()) {
      alert("Please enter your real name first.");
      return;
    }
    if (!avatar) {
      alert("Please upload a profile photo.");
      return;
    }
    if (!isPublicIg) {
      alert("You must agree to make your Instagram public to visitors.");
      return;
    }
    // setConnectedProvider(provider);
    setStep("analyzing");
    // Simulate API Call
    setTimeout(() => {
      setStep("result");
    }, 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const mockResult: AIEvaluationResult = {
    authenticityScore: 0.95,
    personalityTags: ["Art Enthusiast", "Foodie", "Local Expert"],
    vibeSummary: "Host shows consistent and authentic engagement with local culture. High quality content suggests reliability.",
    evaluatedAt: new Date().toISOString(),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
        {step === "connect" && (
          <>
            <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">Connect Social Media</h3>
            <p className="mb-6 text-sm text-zinc-500">
              To become a Vibe Host (L2), we need to verify your real identity and social vibe.
            </p>
            
            <div className="space-y-4 mb-6">
              {/* Profile Photo Upload */}
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Profile Photo <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="avatar-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:border-zinc-500 dark:hover:bg-zinc-700">
                    {avatar ? (
                        <div className="flex flex-col items-center">
                            <ImageIcon className="w-8 h-8 text-green-500 mb-2" />
                            <p className="text-sm text-zinc-500">{avatar.name}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                            <p className="text-xs text-zinc-500">Click to upload avatar</p>
                        </div>
                    )}
                    <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

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
                <p className="mt-1 text-xs text-zinc-500">Only used for verification. Not shown to guests.</p>
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

            <p className="mb-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Connect one of your social accounts:
            </p>
            <div className="space-y-3">
              <button onClick={() => handleConnect()} className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 p-3 font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
                <Instagram className="h-5 w-5 text-pink-600" /> Connect Instagram
              </button>
              <button onClick={() => handleConnect()} className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 p-3 font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
                <Facebook className="h-5 w-5 text-blue-600" /> Connect Facebook
              </button>
              <button onClick={() => handleConnect()} className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 p-3 font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
                <Linkedin className="h-5 w-5 text-blue-700" /> Connect LinkedIn
              </button>
              <button onClick={() => handleConnect()} className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 p-3 font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
                <Twitter className="h-5 w-5 text-sky-500" /> Connect X (Twitter)
              </button>
            </div>
            <button onClick={onCancel} className="mt-6 w-full text-sm text-zinc-500 hover:underline">Cancel</button>
          </>
        )}

        {step === "analyzing" && (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-indigo-600" />
            <h3 className="mb-2 text-lg font-bold">AI Analyzing Profile...</h3>
            <p className="text-center text-sm text-zinc-500">
              GPT-4o is reviewing your public metadata to generate a vibe report.
            </p>
          </div>
        )}

        {step === "result" && (
          <div>
             <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Analysis Complete!</h3>
                <p className="text-zinc-500">Your profile has been verified.</p>
             </div>

             <div className="mb-6 rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-800">
                <p className="font-semibold text-zinc-700 dark:text-zinc-300">AI Summary:</p>
                <p className="italic text-zinc-600 dark:text-zinc-400">&quot;{mockResult.vibeSummary}&quot;</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {mockResult.personalityTags.map(tag => (
                    <span key={tag} className="rounded-full bg-white px-2 py-1 text-xs font-medium shadow-sm dark:bg-zinc-700">#{tag}</span>
                  ))}
                </div>
             </div>

             <button 
               onClick={() => onComplete(mockResult)}
               className="w-full rounded-lg bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700"
             >
               Confirm & Upgrade to Level 2
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
