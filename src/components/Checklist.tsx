import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RotateCcw, ShoppingCart, Calendar, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistProps {
  type: "inköp" | "daglig" | "veckovis";
  items: string[];
  animalId: string;
}

const typeConfig = {
  inköp: { icon: ShoppingCart, label: "Inköpslista", color: "text-primary" },
  daglig: { icon: Calendar, label: "Dagliga rutiner", color: "text-amber-600" },
  veckovis: { icon: CalendarDays, label: "Veckorutiner", color: "text-blue-600" },
};

export function Checklist({ type, items, animalId }: ChecklistProps) {
  const storageKey = `checklist-${animalId}-${type}`;
  
  const [checkedItems, setCheckedItems] = useState<Set<number>>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const toggleItem = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
    localStorage.setItem(storageKey, JSON.stringify([...newChecked]));
  };

  const resetAll = () => {
    setCheckedItems(new Set());
    localStorage.removeItem(storageKey);
  };

  const config = typeConfig[type];
  const Icon = config.icon;
  const progress = Math.round((checkedItems.size / items.length) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4", config.color)} />
          <span className="text-sm font-medium text-muted-foreground">{config.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {checkedItems.size}/{items.length}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetAll}
            className="h-7 px-2 text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Återställ
          </Button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="space-y-2">
        {items.map((item, index) => {
          const isChecked = checkedItems.has(index);
          return (
            <label
              key={index}
              className={cn(
                "checklist-item cursor-pointer",
                isChecked && "bg-primary/10"
              )}
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => toggleItem(index)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className={cn(
                "text-sm flex-1 transition-all",
                isChecked && "line-through text-muted-foreground"
              )}>
                {item}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
