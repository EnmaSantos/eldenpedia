import { Sword, Map, Skull, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-20 gap-12 text-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(194,155,71,0.1),transparent_70%)] pointer-events-none" />
      
      {/* Hero Section */}
      <header className="z-10 flex flex-col items-center gap-6 max-w-4xl">
        <h1 className="font-serif text-5xl sm:text-7xl font-bold text-primary tracking-wider drop-shadow-lg">
          ELDEN PEDIA
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl font-light tracking-wide">
          The Lands Between are vast and unforgiving. <br/>
          Navigate the fog, compare your arsenal, and find your path.
        </p>
      </header>

      {/* Main Actions Grid */}
      <div className="z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl mt-8">
        
        {/* Card 1: Weapon Comparison */}
        <Link 
          href="/weapons"
          className="group relative flex flex-col items-center p-8 border border-border bg-muted/30 rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-all duration-300"
        >
          <div className="p-4 rounded-full bg-background border border-border mb-4 group-hover:border-primary group-hover:text-primary transition-colors">
            <Sword size={32} strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-2xl mb-2 text-foreground group-hover:text-primary transition-colors">
            The Arsenal
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Compare weapons, calculate scaling, and optimize your build.
          </p>
          <div className="mt-auto flex items-center text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary">
            Enter Armory <ChevronRight size={14} className="ml-1" />
          </div>
        </Link>

        {/* Card 2: Progression Guide */}
        <Link 
          href="/guide"
          className="group relative flex flex-col items-center p-8 border border-border bg-muted/30 rounded-lg hover:bg-muted/50 hover:border-primary/50 transition-all duration-300"
        >
          <div className="p-4 rounded-full bg-background border border-border mb-4 group-hover:border-primary group-hover:text-primary transition-colors">
            <Map size={32} strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-2xl mb-2 text-foreground group-hover:text-primary transition-colors">
            The Path
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Find where to go next based on your level and progress.
          </p>
          <div className="mt-auto flex items-center text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary">
            View Map <ChevronRight size={14} className="ml-1" />
          </div>
        </Link>

      </div>

      {/* Footer Quote */}
      <footer className="mt-16 text-sm text-muted-foreground/60 italic font-serif">
        "Arise now, ye Tarnished..."
      </footer>
    </div>
  );
}
