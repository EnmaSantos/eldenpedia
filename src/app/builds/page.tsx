"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Trash2, Swords, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import weaponsData from "@/data/weapons.json";

export default function BuildsPage() {
  const [builds, setBuilds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuilds();
  }, []);

  const fetchBuilds = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setLoading(false);
        return;
    }

    const { data, error } = await supabase
      .from("builds")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setBuilds(data);
    setLoading(false);
  };

  const deleteBuild = async (id: string) => {
    if (!confirm("Are you sure you want to delete this build?")) return;
    await supabase.from("builds").delete().eq("id", id);
    setBuilds(builds.filter(b => b.id !== id));
  };

  // Helper to get weapon name from ID
  const getWeaponName = (id: string | null) => {
    if (!id) return "Empty";
    const w = weaponsData.find((w: any) => w.id === id);
    return w ? w.name : id;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-primary mb-2">My Archives</h1>
        <p className="text-muted-foreground">Your saved loadouts and experiments.</p>
      </header>

      {builds.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-lg bg-muted/10">
          <Swords className="mx-auto text-muted-foreground mb-4" size={48} />
          <h3 className="text-xl font-bold text-foreground mb-2">No Builds Found</h3>
          <p className="text-muted-foreground mb-6">Go to the Arsenal to create your first loadout.</p>
          <Link href="/weapons" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded font-bold hover:bg-accent-gold transition-colors">
             Enter Arsenal <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {builds.map((build) => (
            <div key={build.id} className="relative group bg-muted/20 border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">{build.name}</h3>
                    <p className="text-xs text-muted-foreground">{new Date(build.created_at).toLocaleDateString()}</p>
                </div>
                <button 
                    onClick={() => deleteBuild(build.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors p-2"
                    title="Delete Build"
                >
                    <Trash2 size={18} />
                </button>
              </div>

              {/* Description */}
              {build.description && (
                <p className="text-sm text-muted-foreground mb-4 italic border-l-2 border-primary/30 pl-3">
                    "{build.description}"
                </p>
              )}

              {/* Stats Grid */}
              <div className="flex gap-4 text-sm mb-6 bg-background/50 p-3 rounded border border-border/50">
                 {Object.entries(build.stats).map(([key, val]: any) => (
                    <div key={key} className="flex flex-col items-center">
                        <span className="text-[10px] uppercase text-muted-foreground">{key}</span>
                        <span className="font-mono font-bold text-foreground">{val}</span>
                    </div>
                 ))}
              </div>

              {/* Weapons */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm p-2 rounded bg-muted/40">
                    <span className="text-muted-foreground">R. Hand</span>
                    <span className="font-bold text-foreground">{getWeaponName(build.weapon_r_id)}</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 rounded bg-muted/40">
                    <span className="text-muted-foreground">L. Hand</span>
                    <span className="font-bold text-foreground">{getWeaponName(build.weapon_l_id)}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

