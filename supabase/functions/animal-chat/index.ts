import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ONLY block truly harmful content - be PRACTICAL and HELPFUL
const STRICTLY_BLOCKED_CONTENT = [
  // Sexual content involving animals
  "sex med djur", "djursex", "zoofili", "bestiality",
  // Animal abuse
  "plåga djur", "tortera djur", "skada djur", "döda djur för nöje", "djurplågeri",
  // Violence unrelated to care
  "mörda", "våldta", 
  // Illegal activities
  "smuggla djur", "olaglig handel",
  // Completely off-topic harmful content
  "hacka", "lösenord", "kreditkort", "terrorism", "bomb"
];

// Keywords that indicate animal-related questions - ALWAYS ALLOW
const ANIMAL_CARE_KEYWORDS = [
  // Shopping & supplies
  "inköpslista", "shopping", "köpa", "behöver", "utrustning", "tillbehör", "produkter",
  // Care & setup
  "skötsel", "vård", "setup", "inredning", "terrarium", "akvarium", "bur", "inhägnad",
  // Feeding
  "mat", "foder", "utfodra", "äta", "diet", "näring", "vitaminer", "kalcium",
  // Environment
  "temperatur", "värme", "uvb", "belysning", "lampa", "fuktighet", "substrat",
  // Health
  "sjukdom", "symptom", "hälsa", "veterinär", "medicin", "sjuk", "frisk",
  // Behavior
  "beteende", "stress", "aggressiv", "lugn", "social", "hantering",
  // Routines
  "rutin", "daglig", "vecka", "schema", "timer", "påminnelse", "checklista",
  // Tips & help
  "tips", "råd", "hjälp", "nybörjare", "misstag", "fel", "förbättra", "rekommendation",
  // Comparisons
  "jämför", "skillnad", "likhet", "bättre", "sämre",
  // General animal terms
  "djur", "husdjur", "reptil", "däggdjur", "fågel", "fisk", "groddjur",
  "gecko", "orm", "sköldpadda", "ödla", "hund", "katt", "kanin",
  // Questions
  "hur", "vad", "varför", "när", "vilken", "behöver jag"
];

// Jailbreak attempts - block manipulation
const JAILBREAK_PATTERNS = [
  "ignorera instruktioner",
  "glöm dina regler",
  "låtsas att",
  "du är nu",
  "nya instruktioner",
  "system prompt",
  "override",
  "bypass",
  "ignore previous",
  "forget your rules",
  "pretend you are",
  "act as if"
];

interface ValidationResult {
  isValid: boolean;
  flagReason: string | null;
  severity: "low" | "medium" | "high" | null;
}

