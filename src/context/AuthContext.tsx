"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: 'visitor' | 'host' | null;
  login: (role?: 'visitor' | 'host') => void;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'visitor' | 'host' | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const loggedIn = localStorage.getItem("soonmet_is_logged_in") === "true";
    const role = localStorage.getItem("soonmet_user_role") as 'visitor' | 'host' | null;
    setIsLoggedIn(loggedIn);
    setUserRole(role);
  }, []);

  const login = (role: 'visitor' | 'host' = 'visitor') => {
    localStorage.setItem("soonmet_is_logged_in", "true");
    localStorage.setItem("soonmet_user_role", role);
    setIsLoggedIn(true);
    setUserRole(role);
    setShowLoginModal(false);
  };

  const logout = () => {
    localStorage.removeItem("soonmet_is_logged_in");
    localStorage.removeItem("soonmet_user_role");
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout, showLoginModal, setShowLoginModal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
