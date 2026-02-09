"use client";

import { useState, useEffect } from "react";
import { GeneratorForm } from "@/components/GeneratorForm";
import { ItineraryPreview } from "@/components/ItineraryPreview";
import { HostDashboard } from "@/components/HostDashboard";
import { RegistrationView } from "@/components/RegistrationView";
import { ProfileCompletionForm } from "@/components/ProfileCompletionForm";
import { ActivationModal } from "@/components/ActivationModal";
import { generateItinerary, GeneratorInput, GeneratedItinerary, submitHostApplication } from "@/lib/generator";
import { ArrowRight, Loader2 } from "lucide-react";
import { HostCreditTierCards } from "@/components/HostCreditTierCards";
import { useLanguage } from "@/contexts/LanguageContext";
import { BackButton } from "@/components/BackButton";

interface Guide {
  id: string;
  title: string;
  status: string;
  views: number;
  sales: number;
  lastUpdated: string;
  data: GeneratorInput;
  generatedResult: GeneratedItinerary | null;
  nextServiceDate?: string;
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const [view, setView] = useState<"landing" | "register" | "profile_setup" | "dashboard" | "create" | "edit">("landing");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedItinerary | null>(null);
  const [currentGuideId, setCurrentGuideId] = useState<string | null>(null);
  const [formDataForSubmit, setFormDataForSubmit] = useState<GeneratorInput | null>(null);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [existingPayPayId, setExistingPayPayId] = useState<string | null>(null);
  const [hostLevel, setHostLevel] = useState(0);
  const [hostNickname, setHostNickname] = useState<string>("");
  const [hostCountry, setHostCountry] = useState<string>("");
  const [hostRealName, setHostRealName] = useState<string>("");
  const [hostPhone, setHostPhone] = useState<string>("");
  const [hostGender, setHostGender] = useState<string>("");
  const [hostAgeRange, setHostAgeRange] = useState<string>("");
  const [hostLineId, setHostLineId] = useState<string>("");
  const [hostSnsAccounts, setHostSnsAccounts] = useState<string>("");
  const [hostSpecialTags, setHostSpecialTags] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("host_email");
    if (savedEmail) {
      setRegisteredEmail(savedEmail);
      // Don't set view here, wait for profile check
    } else {
      setView("landing");
      setIsSessionLoading(false);
    }
  }, []);

  // Fetch Host Profile
  useEffect(() => {
    if (registeredEmail) {
      fetch(`/api/host/profile?email=${registeredEmail}`)
        .then(res => {
          if (res.status === 404) {
             throw new Error("Host not found");
          }
          return res.json();
        })
        .then(data => {
          if (data) {
            if (data.paypayId) setExistingPayPayId(data.paypayId);
            if (typeof data.level === 'number') setHostLevel(data.level);
            if (data.nickname) setHostNickname(data.nickname);
            if (data.country) setHostCountry(data.country);
            if (data.realName) setHostRealName(data.realName);
            if (data.phone) setHostPhone(data.phone);
            if (data.gender) setHostGender(data.gender);
            if (data.ageRange) setHostAgeRange(data.ageRange);
            if (data.lineId) setHostLineId(data.lineId);
            if (data.snsAccounts) setHostSnsAccounts(data.snsAccounts);
            if (data.specialTags) setHostSpecialTags(data.specialTags);
            
            // Logic to determine view
            if (data.realName && data.phone && data.paypayId && data.ageRange) {
               setView("dashboard");
            } else {
               setView("profile_setup");
            }
          }
          setIsSessionLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch host profile:", err);
          if (err.message === "Host not found") {
            localStorage.removeItem("host_email");
            setRegisteredEmail("");
            setView("landing");
          }
          setIsSessionLoading(false);
        });
    }
  }, [registeredEmail]);

  // Mock Guides Data (Lifted from HostDashboard)
  const [myGuides, setMyGuides] = useState<Guide[]>([]);

  // Load guides from local storage on mount
  useEffect(() => {
    const savedGuides = localStorage.getItem("my_guides");
    if (savedGuides) {
      try {
        const parsed = JSON.parse(savedGuides);
        // Clean up mock data (guide_1) so user only sees their own guides
        const userGuides = parsed.filter((g: Guide) => g.id !== "guide_1");
        setMyGuides(userGuides);
      } catch (e) {
        console.error("Failed to parse guides", e);
        setMyGuides([]);
      }
    } else {
      // Start with empty list instead of mock data
      setMyGuides([]);
    }
  }, []);

  // Save guides to local storage whenever they change
  useEffect(() => {
    if (myGuides.length > 0) {
      localStorage.setItem("my_guides", JSON.stringify(myGuides));
    }
  }, [myGuides]);

  const handleRegisterComplete = (email: string) => {
    localStorage.setItem("host_email", email);
    setRegisteredEmail(email);
    setView("profile_setup"); // Force profile setup for new users
  };

  const handleProfileComplete = (data: {
      fullName?: string;
      phone?: string;
      paypayId?: string;
      lineId?: string;
      gender?: string;
      ageRange?: string;
      snsAccounts?: string;
  }) => {
    // Update local state
    if (data.fullName) setHostRealName(data.fullName);
    if (data.phone) setHostPhone(data.phone);
    if (data.paypayId) setExistingPayPayId(data.paypayId);
    if (data.lineId) setHostLineId(data.lineId);
    if (data.gender) setHostGender(data.gender);
    if (data.ageRange) setHostAgeRange(data.ageRange);
    if (data.snsAccounts) setHostSnsAccounts(data.snsAccounts);
    
    // Proceed to dashboard
    setView("dashboard");
  };

  const handleCreateGuide = () => {
    // Profile Completion Check (Redundant now, but good for safety)
    if (!hostRealName || !hostPhone || !existingPayPayId || !hostAgeRange) {
      setView("profile_setup");
      return;
    }

    setResult(null);
    setCurrentGuideId(null);
    setView("create");
    setCurrentStep(0);
  };

  const handleEditGuide = (guideId: string) => {
    const guide = myGuides.find(g => g.id === guideId);
    if (guide) {
      setResult(null); // Reset preview
      setCurrentGuideId(guideId);
      setView("edit");
      setCurrentStep(0);
    }
  };

  const handleGenerate = async (input: GeneratorInput) => {
    setIsGenerating(true);
    try {
      // Just Generate Preview (Client-side simulation)
      const data = await generateItinerary(input);
      setResult(data);
      setFormDataForSubmit(input);
      
      // Scroll to preview
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error("Failed to generate itinerary:", error);
      alert("Generation failed. Please check your inputs.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSimulateApproval = (guideId: string) => {
    setMyGuides(prev => prev.map(guide => {
      if (guide.id === guideId) {
        // Generate Calendar Logic
        // Simple mock: Find next available day based on availability
        const today = new Date();
        let foundDate = "";
        
        // Find next 14 days
        for (let i = 1; i <= 14; i++) {
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + i); // Increment by i days
            const dayName = nextDate.toLocaleDateString('en-US', { weekday: 'short' });
            
            // Check availability if data exists
            const availability = guide.data?.availability || [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isAvailable = availability.find((a: any) => a.dayOfWeek === dayName && a.enabled);
            
            if (isAvailable) {
                // Mock Time: 10:00 - 18:00 (8 hours)
                foundDate = `${nextDate.toISOString().split('T')[0]} (${dayName}) 10:00 - 18:00`;
                break;
            }
        }

        // Mock Email
        const email = guide.data?.hostProfile?.email || "host@example.com";
        alert(`[Mock Email System]\nTo: ${email}\nSubject: Your Guide is Approved!\n\nYour guide "${guide.title}" is now active.\nWe have generated your service calendar starting from ${foundDate || "Next available date"}.`);

        return {
          ...guide,
          status: "active",
          nextServiceDate: foundDate
        };
      }
      return guide;
    }));
  };

  const handleConfirmSubmit = async () => {
    if (!formDataForSubmit) {
      console.error("No form data to submit");
      alert("Error: No guide data found. Please generate the guide again.");
      return;
    }

    // Trigger Activation Modal if Full Name is missing or just to confirm details
    // For now, always trigger it as a "Final Step" to ensure we capture the Host's Real Name
    // But we pre-fill it if available
    setShowActivationModal(true);
  };

  const handleActivationComplete = async (activationData: { 
    nickname: string;
    realName: string; 
    phone: string;
    lineId: string;
    whatsapp: string;
    universityEmail: string;
    gender: string;
    age: string;
    university: string;
  }) => {
    console.log("Activation Complete Triggered", activationData);
    
    if (!formDataForSubmit) {
      console.error("Missing formDataForSubmit");
      alert("Error: Guide data missing. Please try generating again.");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // 1. Prepare Final Data
      const finalData = {
        ...formDataForSubmit,
        hostProfile: {
          ...formDataForSubmit.hostProfile,
          fullName: activationData.realName,
          nickname: activationData.nickname,
          phone: activationData.phone,
          lineId: activationData.lineId,
          whatsapp: activationData.whatsapp,
          universityEmail: activationData.universityEmail,
          universityName: activationData.university,
          gender: activationData.gender as 'male' | 'female',
          ageRange: activationData.age
        }
      };

      console.log("Final Data Prepared", finalData);

      // 2. Create New Guide Object
      const newGuide = {
        id: `guide_${Date.now()}`,
        title: finalData.title,
        status: "pending", // Under Review
        views: 0,
        sales: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
        data: finalData,
        generatedResult: result // Save the generated itinerary for Gallery display
      };

      // 3. Update State & LocalStorage
      // We use a functional update to ensure we have the latest state
      setMyGuides(prev => {
        // Filter out the initial mock guide if it exists, to keep the list clean for the user
        const cleanPrev = prev.filter(g => g.id !== "guide_1");
        const updated = [newGuide, ...cleanPrev];
        
        console.log("Updating Guides List", updated);
        localStorage.setItem("my_guides", JSON.stringify(updated));
        return updated;
      });

      // 4. Submit to Backend (Fire and Forget - don't block UI)
      // We wrap this in a non-blocking promise chain
      submitHostApplication(finalData)
        .then(() => console.log("Backend sync successful"))
        .catch(err => console.error("Backend sync failed (offline mode)", err));
      
      // 5. Success Feedback
      // alert("Submission Successful! Your guide is now under review.");
      
      // 6. Reset UI
      setResult(null);
      setFormDataForSubmit(null);
      setShowActivationModal(false);
      setView("dashboard");
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Critical Error in Submission:", error);
      alert("Something went wrong: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a16] text-white overflow-x-hidden font-sans">
      {/* Space Background Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0a16] to-[#0a0a16]"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-900/10 to-transparent"></div>
        {/* Stars/Dust */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full opacity-50 animate-pulse delay-75"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-red-400 rounded-full opacity-40 animate-pulse delay-150"></div>
      </div>

      <div className="relative z-10 pt-8 pb-12">
        {isSessionLoading ? (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
            </div>
        ) : (
          <>
            {view === "landing" && (
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                    Start Your Host Journey
                  </h1>
                  <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                    Join our community of local experts. Review our host tiers and standards below to understand how you can grow and earn with LocalVibe.
                  </p>
                </div>
                
                <div className="mb-12">
                  <HostCreditTierCards initialLevel={0} />
                </div>

                <div className="flex justify-center pb-20">
                  <button
                    onClick={() => setView("register")}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl text-lg hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2 group"
                  >
                    <span>Join LocalVibe Now</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {view === "register" && (
              <div className="relative">
                <BackButton 
                  onClick={() => setView("landing")} 
                  className="absolute top-4 left-4 z-10"
                />
                <RegistrationView onComplete={handleRegisterComplete} />
              </div>
            )}

            {view === "profile_setup" && (
              <div className="relative mx-auto max-w-3xl px-4 py-12">
                <BackButton 
                  onClick={() => setView("landing")} 
                  className="absolute top-4 left-4 z-10"
                />
                <ProfileCompletionForm 
                  initialData={{
                    email: registeredEmail,
                    nickname: hostNickname,
                    country: hostCountry,
                    gender: hostGender,
                    ageRange: hostAgeRange
                  }}
                  onComplete={handleProfileComplete}
                />
              </div>
            )}

            {view === "dashboard" && (
              <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <HostDashboard 
                  onCreateGuide={handleCreateGuide} 
                  onEditGuide={handleEditGuide}
                  onSimulateApproval={handleSimulateApproval}
                  hostEmail={registeredEmail}
                  guides={myGuides}
                />
              </div>
            )}

            {(view === "create" || view === "edit") && (
              <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <BackButton 
                      onClick={() => {
                        if (result) {
                          setResult(null);
                        } else if (currentStep > 0) {
                          setCurrentStep(prev => prev - 1);
                        } else {
                          setView("dashboard");
                        }
                      }}
                      label={t("dashboard.back")}
                      className="mb-6"
                    />
                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                      {view === "edit" ? t("dashboard.edit_guide") : t("dashboard.create_guide")}
                    </h1>
                  </div>
                </div>

                <div className="space-y-12">
                  {/* Input Section */}
                  <div className={`mx-auto max-w-2xl ${result ? 'hidden' : ''}`}>
                    <GeneratorForm 
                      onGenerate={handleGenerate} 
                      isGenerating={isGenerating} 
                      currentStep={currentStep}
                      onStepChange={setCurrentStep}
                      initialData={view === "edit" ? myGuides.find(g => g.id === currentGuideId)?.data : undefined}
                      initialEmail={registeredEmail}
                      existingPayPayId={existingPayPayId}
                      hostLevel={hostLevel}
                      initialNickname={hostNickname}
                      initialCountry={hostCountry}
                      initialRealName={hostRealName}
                      initialPhone={hostPhone}
                      initialLineId={hostLineId}
                      initialGender={hostGender}
                      initialAgeRange={hostAgeRange}
                      initialSnsAccounts={hostSnsAccounts}
                      initialSpecialTags={hostSpecialTags}
                    />
                  </div>

                  {/* Output Section */}
                  {result && (
                    <div className="mx-auto max-w-4xl border-t border-white/10 pt-12">
                      <h2 className="mb-8 text-center text-xl font-bold text-white">
                        AI Agent has generated your guide. It will help you execute and manage it.
                      </h2>
                      <div className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-xl">
                        <ItineraryPreview data={result} />
                      </div>
                      
                      <div className="mt-8 flex justify-center gap-4">
                        <button
                          onClick={() => {
                            setResult(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="rounded-lg border border-white/20 bg-black/40 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-white/10 hover:text-cyan-400 transition-all"
                        >
                          {t("step3.back") || "Back to Edit"}
                        </button>
                        <button
                          onClick={handleConfirmSubmit}
                          disabled={isGenerating}
                          className="rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-3 text-base font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 transition-all"
                        >
                          {isGenerating ? "Submitting..." : "Confirm & Submit for Review"}
                        </button>
                      </div>
                    </div>
                  )}

                  <ActivationModal 
                    isOpen={showActivationModal}
                    onClose={() => setShowActivationModal(false)}
                    onActivate={handleActivationComplete}
                    initialData={{
                      nickname: formDataForSubmit?.hostProfile?.nickname,
                      realName: formDataForSubmit?.hostProfile?.fullName,
                      phone: formDataForSubmit?.hostProfile?.phone,
                      lineId: formDataForSubmit?.hostProfile?.lineId,
                      whatsapp: formDataForSubmit?.hostProfile?.whatsapp,
                      universityEmail: formDataForSubmit?.hostProfile?.universityEmail,
                      university: formDataForSubmit?.hostProfile?.universityName,
                      gender: formDataForSubmit?.hostProfile?.gender,
                      age: formDataForSubmit?.hostProfile?.ageRange
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
