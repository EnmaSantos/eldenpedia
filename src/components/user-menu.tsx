"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AuthModal } from "./auth-modal";
import { User, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function UserMenu() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Check session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
  };

  return (
    <>
      <div className="relative">
        {!user ? (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded font-serif font-bold transition-colors border border-primary/30"
          >
            <User size={18} />
            <span className="hidden sm:inline">Login</span>
          </button>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors"
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-foreground">{profile?.username || "Tarnished"}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Level {Math.floor(Math.random() * 100) + 1}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-muted border border-border overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-bold text-lg">
                    {(profile?.username?.[0] || "T").toUpperCase()}
                  </div>
                )}
              </div>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <Link 
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
                >
                    <Settings size={14} /> Settings
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 flex items-center gap-2"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

