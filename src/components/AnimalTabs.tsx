import { Animal } from "@/data/animals";
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";

interface AnimalTabsProps {
  animals: Animal[];
  activeAnimal: string | null;
  onSelectAnimal: (id: string | null) => void;
}

const themeColors: Record<string, { bg: string; text: string; active: string }> = {
  gecko: { bg: "bg-animal-gecko-main", text: "text-animal-gecko-text", active: "ring-animal-gecko-accent" },
  turtle: { bg: "bg-animal-turtle-main", text: "text-animal-turtle-text", active: "ring-animal-turtle-accent" },
  hamster: { bg: "bg-animal-hamster-main", text: "text-animal-hamster-text", active: "ring-animal-hamster-accent" },
  rabbit: { bg: "bg-animal-rabbit-bg", text: "text-animal-rabbit-text", active: "ring-primary" },
  fish: { bg: "bg-animal-fish-main", text: "text-animal-fish-text", active: "ring-animal-fish-accent" },
  bird: { bg: "bg-animal-bird-main", text: "text-animal-bird-text", active: "ring-animal-bird-accent" },
};

export function AnimalTabs({ animals, activeAnimal, onSelectAnimal }: AnimalTabsProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {animals.map((animal) => {
            const theme = themeColors[animal.theme] || themeColors.gecko;
            const isActive = activeAnimal === animal.id;
            
            return (
              <button
                key={animal.id}
                onClick={() => onSelectAnimal(animal.id)}
                className={cn(
                  "tab-animal shrink-0 border-2 border-transparent",
                  theme.bg,
                  theme.text,
                  isActive && `ring-2 ${theme.active} ring-offset-2 ring-offset-background`
                )}
              >
                <span className="text-lg">{animal.emoji}</span>
                <span className="font-display font-semibold text-sm">{animal.namn}</span>
              </button>
            );
          })}
          
          <button
            onClick={() => onSelectAnimal(null)}
            className={cn(
              "tab-animal shrink-0 bg-primary text-primary-foreground border-2 border-transparent",
              activeAnimal === null && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
          >
            <Bot className="w-4 h-4" />
            <span className="font-display font-semibold text-sm">AI-Assistent</span>
          </button>
        </div>
      </div>
    </div>
  );
}
