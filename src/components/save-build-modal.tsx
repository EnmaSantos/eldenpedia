"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Loader2, Check } from "lucide-react";

interface SaveBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  buildData: {
    stats: any;
    weapon_r: any;
    weapon_l: any;
  };
}

export function SaveBuildModal({ isOpen, onClose, buildData }: SaveBuildModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in.");

      const { error } = await supabase.from("builds").insert({
        user_id: user.id,
        name,
        description,
        is_public: isPublic,
        stats: buildData.stats,
        weapon_r_id: buildData.weapon_r?.id || null,
        weapon_l_id: buildData.weapon_l?.id || null
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Failed to save build. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-background border border-primary/30 w-full max-w-md rounded-lg shadow-2xl p-6 animate-in fade-in zoom-in-95">
        <h2 className="font-serif text-2xl text-primary mb-4">Save Loadout</h2>
        
        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-green-400">
            <Check size={48} className="mb-2" />
            <p>Build Saved to Archives!</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Build Name</label>
              <input 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rivers of Blood DEX/ARC"
                className="w-full bg-muted border border-border rounded px-3 py-2 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Description (Optional)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Notes about talismans, armor, etc."
                className="w-full bg-muted border border-border rounded px-3 py-2 h-20 focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="accent-primary"
              />
              <label htmlFor="isPublic" className="text-sm text-muted-foreground">Make this build public?</label>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded border border-border text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 py-2 rounded bg-primary text-primary-foreground font-bold hover:bg-accent-gold flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

