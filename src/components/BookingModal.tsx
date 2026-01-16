"use client";

import { X, Calendar, Clock, CreditCard, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Host } from "@/lib/data";

interface BookingModalProps {
  host: Host;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ host, isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState<'date' | 'payment' | 'processing'>('date');
  const router = useRouter();

  if (!isOpen) return null;

  const handlePayment = () => {
    setStep('processing');
    
    // Save booking to localStorage
    const newBooking = {
      id: Date.now().toString(),
      hostId: host.id,
      hostName: host.name,
      hostImage: host.imageUrl,
      date: 'Tomorrow, Oct 24',
      time: '10:00 AM', // Hardcoded for demo
      price: host.price + 2,
      status: 'upcoming'
    };

    const existingBookings = JSON.parse(localStorage.getItem('soonmet_bookings') || '[]');
    localStorage.setItem('soonmet_bookings', JSON.stringify([newBooking, ...existingBookings]));

    // Simulate API call
    setTimeout(() => {
      router.push(`/meeting/${host.id}`);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl ring-1 ring-zinc-200 dark:ring-zinc-800 animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-xl font-semibold">Book a session with {host.name}</h3>
          <button 
            onClick={onClose}
            className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'date' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-500">Select Date</label>
                <div className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                  <span className="font-medium">Tomorrow, Oct 24</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-500">Select Time</label>
                <div className="grid grid-cols-3 gap-3">
                  {['10:00 AM', '2:00 PM', '8:00 PM'].map((time) => (
                    <button 
                      key={time}
                      className="px-4 py-2 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 font-medium text-sm hover:bg-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-300 transition-colors focus:ring-2 focus:ring-indigo-500"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => setStep('payment')}
                  className="w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-lg hover:opacity-90 transition-opacity"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Rate</span>
                  <span className="font-medium">¥{host.price} / hr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Service Fee</span>
                  <span className="font-medium">¥300</span>
                </div>
                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>¥{host.price + 300}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <CreditCard className="h-6 w-6 text-zinc-400" />
                <div className="flex-1">
                  <div className="font-medium">•••• •••• •••• 4242</div>
                  <div className="text-xs text-zinc-500">Expires 12/25</div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl flex items-start gap-3 border border-green-100 dark:border-green-800/50">
                <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-green-700 dark:text-green-300">Money Back Guarantee</h4>
                  <p className="text-xs text-green-600/90 dark:text-green-400/90 mt-1 leading-relaxed">
                    Book with confidence. If the meeting doesn't happen or you're not satisfied, we'll refund you 100% instantly. Funds are held securely by SoonMet until the event is complete.
                  </p>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
              >
                Pay ¥{host.price + 300}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
                <ShieldCheck className="h-3 w-3" />
                Payments are secure and encrypted via SoonMet Secure™
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="mb-6 relative">
                <div className="h-16 w-16 rounded-full border-4 border-zinc-100 dark:border-zinc-800"></div>
                <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Processing Payment...</h3>
              <p className="text-zinc-500">Securing your connection with {host.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
