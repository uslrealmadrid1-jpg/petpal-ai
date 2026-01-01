import { Animal } from "@/data/animals";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface AnimalCardProps {
  animal: Animal;
  onClick: () => void;
}

const themeClasses: Record<string, { bg: string; border: string }> = {
  gecko: { bg: "bg-animal-gecko-bg", border: "border-animal-gecko-main" },
  turtle: { bg: "bg-animal-turtle-bg", border: "border-animal-turtle-main" },
  hamster: { bg: "bg-animal-hamster-bg", border: "border-animal-hamster-main" },
  rabbit: { bg: "bg-animal-rabbit-bg", border: "border-primary/30" },
  fish: { bg: "bg-animal-fish-bg", border: "border-animal-fish-main" },
  bird: { bg: "bg-animal-bird-bg", border: "border-animal-bird-main" },
};

export function AnimalCard({ animal, onClick }: AnimalCardProps) {
  const theme = themeClasses[animal.theme] || themeClasses.gecko;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left animal-card ${theme.bg} border-2 ${theme.border} hover:shadow-elevated transition-all duration-300`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{animal.emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-foreground">{animal.namn}</h3>
          <p className="text-xs text-muted-foreground italic truncate">
            {animal.vetenskapligt_namn}
          </p>
          
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge variant="secondary" className="text-xs">
              {animal.kategori}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-xs
                ${animal.svårighet === 'Nybörjare' ? 'border-green-500 text-green-700' : ''}
                ${animal.svårighet === 'Medel' ? 'border-amber-500 text-amber-700' : ''}
                ${animal.svårighet === 'Avancerad' ? 'border-red-500 text-red-700' : ''}
              `}
            >
              {animal.svårighet}
            </Badge>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {animal.beskrivning}
          </p>
          
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Livslängd: {animal.livslängd_år} år</span>
          </div>
        </div>
      </div>
    </button>
  );
}
