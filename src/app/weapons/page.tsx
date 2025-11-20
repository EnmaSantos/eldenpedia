"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Swords, Sparkles, Scale } from "lucide-react";
import weaponsData from "@/data/weapons.json";
import { Weapon } from "@/types/weapon";

const weapons = weaponsData as Weapon[];

export default function WeaponsArsenalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter logic
  const filteredWeapons = searchTerm.trim() 
    ? weapons.filter(w => 
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        w.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 50) // Increased limit for browse page
    : weapons.slice(0, 20);

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-7xl mx-auto pb-20">
      
      {/* Header & Actions */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
            <h1 className="text-4xl font-serif text-primary mb-2">Royal Arsenal</h1>
            <p className="text-muted-foreground text-lg">Browse, analyze, and discover every armament in the Lands Between.</p>
        </div>
        
        <div className="flex items-center gap-4">
            <Link 
                href="/weapons/compare" 
                className="flex items-center gap-2 bg-muted/20 hover:bg-primary/10 border border-border hover:border-primary text-foreground px-6 py-3 rounded-lg transition-all group"
            >
                <Scale size={20} className="text-muted-foreground group-hover:text-primary" />
                <div className="text-left">
                    <div className="text-xs font-bold uppercase text-muted-foreground">Tool</div>
                    <div className="font-bold">Comparator</div>
                </div>
            </Link>
            <Link 
                href="/builds/editor" 
                className="flex items-center gap-2 bg-muted/20 hover:bg-primary/10 border border-border hover:border-primary text-foreground px-6 py-3 rounded-lg transition-all group"
            >
                <Swords size={20} className="text-muted-foreground group-hover:text-primary" />
                <div className="text-left">
                    <div className="text-xs font-bold uppercase text-muted-foreground">Tool</div>
                    <div className="font-bold">Build Editor</div>
                </div>
            </Link>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-12">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-muted-foreground" />
        </div>
        <input 
            type="text" 
            placeholder="Search for a weapon (e.g. 'Moonveil', 'Greatsword')..." 
            className="w-full bg-background border border-border rounded-full pl-12 pr-6 py-4 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredWeapons.map(weapon => (
            <Link 
                key={weapon.id}
                href={`/weapons/${weapon.id}`}
                className="group bg-muted/10 border border-border rounded-lg p-4 hover:border-primary/50 transition-all hover:bg-muted/20 flex flex-col h-full"
            >
                <div className="aspect-square bg-black/20 rounded border border-border mb-4 flex items-center justify-center overflow-hidden p-4 relative">
                        {weapon.image ? (
                        <img src={weapon.image} alt={weapon.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                        <Swords className="text-muted-foreground/20" size={48} />
                        )}
                        
                        {weapon.isSomber && (
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur rounded-full p-1" title="Unique">
                                <Sparkles size={10} className="text-purple-400" />
                            </div>
                        )}
                </div>
                
                <div className="mt-auto">
                    <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors mb-1">{weapon.name}</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="bg-muted px-1.5 py-0.5 rounded border border-border/50">{weapon.category}</span>
                        
                        {/* Mini Stat Preview */}
                        <div className="flex gap-2">
                            {weapon.scaling.some(s => s.tier === 'S') && <span className="text-accent-gold font-bold">S-Tier</span>}
                            {weapon.requirements.some(r => r.attribute === 'Int' && r.value > 0) && <span className="text-blue-400">INT</span>}
                            {weapon.requirements.some(r => r.attribute === 'Fai' && r.value > 0) && <span className="text-yellow-400">FAI</span>}
                            {weapon.requirements.some(r => r.attribute === 'Arc' && r.value > 0) && <span className="text-purple-400">ARC</span>}
                        </div>
                    </div>
                </div>
            </Link>
        ))}
      </div>

      {filteredWeapons.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
            <Swords size={48} className="mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-bold">No Armaments Found</h3>
            <p>Try searching for a different name or category.</p>
        </div>
      )}

    </div>
  );
}
