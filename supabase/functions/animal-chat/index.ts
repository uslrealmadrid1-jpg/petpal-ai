import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, animalId, isGlobalAI } = await req.json();
    console.log("Received chat request:", { messageCount: messages?.length, animalId, isGlobalAI });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create Supabase client to fetch animal data
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build context from database
    let animalContext = "";
    let systemPrompt = "";
    
    if (isGlobalAI) {
      // Global AI mode - fetch all animals for broad knowledge
      console.log("Global AI mode - fetching all animals");
      const { data: allAnimals } = await supabase
        .from("animals")
        .select("*");

      if (allAnimals && allAnimals.length > 0) {
        animalContext = `ALLA DJUR I DATABASEN (${allAnimals.length} arter):
${allAnimals.map((a: any) => `${a.emoji || "🐾"} ${a.namn} (${a.vetenskapligt_namn || "Okänt"}) - Kategori: ${a.kategori}, Svårighet: ${a.svårighet || "Ej angiven"}`).join("\n")}`;
      }

      systemPrompt = `Du är en GLOBAL djur-AI för DjurData-appen. Du är INTE kopplad till ett specifikt djur. 

DITT UPPDRAG:
- Svara generellt om ALLA djur i världen
- Jämför olika djurarter (skillnader, likheter, svårighetsgrad)
- Ge bred kunskap om djurhållning
- Hjälp användare välja rätt djur baserat på deras situation
- Svara på frågor som spänner över flera arter

GRUNDREGLER:
1. Du kan diskutera ALLA djur, inte bara de i databasen.
2. För specifika skötselråd om ett djur i appen, uppmana användaren att välja det djuret.
3. Svara på svenska, pedagogiskt och tydligt.
4. Jämför gärna djur när det är relevant (t.ex. "Leopardgecko vs. Skäggagam").
5. Ge ALDRIG medicinska råd som ersätter veterinär.
6. Prioritera ALLTID djurets hälsa och säkerhet.

SAKER DU KAN HJÄLPA MED:
- "Vilket djur passar för nybörjare?"
- "Vad är skillnaden mellan en hamster och en kanin?"
- "Vilka djur kräver minst utrymme?"
- "Kan jag ha flera arter tillsammans?"
- "Vilket reptildjur rekommenderar du?"
- "Vad kostar det ungefär att ha en fågel?"

${animalContext}

Svara alltid hjälpsamt och uppmuntra användaren att välja ett specifikt djur i appen för detaljerad information.`;

    } else if (animalId) {
      console.log("Fetching animal data for:", animalId);
      
      // Fetch animal data
      const { data: animal } = await supabase
        .from("animals")
        .select("*")
        .eq("id", animalId)
        .maybeSingle();

      if (animal) {
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

        animalContext = `
DJURDATA FÖR ${animal.namn?.toUpperCase() || "OKÄNT DJUR"}:
- Vetenskapligt namn: ${animal.vetenskapligt_namn || "Ej angivet"}
- Kategori: ${animal.kategori || "Ej angiven"}
- Svårighetsgrad: ${animal.svårighet || "Ej angiven"}
- Aktivitet: ${animal.aktivitet || "Ej angiven"}
- Livslängd: ${animal.livslängd_år || "Ej angiven"} år
- Beskrivning: ${animal.beskrivning || "Ingen beskrivning"}

${requirements ? `SKÖTSELKRAV:
- Temperatur: ${requirements.temperatur || "Ej angivet"}
- Fuktighet: ${requirements.fuktighet || "Ej angivet"}
- Belysning: ${requirements.belysning || "Ej angivet"}
- Substrat: ${requirements.substrat || "Ej angivet"}
- Bostad: ${requirements.bostad || "Ej angivet"}
- Vatten: ${requirements.vatten_dryck || "Ej angivet"}

AKTIVITETSCYKEL:
- Vaknar: ${requirements.aktivitet_vaknar || "Ej angivet"}
- Sover: ${requirements.aktivitet_sover || "Ej angivet"}
- Aktiva timmar: ${requirements.aktivitet_timmar || "Ej angivet"}

BETEENDE:
- Aktivitet: ${requirements.beteende_aktivitet || "Ej angivet"}
- Socialt: ${requirements.beteende_social || "Ej angivet"}
- Lek: ${requirements.beteende_lek || "Ej angivet"}` : ""}

${food && food.length > 0 ? `MATGUIDE:
${food.map(f => `- ${f.typ}: ${f.mängd} (${f.frekvens})`).join("\n")}` : ""}

${diseases && diseases.length > 0 ? `VANLIGA SJUKDOMAR:
${diseases.map(d => `- ${d.namn}: Symptom: ${d.symptom?.join(", ") || "Okänt"}. Åtgärd: ${d.åtgärd || "Kontakta veterinär"}`).join("\n")}` : ""}

${warnings && warnings.length > 0 ? `VARNINGAR (VIKTIGT!):
${warnings.map(w => `⚠️ ${w.varning}`).join("\n")}` : ""}

${checklists && checklists.length > 0 ? `CHECKLISTOR:
Inköp: ${checklists.filter(c => c.typ === "inköp").map(c => c.item).join(", ") || "Inga"}
Dagliga rutiner: ${checklists.filter(c => c.typ === "daglig").map(c => c.item).join(", ") || "Inga"}
Veckorutiner: ${checklists.filter(c => c.typ === "veckovis").map(c => c.item).join(", ") || "Inga"}` : ""}
`;
        console.log("Built animal context, length:", animalContext.length);
      }

      systemPrompt = `Du är en intelligent assistent för DjurData-appen. Ditt jobb är att ge korrekt, säker och användbar information om alla djur i appen, rekommendera produkter, skapa dagliga rutiner och checklistor, samt hjälpa användare på ett tryggt sätt.

GRUNDREGLER (MÅSTE FÖLJAS):
1. Använd ALLTID databasens djurdata som primär källa.
2. Om information saknas: säg tydligt "Den informationen finns inte i databasen."
3. Ge ALDRIG medicinska råd som ersätter veterinär.
4. Prioritera ALLTID djurets hälsa och säkerhet.
5. Svara på svenska, kort och tydligt.
6. Varna tydligt vid potentiellt farliga fel (fel temperatur, UV-brist, giftig mat etc.).
7. Anpassa svaret efter om användaren verkar vara nybörjare eller erfaren.

AI-FUNKTIONER DU KAN UTFÖRA:
- Analysera djurens behov och ge skötselråd
- Skapa inköpslistor baserat på djurets krav
- Generera dagliga och veckovisa rutiner
- Identifiera vanliga misstag och risker
- Ge produktrekommendationer baserat på djurets behov
- Föreslå mat, skötsel, hälsovård och miljökrav
- Svara på frågor om livslängd, beteende och habitat

SÄKERHETSREGLER:
- Ge ALDRIG exakta doser av mediciner - hänvisa till veterinär
- Rekommendera ALLTID veterinärbesök vid sjukdomssymptom
- Varna om potentiellt giftiga växter, mat eller material
- Informera om temperatur- och fuktighetskrav som är kritiska

${animalContext}

Svara alltid med korrekt fakta baserad på databasen. Om du inte har information, säg det istället för att gissa. Avsluta gärna med en relevant tips eller varning.`;

    } else {
      // Fallback - no animal, no global AI flag
      const { data: allAnimals } = await supabase
        .from("animals")
        .select("*");

      if (allAnimals && allAnimals.length > 0) {
        animalContext = `TILLGÄNGLIGA DJUR I DATABASEN:
${allAnimals.map((a: any) => `${a.emoji || "🐾"} ${a.namn} (${a.vetenskapligt_namn}) - ${a.kategori}, ${a.svårighet}`).join("\n")}`;
      }

      systemPrompt = `Du är en intelligent assistent för DjurData-appen. Ditt jobb är att ge korrekt, säker och användbar information om alla djur i appen.

${animalContext}

Svara på svenska och hjälp användaren välja ett djur för detaljerad information.`;
    }

    console.log("Calling Lovable AI Gateway, isGlobalAI:", isGlobalAI);
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "För många förfrågningar. Vänta en stund och försök igen." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI-krediter slut. Kontakta administratören." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    console.log("Streaming response back to client...");
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in animal-chat function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
