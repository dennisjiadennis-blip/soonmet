"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, UserPlus, Calendar, Home, Menu, User, Repeat, LogOut, CheckCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, logout, setShowLoginModal, userRole } = useAuth();
  const [userMode, setUserMode] = useState<'visitor' | 'host'>('visitor');
  const [showMenu, setShowMenu] = useState(false);
  const [isVerifiedHost, setIsVerifiedHost] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sync local userMode with auth context role if available
    if (userRole) {
      setUserMode(userRole);
    }
  }, [userRole]);

  useEffect(() => {
    const verified = localStorage.getItem('soonmet_is_verified_host') === 'true';
    setIsVerifiedHost(verified);
  }, [showMenu]); // Check when menu opens to ensure fresh state

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const toggleMode = () => {
    const newMode = userMode === 'visitor' ? 'host' : 'visitor';
    
    if (newMode === 'host' && !isVerifiedHost) {
      setShowMenu(false);
      router.push('/verify');
      return;
    }

    setUserMode(newMode);
    setShowMenu(false);
    if (newMode === 'host') {
      router.push('/dashboard?tab=hosting');
    } else {
      router.push('/');
    }
  };

  const visitorNavItems = [
    { name: "Discover", href: "/", icon: Home },
    { name: "Activities", href: "/activities", icon: Compass },
    { name: "My Bookings", href: "/dashboard?tab=traveling", icon: Calendar },
  ];

  const hostNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Inbox", href: "/inbox", icon: Compass },
    { name: "Calendar", href: "/calendar", icon: Calendar },
  ];

  const currentNavItems = userMode === 'visitor' ? visitorNavItems : hostNavItems;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-sky-500/95 backdrop-blur-md supports-[backdrop-filter]:bg-sky-500/90 shadow-sm transition-all duration-300">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight drop-shadow-sm">
              AskALocal
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {currentNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-bold transition-all ${
                    isActive
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-sky-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Link 
                  href="/verify"
                  className="hidden sm:flex text-sm font-bold text-sky-100 hover:text-white transition-colors"
                >
                  Become a Host
                </Link>
                <button
                  onClick={handleLogin}
                  className="flex items-center justify-center px-4 py-1.5 rounded-full bg-white text-sky-600 text-sm font-bold hover:bg-sky-50 transition-colors shadow-sm"
                >
                  Log in
                </button>
              </>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 px-3 py-1 rounded-full border border-sky-400 bg-sky-600/50 hover:bg-sky-600 transition-all shadow-sm"
                >
                  <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center text-sky-600 font-bold text-xs">
                    DJ
                  </div>
                  <Menu className="h-4 w-4 text-sky-100" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 top-12 w-64 bg-white border border-stone-100 rounded-2xl shadow-xl py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5">
                    <div className="px-4 py-3 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-stone-900">Dennis Jia</p>
                        {isVerifiedHost && (
                          <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider rounded border border-orange-200">
                            Host
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Verified via Gmail
                      </p>
                    </div>

                    <div className="py-2">
                      <button 
                        onClick={toggleMode}
                        className="w-full px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 flex items-center gap-3 transition-colors"
                      >
                        <Repeat className="h-4 w-4 text-orange-500" />
                        Switch to {userMode === 'visitor' ? 'Hosting' : 'Traveling'}
                      </button>
                      
                      <Link 
                        href="/dashboard"
                        className="w-full px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 flex items-center gap-3 transition-colors"
                      >
                        <User className="h-4 w-4 text-blue-500" />
                        Manage Account
                      </Link>
                      
                      <Link 
                        href="/verify"
                        className="w-full px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 flex items-center gap-3 transition-colors"
                      >
                        <UserPlus className="h-4 w-4 text-green-500" />
                        {userMode === 'visitor' ? 'Create a new Experience' : 'Edit Listing'}
                      </Link>
                    </div>

                    <div className="border-t border-stone-100 pt-2">
                      <button 
                        onClick={() => { logout(); setShowMenu(false); }}
                        className="w-full px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-3 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
