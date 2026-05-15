"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Link as LinkIcon, 
  Instagram, 
  Linkedin, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Award,
  ArrowRight,
  Globe,
  Sparkles,
  Upload,
  CreditCard,
  Building,
  Smartphone,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Airbnb Icon Component
function AirbnbIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className}>
      <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836 1.045 2.456.915 5.56-.511 7.634-1.262 1.844-3.563 2.736-5.877 2.736-2.52 0-4.524-1.127-5.59-2.92L16 27.04l-.406.54c-1.066 1.793-3.07 2.92-5.59 2.92-2.314 0-4.615-.892-5.877-2.736-1.426-2.074-1.556-5.178-.511-7.634.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.23 0-2.316.688-3.013 1.936l-.521 1.002c-2.035 3.989-6.236 12.803-7.16 14.966-.827 1.944-.72 4.316.326 5.836.938 1.37 2.656 2.06 4.372 2.06 1.955 0 3.473-.912 4.267-2.348l1.325-1.763a.5.5 0 0 1 .808 0l1.325 1.763c.794 1.436 2.312 2.348 4.267 2.348 1.716 0 3.434-.69 4.372-2.06 1.046-1.52 1.153-3.892.326-5.836-.924-2.163-5.125-10.977-7.16-14.966l-.521-1.002C18.316 3.688 17.23 3 16 3z"/>
    </svg>
  );
}

// Types based on the JSON prompt
type AnalysisResult = {
  host_status: "Approved" | "Pending" | "Rejected";
  host_score: number; // 0-100 (renamed from trust_score to match UI logic usually)
  badges: string[];
  auto_profile: {
    display_name: string;
    bio_summary: string;
    suggested_topics: string[];
    source_verification: string;
    avatar_url: string;
    cover_images: string[];
    location: string;
  };
  risk_flags: string[];
};

