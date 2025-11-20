"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { X, Mail, Lock, Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  // ... existing state ...
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ... existing handleAuth function ...
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
              avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`,
            },
          },
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose(); 
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-background border border-primary/30 w-full max-w-md rounded-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-8 z-[10000]">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="font-serif text-3xl text-primary mb-2 text-center">
            {isSignUp ? "Join the Order" : "Return, Tarnished"}
          </h2>
          <p className="text-muted-foreground text-center mb-6 text-sm">
            {isSignUp 
              ? "Create an account to save your builds." 
              : "Sign in to access your arsenal."}
          </p>

          {error && (
            <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-3 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-900/20 border border-green-900/50 text-green-200 p-3 rounded mb-4 text-sm text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-muted-foreground">Tarnished Name</label>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    className="w-full bg-muted/50 border border-border rounded px-3 py-2 pl-10 focus:outline-none focus:border-primary"
                    placeholder="LetMeSoloHer"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5 text-muted-foreground">
                     <div className="w-4 h-4 bg-current rounded-full opacity-50" /> 
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-muted-foreground">Email</label>
              <div className="relative">
                <input 
                  required
                  type="email" 
                  className="w-full bg-muted/50 border border-border rounded px-3 py-2 pl-10 focus:outline-none focus:border-primary"
                  placeholder="tarnished@grace.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail size={16} className="absolute left-3 top-3 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-muted-foreground">Password</label>
              <div className="relative">
                <input 
                  required
                  type="password" 
                  className="w-full bg-muted/50 border border-border rounded px-3 py-2 pl-10 focus:outline-none focus:border-primary"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock size={16} className="absolute left-3 top-3 text-muted-foreground" />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded hover:bg-accent-gold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have a seat?" : "New to the Lands Between?"}{" "}
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
              className="text-primary hover:underline font-bold"
            >
              {isSignUp ? "Login" : "Create Account"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

