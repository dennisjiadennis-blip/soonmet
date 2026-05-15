"use client";

import { useState } from "react";
import { X, Mail, Github, Chrome } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export function AuthModal() {
  const { showLoginModal, setShowLoginModal, login } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<'visitor' | 'host'>('visitor');

  if (!showLoginModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowLoginModal(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Close Button */}
          <button 
            onClick={() => setShowLoginModal(false)}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Join SoonMet'}
              </h2>
              <p className="text-zinc-400 text-sm">
                {mode === 'login' 
                  ? 'Login to access your personalized experience.' 
                  : 'Create an account to connect with locals.'}
              </p>
            </div>

            {/* Role Selection */}
            <div className="bg-zinc-900/50 p-1 rounded-xl flex mb-6">
              <button
                onClick={() => setSelectedRole('visitor')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  selectedRole === 'visitor' 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                I'm a Visitor
              </button>
              <button
                onClick={() => setSelectedRole('host')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  selectedRole === 'host' 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                I'm a Host
              </button>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => login(selectedRole)}
                className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors"
              >
                <Chrome className="w-5 h-5" />
                Continue with Google
              </button>
              
              <button 
                onClick={() => login(selectedRole)}
                className="w-full py-3 bg-zinc-800 text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-zinc-700 transition-colors border border-zinc-700"
              >
                <Mail className="w-5 h-5" />
                Continue with Email
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-zinc-500">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                >
                  {mode === 'login' ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>
          </div>
          
          {/* Decorative Gradient */}
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