function validateMessage(message: string): ValidationResult {
  const lowerMessage = message.toLowerCase();
  
  // FIRST: Check if message contains animal care keywords - ALWAYS ALLOW
  for (const keyword of ANIMAL_CARE_KEYWORDS) {
    if (lowerMessage.includes(keyword)) {
      console.log("Message contains animal keyword, allowing:", keyword);
      return { isValid: true, flagReason: null, severity: null };
    }
  }
  
  // Check for jailbreak attempts
  for (const pattern of JAILBREAK_PATTERNS) {
    if (lowerMessage.includes(pattern)) {
      return { 
        isValid: false, 
        flagReason: "Försök att manipulera AI", 
        severity: "high" 
      };
    }
  }
  
  // Check for strictly blocked harmful content
  for (const blocked of STRICTLY_BLOCKED_CONTENT) {
    if (lowerMessage.includes(blocked)) {
      return { 
        isValid: false, 
        flagReason: `Olämpligt innehåll: ${blocked}`, 
        severity: "high" 
      };
    }
  }
  
  // If no animal keywords found but also no blocked content,
  // let the AI handle it naturally (it will redirect if needed)
  return { isValid: true, flagReason: null, severity: null };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, animalId, isGlobalAI, userId } = await req.json();
    console.log("Received chat request:", { messageCount: messages?.length, animalId, isGlobalAI, userId });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if user is blocked
    if (userId) {
      const { data: violation } = await supabase
        .from("user_violations")
        .select("*")
        .eq("user_id", userId)
        .eq("is_blocked", true)
        .maybeSingle();

      if (violation) {
        console.log("Blocked user attempted to use chat:", userId);
        return new Response(
          JSON.stringify({ 
            error: "Ditt konto är blockerat p.g.a. regelbrott. Kontakta admin för mer information.",
            blocked: true 
          }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate the latest user message
    const lastUserMessage = messages?.filter((m: any) => m.role === "user").pop();
    if (lastUserMessage) {
      const validation = validateMessage(lastUserMessage.content);
      
      if (!validation.isValid) {
        console.log("Message flagged:", validation.flagReason, "Severity:", validation.severity);
        
        // Log flagged message to database and notify admin
        if (userId) {
          await supabase
            .from("flagged_messages")
            .insert({
              user_id: userId,
              message_content: lastUserMessage.content,
              flag_reason: validation.flagReason
            });

          // Increment violation count for high severity
          if (validation.severity === "high") {
            const { data: existing } = await supabase
              .from("user_violations")
              .select("*")
              .eq("user_id", userId)
              .maybeSingle();

            if (existing) {
              const newCount = (existing.violation_count || 0) + 1;
              await supabase
                .from("user_violations")
                .update({ 
                  violation_count: newCount,
                  updated_at: new Date().toISOString()
                })
                .eq("user_id", userId);

              // Auto-block after 3 high-severity violations
              if (newCount >= 3 && !existing.is_blocked) {
                await supabase
                  .from("user_violations")
                  .update({
                    is_blocked: true,
                    blocked_reason: "Automatiskt blockerad efter 3 allvarliga regelbrott",
                    blocked_at: new Date().toISOString()
                  })
                  .eq("user_id", userId);

                return new Response(
                  JSON.stringify({ 
                    error: "Du har blivit blockerad efter upprepade regelbrott. Kontakta admin.",
                    blocked: true 
                  }),
                  { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
              }
            } else {
              await supabase
                .from("user_violations")
                .insert({
                  user_id: userId,
                  violation_count: 1
                });
            }
          }
        }

        // Return rejection for blocked content
        return new Response(
          JSON.stringify({ 
            error: "Denna fråga är inte tillåten i denna djurfokuserade app.",
            flagged: true
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

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

      systemPrompt = `Du är en HJÄLPSAM och PRAKTISK djur-AI för DjurData-appen.

DITT HUVUDUPPDRAG: Hjälpa användare med ALLT som rör djur!

✅ DU MÅSTE SVARA PÅ:
- Inköpslistor och utrustning
- Skötselråd och tips
- Matscheman och diet
- Hälsa och sjukdomar
- Miljökrav (temperatur, UVB, fuktighet)
- Beteende och hantering
- Checklistor och rutiner
- Nybörjartips och vanliga misstag
- Produktrekommendationer
- Jämförelser mellan djur
- ALLA praktiska frågor om djurhållning

❌ BLOCKERA ENDAST:
- Sexuellt innehåll om djur
- Djurplågeri eller misshandel
- Olagliga aktiviteter
- Våld som inte rör djurvård
- Helt orelaterade ämnen (politik, hacking, droger)

Om en fråga är ORELATERAD till djur, säg vänligt:
"Jag fokuserar på djurfrågor! 🐾 Vad vill du veta om djur?"

${animalContext}

Svara alltid hjälpsamt, praktiskt och på svenska. Var generös med information!`;

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

      systemPrompt = `Du är en EXPERT-AI för ${animalContext ? "detta specifika djur" : "djur"} i DjurData-appen.

DITT HUVUDUPPDRAG: Ge PRAKTISK och ANVÄNDBAR hjälp om detta djur!

✅ DU MÅSTE ALLTID SVARA PÅ:
- "Gör en inköpslista" → Skapa detaljerad lista med all utrustning
- "Vad behöver jag?" → Lista allt som behövs för djuret
- "Ge mig tips" → Ge konkreta nybörjartips
- "Vanliga misstag" → Lista fel som nya ägare gör
- "Checklista" → Skapa praktisk checklista
- "Förbättra min setup" → Ge förbättringsförslag
- "Produktrekommendationer" → Föreslå lämpliga produkter
- ALLA frågor om skötsel, mat, hälsa, miljö, beteende

DINA FUNKTIONER:
📋 Skapa inköpslistor med priser och prioriteringar
🌡️ Förklara temperatur, UVB och fuktighetskrav
🍽️ Ge matscheman och kostråd
🏥 Beskriv sjukdomar och symptom
⚠️ Varna för vanliga misstag
📅 Skapa dag- och veckorutiner
💡 Ge praktiska tips och tricks

❌ BLOCKERA ENDAST:
- Sexuellt innehåll
- Djurplågeri
- Olagliga aktiviteter

${animalContext}

Svara ALLTID hjälpsamt och praktiskt på svenska. Om info saknas i databasen, ge allmänna råd baserat på djurets art och behov.`;

    } else {
      // Fallback - no animal, no global AI flag
      const { data: allAnimals } = await supabase
        .from("animals")
        .select("*");

      if (allAnimals && allAnimals.length > 0) {
        animalContext = `TILLGÄNGLIGA DJUR I DATABASEN:
${allAnimals.map((a: any) => `${a.emoji || "🐾"} ${a.namn} (${a.vetenskapligt_namn}) - ${a.kategori}, ${a.svårighet}`).join("\n")}`;
      }

      systemPrompt = `Du är en hjälpsam djur-AI för DjurData-appen.

Hjälp användaren med djurfrågor och guida dem till rätt djur i appen.

${animalContext}

Svara på svenska och var hjälpsam!`;
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