export default function VerifyPage() {
  const router = useRouter();
  const [step, setStep] = useState<"mode_selection" | "input" | "analyzing" | "result" | "kyc">("mode_selection");
  const [inputs, setInputs] = useState({
    airbnb: "",
    linkedin: "",
    instagram: ""
  });
  const [kycInputs, setKycInputs] = useState({
    idType: "license", // license, mynumber, passport, residence
    paymentType: "bank", // bank, paypay
    bankName: "",
    branchCode: "",
    accountNumber: "",
    accountName: "",
    paypayId: ""
  });
  const [livenessStatus, setLivenessStatus] = useState<"idle" | "recording" | "analyzing" | "verified">("idle");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  const startLivenessCheck = () => {
    setLivenessStatus("recording");
    setTimeout(() => {
      setLivenessStatus("analyzing");
      setTimeout(() => {
        setLivenessStatus("verified");
      }, 2000);
    }, 3000);
  };

  const handleSmartImport = () => {
    setStep("analyzing");
    setProgress(0);
    setLogs([]);

    const timeline = [
      { t: 500, p: 10, msg: "Connecting to Instagram API..." },
      { t: 1500, p: 30, msg: "Extracting visual style and activities..." },
      { t: 2500, p: 50, msg: "AI Personality Analysis: 'Energetic' & 'Creative'..." },
      { t: 3500, p: 70, msg: "Scanning for cross-platform consistency..." },
      { t: 4500, p: 90, msg: "Generating profile from digital footprint..." },
    ];

    timeline.forEach(({ t, p, msg }) => {
      setTimeout(() => {
        setProgress(p);
        addLog(msg);
      }, t);
    });

    setTimeout(() => {
      setResult({
        host_status: "Approved",
        host_score: 85,
        badges: ["Identity_Verified", "Social_Active"],
        auto_profile: {
          display_name: "Yuki Tanaka",
          bio_summary: "A creative soul exploring Tokyo's hidden art scenes. Loves connecting through photography and cafe hopping.",
          suggested_topics: ["Film Photography", "Hidden Cafes", "Modern Art"],
          source_verification: "Verified via Instagram",
          avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1061&q=80",
          cover_images: [
            "https://images.unsplash.com/photo-1493936734716-77ba6da66365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          ],
          location: "Tokyo, Japan"
        },
        risk_flags: []
      });
      setStep("result");
    }, 5000);
  };

  const handleAnalyze = () => {
    if (!inputs.airbnb) return;
    
    setStep("analyzing");
    setProgress(0);
    setLogs([]);

    // Simulation of the "Trust Migration" logic
    const timeline = [
      { t: 500, p: 10, msg: "Connecting to Airbnb API..." },
      { t: 1500, p: 30, msg: "Extracting host profile (Name, Photos, Ratings)..." },
      { t: 2500, p: 40, msg: "Verified: Superhost Status Found ✅" },
      { t: 3000, p: 50, msg: "Translating bio to CN/EN/JP..." },
      { t: 4000, p: 60, msg: "Scanning LinkedIn profile for professional verification..." },
      { t: 5000, p: 70, msg: "Verified: 500+ Connections & Known Company ✅" },
      { t: 6000, p: 80, msg: "Analyzing Instagram visual style..." },
      { t: 7000, p: 90, msg: "Generating DeepTalk topics based on background..." },
      { t: 8000, p: 100, msg: "Compliance Check: Minpaku License Verified ✅" },
    ];

    timeline.forEach(({ t, p, msg }) => {
      setTimeout(() => {
        setProgress(p);
        addLog(msg);
      }, t);
    });

    setTimeout(() => {
      // Mock Result based on the prompt's JSON structure
      setResult({
        host_status: "Approved",
        host_score: 98,
        badges: ["Superhost_Transferred", "Professional_Verified", "Identity_Verified"],
        auto_profile: {
          display_name: "Yuki Tanaka",
          bio_summary: "Architect & Airbnb Superhost in Tokyo. I combine my passion for traditional Japanese aesthetics with modern living. Love to share stories about renovating Machiya houses.",
          suggested_topics: [
            "Experience operating a Minpaku in Kyoto",
            "Modern Architecture vs. Traditional Design",
            "Hidden Gem Cafes in Daikanyama"
          ],
          source_verification: "Verified via Airbnb Listing [4.98★]",
          avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80",
          cover_images: [
            "https://images.unsplash.com/photo-1493936734716-77ba6da66365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          ],
          location: "Shibuya, Tokyo"
        },
        risk_flags: ["Low"]
      });
      setStep("result");
    }, 8500);
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-4 relative pb-20 pt-24">
       {/* Background */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />
       
       <div className="w-full max-w-3xl relative z-10">
         <div className="mb-8 text-center">
           <h1 className="text-4xl font-bold text-white mb-2">Trust Migration</h1>
           <p className="text-zinc-400">Import your reputation from other platforms to become a Verified Host instantly.</p>
         </div>

         {/* STEP 0: MODE SELECTION */}
         {step === "mode_selection" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Smart Import Option */}
              <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/50 transition-all cursor-pointer" onClick={() => setStep("input")}>
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">AI Smart Import</h3>
                  <p className="text-zinc-400 text-sm mb-6">
                    Connect your Instagram or Airbnb. AI automatically builds your profile, verifies your identity, and analyzes your personality vibe.
                  </p>
                  <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                    Start Auto-Verify <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Manual Option */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl group hover:bg-zinc-900/80 transition-all cursor-pointer" onClick={() => setStep("input")}>
                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6">
                  <Upload className="w-6 h-6 text-zinc-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Manual Entry</h3>
                <p className="text-zinc-400 text-sm mb-6">
                  Manually upload documents and fill in your profile details step by step. Best if you don't have public social media.
                </p>
                <div className="flex items-center gap-2 text-zinc-500 text-sm font-bold group-hover:text-white transition-colors">
                  Continue Manually <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
         )}

         {/* STEP 1: INPUT */}
         {step === "input" && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl"
           >
             <div className="space-y-6">
               {/* Airbnb Input */}
               <div>
                 <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                   <AirbnbIcon className="w-5 h-5 text-[#FF5A5F]" />
                   Airbnb Listing URL <span className="text-[#FF5A5F]">*</span>
                 </label>
                 <input 
                   type="text" 
                   value={inputs.airbnb}
                   onChange={(e) => setInputs({...inputs, airbnb: e.target.value})}
                   placeholder="https://www.airbnb.com/rooms/..."
                   className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent outline-none transition-all"
                 />
                 <p className="text-xs text-zinc-500 mt-1">We'll verify your Superhost status and reviews (Requires 4.8+ rating).</p>
               </div>

               {/* LinkedIn Input */}
               <div>
                 <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                   <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                   LinkedIn Profile URL
                 </label>
                 <input 
                   type="text" 
                   value={inputs.linkedin}
                   onChange={(e) => setInputs({...inputs, linkedin: e.target.value})}
                   placeholder="https://www.linkedin.com/in/..."
                   className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent outline-none transition-all"
                 />
                 <p className="text-xs text-zinc-500 mt-1">For "Professional Verified" badge. Used to generate deep conversation topics.</p>
               </div>

               {/* Instagram Input */}
               <div>
                 <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-2">
                   <Instagram className="w-5 h-5 text-[#E4405F]" />
                   Instagram Handle
                 </label>
                 <div className="relative">
                   <span className="absolute left-4 top-3 text-zinc-500">@</span>
                   <input 
                     type="text" 
                     value={inputs.instagram}
                     onChange={(e) => setInputs({...inputs, instagram: e.target.value})}
                     placeholder="username"
                     className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl pl-8 pr-4 py-3 text-white focus:ring-2 focus:ring-[#E4405F] focus:border-transparent outline-none transition-all"
                   />
                 </div>
                 <p className="text-xs text-zinc-500 mt-1">We'll fetch your top 3 public photos for your visual profile.</p>
                <div className="mt-2 p-3 bg-indigo-900/30 border border-indigo-500/30 rounded-lg">
                  <p className="text-xs text-indigo-200 font-medium flex items-start gap-2">
                    <span className="mt-0.5">⚠️</span>
                    Important: You must follow our official account @soonmet_official to allow our AI to access your public posts.
                  </p>
                </div>
              </div>

               <button
                 onClick={handleAnalyze}
                 disabled={!inputs.airbnb}
                 className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                   inputs.airbnb 
                     ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-indigo-500/25"
                     : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                 }`}
               >
                 Verify & Create Profile
               </button>
             </div>
           </motion.div>
         )}

         {/* STEP 2: ANALYZING */}
         {step === "analyzing" && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl min-h-[400px] flex flex-col justify-center"
           >
             <div className="flex flex-col items-center mb-8">
               <div className="w-20 h-20 relative mb-6">
                 <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
                 <div 
                   className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" 
                 />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <ShieldCheck className="w-8 h-8 text-indigo-400" />
                 </div>
               </div>
               <h2 className="text-2xl font-bold text-white mb-2">Analyzing Trust Signals</h2>
               <div className="w-full max-w-md bg-zinc-800 rounded-full h-2 mb-2 overflow-hidden">
                 <motion.div 
                   className="h-full bg-indigo-500"
                   initial={{ width: "0%" }}
                   animate={{ width: `${progress}%` }}
                   transition={{ duration: 0.5 }}
                 />
               </div>
               <p className="text-zinc-400 font-mono text-sm">{progress}% Complete</p>
             </div>

             <div className="space-y-2 max-w-md mx-auto w-full font-mono text-sm">
               {logs.map((log, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex items-center gap-2 text-zinc-300"
                 >
                   {log.includes("Verified") || log.includes("Found") ? (
                     <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                   ) : (
                     <Loader2 className="w-3 h-3 text-indigo-400 animate-spin shrink-0" />
                   )}
                   <span>{log}</span>
                 </motion.div>
               ))}
             </div>
           </motion.div>
         )}

         {/* STEP 3: RESULT */}
         {step === "result" && result && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="space-y-6"
           >
             {/* Score Card */}
             <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-3xl p-8 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-6">
                 <div className="relative w-24 h-24 flex items-center justify-center">
                   <svg className="w-full h-full transform -rotate-90">
                     <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                     <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-green-500" strokeDasharray={`${result.host_score * 2.51} 251`} />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-3xl font-bold text-white">{result.host_score}</span>
                     <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Score</span>
                   </div>
                 </div>
                 <div>
                   <div className="flex items-center gap-3 mb-1">
                     <h2 className="text-3xl font-bold text-white">{result.host_status}</h2>
                     <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30 uppercase tracking-wide">
                       Verified
                     </span>
                   </div>
                   <p className="text-zinc-300 max-w-sm">
                     Your profile has been successfully verified. You are eligible for <span className="text-white font-medium">Auto-Approval</span>.
                   </p>
                 </div>
               </div>
               
               <div className="flex flex-wrap gap-2 justify-center md:justify-end max-w-xs">
                 {result.badges.map((badge, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs font-medium text-zinc-200">
                      <Award className="w-3 h-3 text-yellow-500" />
                      {badge.replace(/_/g, " ")}
                    </div>
                 ))}
               </div>
             </div>

             {/* Generated Profile Preview */}
             <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
               <div className="bg-zinc-800/50 px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
                 <h3 className="font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                   AI-Generated Profile Preview
                 </h3>
                 <span className="text-xs text-zinc-500">Based on your digital footprint</span>
               </div>
               
               <div className="p-6 md:p-8">
                 <div className="flex flex-col md:flex-row gap-8">
                   {/* Left: Avatar & Photos */}
                   <div className="w-full md:w-1/3 space-y-4">
                     <div className="aspect-square rounded-2xl overflow-hidden relative border-2 border-white/10">
                       <img src={result.auto_profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                       <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white border border-white/10 flex items-center gap-1">
                         <AirbnbIcon className="w-3 h-3" />
                         Matched
                       </div>
                     </div>
                     <div className="grid grid-cols-3 gap-2">
                       {result.auto_profile.cover_images.map((img, i) => (
                         <div key={i} className="aspect-square rounded-lg overflow-hidden relative">
                           <img src={img} alt={`Cover ${i}`} className="w-full h-full object-cover" />
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* Right: Info */}
                   <div className="flex-1 space-y-6">
                     <div>
                       <h2 className="text-3xl font-bold text-white mb-1">{result.auto_profile.display_name}</h2>
                       <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                         <MapPin className="w-4 h-4" />
                         {result.auto_profile.location}
                         <span className="text-zinc-600">•</span>
                         <span className="text-green-400">{result.auto_profile.source_verification}</span>
                       </div>
                       
                       <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-800">
                         <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Bio Summary</h4>
                         <p className="text-zinc-200 leading-relaxed">
                           {result.auto_profile.bio_summary}
                         </p>
                       </div>
                     </div>

                     <div>
                       <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Suggested DeepTalk Topics</h4>
                       <div className="space-y-2">
                         {result.auto_profile.suggested_topics.map((topic, i) => (
                           <div key={i} className="flex items-start gap-3 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                             <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                               <span className="text-xs font-bold text-indigo-400">{i + 1}</span>
                             </div>
                             <p className="text-zinc-300 text-sm">{topic}</p>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
               
               <div className="bg-zinc-800/30 px-6 py-4 border-t border-zinc-800 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-sm text-zinc-400">
                   <ShieldCheck className="w-4 h-4 text-green-500" />
                   <span>Minpaku License Verified</span>
                 </div>
                 <button 
                   onClick={() => setStep("kyc")}
                   className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-colors"
                 >
                   Continue to ID Verification
                   <ArrowRight className="w-4 h-4" />
                 </button>
               </div>
             </div>
           </motion.div>
         )}

         {/* STEP 4: KYC */}
         {step === "kyc" && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl space-y-6"
           >
                {/* ID Type Selection */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "license", label: "Driver's License", icon: CreditCard },
                    { id: "mynumber", label: "My Number Card", icon:  ShieldCheck },
                    { id: "passport", label: "Passport", icon: Globe },
                    { id: "residence", label: "Residence Card", icon: Building },
                  ].map((type) => (
                    <div 
                      key={type.id}
                      onClick={() => setKycInputs({...kycInputs, idType: type.id})}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center gap-2 text-center ${
                        kycInputs.idType === type.id 
                          ? "bg-indigo-600/20 border-indigo-500 text-white" 
                          : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                      }`}
                    >
                      <type.icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </div>
                  ))}
                </div>

                {/* Japan Compliance Warning */}
                {kycInputs.idType === "mynumber" && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-yellow-500">Japan Compliance Alert</h4>
                      <p className="text-xs text-zinc-400">
                        Per Japanese law, please ensure the <strong>12-digit My Number on the back is MASKED</strong>. Do not upload the back side unless covered.
                      </p>
                    </div>
                  </div>
                )}

                {/* Upload Area */}
                <div className="border-2 border-dashed border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-zinc-400" />
                  </div>
                  <h3 className="text-white font-medium mb-1">Upload ID Document</h3>
                  <p className="text-sm text-zinc-500">Front side clearly visible</p>
                </div>

                {/* Liveness Check Section */}
                <div className="pt-6 border-t border-zinc-800">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-indigo-400" />
                    Biometric Liveness Check
                  </h3>
                  
                  {livenessStatus === "idle" && (
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 text-center">
                      <div className="w-16 h-16 bg-zinc-900 rounded-full mx-auto mb-4 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-pulse" />
                        <span className="text-2xl">📸</span>
                      </div>
                      <h4 className="text-white font-medium mb-2">3-Second Video Selfie</h4>
                      <p className="text-sm text-zinc-400 mb-6 max-w-sm mx-auto">
                        Please look at the camera and nod slowly to verify you are a real person and match your ID.
                      </p>
                      <button 
                        onClick={startLivenessCheck}
                        className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-colors"
                      >
                        Start Camera
                      </button>
                    </div>
                  )}

                  {livenessStatus === "recording" && (
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 text-center">
                      <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping" />
                        <div className="w-3 h-3 bg-red-500 rounded-sm" />
                      </div>
                      <h4 className="text-white font-medium mb-2">Recording...</h4>
                      <p className="text-sm text-zinc-400">Please nod your head slowly</p>
                    </div>
                  )}

                  {livenessStatus === "analyzing" && (
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        <span className="text-sm text-zinc-300">Analyzing Biometrics & Deepfake Check...</span>
                      </div>
                    </div>
                  )}

                  {livenessStatus === "verified" && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-green-500 font-bold">Liveness Verified</h4>
                        <p className="text-xs text-zinc-400">Face match confirmed with ID document.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Information Section */}
                <div className="pt-6 border-t border-zinc-800">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-indigo-400" />
                    Payment Information
                  </h3>
                  
                  <div className="flex gap-4 mb-4">
                     <button
                       onClick={() => setKycInputs({...kycInputs, paymentType: "bank"})}
                       className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                         kycInputs.paymentType === "bank"
                           ? "bg-indigo-600/20 border-indigo-500 text-white"
                           : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                       }`}
                     >
                       Bank Transfer
                     </button>
                     <button
                       onClick={() => setKycInputs({...kycInputs, paymentType: "paypay"})}
                       className={`flex-1 py-3 rounded-xl border font-medium transition-all ${
                         kycInputs.paymentType === "paypay"
                           ? "bg-indigo-600/20 border-indigo-500 text-white"
                           : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                       }`}
                     >
                       PayPay
                     </button>
                  </div>

                  {kycInputs.paymentType === "bank" ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          placeholder="Bank Name"
                          value={kycInputs.bankName}
                          onChange={(e) => setKycInputs({...kycInputs, bankName: e.target.value})}
                          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors"
                        />
                        <input 
                          type="text" 
                          placeholder="Branch Code"
                          value={kycInputs.branchCode}
                          onChange={(e) => setKycInputs({...kycInputs, branchCode: e.target.value})}
                          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Account Number"
                        value={kycInputs.accountNumber}
                        onChange={(e) => setKycInputs({...kycInputs, accountNumber: e.target.value})}
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors"
                      />
                      <input 
                        type="text" 
                        placeholder="Account Holder Name (Katakana)"
                        value={kycInputs.accountName}
                        onChange={(e) => setKycInputs({...kycInputs, accountName: e.target.value})}
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  ) : (
                    <div>
                      <input 
                        type="text" 
                        placeholder="PayPay ID"
                        value={kycInputs.paypayId}
                        onChange={(e) => setKycInputs({...kycInputs, paypayId: e.target.value})}
                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors"
                      />
                      <p className="text-xs text-zinc-500 mt-2">
                        We will send a test payment of ¥1 to verify this ID.
                      </p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => {
                    localStorage.setItem('soonmet_is_verified_host', 'true');
                    router.push("/dashboard?tab=hosting");
                  }}
                  disabled={livenessStatus !== "verified"}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all mt-8 ${
                    livenessStatus === "verified"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-indigo-500/25"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  Submit for Final Review
                </button>
           </motion.div>
         )}
       </div>
    </main>
  );
}
