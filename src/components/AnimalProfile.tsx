import { DbAnimal, DbRequirements } from "@/hooks/useAnimals";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Ruler, Scale, Calendar } from "lucide-react";

interface AnimalProfileProps {
  animal: DbAnimal;
  requirements?: DbRequirements | null;
}

const themeClasses: Record<string, { bg: string; card: string; accent: string }> = {
  gecko: { bg: "bg-animal-gecko-bg", card: "bg-animal-gecko-main/30", accent: "bg-animal-gecko-accent" },
  turtle: { bg: "bg-animal-turtle-bg", card: "bg-animal-turtle-main/30", accent: "bg-animal-turtle-accent" },
  hamster: { bg: "bg-animal-hamster-bg", card: "bg-animal-hamster-main/30", accent: "bg-animal-hamster-accent" },
  rabbit: { bg: "bg-animal-rabbit-bg", card: "bg-animal-rabbit-main/20", accent: "bg-primary" },
  fish: { bg: "bg-animal-fish-bg", card: "bg-animal-fish-main/30", accent: "bg-animal-fish-accent" },
  bird: { bg: "bg-animal-bird-bg", card: "bg-animal-bird-main/30", accent: "bg-animal-bird-accent" },
  coati: { bg: "bg-amber-50 dark:bg-amber-950/20", card: "bg-amber-100/50 dark:bg-amber-900/30", accent: "bg-amber-500" },
  otter: { bg: "bg-cyan-50 dark:bg-cyan-950/20", card: "bg-cyan-100/50 dark:bg-cyan-900/30", accent: "bg-cyan-500" },
  ferret: { bg: "bg-stone-50 dark:bg-stone-950/20", card: "bg-stone-100/50 dark:bg-stone-900/30", accent: "bg-stone-500" },
};

export function AnimalProfile({ animal, requirements }: AnimalProfileProps) {
  const theme = themeClasses[animal.theme || "gecko"] || themeClasses.gecko;

  // Build info items for the grid
  const infoItems = [
    { label: "Kategori", value: animal.kategori, icon: "🐾" },
    { label: "Ursprung", value: animal.ursprung, icon: "🌍" },
    { label: "Livslängd", value: animal.livslängd_år ? `${animal.livslängd_år} år` : null, icon: "⏳" },
    { label: "Storlek", value: animal.storlek, icon: "📏" },
    { label: "Vikt", value: animal.vikt, icon: "⚖️" },
    { label: "Aktivitet", value: animal.aktivitet, icon: "🕐" },
    { label: "Svårighetsgrad", value: animal.svårighet, icon: "📊" },
  ].filter(item => item.value);

  return (
    <div className={`${theme.bg} rounded-2xl p-6 mb-6 animate-fade-in`}>
      {/* Header with emoji and name */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`${theme.card} w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-soft`}>
          {animal.emoji || "🐾"}
        </div>
        
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            🐾 {animal.namn}
          </h1>
          {animal.vetenskapligt_namn && (
            <p className="text-sm text-muted-foreground italic mb-3">
              {animal.vetenskapligt_namn}
            </p>
          )}
        </div>
      </div>
      
      {/* Info Grid - Always visible */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
        {infoItems.map((item, index) => (
          <div 
            key={index} 
            className="bg-card/60 rounded-lg p-3 border border-border/50"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{item.icon}</span>
              <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
            </div>
            <p className={`text-sm font-semibold ${
              item.label === "Svårighetsgrad" 
                ? item.value === "Nybörjare" 
                  ? "text-green-600 dark:text-green-400" 
                  : item.value === "Medel" 
                    ? "text-amber-600 dark:text-amber-400" 
                    : "text-red-600 dark:text-red-400"
                : "text-foreground"
            }`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
      
      {/* Description - Always visible */}
      {animal.beskrivning && (
        <div className="bg-card/40 rounded-lg p-4 border border-border/30">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Kort beskrivning</h3>
          <p className="text-foreground/90 text-sm leading-relaxed">
            {animal.beskrivning}
          </p>
        </div>
      )}
    </div>
  );
}
