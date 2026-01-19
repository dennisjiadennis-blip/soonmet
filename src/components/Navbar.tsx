"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, UserPlus, Calendar, Home, LogIn, Menu, User, Repeat, LogOut, CheckCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMode, setUserMode] = useState<'visitor' | 'host'>('visitor');
  const [showMenu, setShowMenu] = useState(false);
  const [isVerifiedHost, setIsVerifiedHost] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    // Simulate Gmail Login
    const confirmLogin = window.confirm("Simulate Login with Gmail?\n(This will merge your Visitor and Host identities)");
    if (confirmLogin) {
      setIsLoggedIn(true);
      // Simulate fetching user profile which has both roles
    }
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            SoonMet
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
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
                  className="hidden sm:flex text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Become a Host
                </Link>
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  Log in
                </button>
              </>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-all"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                    DJ
                  </div>
                  <Menu className="h-4 w-4 text-zinc-400" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 top-12 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">Dennis Jia</p>
                        {isVerifiedHost && (
                          <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-wider rounded border border-yellow-500/30">
                            Host
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Verified via Gmail
                      </p>
                    </div>

                    <div className="py-2">
                      <button 
                        onClick={toggleMode}
                        className="w-full px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-3 transition-colors"
                      >
                        <Repeat className="h-4 w-4 text-indigo-400" />
                        Switch to {userMode === 'visitor' ? 'Hosting' : 'Traveling'}
                      </button>
                      
                      <Link 
                        href="/dashboard"
                        className="w-full px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-3 transition-colors"
                      >
                        <User className="h-4 w-4 text-blue-400" />
                        Manage Account
                      </Link>
                      
                      <Link 
                        href="/verify"
                        className="w-full px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-3 transition-colors"
                      >
                        <UserPlus className="h-4 w-4 text-green-400" />
                        {userMode === 'visitor' ? 'Create a new Experience' : 'Edit Listing'}
                      </Link>
                    </div>

                    <div className="border-t border-zinc-800 pt-2">
                      <button 
                        onClick={() => { setIsLoggedIn(false); setShowMenu(false); }}
                        className="w-full px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 flex items-center gap-3 transition-colors"
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
