"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

interface RegistrationViewProps {
  onComplete: (email: string) => void;
}

export function RegistrationView({ onComplete }: RegistrationViewProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverCode, setServerCode] = useState(""); // Mock server-side code

  const handleSendCode = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setIsLoading(true);
    
    // Simulate API call and code generation
    setTimeout(() => {
      setIsLoading(false);
      setServerCode("123456"); // Hardcoded for demo/testing
      setStep("otp");
    }, 1500);
  };

  const handleVerify = async () => {
    if (otp !== serverCode) {
      setError("Invalid verification code. Please check your input.");
      return;
    }
    setError("");
    setIsLoading(true);

    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      onComplete(email);
    }, 1500);
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <Mail className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {step === "email" ? "Host Registration" : "Check your inbox"}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {step === "email" 
              ? "Enter your email to start your journey as a local guide." 
              : <span>We've sent a verification code to {email}.<br/><span className="font-mono text-indigo-600 dark:text-indigo-400">(Demo Code: {serverCode})</span></span>}
          </p>
        </div>

        <div className="space-y-6">
          {step === "email" ? (
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full appearance-none rounded-lg border border-zinc-300 px-3 py-3 text-zinc-900 placeholder-zinc-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 sm:text-sm"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <label htmlFor="otp" className="sr-only">Verification Code</label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                className="relative block w-full appearance-none rounded-lg border border-zinc-300 px-3 py-3 text-center text-2xl font-bold tracking-widest text-zinc-900 placeholder-zinc-300 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-600 sm:text-sm"
                placeholder="0000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          )}

          {error && (
            <p className="text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            onClick={step === "email" ? handleSendCode : handleVerify}
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 dark:ring-offset-zinc-900"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                {step === "email" ? "Send Code" : "Verify & Register"}
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </button>
          
          {step === "otp" && (
            <button 
              onClick={() => { setStep("email"); setError(""); }}
              className="w-full text-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            >
              Change email address
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
