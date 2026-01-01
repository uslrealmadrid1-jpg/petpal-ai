import { Animal } from "@/data/animals";
import { Badge } from "@/components/ui/badge";
import { Clock, Thermometer, Droplets, Sun, Home, AlertTriangle } from "lucide-react";

interface AnimalProfileProps {
  animal: Animal;
}

const themeClasses: Record<string, { bg: string; card: string; accent: string }> = {
  gecko: { bg: "bg-animal-gecko-bg", card: "bg-animal-gecko-main/30", accent: "bg-animal-gecko-accent" },
  turtle: { bg: "bg-animal-turtle-bg", card: "bg-animal-turtle-main/30", accent: "bg-animal-turtle-accent" },
  hamster: { bg: "bg-animal-hamster-bg", card: "bg-animal-hamster-main/30", accent: "bg-animal-hamster-accent" },
  rabbit: { bg: "bg-animal-rabbit-bg", card: "bg-animal-rabbit-main/20", accent: "bg-primary" },
  fish: { bg: "bg-animal-fish-bg", card: "bg-animal-fish-main/30", accent: "bg-animal-fish-accent" },
  bird: { bg: "bg-animal-bird-bg", card: "bg-animal-bird-main/30", accent: "bg-animal-bird-accent" },
};

export function AnimalProfile({ animal }: AnimalProfileProps) {
  const theme = themeClasses[animal.theme] || themeClasses.gecko;

  return (
    <div className={`${theme.bg} rounded-2xl p-6 mb-6 animate-fade-in`}>
      <div className="flex items-start gap-4">
        <div className={`${theme.card} w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-soft`}>
          {animal.emoji}
        </div>
        
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            {animal.namn}
          </h1>
          <p className="text-sm text-muted-foreground italic mb-3">
            {animal.vetenskapligt_namn}
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="font-medium">
              {animal.kategori}
            </Badge>
            <Badge 
              variant="outline" 
              className={`
                ${animal.svårighet === 'Nybörjare' ? 'border-green-500 text-green-700' : ''}
                ${animal.svårighet === 'Medel' ? 'border-amber-500 text-amber-700' : ''}
                ${animal.svårighet === 'Avancerad' ? 'border-red-500 text-red-700' : ''}
              `}
            >
              {animal.svårighet}
            </Badge>
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              {animal.aktivitet}
            </Badge>
          </div>
        </div>
      </div>
      
      <p className="mt-4 text-foreground/80">
        {animal.beskrivning}
      </p>
      
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-lg">⏳</span>
          <span>Livslängd: <strong className="text-foreground">{animal.livslängd_år} år</strong></span>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        <div className="bg-card/50 rounded-lg p-3 text-center">
          <Thermometer className="w-5 h-5 mx-auto mb-1 text-red-500" />
          <p className="text-xs text-muted-foreground">Temperatur</p>
          <p className="text-sm font-medium">{animal.skötsel.temperatur.split(',')[0]}</p>
        </div>
        <div className="bg-card/50 rounded-lg p-3 text-center">
          <Droplets className="w-5 h-5 mx-auto mb-1 text-blue-500" />
          <p className="text-xs text-muted-foreground">Fuktighet</p>
          <p className="text-sm font-medium">{animal.skötsel.fuktighet}</p>
        </div>
        <div className="bg-card/50 rounded-lg p-3 text-center">
          <Sun className="w-5 h-5 mx-auto mb-1 text-amber-500" />
          <p className="text-xs text-muted-foreground">Belysning</p>
          <p className="text-sm font-medium truncate">{animal.skötsel.belysning.split(' ')[0]}</p>
        </div>
        <div className="bg-card/50 rounded-lg p-3 text-center">
          <Home className="w-5 h-5 mx-auto mb-1 text-primary" />
          <p className="text-xs text-muted-foreground">Bostad</p>
          <p className="text-sm font-medium truncate">{animal.skötsel.bostad.split(' ')[0]}</p>
        </div>
      </div>
      
      {/* Warnings Banner */}
      {animal.varningar.length > 0 && (
        <div className="mt-5 bg-destructive/10 border border-destructive/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-display font-semibold text-sm">Viktigt att veta</span>
          </div>
          <ul className="text-sm text-foreground/80 space-y-1">
            {animal.varningar.slice(0, 2).map((warning, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-destructive">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
