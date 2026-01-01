import { useState, useMemo } from "react";
import { animals } from "@/data/animals";
import { AnimalTabs } from "@/components/AnimalTabs";
import { AnimalProfile } from "@/components/AnimalProfile";
import { AnimalSections } from "@/components/AnimalSections";
import { SearchBar } from "@/components/SearchBar";
import { AIChat } from "@/components/AIChat";
import { AnimalCard } from "@/components/AnimalCard";
import { PawPrint, Heart, Sparkles } from "lucide-react";

export default function Index() {
  const [activeAnimal, setActiveAnimal] = useState<string | null>(animals[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const selectedAnimal = useMemo(() => 
    animals.find((a) => a.id === activeAnimal) || null, 
    [activeAnimal]
  );

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const matchesSearch = 
        animal.namn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.vetenskapligt_namn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.beskrivning.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "all" || 
        animal.kategori.toLowerCase() === selectedCategory.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft">
                <PawPrint className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">
                  DjurData
                </h1>
                <p className="text-xs text-muted-foreground">
                  Din guide till ansvarsfull djurhållning
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Heart className="w-3 h-3 text-red-500" />
              <span>{animals.length} arter</span>
            </div>
          </div>
          
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </header>

      {/* Animal Tabs */}
      <AnimalTabs
        animals={filteredAnimals}
        activeAnimal={activeAnimal}
        onSelectAnimal={setActiveAnimal}
      />

      {/* Main Content */}
      <main className="container py-6">
        {activeAnimal === null ? (
          /* AI Chat View */
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium text-sm">AI-Assistent</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Fråga mig om djurvård!
              </h2>
              <p className="text-muted-foreground">
                Jag svarar baserat på all data i appen och hjälper dig med skötselråd.
              </p>
            </div>
            <AIChat selectedAnimal={null} animals={animals} />
          </div>
        ) : selectedAnimal ? (
          /* Animal Detail View */
          <div className="max-w-2xl mx-auto">
            <AnimalProfile animal={selectedAnimal} />
            <AnimalSections animal={selectedAnimal} />
            
            {/* Animal-specific AI Chat */}
            <div className="mt-8">
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Chatta med {selectedAnimal.namn}-experten
              </h3>
              <AIChat selectedAnimal={selectedAnimal} animals={animals} />
            </div>
          </div>
        ) : (
          /* Animal Grid View (when search yields results but none selected) */
          <div>
            <h2 className="font-display text-xl font-bold mb-4">
              {filteredAnimals.length} djur hittade
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAnimals.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  onClick={() => setActiveAnimal(animal.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="container py-6 text-center">
          <p className="text-sm text-muted-foreground">
            🐾 DjurData — Säker information för lyckliga husdjur
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            ⚠️ Kontakta alltid veterinär vid akuta hälsoproblem
          </p>
        </div>
      </footer>
    </div>
  );
}
