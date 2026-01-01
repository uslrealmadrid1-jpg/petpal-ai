import { useRef } from "react";
import { DbAnimal } from "@/hooks/useAnimals";
import { cn } from "@/lib/utils";
import { Bot, ChevronLeft, ChevronRight } from "lucide-react";

interface AnimalTabsProps {
  animals: DbAnimal[];
  activeAnimal: string | null;
  onSelectAnimal: (id: string | null) => void;
  isLoading?: boolean;
}

const themeColors: Record<string, { bg: string; text: string; active: string }> = {
  gecko: { bg: "bg-animal-gecko-main", text: "text-animal-gecko-text", active: "ring-animal-gecko-accent" },
  turtle: { bg: "bg-animal-turtle-main", text: "text-animal-turtle-text", active: "ring-animal-turtle-accent" },
  hamster: { bg: "bg-animal-hamster-main", text: "text-animal-hamster-text", active: "ring-animal-hamster-accent" },
  rabbit: { bg: "bg-animal-rabbit-bg", text: "text-animal-rabbit-text", active: "ring-primary" },
  fish: { bg: "bg-animal-fish-main", text: "text-animal-fish-text", active: "ring-animal-fish-accent" },
  bird: { bg: "bg-animal-bird-main", text: "text-animal-bird-text", active: "ring-animal-bird-accent" },
};

export function AnimalTabs({ animals, activeAnimal, onSelectAnimal, isLoading }: AnimalTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 150;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container py-2">
          <div className="flex items-center gap-1">
            <div className="h-7 w-7 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex gap-1.5 overflow-hidden flex-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-7 w-24 rounded-full bg-muted animate-pulse shrink-0"
                />
              ))}
            </div>
            <div className="h-7 w-7 rounded-full bg-muted animate-pulse shrink-0" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container py-2">
        <div className="flex items-center gap-1">
          {/* Vänster pil */}
          <button
            onClick={() => scroll("left")}
            className="shrink-0 w-7 h-7 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Scrolla vänster"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Tabbar */}
          <div
            ref={scrollRef}
            className="flex gap-1.5 overflow-x-auto scrollbar-hide flex-1"
          >
            {animals.map((animal) => {
              const theme = themeColors[animal.theme || "gecko"] || themeColors.gecko;
              const isActive = activeAnimal === animal.id;
              
              return (
                <button
                  key={animal.id}
                  onClick={() => onSelectAnimal(animal.id)}
                  className={cn(
                    "tab-animal-compact shrink-0 border-2 border-transparent",
                    theme.bg,
                    theme.text,
                    isActive && `ring-2 ${theme.active} ring-offset-1 ring-offset-background`
                  )}
                >
                  <span className="text-sm">{animal.emoji || "🐾"}</span>
                  <span className="font-display font-medium text-xs">{animal.namn}</span>
                </button>
              );
            })}
            
            <button
              onClick={() => onSelectAnimal(null)}
              className={cn(
                "tab-animal-compact shrink-0 bg-primary text-primary-foreground border-2 border-transparent",
                activeAnimal === null && "ring-2 ring-primary ring-offset-1 ring-offset-background"
              )}
            >
              <Bot className="w-3 h-3" />
              <span className="font-display font-medium text-xs">AI-Assistent</span>
            </button>
          </div>

          {/* Höger pil */}
          <button
            onClick={() => scroll("right")}
            className="shrink-0 w-7 h-7 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Scrolla höger"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
