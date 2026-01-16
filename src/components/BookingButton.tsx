"use client";

import { useState } from "react";
import { Video } from "lucide-react";
import { Host } from "@/lib/data";
import { BookingModal } from "@/components/BookingModal";

interface BookingButtonProps {
  host: Host;
}

export function BookingButton({ host }: BookingButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 p-[2px] transition-all hover:shadow-[0_0_40px_rgba(79,70,229,0.4)]"
      >
        <div className="relative flex items-center justify-center gap-3 rounded-full bg-transparent px-8 py-4 transition-all group-hover:bg-opacity-0">
          <Video className="h-6 w-6 text-white animate-pulse" />
          <span className="text-xl font-semibold text-white">Say Hi on Zoom</span>
        </div>
      </button>

      <BookingModal 
        host={host} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
