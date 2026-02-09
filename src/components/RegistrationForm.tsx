"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Mail, User, Globe, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

const TOP_COUNTRIES = [
  "United States", "Spain", "France", "Thailand", "United Kingdom",
  "Italy", "Australia", "Germany", "Japan", "China",
  "Turkey", "Mexico", "Canada", "Hong Kong", "India",
  "Austria", "Portugal", "Greece", "Malaysia", "Netherlands"
];

export function RegistrationForm() {
  const { t } = useLanguage();
  const { login } = useUser();
  
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Gmail Validation
    if (!email.trim().toLowerCase().endsWith("@gmail.com")) {
      setError(t("reg.gmail_error"));
      return;
    }

    if (!nickname.trim()) {
      setError("Nickname is required");
      return;
    }

    if (!country) {
      setError("Country is required");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true);
      setTimeout(() => {
        login(email, nickname, country);
        setIsLoading(false);
      }, 800);
    }, 1000);
  };

    if (isSuccess) {
    return (
      <div className="relative w-full max-w-md mx-auto">
         <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl opacity-50 blur-xl animate-pulse"></div>
         <div className="relative w-full bg-zinc-900/90 backdrop-blur-xl border border-green-500/30 rounded-3xl p-12 shadow-2xl flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                <ArrowRight className="h-6 w-6 text-white -rotate-45" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome!</h2>
            <p className="text-zinc-400">Redirecting to your dashboard...</p>
         </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-md mx-auto group/form">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-20 blur-xl transition duration-1000 group-hover/form:opacity-60 animate-pulse"></div>
      
      <div className="relative w-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl ring-1 ring-white/5 transition-all duration-500 hover:border-indigo-500/30">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-1 tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">{t("reg.title")}</h2>
          <p className="text-zinc-400 text-xs">{t("reg.desc")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5 group/input">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1 group-focus-within/input:text-indigo-400 transition-colors">
              {t("reg.email")}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-zinc-500 group-focus-within/input:text-indigo-400 transition-colors duration-300" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 group-hover/input:border-white/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Nickname Input */}
            <div className="space-y-1.5 group/input">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1 group-focus-within/input:text-indigo-400 transition-colors">
                {t("reg.nickname")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-zinc-500 group-focus-within/input:text-indigo-400 transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Nickname"
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 group-hover/input:border-white/20"
                />
              </div>
            </div>

            {/* Country Select */}
            <div className="space-y-1.5 group/input">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1 group-focus-within/input:text-indigo-400 transition-colors">
                {t("reg.country")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-4 w-4 text-zinc-500 group-focus-within/input:text-indigo-400 transition-colors duration-300" />
                </div>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-10 pr-8 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 appearance-none cursor-pointer hover:bg-black/60"
                >
                  <option value="" disabled>Select</option>
                  {TOP_COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-zinc-900 text-white py-2">
                      {c}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                  <ArrowRight className="h-3 w-3 text-zinc-600 rotate-90 group-focus-within/input:text-indigo-400 transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 skew-y-12"></div>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin relative z-10" />
            ) : (
              <span className="relative z-10 flex items-center gap-2 text-sm">
                {t("reg.submit")}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
