import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAnimals, useAnimalDetails } from "@/hooks/useAnimals";
import { useAuth } from "@/hooks/useAuth";
import { AnimalTabs } from "@/components/AnimalTabs";
import { AnimalProfile } from "@/components/AnimalProfile";
import { AnimalSections } from "@/components/AnimalSections";
import { SearchBar } from "@/components/SearchBar";
import { AIChat } from "@/components/AIChat";
import { Button } from "@/components/ui/button";
import { PawPrint, Heart, Sparkles, Loader2, LogIn, LogOut, User, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Index() {
  const { data: animals = [], isLoading: animalsLoading } = useAnimals();
  const { user, isLoading: authLoading, roles, signOut, isAdmin, isModerator } = useAuth();
  const [activeAnimal, setActiveAnimal] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Set first animal as active when loaded
  useMemo(() => {
    if (animals.length > 0 && activeAnimal === null) {
      setActiveAnimal(animals[0].id);
    }
  }, [animals, activeAnimal]);

  const { data: animalDetails, isLoading: detailsLoading } = useAnimalDetails(activeAnimal);

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const matchesSearch = 
        animal.namn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (animal.vetenskapligt_namn?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (animal.beskrivning?.toLowerCase() || "").includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "all" || 
        animal.kategori.toLowerCase() === selectedCategory.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  }, [animals, searchQuery, selectedCategory]);

  const selectedAnimal = animalDetails?.animal || null;

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
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <Heart className="w-3 h-3 text-red-500" />
                <span>{animals.length} arter</span>
              </div>
              
              {/* Auth Section */}
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline max-w-[100px] truncate">
                        {user.user_metadata?.display_name || user.email?.split("@")[0]}
                      </span>
                      {isAdmin && <Shield className="w-3 h-3 text-amber-500" />}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Roll: {roles.length > 0 ? roles.join(", ") : "Användare"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(isAdmin || isModerator) && (
                      <>
                        <DropdownMenuItem className="text-amber-600">
                          <Shield className="w-4 h-4 mr-2" />
                          {isAdmin ? "Adminpanel" : "Moderatorvy"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logga ut
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Logga in</span>
                  </Button>
                </Link>
              )}
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
        isLoading={animalsLoading}
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
            <AIChat animalId={null} animalName={null} />
          </div>
        ) : detailsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : selectedAnimal ? (
          /* Animal Detail View */
          <div className="max-w-2xl mx-auto">
            <AnimalProfile 
              animal={selectedAnimal} 
              requirements={animalDetails?.requirements}
              warnings={animalDetails?.warnings}
            />
            <AnimalSections 
              animalId={selectedAnimal.id}
              requirements={animalDetails?.requirements}
              food={animalDetails?.food || []}
              diseases={animalDetails?.diseases || []}
              warnings={animalDetails?.warnings || []}
              checklists={animalDetails?.checklists || []}
            />
            
            {/* Animal-specific AI Chat */}
            <div className="mt-8">
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Chatta med {selectedAnimal.namn}-experten
              </h3>
              <AIChat animalId={selectedAnimal.id} animalName={selectedAnimal.namn} />
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Välj ett djur för att se information</p>
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
