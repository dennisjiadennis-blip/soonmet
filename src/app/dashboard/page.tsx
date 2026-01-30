"use client";

import { useState, useEffect } from "react";
import { GeneratorForm } from "@/components/GeneratorForm";
import { ItineraryPreview } from "@/components/ItineraryPreview";
import { HostDashboard } from "@/components/HostDashboard";
import { RegistrationView } from "@/components/RegistrationView";
import { generateItinerary, GeneratorInput, GeneratedItinerary, submitHostApplication } from "@/lib/generator";
import { ArrowLeft } from "lucide-react";

export default function DashboardPage() {
  const [view, setView] = useState<"register" | "dashboard" | "create" | "edit">("register");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedItinerary | null>(null);
  const [currentGuideId, setCurrentGuideId] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("host_email");
    if (savedEmail) {
      setRegisteredEmail(savedEmail);
      setView("dashboard");
    }
  }, []);

  // Mock Guides Data (Lifted from HostDashboard)
  const [myGuides, setMyGuides] = useState([
    {
      id: "guide_1",
      title: "Nakameguro Late Night: Craft Beer & Hidden Bars",
      status: "active",
      views: 1240,
      sales: 12,
      lastUpdated: "2024-03-15",
      // Partial data for editing demo
      data: {
        title: "Nakameguro Late Night: Craft Beer & Hidden Bars",
        locations: [],
        duration: "3 hours",
        meetingPoint: "Nakameguro Station Front",
        productPrice: "1500",
        meetupPrice: "6000",
        guestCostBreakdown: [],
        payoutId: "pay_123",
        earliestServiceDate: "2024-04-01",
        availability: [],
        hostProfile: {
          email: "host@example.com",
          fullName: "Taro Yamada",
          nickname: "Taro",
          phone: "090-1234-5678",
          lineId: "taro_line",
          preferredContactTime: "18:00-22:00"
        },
        standards: {
          noDiscrimination: true,
          boundaryConfirmed: true,
          refundPolicyConfirmed: true
        }
      } as GeneratorInput
    }
  ]);

  const handleRegisterComplete = (email: string) => {
    localStorage.setItem("host_email", email);
    setRegisteredEmail(email);
    setView("dashboard");
  };

  const handleCreateGuide = () => {
    setResult(null);
    setCurrentGuideId(null);
    setView("create");
  };

  const handleEditGuide = (guideId: string) => {
    const guide = myGuides.find(g => g.id === guideId);
    if (guide) {
      setResult(null); // Reset preview
      setCurrentGuideId(guideId);
      setView("edit");
    }
  };

  const handleGenerate = async (input: GeneratorInput) => {
    setIsGenerating(true);
    try {
      // 1. Submit Application to Backend
      await submitHostApplication(input);
      
      // If editing, simulate email notification
      if (view === "edit") {
        console.log("Sending update email to platform service department...");
        alert("Update submitted! Support team notified.");
      }

      // 2. Generate Itinerary Preview (Client-side simulation)
      const data = await generateItinerary(input);
      setResult(data);
      
      // If creating new, maybe add to list (mock)
      if (view === "create") {
         // In a real app, we'd get ID from backend
      }
      
    } catch (error) {
      console.error("Failed to generate itinerary:", error);
      alert("Submission failed. Please check your inputs.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Render Logic
  if (view === "register") {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-12">
        <RegistrationView onComplete={handleRegisterComplete} />
      </div>
    );
  }

  if (view === "dashboard") {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <HostDashboard 
            onCreateGuide={handleCreateGuide} 
            onEditGuide={handleEditGuide}
            hostEmail={registeredEmail}
            guides={myGuides}
          />
        </div>
      </div>
    );
  }

  // Create or Edit View
  const initialData = view === "edit" ? myGuides.find(g => g.id === currentGuideId)?.data : undefined;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button 
              onClick={() => setView("dashboard")}
              className="mb-2 flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              {view === "edit" ? "Edit Guide" : "Create New Guide"}
            </h1>
          </div>
        </div>

        <div className="space-y-12">
          {/* Input Section */}
          <div className="mx-auto max-w-2xl">
            <GeneratorForm 
              onGenerate={handleGenerate} 
              isGenerating={isGenerating} 
              initialData={initialData}
              initialEmail={registeredEmail}
            />
          </div>

          {/* Output Section */}
          {result && (
            <div className="mx-auto max-w-4xl border-t border-zinc-200 pt-12 dark:border-zinc-800">
              <h2 className="mb-8 text-center text-xl font-bold text-zinc-900 dark:text-zinc-50">
                AI Agent 帮你生成的旅游攻略，并会持续帮助你执行该攻略和售后服务
              </h2>
              <ItineraryPreview data={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
