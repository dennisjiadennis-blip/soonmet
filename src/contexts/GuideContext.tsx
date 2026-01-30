"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { GeneratedItinerary } from "@/lib/generator";

interface GuideContextType {
  guides: GeneratedItinerary[];
  addGuide: (guide: GeneratedItinerary) => void;
}

const GuideContext = createContext<GuideContextType | undefined>(undefined);

export function GuideProvider({ children }: { children: ReactNode }) {
  const [guides, setGuides] = useState<GeneratedItinerary[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("tokyo-travel-pro-guides");
    if (saved) {
      try {
        setGuides(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse guides", e);
      }
    }
  }, []);

  const addGuide = (guide: GeneratedItinerary) => {
    setGuides((prev) => {
      const newGuides = [guide, ...prev];
      localStorage.setItem("tokyo-travel-pro-guides", JSON.stringify(newGuides));
      return newGuides;
    });
  };

  return (
    <GuideContext.Provider value={{ guides, addGuide }}>
      {children}
    </GuideContext.Provider>
  );
}

export function useGuide() {
  const context = useContext(GuideContext);
  if (context === undefined) {
    throw new Error("useGuide must be used within a GuideProvider");
  }
  return context;
}
