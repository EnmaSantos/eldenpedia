"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Save, ArrowLeft, RefreshCw, RotateCcw, Swords, Shield, User, Shirt, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ItemSelector } from "@/components/item-selector";

// Data Imports
import weaponsData from "@/data/weapons.json";
import shieldsData from "@/data/shields.json";
import armorsData from "@/data/armors.json";
import talismansData from "@/data/talismans.json";
import classesData from "@/data/classes.json";

// Default Stats for Calculator
const STATS = ["vigor", "mind", "endurance", "strength", "dexterity", "intelligence", "faith", "arcane"];

export default function BuildEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buildId = searchParams.get("id"); // If present, we are editing

  // State: Build Metadata
  const [name, setName] = useState("New Build");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // State: Stats
  const [stats, setStats] = useState<Record<string, number>>({
    vigor: 10, mind: 10, endurance: 10, strength: 10, dexterity: 10, intelligence: 10, faith: 10, arcane: 10
  });
  const [level, setLevel] = useState(1);

  // State: Equipment
  const [equipment, setEquipment] = useState<{
    weapon_r: any;
    weapon_l: any;
    head: any;
    chest: any;
    arms: any;
    legs: any;
    talisman1: any;
    talisman2: any;
    talisman3: any;
    talisman4: any;
    startingClass: any;
  }>({
    weapon_r: null, weapon_l: null,
    head: null, chest: null, arms: null, legs: null,
    talisman1: null, talisman2: null, talisman3: null, talisman4: null,
    startingClass: null
  });

  // State: UI
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectorType, setSelectorType] = useState<any>("weapon");
  const [selectorTarget, setSelectorTarget] = useState<string>(""); // e.g. "weapon_r", "head"
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load existing build if ID is present
  useEffect(() => {
    if (buildId) {
      loadBuild(buildId);
    }
  }, [buildId]);

  // Recalculate Level when stats change (Base logic: Level = sum of stats - 79 (approx for wretch) - but depends on class)
  // For simplicity, we will just sum stats - 79 or use class base.
  // A robust level calculator requires knowing the base class stats.
  useEffect(() => {
    const sum = Object.values(stats).reduce((a, b) => a + b, 0);
    // Wretch starts at Level 1 with 10 in all (Total 80). So Level = Sum - 79.
    // We'll assume Wretch base for now unless class is selected.
    const base = equipment.startingClass ? 
        Number(equipment.startingClass.stats.level) - Object.values(equipment.startingClass.stats).reduce((a: any, b: any) => Number(a) + Number(b), 0) + Number(equipment.startingClass.stats.level) // This is complex math, let's simplify
        : 79; 
        
    // Correct formula: Level = CurrentTotal - BaseTotal + BaseLevel
    if (equipment.startingClass) {
        const baseTotal = Object.values(equipment.startingClass.stats)
            .filter((val) => !isNaN(Number(val))) // exclude "level" key if it's in there, oh wait stats object has level key
            .reduce((a: number, b: any) => a + Number(b), 0) - Number(equipment.startingClass.stats.level);
            
        setLevel(sum - baseTotal + Number(equipment.startingClass.stats.level));
    } else {
         setLevel(sum - 79); // Wretch default
    }

  }, [stats, equipment.startingClass]);

  const loadBuild = async (id: string) => {
    setLoading(true);
    const { data, error } = await supabase.from("builds").select("*").eq("id", id).single();
    if (data) {
      setName(data.name);
      setDescription(data.description || "");
      setIsPublic(data.is_public);
      setStats(data.stats);
      
      // Helper to find item by ID
      const find = (arr: any[], id: string) => arr.find(i => i.id === id) || null;
      
      setEquipment({
        weapon_r: find(weaponsData, data.weapon_r_id),
        weapon_l: find([...weaponsData, ...shieldsData], data.weapon_l_id), // Left hand can be weapon or shield
        head: find(armorsData, data.armor_head_id),
        chest: find(armorsData, data.armor_chest_id),
        arms: find(armorsData, data.armor_arms_id),
        legs: find(armorsData, data.armor_legs_id),
        talisman1: find(talismansData, data.talisman_1_id),
        talisman2: find(talismansData, data.talisman_2_id),
        talisman3: find(talismansData, data.talisman_3_id),
        talisman4: find(talismansData, data.talisman_4_id),
        startingClass: find(classesData, data.class_id)
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        alert("Please log in to save.");
        setSaving(false);
        return;
    }

    const payload = {
      user_id: user.id,
      name,
      description,
      is_public: isPublic,
      stats,
      weapon_r_id: equipment.weapon_r?.id,
      weapon_l_id: equipment.weapon_l?.id,
      armor_head_id: equipment.head?.id,
      armor_chest_id: equipment.chest?.id,
      armor_arms_id: equipment.arms?.id,
      armor_legs_id: equipment.legs?.id,
      talisman_1_id: equipment.talisman1?.id,
      talisman_2_id: equipment.talisman2?.id,
      talisman_3_id: equipment.talisman3?.id,
      talisman_4_id: equipment.talisman4?.id,
      class_id: equipment.startingClass?.id
    };

    let error;
    if (buildId) {
      ({ error } = await supabase.from("builds").update(payload).eq("id", buildId));
    } else {
      ({ error } = await supabase.from("builds").insert(payload));
    }

    if (error) {
      console.error(error);
      alert("Failed to save.");
    } else {
      router.push("/builds");
    }
    setSaving(false);
  };

  const openSelector = (type: string, target: string) => {
    setSelectorType(type);
    setSelectorTarget(target);
    setSelectorOpen(true);
  };

  const handleSelect = (item: any) => {
    if (selectorType === "class") {
        // Set base stats
        const newStats: any = {};
        Object.keys(stats).forEach(key => {
            // If current stat is lower than class base, raise it. 
            // Or just reset to class base? 
            // Let's reset to class base for now to simplify.
            newStats[key] = Number(item.stats[key]);
        });
        setStats(newStats);
    }

    setEquipment(prev => ({
        ...prev,
        [selectorTarget]: item
    }));
  };

  // Determine items to show in selector
  const getSelectorItems = () => {
    switch(selectorType) {
        case "weapon": return weaponsData;
        case "shield": return [...weaponsData, ...shieldsData]; // Left hand allows both
        case "armor": return armorsData.filter((a: any) => {
             if (selectorTarget === "head") return a.category.includes("Helm");
             if (selectorTarget === "chest") return a.category.includes("Chest");
             if (selectorTarget === "arms") return a.category.includes("Gauntlets");
             if (selectorTarget === "legs") return a.category.includes("Leg");
             return true;
        });
        case "talisman": return talismansData;
        case "class": return classesData;
        default: return [];
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border p-4 flex justify-between items-center">
         <div className="flex items-center gap-4">
            <Link href="/builds" className="p-2 hover:bg-muted rounded-full text-muted-foreground">
                <ArrowLeft />
            </Link>
            <div>
                <input 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="bg-transparent text-xl font-bold font-serif focus:outline-none focus:underline"
                />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Level {level}</span>
                    {equipment.startingClass && <span>• {equipment.startingClass.name}</span>}
                </div>
            </div>
         </div>
         <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-primary-foreground px-6 py-2 rounded font-bold hover:bg-accent-gold transition-colors flex items-center gap-2"
         >
            {saving ? <RefreshCw className="animate-spin" /> : <Save size={18} />}
            Save Build
         </button>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Stats & Class */}
        <div className="space-y-6">
            <div className="bg-muted/10 border border-border rounded-lg p-6">
                <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                    <User size={20} /> Character
                </h3>
                
                <button 
                    onClick={() => openSelector("class", "startingClass")}
                    className="w-full p-3 bg-background border border-border rounded mb-6 flex items-center gap-3 hover:border-primary transition-colors text-left"
                >
                    {equipment.startingClass ? (
                        <>
                            <img src={equipment.startingClass.image} className="w-10 h-10 rounded bg-black/20" />
                            <div>
                                <div className="font-bold">{equipment.startingClass.name}</div>
                                <div className="text-xs text-muted-foreground">Base Level {equipment.startingClass.stats.level}</div>
                            </div>
                        </>
                    ) : (
                        <span className="text-muted-foreground">Select Starting Class...</span>
                    )}
                </button>

                <div className="space-y-2">
                    {STATS.map(stat => (
                        <div key={stat} className="flex items-center justify-between">
                            <label className="text-sm uppercase text-muted-foreground font-bold w-24">{stat}</label>
                            <input 
                                type="number"
                                value={stats[stat]}
                                onChange={(e) => setStats({...stats, [stat]: Number(e.target.value)})}
                                className="w-20 bg-background border border-border rounded px-2 py-1 text-right font-mono focus:border-primary outline-none"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-muted/10 border border-border rounded-lg p-6">
                <h3 className="font-serif font-bold text-lg mb-4">Summary</h3>
                <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe your build strategy..."
                    className="w-full h-32 bg-background border border-border rounded p-3 text-sm resize-none focus:border-primary outline-none"
                />
                <div className="mt-4 flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        id="public"
                        checked={isPublic}
                        onChange={e => setIsPublic(e.target.checked)}
                    />
                    <label htmlFor="public" className="text-sm text-muted-foreground">Make public</label>
                </div>
            </div>
        </div>

        {/* Middle Col: Equipment (Weapons & Armor) */}
        <div className="space-y-6">
            
            {/* Weapons */}
            <div className="bg-muted/10 border border-border rounded-lg p-6">
                <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                    <Swords size={20} /> Armaments
                </h3>
                <div className="space-y-4">
                    {/* Right Hand */}
                    <div>
                        <label className="text-xs uppercase text-muted-foreground mb-1 block">Right Hand</label>
                        <EquipmentSlot 
                            item={equipment.weapon_r} 
                            placeholder="Right Hand Weapon"
                            onClick={() => openSelector("weapon", "weapon_r")}
                            onClear={() => setEquipment(prev => ({ ...prev, weapon_r: null }))}
                        />
                    </div>
                    {/* Left Hand */}
                    <div>
                        <label className="text-xs uppercase text-muted-foreground mb-1 block">Left Hand</label>
                        <EquipmentSlot 
                            item={equipment.weapon_l} 
                            placeholder="Left Hand / Shield"
                            onClick={() => openSelector("shield", "weapon_l")}
                            onClear={() => setEquipment(prev => ({ ...prev, weapon_l: null }))}
                        />
                    </div>
                </div>
            </div>

            {/* Armor */}
            <div className="bg-muted/10 border border-border rounded-lg p-6">
                <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                    <Shirt size={20} /> Armor
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <EquipmentSlot 
                        item={equipment.head} 
                        placeholder="Head"
                        onClick={() => openSelector("armor", "head")} 
                        onClear={() => setEquipment(prev => ({ ...prev, head: null }))}
                    />
                    <EquipmentSlot 
                        item={equipment.chest} 
                        placeholder="Chest"
                        onClick={() => openSelector("armor", "chest")} 
                        onClear={() => setEquipment(prev => ({ ...prev, chest: null }))}
                    />
                    <EquipmentSlot 
                        item={equipment.arms} 
                        placeholder="Arms"
                        onClick={() => openSelector("armor", "arms")} 
                        onClear={() => setEquipment(prev => ({ ...prev, arms: null }))}
                    />
                    <EquipmentSlot 
                        item={equipment.legs} 
                        placeholder="Legs"
                        onClick={() => openSelector("armor", "legs")} 
                        onClear={() => setEquipment(prev => ({ ...prev, legs: null }))}
                    />
                </div>
            </div>

        </div>

        {/* Right Col: Talismans & Calculations */}
        <div className="space-y-6">
            <div className="bg-muted/10 border border-border rounded-lg p-6">
                <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                    <Sparkles size={20} /> Talismans
                </h3>
                <div className="space-y-3">
                    <EquipmentSlot 
                        item={equipment.talisman1} 
                        placeholder="Talisman Slot 1"
                        onClick={() => openSelector("talisman", "talisman1")} 
                        onClear={() => setEquipment(prev => ({ ...prev, talisman1: null }))}
                    />
                    <EquipmentSlot 
                        item={equipment.talisman2} 
                        placeholder="Talisman Slot 2"
                        onClick={() => openSelector("talisman", "talisman2")} 
                        onClear={() => setEquipment(prev => ({ ...prev, talisman2: null }))}
                    />
                    <EquipmentSlot 
                        item={equipment.talisman3} 
                        placeholder="Talisman Slot 3"
                        onClick={() => openSelector("talisman", "talisman3")} 
                        onClear={() => setEquipment(prev => ({ ...prev, talisman3: null }))}
                    />
                    <EquipmentSlot 
                        item={equipment.talisman4} 
                        placeholder="Talisman Slot 4"
                        onClick={() => openSelector("talisman", "talisman4")} 
                        onClear={() => setEquipment(prev => ({ ...prev, talisman4: null }))}
                    />
                </div>
            </div>

            {/* Simple Stats Calc (Placeholder) */}
            <div className="bg-muted/10 border border-border rounded-lg p-6 opacity-70">
                <h3 className="font-serif font-bold text-lg mb-2">Est. Stats</h3>
                <div className="text-sm text-muted-foreground">
                    <p>Total Weight: {
                        (equipment.weapon_r?.weight || 0) + 
                        (equipment.weapon_l?.weight || 0) + 
                        (equipment.head?.weight || 0) + 
                        (equipment.chest?.weight || 0) + 
                        (equipment.arms?.weight || 0) + 
                        (equipment.legs?.weight || 0)
                    }</p>
                    {/* Poise and Damage Negation calculation would go here */}
                </div>
            </div>
        </div>

      </div>

      <ItemSelector 
        isOpen={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelect={handleSelect}
        items={getSelectorItems()}
        type={selectorType}
        title={selectorTarget}
      />
    </div>
  );
}

function EquipmentSlot({ item, placeholder, onClick, onClear }: any) {
    return (
        <div className="relative group">
            <button 
                onClick={onClick}
                className={cn(
                    "w-full p-3 rounded border text-left flex items-center gap-3 transition-all",
                    item ? "bg-background border-primary/40" : "bg-muted/20 border-dashed border-border hover:bg-muted/40"
                )}
            >
                {item ? (
                    <>
                        <div className="w-10 h-10 bg-black/20 rounded border border-border flex items-center justify-center overflow-hidden shrink-0">
                            {item.image && <img src={item.image} className="w-full h-full object-contain" />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="font-bold text-sm truncate">{item.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{item.category || item.effect}</div>
                        </div>
                    </>
                ) : (
                    <span className="text-sm text-muted-foreground">{placeholder}</span>
                )}
            </button>
            {item && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onClear(); }}
                    className="absolute top-1 right-1 p-1 rounded-full hover:bg-red-500/20 hover:text-red-500 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Clear slot"
                >
                    <RotateCcw size={14} />
                </button>
            )}
        </div>
    );
}

