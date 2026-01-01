import { DbRequirements, DbFood, DbDisease, DbWarning, DbChecklist } from "@/hooks/useAnimals";
import { ExpandableSection } from "./ExpandableSection";
import { Checklist } from "./Checklist";
import { AlertTriangle } from "lucide-react";

interface AnimalSectionsProps {
  animalId: string;
  requirements?: DbRequirements | null;
  food?: DbFood[];
  diseases?: DbDisease[];
  warnings?: DbWarning[];
  checklists?: DbChecklist[];
}

export function AnimalSections({ 
  animalId, 
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
      {/* Skötsel / Miljö */}
      {requirements && (
        <ExpandableSection title="Boende & Miljö" emoji="🏠" defaultOpen>
          <div className="space-y-4">
            <div className="grid gap-3">
              {requirements.bostad && <InfoRow label="Bostad" value={requirements.bostad} />}
              {requirements.temperatur && <InfoRow label="Temperatur" value={requirements.temperatur} />}
              {requirements.fuktighet && <InfoRow label="Fuktighet" value={requirements.fuktighet} />}
              {requirements.belysning && <InfoRow label="Belysning" value={requirements.belysning} />}
              {requirements.substrat && <InfoRow label="Substrat" value={requirements.substrat} />}
            </div>
          </div>
        </ExpandableSection>
      )}

      {/* Mat & Foder */}
      {food.length > 0 && (
        <ExpandableSection title="Mat & Utfodring" emoji="🍽️" badge={`${food.length} typer`}>
          <div className="space-y-3">
            {food.map((f) => (
              <div key={f.id} className="bg-muted/50 rounded-lg p-3">
                <div className="font-medium text-foreground">{f.typ}</div>
                <div className="text-sm text-muted-foreground mt-1 flex gap-4">
                  {f.frekvens && <span>📅 {f.frekvens}</span>}
                  {f.mängd && <span>📊 {f.mängd}</span>}
                </div>
              </div>
            ))}
            
            {requirements && (requirements.vatten_dryck || requirements.vatten_behandling) && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  💧 Vatten
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
                  {requirements.vatten_dryck && <p><strong>Dryck:</strong> {requirements.vatten_dryck}</p>}
                  {requirements.vatten_behandling && <p><strong>Behandling:</strong> {requirements.vatten_behandling}</p>}
                </div>
              </div>
            )}
          </div>
        </ExpandableSection>
      )}

      {/* Aktivitet & Beteende */}
      {requirements && (requirements.beteende_aktivitet || requirements.aktivitet_vaknar) && (
        <ExpandableSection title="Beteende & Aktivitet" emoji="🐾">
          <div className="space-y-4">
            {(requirements.aktivitet_vaknar || requirements.aktivitet_sover || requirements.aktivitet_timmar) && (
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
            )}
            
            <div className="grid gap-3">
              {requirements.beteende_aktivitet && <InfoRow label="Aktivitet" value={requirements.beteende_aktivitet} />}
              {requirements.beteende_social && <InfoRow label="Socialt" value={requirements.beteende_social} />}
              {requirements.beteende_lek && <InfoRow label="Lek" value={requirements.beteende_lek} />}
            </div>
          </div>
        </ExpandableSection>
      )}

      {/* Hälsa & Sjukdomar */}
      {diseases.length > 0 && (
        <ExpandableSection title="Hälsa & Sjukdomar" emoji="🩺" badge={`${diseases.length} vanliga`}>
          <div className="space-y-4">
            {diseases.map((disease) => (
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
            ))}
          </div>
        </ExpandableSection>
      )}

      {/* Varningar */}
      {warnings.length > 0 && (
        <ExpandableSection title="Vanliga misstag & Varningar" emoji="⚠️">
          <div className="space-y-2">
            {warnings.map((w) => (
              <div 
                key={w.id} 
                className="flex gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm"
              >
                <span className="text-destructive shrink-0">⚠️</span>
                <span className="text-foreground">{w.varning}</span>
              </div>
            ))}
          </div>
        </ExpandableSection>
      )}

      {/* Checklistor */}
      {inköpItems.length > 0 && (
        <ExpandableSection title="Inköpslista" emoji="🛒" badge={`${inköpItems.length} saker`}>
          <Checklist type="inköp" items={inköpItems} animalId={animalId} />
        </ExpandableSection>
      )}

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
