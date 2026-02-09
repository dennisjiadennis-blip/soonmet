"use client";

import { useState } from "react";
import { Loader2, Zap } from "lucide-react";

interface RegistrationViewProps {
  onComplete: (email: string) => void;
}

export function RegistrationView({ onComplete }: RegistrationViewProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "profile">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverCode, setServerCode] = useState(""); // Mock server-side code
  
  // Profile State
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "">("");
  const [country, setCountry] = useState("");

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
    // Move to profile step
    setStep("profile");
  };

  const handleRegister = async () => {
    // Validation
    if (!country) {
      setError("Please select your country.");
      return;
    }
    if (!nickname || !/^[A-Za-z\s]+$/.test(nickname)) {
      setError("Nickname must contain English letters only.");
      return;
    }
    if (!gender) {
      setError("Please select your gender.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Call Register API
      const res = await fetch('/api/host/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nickname, country, gender })
      });

      if (!res.ok) {
        throw new Error('Registration failed');
      }

      // Complete
      onComplete(email);
    } catch (err) {
      console.error(err);
      setError("Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-[#1a1a2e]/80 backdrop-blur-md p-8 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Zap className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {step === "email" ? "Join LocalVibe" : step === "otp" ? "Check your inbox" : "Complete Profile"}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {step === "email" 
              ? "Become a Host and share your Tokyo vibe." 
              : step === "otp" 
                ? `We sent a code to ${email}`
                : "Tell us a bit about yourself."}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-900/20 border border-red-500/50 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {step === "email" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm transition-all"
                  placeholder="Enter your email address"
                />
              </div>
              <button
                onClick={handleSendCode}
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Continue"}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="sr-only">Verification Code</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="relative block w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-center text-2xl tracking-widest text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              <button
                onClick={handleVerify}
                className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                Verify Code
              </button>
              <button 
                onClick={() => setStep("email")}
                className="w-full text-center text-sm text-zinc-500 hover:text-cyan-400"
              >
                Change email
              </button>
            </div>
          )}

          {step === "profile" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Nickname (English only)</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm"
                  placeholder="e.g. Kenji"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Country / Region</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="block w-full rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm appearance-none"
                >
                  <option value="" disabled>Select your country</option>
                  <option value="Japan">Japan</option>
                  <option value="USA">USA</option>
                  <option value="China">China</option>
                  <option value="Korea">Korea</option>
                  <option value="Taiwan">Taiwan</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Male", "Female"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g as "Male" | "Female")}
                      className={`flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                        gender === g
                          ? "border-cyan-500 bg-cyan-950/30 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                          : "border-white/10 bg-black/20 text-zinc-400 hover:bg-white/5"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="mt-6 group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-red-600 to-pink-600 px-4 py-3 text-sm font-semibold text-white hover:from-red-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                 {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Complete Registration"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
