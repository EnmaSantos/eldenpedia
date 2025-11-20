"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Scale, BicepsFlexed, Swords } from "lucide-react";
import { cn } from "@/lib/utils";
import weaponsData from "@/data/weapons.json";
import { Weapon } from "@/types/weapon";

export default function WeaponDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const weapon = weaponsData.find((w: any) => w.id === id) as Weapon | undefined;

  if (!weapon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Weapon Not Found</h1>
        <Link href="/weapons" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Return to Arsenal
        </Link>
      </div>
    );
  }

  // Helper for rendering stat blocks
  const StatBlock = ({ label, value, color }: { label: string, value: number | string, color?: string }) => (
    <div className="flex flex-col items-center p-3 bg-muted/30 rounded border border-border/50">
      <span className="text-xs uppercase text-muted-foreground font-bold mb-1">{label}</span>
      <span className={cn("font-mono text-lg font-bold", color)}>{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-5xl mx-auto pb-20">
      {/* Navigation */}
      <Link href="/weapons" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft size={20} /> Back to Arsenal
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left Column: Image & Core Info */}
        <div className="space-y-6">
          <div className="aspect-square bg-black/20 rounded-lg border border-border flex items-center justify-center p-8 relative overflow-hidden group">
            {/* Background decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />
            
            {weapon.image ? (
                <img 
                    src={weapon.image} 
                    alt={weapon.name} 
                    className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110" 
                />
            ) : (
                <Swords size={64} className="text-muted-foreground opacity-20" />
            )}

            {weapon.isSomber && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-zinc-900/90 text-zinc-300 text-xs uppercase font-bold px-2 py-1 rounded border border-zinc-700 shadow-lg backdrop-blur-sm">
                    <Sparkles size={12} className="text-purple-400" /> Unique
                </div>
            )}
          </div>

          <div className="bg-muted/10 border border-border rounded-lg p-6">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">{weapon.name}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <span className="bg-muted px-2 py-0.5 rounded border border-border">{weapon.category}</span>
                <span>Weight: <span className="font-mono text-foreground">{weapon.weight}</span></span>
            </div>
            <p className="italic text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4">
                "{weapon.description}"
            </p>
          </div>
        </div>

        {/* Right Column: Stats & Tables */}
        <div className="space-y-8">
            
            {/* Attack Power */}
            <div>
                <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2 text-primary">
                    <Swords size={20} /> Attack Power
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    <StatBlock label="Phy" value={weapon.damage.physical} />
                    <StatBlock label="Mag" value={weapon.damage.magic || "-"} color="text-blue-400" />
                    <StatBlock label="Fire" value={weapon.damage.fire || "-"} color="text-red-400" />
                    <StatBlock label="Ligt" value={weapon.damage.lightning || "-"} color="text-yellow-400" />
                    <StatBlock label="Holy" value={weapon.damage.holy || "-"} color="text-amber-200" />
                    <StatBlock label="Crit" value={weapon.damage.critical} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Scaling */}
                <div>
                    <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2 text-primary">
                        <Scale size={20} /> Attribute Scaling
                    </h3>
                    <div className="bg-muted/10 border border-border rounded-lg overflow-hidden">
                        {weapon.scaling.map((s) => (
                            <div key={s.attribute} className="flex justify-between items-center p-3 border-b border-border/50 last:border-0">
                                <span className="text-sm font-bold text-muted-foreground">{s.attribute}</span>
                                <span className={cn(
                                    "font-mono font-bold",
                                    s.tier === "S" ? "text-accent-gold" :
                                    s.tier === "A" ? "text-primary" :
                                    s.tier === "-" ? "text-muted-foreground/30" : "text-foreground"
                                )}>
                                    {s.tier}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Requirements */}
                <div>
                    <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2 text-primary">
                        <BicepsFlexed size={20} /> Requirements
                    </h3>
                    <div className="bg-muted/10 border border-border rounded-lg overflow-hidden">
                        {weapon.requirements.map((r) => (
                            <div key={r.attribute} className="flex justify-between items-center p-3 border-b border-border/50 last:border-0">
                                <span className="text-sm font-bold text-muted-foreground">{r.attribute}</span>
                                <span className={cn(
                                    "font-mono font-bold",
                                    r.value > 0 ? "text-foreground" : "text-muted-foreground/30"
                                )}>
                                    {r.value > 0 ? r.value : "-"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

