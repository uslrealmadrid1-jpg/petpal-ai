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
    const { messages, animalId } = await req.json();
    console.log("Received chat request:", { messageCount: messages?.length, animalId });

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
    
    if (animalId) {
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
    } else {
      // Fetch all animals for general context
      const { data: allAnimals } = await supabase
        .from("animals")
        .select("*");

      if (allAnimals && allAnimals.length > 0) {
        animalContext = `TILLGÄNGLIGA DJUR I DATABASEN:
${allAnimals.map((a: any) => `${a.emoji || "🐾"} ${a.namn} (${a.vetenskapligt_namn}) - ${a.kategori}, ${a.svårighet}`).join("\n")}`;
      }
    }

    const systemPrompt = `Du är en expert på djurvård och husdjur. Din uppgift är att ge säkra, pedagogiska och faktabaserade råd.

REGLER:
1. Använd ALLTID den interna databasen med djur, krav, checklistor och varningar som finns i kontexten.
2. Om information saknas: säg tydligt "Information saknas i databasen."
3. Prioritera ALLTID djurets hälsa och säkerhet.
4. Ge svar på svenska, kort och tydligt.
5. Ge konkreta rekommendationer: t.ex. temperatur, UV-lampa, foder, och kosttillskott.
6. Varna tydligt vid potentiellt farliga fel.
7. Anpassa svaret efter om användaren verkar vara nybörjare eller erfaren.

AI-FUNKTIONER:
- Skapa automatiskt inköpslista för varje djur baserat på dess krav.
- Föreslå dagliga och veckovisa checklistor.
- Identifiera vanliga misstag och risker.
- Ge produktrekommendationer baserat på djurets behov.

${animalContext}

Svara alltid med korrekt fakta baserad på databasen. Om du inte har information, säg det istället för att gissa.`;

    console.log("Calling Lovable AI Gateway...");
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
