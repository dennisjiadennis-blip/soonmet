
"use client";

import { useState } from "react";
import { Loader2, UploadCloud, FileText, CheckCircle, AlertTriangle, Video, Tag, PlayCircle } from "lucide-react";

interface Level3UpgradeFlowProps {
  hostId: string;
  onComplete: (tags: string[]) => void;
  onCancel: () => void;
}

const AVAILABLE_TAGS = [
  { id: "anime", label: "Anime/Manga", desc: "Akihabara/Nakano Guide" },
  { id: "sake", label: "Sake & Izakaya", desc: "Hidden Bars Expert" },
  { id: "gourmet", label: "Gourmet", desc: "Foodie & Fine Dining" },
  { id: "fashion", label: "Fashion/Beauty", desc: "Omotesando/Shibuya Style" },
  { id: "history", label: "History", desc: "Shrines & Temples" },
];

export function Level3UpgradeFlow({ hostId, onComplete, onCancel }: Level3UpgradeFlowProps) {
  const [step, setStep] = useState<"upload" | "video" | "tags" | "processing" | "success">("upload");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Step 1: ID Upload
  const handleIdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setIdFile(e.target.files[0]);
  };

  // Step 2: Video Upload
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setVideoFile(e.target.files[0]);
  };

  // Step 3: Tags
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(prev => prev.filter(t => t !== tagId));
    } else {
      if (selectedTags.length >= 3) return; // Max 3
      setSelectedTags(prev => [...prev, tagId]);
    }
  };

  const handleSubmit = async () => {
    setStep("processing");
    try {
      // In a real app, we would upload files (idFile, videoFile) to S3/Blob storage here first
      // and get their URLs to send to the backend.
      // For this prototype, we simulate file upload and just send the tags.
      
      const res = await fetch('/api/host/tier/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostId,
          action: "UPGRADE_L3",
          tags: selectedTags
        })
      });

      if (!res.ok) {
        throw new Error("Failed to update tier");
      }

      // Wait a bit to show processing state
      setTimeout(() => {
        setStep("success");
      }, 1500);
      
    } catch (error) {
      console.error("L3 Upgrade Error:", error);
      alert("Application failed. Please try again.");
      setStep("tags");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
        
        {/* Progress Header */}
        <div className="mb-6 flex items-center justify-between px-2">
           <div className={`flex flex-col items-center ${step === "upload" ? "text-indigo-600" : "text-zinc-400"}`}>
             <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step === "upload" || idFile ? "border-indigo-600 bg-indigo-50" : "border-zinc-300"}`}>1</div>
             <span className="mt-1 text-xs">ID</span>
           </div>
           <div className="h-0.5 flex-1 bg-zinc-200 mx-2"></div>
           <div className={`flex flex-col items-center ${step === "video" ? "text-indigo-600" : "text-zinc-400"}`}>
             <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step === "video" || videoFile ? "border-indigo-600 bg-indigo-50" : "border-zinc-300"}`}>2</div>
             <span className="mt-1 text-xs">Video</span>
           </div>
           <div className="h-0.5 flex-1 bg-zinc-200 mx-2"></div>
           <div className={`flex flex-col items-center ${step === "tags" ? "text-indigo-600" : "text-zinc-400"}`}>
             <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step === "tags" || selectedTags.length > 0 ? "border-indigo-600 bg-indigo-50" : "border-zinc-300"}`}>3</div>
             <span className="mt-1 text-xs">Tags</span>
           </div>
        </div>

        {step === "upload" && (
          <>
            <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">Identity Verification</h3>
            <p className="mb-6 text-sm text-zinc-500">
              Upload a valid Government ID (Passport, Driver&apos;s License) to become an Ace Host (L3).
              <span className="mt-2 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500">
                <AlertTriangle className="h-3 w-3" />
                Securely encrypted.
              </span>
            </p>

            <div className="mb-6 rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50">
              <input type="file" accept="image/*,.pdf" onChange={handleIdFileChange} className="hidden" id="id-upload" />
              <label htmlFor="id-upload" className="cursor-pointer flex flex-col items-center">
                {idFile ? (
                  <>
                    <FileText className="mb-2 h-10 w-10 text-indigo-500" />
                    <span className="font-medium">{idFile.name}</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="mb-2 h-10 w-10 text-zinc-400" />
                    <span className="font-medium">Click to Upload ID</span>
                  </>
                )}
              </label>
            </div>

            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 rounded-lg border border-zinc-200 py-2.5 font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">Cancel</button>
              <button 
                onClick={() => setStep("video")}
                disabled={!idFile}
                className="flex-[2] rounded-lg bg-indigo-600 py-2.5 font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Next: Video Interview
              </button>
            </div>
          </>
        )}

        {step === "video" && (
          <>
            <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">Video Interview</h3>
            <p className="mb-6 text-sm text-zinc-500">
              Upload a short (30-60s) video introducing yourself. Why should guests choose you?
            </p>

            <div className="mb-6 rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50">
              <input type="file" accept="video/*" onChange={handleVideoFileChange} className="hidden" id="video-upload" />
              <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                {videoFile ? (
                  <>
                    <PlayCircle className="mb-2 h-10 w-10 text-indigo-500" />
                    <span className="font-medium">{videoFile.name}</span>
                  </>
                ) : (
                  <>
                    <Video className="mb-2 h-10 w-10 text-zinc-400" />
                    <span className="font-medium">Upload Introduction Video</span>
                  </>
                )}
              </label>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("upload")} className="flex-1 rounded-lg border border-zinc-200 py-2.5 font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">Back</button>
              <button 
                onClick={() => setStep("tags")}
                disabled={!videoFile}
                className="flex-[2] rounded-lg bg-indigo-600 py-2.5 font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Next: Select Tags
              </button>
            </div>
          </>
        )}

        {step === "tags" && (
          <>
            <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">Claim Your Niche</h3>
            <p className="mb-6 text-sm text-zinc-500">
              Select up to 3 tags that describe your expertise. These allow guests to find you based on their interests.
            </p>

            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {AVAILABLE_TAGS.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`flex flex-col items-start rounded-lg border p-3 text-left transition-all ${
                    selectedTags.includes(tag.id)
                      ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 dark:bg-indigo-900/20"
                      : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                    <Tag className="h-4 w-4" />
                    {tag.label}
                  </span>
                  <span className="text-xs text-zinc-500">{tag.desc}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("video")} className="flex-1 rounded-lg border border-zinc-200 py-2.5 font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">Back</button>
              <button 
                onClick={handleSubmit}
                disabled={selectedTags.length === 0}
                className="flex-[2] rounded-lg bg-indigo-600 py-2.5 font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Submit Application
              </button>
            </div>
          </>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center py-12">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-indigo-600" />
            <h3 className="mb-2 text-lg font-bold">Processing Application...</h3>
            <p className="text-center text-sm text-zinc-500">
              Verifying ID, analyzing video, and applying tags.
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-8">
             <div className="mb-6 flex flex-col items-center">
                <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Application Received!</h3>
                <p className="mt-2 text-zinc-500">
                  Your request to become an Ace Host (L3) is under review.
                  <br />
                  <span className="text-sm">We will notify you within 24-48 hours.</span>
                </p>
             </div>
             <button 
               onClick={() => onComplete(selectedTags)}
               className="w-full rounded-lg bg-zinc-900 py-3 font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
             >
               Return to Dashboard
             </button>
          </div>
        )}

      </div>
    </div>
  );
}
