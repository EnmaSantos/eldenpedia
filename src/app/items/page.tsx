"use client";

import { useState } from "react";
import { Search, Beaker, Hammer, Ghost, Info, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import itemsData from "@/data/items.json";
import recipesData from "@/data/recipes.json"; // Import known recipes
import { cn } from "@/lib/utils";

const items = itemsData as any[];
const recipes = recipesData as any[];

export default function ItemsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [craftingSearch, setCraftingSearch] = useState("");
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  const toggleGuide = (guide: string) => {
    setOpenGuide(openGuide === guide ? null : guide);
  };

  // --- Item Search Logic ---
  const filteredItems = searchTerm.trim() 
    ? items.filter(i => 
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (i.description && i.description.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 50)
    : items.slice(0, 24);

  // --- Crafting Logic ---
  // 1. Find recipes where the item is the RESULT (e.g. "Sleep Pot")
  const foundRecipes = craftingSearch.trim() 
    ? recipes.filter(r => r.name.toLowerCase().includes(craftingSearch.toLowerCase()))
    : [];

  // 2. Find recipes where the item is an INGREDIENT (e.g. "Mushroom")
  const reverseRecipes = craftingSearch.trim()
    ? recipes.filter(r => 
        r.materials.some((m: any) => m.name.toLowerCase().includes(craftingSearch.toLowerCase()))
      )
    : [];

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-serif text-primary mb-4">Items & Knowledge</h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
            A compendium of useful tools, key items, and the hidden mechanics that govern their use.
        </p>
      </header>

      {/* Mechanics Guides */}
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
                        To craft items, you first need the <strong>Crafting Kit</strong> (bought from Kalé). 
                        Recipes are unlocked by finding <strong>Cookbooks</strong>.
                    </p>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-foreground min-w-[100px]">Cracked Pots:</span>
                            <span className="text-muted-foreground">Reusable containers. They return to your inventory after use!</span>
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
                        Complete <strong>Roderika's Quest</strong> to unlock Spirit Tuning.
                    </p>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-foreground min-w-[100px]">Gloveworts:</span>
                            <span className="text-muted-foreground"><strong>Grave</strong> for standard, <strong>Ghost</strong> for renowned ashes.</span>
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
                        Never sell Smithing Stones! They are crucial for damage scaling.
                    </p>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-foreground min-w-[100px]">Standard:</span>
                            <span className="text-muted-foreground">Regular Stones (1-8) -> +25.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <span className="font-bold text-foreground min-w-[100px]">Somber:</span>
                            <span className="text-muted-foreground">Somber Stones (1-9) -> +10.</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </section>

      {/* Crafting Calculator */}
      <section className="mb-16 bg-muted/5 border border-border rounded-xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h2 className="font-serif text-2xl text-foreground flex items-center gap-2">
                    <Beaker className="text-primary" /> Crafting Helper
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                    Type an item name to see its recipe, OR a material to see what you can make with it.
                </p>
            </div>
            <input 
                type="text" 
                placeholder="e.g. 'Sleep Pot' or 'Mushroom'" 
                className="bg-background border border-border rounded-lg px-4 py-2 w-full md:w-80 focus:outline-none focus:border-primary"
                value={craftingSearch}
                onChange={(e) => setCraftingSearch(e.target.value)}
            />
        </div>

        {craftingSearch && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                
                {/* Recipe Results */}
                {foundRecipes.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold uppercase text-muted-foreground mb-3">Recipes Found</h3>
                        <div className="space-y-3">
                            {foundRecipes.map(recipe => (
                                <div key={recipe.id} className="bg-background border border-border rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-primary">{recipe.name}</h4>
                                        <span className="text-xs bg-muted px-2 py-1 rounded">{recipe.type}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground italic mb-3">{recipe.description}</p>
                                    <div className="bg-muted/30 rounded p-2 text-sm space-y-1">
                                        {recipe.materials.map((mat: any, idx: number) => (
                                            <div key={idx} className="flex justify-between">
                                                <span>{mat.name}</span>
                                                <span className="font-mono font-bold text-muted-foreground">x{mat.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reverse Lookup Results */}
                {reverseRecipes.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold uppercase text-muted-foreground mb-3">Used to Craft...</h3>
                        <div className="space-y-3">
                            {reverseRecipes.map(recipe => (
                                <div key={recipe.id} className="bg-background border border-border rounded-lg p-4 flex items-center justify-between group hover:border-primary/50 transition-colors">
                                    <div>
                                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{recipe.name}</h4>
                                        <p className="text-xs text-muted-foreground">Requires: {recipe.materials.map((m: any) => m.name).join(", ")}</p>
                                    </div>
                                    <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {foundRecipes.length === 0 && reverseRecipes.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                        No crafting data found for "{craftingSearch}".
                    </div>
                )}
            </div>
        )}
      </section>

      {/* Main Item Grid */}
      <section>
        <div className="relative max-w-xl mx-auto mb-8">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="text-muted-foreground" />
            </div>
            <input 
                type="text" 
                placeholder="Search encyclopedia (Consumables, Keys)..." 
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
