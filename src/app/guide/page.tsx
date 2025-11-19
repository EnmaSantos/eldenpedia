"use client";

import { useState } from "react";
import { zones, Zone } from "@/data/zones";
import { Map, ChevronRight, Skull, AlertTriangle, Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function GuidePage() {
  // State for the user's current level
  const [userLevel, setUserLevel] = useState<number>(1);
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <header className="mb-12 flex flex-col gap-4">
        <div>
          <h1 className="text-4xl font-serif text-primary mb-2">The Path of Guidance</h1>
          <p className="text-muted-foreground max-w-2xl">
            Enter your Rune Level to see which lands are safe to traverse, and which will lead to certain death.
          </p>
        </div>
      </header>

      {/* Control Panel */}
      <div className="sticky top-4 z-30 bg-background/95 backdrop-blur border border-border p-4 rounded-lg shadow-lg mb-8 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <label className="font-serif text-lg text-foreground whitespace-nowrap">Your Level:</label>
          <input 
            type="number" 
            min="1" 
            max="713"
            value={userLevel}
            onChange={(e) => setUserLevel(parseInt(e.target.value) || 1)}
            className="bg-muted border border-border rounded px-3 py-2 w-24 text-center text-xl font-bold text-primary focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden min-w-[200px]">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: `${Math.min(userLevel / 150 * 100, 100)}%` }}
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
            <input 
                type="checkbox" 
                id="showAll" 
                checked={showAll} 
                onChange={(e) => setShowAll(e.target.checked)}
                className="w-4 h-4 accent-primary"
            />
            <label htmlFor="showAll" className="text-muted-foreground cursor-pointer">Show all regions</label>
        </div>
      </div>

      {/* Timeline / Map List */}
      <div className="space-y-4 relative">
        {/* Vertical Line */}
        <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-border z-0 hidden sm:block" />

        {zones.map((zone, index) => {
            // Determine status based on level
            const isUnderLeveled = userLevel < zone.minLevel - 5;
            const isOverLeveled = userLevel > zone.maxLevel + 10;
            const isPerfect = !isUnderLeveled && !isOverLeveled;

            // Skip if "Show All" is false and user is way past this content
            // (But keep at least one or two past ones for context)
            if (!showAll && isOverLeveled && index < zones.findIndex(z => z.minLevel > userLevel) - 1) {
                return null;
            }

            return (
                <div key={zone.id} className="relative z-10 group">
                    <div className={cn(
                        "flex flex-col sm:flex-row gap-6 p-6 rounded-lg border transition-all duration-300",
                        isPerfect ? "bg-muted/30 border-primary/50 shadow-[0_0_15px_rgba(194,155,71,0.1)]" : "bg-background border-border opacity-80 hover:opacity-100",
                        isUnderLeveled ? "opacity-50 grayscale-[0.5]" : ""
                    )}>
                        {/* Icon / Status Indicator */}
                        <div className="flex-shrink-0 sm:w-14 flex flex-col items-center gap-2">
                             <div className={cn(
                                 "w-14 h-14 rounded-full flex items-center justify-center border-2",
                                 isPerfect ? "bg-background border-primary text-primary" : "bg-muted border-border text-muted-foreground",
                                 isUnderLeveled ? "border-red-900/50 text-red-900" : ""
                             )}>
                                 {isUnderLeveled ? <Lock size={20} /> : <Map size={24} />}
                             </div>
                             {isUnderLeveled && <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Danger</span>}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <h3 className="text-2xl font-serif font-bold text-foreground">{zone.name}</h3>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className={cn("px-2 py-1 rounded border", isPerfect ? "bg-primary/20 border-primary text-primary" : "bg-muted border-border text-muted-foreground")}>
                                        Lvl {zone.minLevel} - {zone.maxLevel}
                                    </span>
                                    <span className="px-2 py-1 rounded border bg-muted border-border text-muted-foreground" title="Recommended Weapon Upgrade">
                                        +{zone.upgradeLevel}
                                    </span>
                                </div>
                            </div>
                            
                            <p className="text-muted-foreground mb-4">{zone.description}</p>

                            {/* Bosses */}
                            <div className="flex flex-wrap gap-2">
                                {zone.bosses.map(boss => (
                                    <span key={boss} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded bg-background border border-border text-foreground/80">
                                        <Skull size={12} className="text-red-900" /> {boss}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        {/* Action Arrow (Decorative) */}
                        <div className="hidden sm:flex items-center justify-center text-muted-foreground/20 group-hover:text-primary/50 transition-colors">
                            <ChevronRight size={32} />
                        </div>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
}

