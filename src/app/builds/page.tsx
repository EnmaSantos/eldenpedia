"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Trash2, Swords, ArrowRight, Edit, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import weaponsData from "@/data/weapons.json";
import shieldsData from "@/data/shields.json";

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

  // Helper to get weapon/shield name from ID
  const getItemName = (id: string | null) => {
    if (!id) return "Empty";
    const w = weaponsData.find((w: any) => w.id === id);
    if (w) return w.name;
    const s = shieldsData.find((s: any) => s.id === id);
    return s ? s.name : "Unknown";
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-5xl mx-auto">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-serif text-primary mb-2">My Archives</h1>
            <p className="text-muted-foreground">Your saved loadouts and experiments.</p>
        </div>
        <Link href="/builds/editor" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded font-bold hover:bg-accent-gold transition-colors">
            <Plus size={18} />
            New Build
        </Link>
      </header>

      {builds.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-lg bg-muted/10">
          <Swords className="mx-auto text-muted-foreground mb-4" size={48} />
          <h3 className="text-xl font-bold text-foreground mb-2">No Builds Found</h3>
          <p className="text-muted-foreground mb-6">Start fresh with the new Build Editor.</p>
          <Link href="/builds/editor" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded font-bold hover:bg-accent-gold transition-colors">
             Create First Loadout <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {builds.map((build) => (
            <div key={build.id} className="relative group bg-muted/20 border border-border rounded-lg p-6 hover:border-primary/50 transition-colors flex flex-col">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors truncate pr-4">{build.name}</h3>
                    <p className="text-xs text-muted-foreground">{new Date(build.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-1">
                    <Link 
                        href={`/builds/editor?id=${build.id}`}
                        className="text-muted-foreground hover:text-primary transition-colors p-2"
                        title="Edit Build"
                    >
                        <Edit size={18} />
                    </Link>
                    <button 
                        onClick={() => deleteBuild(build.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-2"
                        title="Delete Build"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
              </div>

              {/* Description */}
              {build.description && (
                <p className="text-sm text-muted-foreground mb-4 italic border-l-2 border-primary/30 pl-3 line-clamp-2">
                    "{build.description}"
                </p>
              )}

              {/* Stats Grid */}
              <div className="flex gap-4 text-sm mb-6 bg-background/50 p-3 rounded border border-border/50 justify-center">
                 {Object.entries(build.stats).slice(0, 4).map(([key, val]: any) => ( // Show first 4 stats
                    <div key={key} className="flex flex-col items-center">
                        <span className="text-[10px] uppercase text-muted-foreground">{key.substring(0, 3)}</span>
                        <span className="font-mono font-bold text-foreground">{val}</span>
                    </div>
                 ))}
                 {Object.keys(build.stats).length > 4 && (
                     <div className="flex flex-col items-center justify-center">
                         <span className="text-[10px] uppercase text-muted-foreground">...</span>
                     </div>
                 )}
              </div>

              {/* Weapons */}
              <div className="space-y-2 mt-auto">
                <div className="flex items-center justify-between text-sm p-2 rounded bg-muted/40">
                    <span className="text-muted-foreground">R. Hand</span>
                    <span className="font-bold text-foreground truncate max-w-[150px]">{getItemName(build.weapon_r_id)}</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 rounded bg-muted/40">
                    <span className="text-muted-foreground">L. Hand</span>
                    <span className="font-bold text-foreground truncate max-w-[150px]">{getItemName(build.weapon_l_id)}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
