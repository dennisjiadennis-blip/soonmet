"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface UserProfile {
  email: string;
  nickname: string;
  country: string;
  isVerified: boolean;
  role: "visitor" | "host" | "none";
}

interface UserContextType {
  user: UserProfile | null;
  login: (email: string, nickname: string, country: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("localvibe_user");
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {
          console.error("Failed to parse user data", e);
          localStorage.removeItem("localvibe_user");
        }
      }
    }
    return null;
  });

  const login = (email: string, nickname: string, country: string) => {
    // Basic validation happens in the form, here we just set the state
    const newUser: UserProfile = {
      email,
      nickname,
      country,
      isVerified: true, // Mock verification as per requirement
      role: "none", // Role is determined later (e.g. when they create a guide)
    };
    setUser(newUser);
    localStorage.setItem("localvibe_user", JSON.stringify(newUser));
    
    // Also sync with host_email for backward compatibility with dashboard
    localStorage.setItem("host_email", email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("localvibe_user");
    localStorage.removeItem("host_email");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
