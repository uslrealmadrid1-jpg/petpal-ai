import { DbRequirements, DbFood, DbDisease, DbWarning, DbChecklist } from "@/hooks/useAnimals";
import { ExpandableSection } from "./ExpandableSection";
import { Checklist } from "./Checklist";
import { PetLogSection } from "./PetLogSection";
import { AIChat } from "./AIChat";
import { AlertTriangle } from "lucide-react";

interface AnimalSectionsProps {
  animalId: string;
  animalName: string;
  requirements?: DbRequirements | null;
  food?: DbFood[];
  diseases?: DbDisease[];
  warnings?: DbWarning[];
  checklists?: DbChecklist[];
}

export function AnimalSections({ 
  animalId,
  animalName,
  requirements, 
  food = [], 
  diseases = [], 
  warnings = [], 
  checklists = [] 
}: AnimalSectionsProps) {
  const inköpItems = checklists.filter(c => c.typ === "inköp").map(c => c.item);
  const dagligItems = checklists.filter(c => c.typ === "daglig").map(c => c.item);
  const veckoItems = checklists.filter(c => c.typ === "veckovis").map(c => c.item);

  return (
    <div className="space-y-4">
      {/* 🍽️ Mat & Vatten */}
      <ExpandableSection title="Mat & Vatten" emoji="🍽️" badge={food.length > 0 ? `${food.length} typer` : undefined}>
        <div className="space-y-3">
          {food.length > 0 ? (
            <>
              {food.map((f) => (
                <div key={f.id} className="bg-muted/50 rounded-lg p-3">
                  <div className="font-medium text-foreground">{f.typ}</div>
                  <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-4">
                    {f.frekvens && <span>📅 Frekvens: {f.frekvens}</span>}
                    {f.mängd && <span>📊 Mängd: {f.mängd}</span>}
                  </div>
                </div>
              ))}
              
              {requirements && (requirements.vatten_dryck || requirements.vatten_behandling) && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    💧 Vatten
                  </h4>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
                    {requirements.vatten_dryck && <p><strong>Hur den dricker:</strong> {requirements.vatten_dryck}</p>}
                    {requirements.vatten_behandling && <p><strong>Behandling:</strong> {requirements.vatten_behandling}</p>}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Ingen matinformation tillgänglig ännu.</p>
          )}
        </div>
      </ExpandableSection>

      {/* 🌡️ Temperatur, Värme & UVB */}
      <ExpandableSection title="Temperatur, Värme & UVB" emoji="🌡️">
        <div className="space-y-3">
          {requirements ? (
            <div className="grid gap-3">
              {requirements.temperatur && <InfoRow label="Optimal temperatur" value={requirements.temperatur} />}
              {requirements.belysning && <InfoRow label="Belysning / UVB" value={requirements.belysning} />}
              {!requirements.temperatur && !requirements.belysning && (
                <p className="text-sm text-muted-foreground">Ej tillämpligt för detta djur.</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Ingen temperaturinformation tillgänglig ännu.</p>
          )}
        </div>
      </ExpandableSection>

      {/* 🏠 Boende & Miljö */}
      <ExpandableSection title="Boende & Miljö" emoji="🏠">
        <div className="space-y-3">
          {requirements ? (
            <div className="grid gap-3">
              {requirements.bostad && <InfoRow label="Typ av boende" value={requirements.bostad} />}
              {requirements.substrat && <InfoRow label="Substrat / underlag" value={requirements.substrat} />}
              {requirements.fuktighet && <InfoRow label="Fuktighet" value={requirements.fuktighet} />}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Ingen boendeinformation tillgänglig ännu.</p>
          )}
        </div>
      </ExpandableSection>

      {/* 🕒 Dygnsrytm & Aktivitet */}
      <ExpandableSection title="Dygnsrytm & Aktivitet" emoji="🕒">
        <div className="space-y-4">
          {requirements && (requirements.aktivitet_vaknar || requirements.aktivitet_sover || requirements.aktivitet_timmar) ? (
            <>
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  🕐 Aktivitetscykel
                </h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {requirements.aktivitet_vaknar && (
                    <div className="text-center p-2 bg-card rounded">
                      <div className="text-muted-foreground text-xs">Vaknar</div>
                      <div className="font-medium">{requirements.aktivitet_vaknar}</div>
                    </div>
                  )}
                  {requirements.aktivitet_timmar && (
                    <div className="text-center p-2 bg-card rounded">
                      <div className="text-muted-foreground text-xs">Aktiv</div>
                      <div className="font-medium">{requirements.aktivitet_timmar}</div>
                    </div>
                  )}
                  {requirements.aktivitet_sover && (
                    <div className="text-center p-2 bg-card rounded">
                      <div className="text-muted-foreground text-xs">Sover</div>
                      <div className="font-medium">{requirements.aktivitet_sover}</div>
                    </div>
                  )}
                </div>
              </div>
              {requirements.beteende_aktivitet && (
                <InfoRow label="Hur aktiv" value={requirements.beteende_aktivitet} />
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Ingen aktivitetsinformation tillgänglig ännu.</p>
          )}
        </div>
      </ExpandableSection>

      {/* 🐾 Beteende & Socialt */}
      <ExpandableSection title="Beteende & Socialt" emoji="🐾">
        <div className="space-y-3">
          {requirements && (requirements.beteende_social || requirements.beteende_lek) ? (
            <div className="grid gap-3">
              {requirements.beteende_social && <InfoRow label="Socialt beteende" value={requirements.beteende_social} />}
              {requirements.beteende_lek && <InfoRow label="Lek & hantering" value={requirements.beteende_lek} />}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Ingen beteendeinformation tillgänglig ännu.</p>
          )}
        </div>
      </ExpandableSection>

      {/* 📅 Matningsschema */}
      <ExpandableSection title="Matningsschema" emoji="📅">
        <div className="space-y-3">
          {food.length > 0 ? (
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-3">Typiskt schema</h4>
              <div className="space-y-2 text-sm">
                {food.map((f) => (
                  <div key={f.id} className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                    <span className="text-foreground">{f.typ}</span>
                    <span className="text-muted-foreground">{f.frekvens || "Ingen frekvens angiven"}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Inget matningsschema tillgängligt ännu.</p>
          )}
        </div>
      </ExpandableSection>

      {/* ❤️ Hälsa & Vanliga Sjukdomar */}
      <ExpandableSection title="Hälsa & Vanliga Sjukdomar" emoji="❤️" badge={diseases.length > 0 ? `${diseases.length} vanliga` : undefined}>
        <div className="space-y-4">
          {diseases.length > 0 ? (
            diseases.map((disease) => (
              <div key={disease.id} className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  {disease.namn}
                </h4>
                <div className="mt-3 space-y-2 text-sm">
                  {disease.symptom && disease.symptom.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Symptom: </span>
                      <span className="text-foreground">{disease.symptom.join(", ")}</span>
                    </div>
                  )}
                  {disease.åtgärd && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded p-2">
                      <span className="font-medium text-amber-800 dark:text-amber-200">Åtgärd: </span>
                      <span className="text-amber-900 dark:text-amber-100">{disease.åtgärd}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Ingen sjukdomsinformation tillgänglig ännu.</p>
          )}
        </div>
      </ExpandableSection>

      {/* ⚠️ Vanliga Misstag & Varningar */}
      <ExpandableSection title="Vanliga Misstag & Varningar" emoji="⚠️">
        <div className="space-y-2">
          {warnings.length > 0 ? (
            warnings.map((w) => (
              <div 
                key={w.id} 
                className="flex gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm"
              >
                <span className="text-destructive shrink-0">⚠️</span>
                <span className="text-foreground">{w.varning}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Inga varningar registrerade för detta djur.</p>
          )}
        </div>
      </ExpandableSection>

      {/* 🛒 Inköpslista */}
      <ExpandableSection title="Inköpslista" emoji="🛒" badge={inköpItems.length > 0 ? `${inköpItems.length} saker` : undefined}>
        {inköpItems.length > 0 ? (
          <Checklist type="inköp" items={inköpItems} animalId={animalId} />
        ) : (
          <p className="text-sm text-muted-foreground">Ingen inköpslista tillgänglig ännu.</p>
        )}
      </ExpandableSection>

      {/* 📓 Min djurlogg + ⏱️ Timer & Påminnelser */}
      <PetLogSection animalId={animalId} animalName={animalName} />

      {/* Dagliga & Veckorutiner */}
      {dagligItems.length > 0 && (
        <ExpandableSection title="Dagliga rutiner" emoji="📅">
          <Checklist type="daglig" items={dagligItems} animalId={animalId} />
        </ExpandableSection>
      )}

      {veckoItems.length > 0 && (
        <ExpandableSection title="Veckorutiner" emoji="📆">
          <Checklist type="veckovis" items={veckoItems} animalId={animalId} />
        </ExpandableSection>
      )}

      {/* 🤖 Djurspecifik AI-expert */}
      <ExpandableSection title={`Chatta med ${animalName}-expert`} emoji="🤖">
        <AIChat animalId={animalId} animalName={animalName} />
      </ExpandableSection>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground text-sm shrink-0">{label}</span>
      <span className="text-foreground text-sm text-right">{value}</span>
    </div>
  );
}
