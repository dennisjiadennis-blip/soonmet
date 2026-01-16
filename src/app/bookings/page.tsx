"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Video, MoreHorizontal, MapPin } from "lucide-react";
import Image from "next/image";

interface Booking {
  id: string;
  hostId: string;
  hostName: string;
  hostImage: string;
  date: string;
  time: string;
  price: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load bookings from localStorage
    const storedBookings = localStorage.getItem('soonmet_bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    } else {
      // Add some mock past bookings for better demo if empty
      const mockPastBookings: Booking[] = [
        {
          id: 'mock-1',
          hostId: 'host-1',
          hostName: 'Yuki Tanaka',
          hostImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
          date: 'Oct 15, 2023',
          time: '2:00 PM',
          price: 27,
          status: 'completed'
        },
        {
          id: 'mock-2',
          hostId: 'host-2',
          hostName: 'Kenji Sato',
          hostImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
          date: 'Sep 28, 2023',
          time: '8:00 PM',
          price: 32,
          status: 'completed'
        }
      ];
      // Only set mock data if truly empty to avoid overwriting user data on reload if logic was different
      // But here we just want to show something if user hasn't booked anything yet
      // Actually, let's just append mock data if it's the very first load ever (checking a flag)
      // For simplicity, just show them if array is empty
       setBookings(mockPastBookings);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex justify-center">
        <div className="animate-pulse text-zinc-500">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <div className="text-sm text-zinc-400">
            {bookings.length} {bookings.length === 1 ? 'Session' : 'Sessions'}
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <Calendar className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
            <p className="text-zinc-400 mb-6">Explore our hosts and book your first coffee chat!</p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
            >
              Browse Hosts
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div 
                key={booking.id}
                className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6 transition-all hover:bg-white/10"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Host Image */}
                  <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={booking.hostImage}
                      alt={booking.hostName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{booking.hostName}</h3>
                        <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>Tokyo, Japan</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        booking.status === 'upcoming' 
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
                          : 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-sm text-zinc-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-zinc-500" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-zinc-500" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-zinc-500" />
                        <span>Zoom Meeting</span>
                      </div>
                    </div>

                    {booking.status === 'upcoming' && (
                      <div className="pt-2 flex flex-col sm:flex-row gap-3">
                        <Link 
                          href={`/meeting/${booking.hostId}`}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
                        >
                          <Video className="h-4 w-4" />
                          Join Meeting
                        </Link>
                        <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10">
                          Reschedule
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
