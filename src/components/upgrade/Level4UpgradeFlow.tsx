
"use client";

import { useState, useRef } from "react";
import { Loader2, Camera, CheckCircle, XCircle } from "lucide-react";

interface Level4UpgradeFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function Level4UpgradeFlow({ onComplete, onCancel }: Level4UpgradeFlowProps) {
  const [step, setStep] = useState<"permission" | "camera" | "verifying" | "success" | "error">("permission");
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      setStep("camera");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setStep("error");
    }
  };

  const captureAndVerify = () => {
    setStep("verifying");
    // Simulate Face Comparison Logic
    setTimeout(() => {
      // Stop camera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      setStep("success");
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-zinc-900">
        
        {step === "permission" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30">
              <Camera className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Biometric Liveness Check</h3>
            <p className="mb-6 text-sm text-zinc-500">
              We need to verify that you are a real person. This involves a quick live face scan.
              Please ensure you are in a well-lit area.
            </p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 rounded-lg border border-zinc-200 py-2.5 font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
                Cancel
              </button>
              <button 
                onClick={startCamera}
                className="flex-[2] rounded-lg bg-indigo-600 py-2.5 font-bold text-white hover:bg-indigo-700"
              >
                Start Camera
              </button>
            </div>
          </div>
        )}

        {step === "camera" && (
          <div className="relative overflow-hidden rounded-xl bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="h-64 w-full object-cover transform scale-x-[-1]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-48 w-48 rounded-full border-4 border-white/50 border-dashed"></div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
               <button 
                 onClick={captureAndVerify}
                 className="rounded-full bg-white px-6 py-2 text-sm font-bold text-black shadow-lg hover:bg-gray-100"
               >
                 Capture & Verify
               </button>
            </div>
          </div>
        )}

        {step === "verifying" && (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-indigo-600" />
            <h3 className="mb-2 text-lg font-bold">Verifying Biometrics...</h3>
            <p className="text-center text-sm text-zinc-500">
              Matching your live face with your ID document...
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="text-center">
             <div className="mb-6 flex flex-col items-center">
                <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Verification Successful!</h3>
                <p className="text-zinc-500 mt-2">
                  You are now a Trusted Host (Level 4). Your pricing cap has been removed.
                </p>
             </div>

             <button 
               onClick={onComplete}
               className="w-full rounded-lg bg-amber-500 py-3 font-bold text-white hover:bg-amber-600"
             >
               Unlock Uncapped Pricing
             </button>
          </div>
        )}

        {step === "error" && (
          <div className="text-center">
             <div className="mb-6 flex flex-col items-center">
                <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/30">
                  <XCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Camera Access Failed</h3>
                <p className="text-zinc-500 mt-2">
                  We couldn&apos;t access your camera. Please check your browser permissions and try again.
                </p>
             </div>
             <button onClick={onCancel} className="w-full rounded-lg bg-zinc-200 py-3 font-medium text-zinc-800 hover:bg-zinc-300">
               Close
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
