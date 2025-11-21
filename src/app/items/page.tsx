"use client";

import { useState } from "react";
import { Search, Beaker, Hammer, Ghost, Info, ChevronDown, ChevronUp } from "lucide-react";
import itemsData from "@/data/items.json";
import { cn } from "@/lib/utils";

const items = itemsData as any[];

export default function ItemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  const toggleGuide = (guide: string) => {
    setOpenGuide(openGuide === guide ? null : guide);
  };

  // Simple filter
  const filteredItems = searchTerm.trim() 
    ? items.filter(i => 
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (i.description && i.description.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 50)
    : items.slice(0, 24);

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-serif text-primary mb-4">Items & Knowledge</h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
            A compendium of useful tools, key items, and the hidden mechanics that govern their use.
        </p>
      </header>

      {/* Mechanics Guides (The Friend's Idea) */}
      <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Crafting Guide */}
        <div className="bg-muted/10 border border-border rounded-lg overflow-hidden">
            <button 
                onClick={() => toggleGuide("crafting")}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-900/20 text-green-600 rounded-lg border border-green-900/30">
                        <Beaker size={24} />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-lg">Crafting & Pots</h3>
                        <p className="text-xs text-muted-foreground">Sleep Pots, Bombs, & Greases</p>
                    </div>
                </div>
                {openGuide === "crafting" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {openGuide === "crafting" && (
                <div className="p-6 pt-0 border-t border-border/50 bg-background/50 animate-in slide-in-from-top-2">
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        To craft items, you first need the <strong>Crafting Kit</strong> (bought from Kalé at the Church of Elleh). 
                        Recipes are unlocked by finding <strong>Cookbooks</strong> scattered across the world.
                    </p>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-foreground min-w-[100px]">Cracked Pots:</span>
                            <span className="text-muted-foreground">Reusable containers for throwing bombs. They return to your inventory after use!</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-foreground min-w-[100px]">Sleep Pots:</span>
                            <span className="text-muted-foreground">Extremely effective against Godskins and Bears. Require Trina's Lily.</span>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Spirit Tuning Guide */}
        <div className="bg-muted/10 border border-border rounded-lg overflow-hidden">
            <button 
                onClick={() => toggleGuide("spirits")}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-900/20 text-purple-400 rounded-lg border border-purple-900/30">
                        <Ghost size={24} />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-lg">Spirit Ashes</h3>
                        <p className="text-xs text-muted-foreground">Upgrading Summons</p>
                    </div>
                </div>
                {openGuide === "spirits" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {openGuide === "spirits" && (
                <div className="p-6 pt-0 border-t border-border/50 bg-background/50 animate-in slide-in-from-top-2">
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        Spirits are not just collectibles; they can be upgraded! You must complete <strong>Roderika's Quest</strong> at Stormhill Shack and Roundtable Hold to unlock Spirit Tuning.
                    </p>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-foreground min-w-[100px]">Gloveworts:</span>
                            <span className="text-muted-foreground"><strong>Grave Gloveworts</strong> upgrade standard ashes. <strong>Ghost Gloveworts</strong> upgrade renowned (named) ashes.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-foreground min-w-[100px]">Mimic Tear:</span>
                            <span className="text-muted-foreground">Copies your exact build. Upgrade it to +10 for the ultimate tank.</span>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Upgrading Guide */}
        <div className="bg-muted/10 border border-border rounded-lg overflow-hidden">
            <button 
                onClick={() => toggleGuide("smithing")}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-900/20 text-amber-600 rounded-lg border border-amber-900/30">
                        <Hammer size={24} />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-lg">Smithing</h3>
                        <p className="text-xs text-muted-foreground">Weapon Upgrades</p>
                    </div>
                </div>
                {openGuide === "smithing" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {openGuide === "smithing" && (
                <div className="p-6 pt-0 border-t border-border/50 bg-background/50 animate-in slide-in-from-top-2">
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        Never sell Smithing Stones! They are the primary way to increase damage. Leveling stats helps scaling, but upgrades base damage significantly.
                    </p>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-foreground min-w-[100px]">Standard:</span>
                            <span className="text-muted-foreground">Uses regular Smithing Stones (1-8) up to +25.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-foreground min-w-[100px]">Somber:</span>
                            <span className="text-muted-foreground">Uses Somber Smithing Stones (1-9) up to +10. Easier to upgrade early game.</span>
                        </div>
                    </div>
                </div>
            )}
        </div>

      </section>

      {/* Search & Grid */}
      <section>
        <div className="relative max-w-xl mx-auto mb-8">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="text-muted-foreground" />
            </div>
            <input 
                type="text" 
                placeholder="Search items (e.g. 'Larval Tear', 'Rune Arc')..." 
                className="w-full bg-background border border-border rounded-full pl-12 pr-6 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-muted/10 border border-border rounded-lg hover:border-primary/30 transition-colors">
                    <div className="w-16 h-16 bg-black/20 rounded border border-border shrink-0 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                            <Info size={24} className="text-muted-foreground" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground">{item.name}</h4>
                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/50 mb-2 inline-block">
                            {item.type}
                        </span>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.effect || item.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
}

