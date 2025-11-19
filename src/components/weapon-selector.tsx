"use client";

import { useState, useEffect } from "react";
import { Weapon } from "@/types/weapon";
import weaponsData from "@/data/weapons.json"; // Import JSON directly
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const weapons = weaponsData as Weapon[]; // Cast to type

interface WeaponSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (weapon: Weapon) => void;
}

export function WeaponSelector({ isOpen, onClose, onSelect }: WeaponSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWeapons, setFilteredWeapons] = useState<Weapon[]>([]);

  // Reset search when opened
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setFilteredWeapons(weapons.slice(0, 20)); // Show first 20 by default
    }
  }, [isOpen]);

  // Filter logic
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredWeapons(weapons.slice(0, 20));
      return;
    }
    
    const lowerTerm = searchTerm.toLowerCase();
    const results = weapons.filter(w => 
      w.name.toLowerCase().includes(lowerTerm) || 
      w.category.toLowerCase().includes(lowerTerm)
    ).slice(0, 50); // Limit to 50 results for performance
    
    setFilteredWeapons(results);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-background border border-primary/30 w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header / Search */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Search className="text-muted-foreground" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search weapon name (e.g. 'Moonveil', 'Greatsword')..." 
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={onClose} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredWeapons.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No weapons found matching "{searchTerm}"
            </div>
          ) : (
            filteredWeapons.map((weapon) => (
              <button
                key={weapon.id}
                onClick={() => { onSelect(weapon); onClose(); }}
                className="w-full flex items-center gap-4 p-3 rounded hover:bg-muted/50 text-left group transition-colors border border-transparent hover:border-primary/20"
              >
                {/* Image Thumbnail */}
                <div className="w-12 h-12 bg-black/20 rounded flex items-center justify-center overflow-hidden border border-border">
                    {weapon.image ? (
                        <img src={weapon.image} alt={weapon.name} className="w-full h-full object-contain" />
                    ) : (
                        <span className="text-xs text-muted-foreground">?</span>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h4 className="font-serif font-bold text-foreground group-hover:text-primary">{weapon.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="bg-muted px-1.5 py-0.5 rounded border border-border/50">{weapon.category}</span>
                        {weapon.damage.physical > 0 && <span>Phy: {weapon.damage.physical}</span>}
                        {weapon.damage.magic > 0 && <span className="text-blue-400">Mag: {weapon.damage.magic}</span>}
                        {weapon.damage.fire > 0 && <span className="text-red-400">Fir: {weapon.damage.fire}</span>}
                    </div>
                </div>

                {/* Scaling Badges */}
                <div className="flex gap-1 text-xs font-mono text-muted-foreground opacity-50 group-hover:opacity-100">
                    {weapon.scaling.map(s => (
                        s.tier !== "-" && (
                            <div key={s.attribute} className="flex flex-col items-center">
                                <span className="text-[10px] uppercase">{s.attribute}</span>
                                <span className={cn(
                                    "font-bold",
                                    s.tier === "S" ? "text-accent-gold" : 
                                    s.tier === "A" ? "text-primary" : 
                                    "text-foreground"
                                )}>{s.tier}</span>
                            </div>
                        )
                    ))}
                </div>
              </button>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="p-2 bg-muted/20 border-t border-border text-center text-xs text-muted-foreground">
            Showing {filteredWeapons.length} results
        </div>
      </div>
    </div>
  );
}

