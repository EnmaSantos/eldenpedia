"use client";

import { useState } from "react";
import weaponsData from "@/data/weapons.json";
import { Weapon } from "@/types/weapon"; // Keep the type import

// Cast the JSON data to our Weapon type safely
const weapons = weaponsData as Weapon[];
import { calculateAR } from "@/lib/calculator"; // Import calculator
import { Swords, X } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming standard shadcn utils location, or we'll create it
import Link from "next/link";

import { WeaponSelector } from "@/components/weapon-selector";
import { SaveBuildModal } from "@/components/save-build-modal";
import { Sparkles, Save } from "lucide-react";
import { supabase } from "@/lib/supabase"; // To check login status

export default function WeaponComparisonPage() {
  const [weaponA, setWeaponA] = useState<Weapon | null>(null);
  const [weaponB, setWeaponB] = useState<Weapon | null>(null);
  const [selectorOpen, setSelectorOpen] = useState<{ isOpen: boolean; slot: "A" | "B" | null }>({ isOpen: false, slot: null });
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  
  // User Stats State
  const [stats, setStats] = useState({
    str: 10,
    dex: 10,
    int: 10,
    fai: 10,
    arc: 10
  });

  // Open modal
  const openSelector = (slot: "A" | "B") => {
    setSelectorOpen({ isOpen: true, slot });
  };

  // Handle selection
  const handleSelect = (weapon: Weapon) => {
    if (selectorOpen.slot === "A") setWeaponA(weapon);
    else if (selectorOpen.slot === "B") setWeaponB(weapon);
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-6xl mx-auto">
      <WeaponSelector 
        isOpen={selectorOpen.isOpen} 
        onClose={() => setSelectorOpen({ ...selectorOpen, isOpen: false })} 
        onSelect={handleSelect} 
      />

      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-serif text-primary">Weapon Comparator</h1>
        
        {/* Save Button (only if at least one weapon selected) */}
        {(weaponA || weaponB) && (
            <button 
                onClick={() => setSaveModalOpen(true)}
                className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
                <Save size={16} /> Save Loadout
            </button>
        )}
      </header>

      <SaveBuildModal 
        isOpen={saveModalOpen} 
        onClose={() => setSaveModalOpen(false)}
        buildData={{ stats, weapon_r: weaponA, weapon_l: weaponB }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: Stats Input */}
        <div className="lg:col-span-1 space-y-6 bg-muted/20 p-6 rounded-lg border border-border">
          <h2 className="font-serif text-xl text-foreground border-b border-border pb-2">Tarnished Stats</h2>
          
          <div className="space-y-4">
            {Object.entries(stats).map(([stat, value]) => (
              <div key={stat} className="flex items-center justify-between">
                <label className="uppercase font-bold text-muted-foreground w-12">{stat}</label>
                <input 
                  type="number" 
                  min="1" 
                  max="99"
                  value={value}
                  onChange={(e) => setStats({...stats, [stat as keyof typeof stats]: parseInt(e.target.value) || 0})}
                  className="bg-background border border-border rounded px-3 py-1 w-20 text-right focus:outline-none focus:border-primary"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 & 3: The Comparison Area */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          
          {/* Slot A */}
          <WeaponSlot 
            label="Weapon A" 
            weapon={weaponA} 
            onSelect={() => openSelector("A")} 
            onClear={() => setWeaponA(null)} 
          />

          {/* Slot B */}
          <WeaponSlot 
            label="Weapon B" 
            weapon={weaponB} 
            onSelect={() => openSelector("B")} 
            onClear={() => setWeaponB(null)} 
          />

        </div>
      </div>

            {/* Performance Analysis */}
            {weaponA && weaponB && (
                <div className="mt-8 p-6 border border-primary/30 rounded-lg bg-muted/10">
                    <h3 className="font-serif text-2xl text-center mb-6 text-primary">Performance Analysis</h3>
                    <div className="grid grid-cols-3 gap-4 text-center items-center">
                        <div className="text-right font-bold text-foreground text-lg">{weaponA.name}</div>
                        <div className="text-muted-foreground text-sm uppercase tracking-widest">vs</div>
                        <div className="text-left font-bold text-foreground text-lg">{weaponB.name}</div>

                        {/* Base Damage Compare */}
                        <div className="text-right font-mono text-muted-foreground">
                            {(weaponA.damage.physical + weaponA.damage.magic + weaponA.damage.fire + weaponA.damage.lightning + weaponA.damage.holy)} Base
                        </div>
                        <div className="text-muted-foreground text-xs">Raw Stats</div>
                        <div className="text-left font-mono text-muted-foreground">
                            {(weaponB.damage.physical + weaponB.damage.magic + weaponB.damage.fire + weaponB.damage.lightning + weaponB.damage.holy)} Base
                        </div>
                        
                        {/* Calculated AR */}
                        <div className="text-right text-accent-gold font-bold text-3xl">
                            {calculateAR(weaponA, stats)}
                        </div>
                        <div className="text-muted-foreground text-sm font-bold uppercase tracking-wider">Total AR</div>
                        <div className="text-left text-accent-gold font-bold text-3xl">
                            {calculateAR(weaponB, stats)}
                        </div>
                    </div>
                    
                    {/* Insight Message */}
                    <div className="text-center mt-6 text-sm text-muted-foreground">
                        {calculateAR(weaponA, stats) > calculateAR(weaponB, stats) 
                            ? <span><span className="text-primary font-bold">{weaponA.name}</span> is performing better with your current stats.</span>
                            : <span><span className="text-primary font-bold">{weaponB.name}</span> is the stronger choice right now.</span>
                        }
                    </div>
                </div>
            )}
    </div>
  );
}

function WeaponSlot({ label, weapon, onSelect, onClear }: { label: string, weapon: Weapon | null, onSelect: () => void, onClear: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div 
        onClick={!weapon ? onSelect : undefined}
        className={cn(
          "relative flex-1 min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-all cursor-pointer group",
          weapon ? "border-primary bg-muted/30 border-solid cursor-default" : "border-border hover:border-primary/50 hover:bg-muted/20"
        )}
      >
        {weapon ? (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="absolute top-2 right-2 p-1 hover:bg-background rounded-full text-muted-foreground hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
            <Swords className="mb-4 text-primary" size={32} />
            <div className="flex items-center gap-2 justify-center mb-1">
                <h3 className="font-serif text-xl text-center font-bold">{weapon.name}</h3>
                {weapon.isSomber && <div title="Somber Weapon"><Sparkles size={16} className="text-purple-400" /></div>}
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{weapon.category}</p>
            
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm w-full">
                <div className="text-right text-muted-foreground">Str</div>
                <div className="font-mono">{weapon.requirements.find(r => r.attribute === "Str")?.value || "-"}</div>
                
                <div className="text-right text-muted-foreground">Dex</div>
                <div className="font-mono">{weapon.requirements.find(r => r.attribute === "Dex")?.value || "-"}</div>
            </div>
          </>
        ) : (
          <>
            <div className="p-3 rounded-full bg-background mb-3 group-hover:scale-110 transition-transform">
                <Swords className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-muted-foreground font-medium group-hover:text-foreground">Select {label}</span>
          </>
        )}
      </div>
      {weapon && (
          <button onClick={onSelect} className="mt-2 text-xs text-center text-muted-foreground hover:text-primary underline">
              Change Weapon
          </button>
      )}
    </div>
  );
}

