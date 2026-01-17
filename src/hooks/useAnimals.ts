import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbAnimal {
  id: string;
  namn: string;
  vetenskapligt_namn: string | null;
  emoji: string | null;
  kategori: "Reptil" | "Däggdjur" | "Fågel" | "Groddjur" | "Kräftdjur" | "Fisk";
  svårighet: "Nybörjare" | "Medel" | "Avancerad" | null;
  aktivitet: "Dagaktiv" | "Nattaktiv" | "Skymningsaktiv" | null;
  livslängd_år: string | null;
  beskrivning: string | null;
  theme: string | null;
  ursprung: string | null;
  storlek: string | null;
  vikt: string | null;
}

export interface DbRequirements {
  temperatur: string | null;
  fuktighet: string | null;
  belysning: string | null;
  substrat: string | null;
  bostad: string | null;
  vatten_dryck: string | null;
  vatten_behandling: string | null;
  beteende_aktivitet: string | null;
  beteende_social: string | null;
  beteende_lek: string | null;
  aktivitet_vaknar: string | null;
  aktivitet_sover: string | null;
  aktivitet_timmar: string | null;
}

export interface DbFood {
  id: string;
  typ: string;
  frekvens: string | null;
  mängd: string | null;
}

export interface DbDisease {
  id: string;
  namn: string;
  symptom: string[] | null;
  åtgärd: string | null;
}

export interface DbWarning {
  id: string;
  varning: string;
}

export interface DbChecklist {
  id: string;
  typ: string;
  item: string;
  sort_order: number | null;
}

export function useAnimals() {
  return useQuery({
    queryKey: ["animals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("animals")
        .select("*")
        .order("namn");
      
      if (error) throw error;
      return data as DbAnimal[];
    },
  });
}

export function useAnimalDetails(animalId: string | null) {
  return useQuery({
    queryKey: ["animal-details", animalId],
    enabled: !!animalId,
    queryFn: async () => {
      if (!animalId) return null;

      // Fetch animal
      const { data: animal, error: animalError } = await supabase
        .from("animals")
        .select("*")
        .eq("id", animalId)
        .single();

      if (animalError) throw animalError;

      // Fetch requirements
      const { data: requirements } = await supabase
        .from("animal_requirements")
        .select("*")
        .eq("animal_id", animalId)
        .maybeSingle();

      // Fetch food
      const { data: food } = await supabase
        .from("animal_food")
        .select("*")
        .eq("animal_id", animalId);

      // Fetch diseases
      const { data: diseases } = await supabase
        .from("animal_diseases")
        .select("*")
        .eq("animal_id", animalId);

      // Fetch warnings
      const { data: warnings } = await supabase
        .from("animal_warnings")
        .select("*")
        .eq("animal_id", animalId);

      // Fetch checklists
      const { data: checklists } = await supabase
        .from("checklist_templates")
        .select("*")
        .eq("animal_id", animalId)
        .order("sort_order");

      return {
        animal: animal as DbAnimal,
        requirements: requirements as DbRequirements | null,
        food: (food || []) as DbFood[],
        diseases: (diseases || []) as DbDisease[],
        warnings: (warnings || []) as DbWarning[],
        checklists: (checklists || []) as DbChecklist[],
      };
    },
  });
}
