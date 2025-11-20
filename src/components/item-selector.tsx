"use client";

import { useState, useEffect } from "react";
import { Search, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Define a union type for all possible items to keep TypeScript happy
type ItemType = "weapon" | "shield" | "armor" | "talisman" | "class";

interface ItemSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: any) => void;
  items: any[];
  type: ItemType;
  title?: string;
}

export function ItemSelector({ isOpen, onClose, onSelect, items, type, title }: ItemSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setFilteredItems(items.slice(0, 20));
    }
  }, [isOpen, items]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items.slice(0, 20));
      return;
    }
    
    const lowerTerm = searchTerm.toLowerCase();
    const results = items.filter(item => 
      item.name.toLowerCase().includes(lowerTerm) || 
      (item.category && item.category.toLowerCase().includes(lowerTerm))
    ).slice(0, 50);
    
    setFilteredItems(results);
  }, [searchTerm, items]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-background border border-primary/30 w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Search className="text-muted-foreground" />
          <input 
            autoFocus
            type="text" 
            placeholder={`Search ${title || type}...`} 
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={onClose} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No items found matching "{searchTerm}"
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onSelect(item); onClose(); }}
                className="w-full flex items-center gap-4 p-3 rounded hover:bg-muted/50 text-left group transition-colors border border-transparent hover:border-primary/20"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-black/20 rounded flex items-center justify-center overflow-hidden border border-border shrink-0">
                    {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    ) : (
                        <span className="text-xs text-muted-foreground">?</span>
                    )}
                </div>

                {/* Content based on type */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-foreground group-hover:text-primary truncate">{item.name}</h4>
                        {item.isSomber && (
                            <span className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-300 text-[10px] uppercase px-1.5 py-0.5 rounded border border-zinc-700 shrink-0">
                                <Sparkles size={10} className="text-purple-400" /> Unique
                            </span>
                        )}
                    </div>
                    
                    {/* Subtitle / Details */}
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                        {type === "class" && (
                            <span>Level {item.stats.level} • Vigor {item.stats.vigor} • Dex {item.stats.dexterity} • Str {item.stats.strength}</span>
                        )}
                        {type === "talisman" && (
                            <span className="text-zinc-400">{item.effect}</span>
                        )}
                        {(type === "armor" || type === "weapon" || type === "shield") && (
                            <div className="flex gap-2">
                                <span className="bg-muted px-1.5 py-0.5 rounded border border-border/50">{item.category}</span>
                                <span>Wgt: {item.weight}</span>
                                {type === "armor" && item.dmgNegation && (
                                    <span className="hidden sm:inline">Phy: {item.dmgNegation.find((s: any) => s.name === "Phy")?.amount ?? 0}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

