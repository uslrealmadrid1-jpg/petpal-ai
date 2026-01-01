import { Animal } from "@/data/animals";
import { ExpandableSection } from "./ExpandableSection";
import { Checklist } from "./Checklist";
import { AlertTriangle } from "lucide-react";

interface AnimalSectionsProps {
  animal: Animal;
}

export function AnimalSections({ animal }: AnimalSectionsProps) {
  return (
    <div className="space-y-4">
      {/* Skötsel / Miljö */}
      <ExpandableSection title="Boende & Miljö" emoji="🏠" defaultOpen>
        <div className="space-y-4">
          <div className="grid gap-3">
            <InfoRow label="Bostad" value={animal.skötsel.bostad} />
            <InfoRow label="Temperatur" value={animal.skötsel.temperatur} />
            <InfoRow label="Fuktighet" value={animal.skötsel.fuktighet} />
            <InfoRow label="Belysning" value={animal.skötsel.belysning} />
            <InfoRow label="Substrat" value={animal.skötsel.substrat} />
          </div>
        </div>
      </ExpandableSection>

      {/* Mat & Foder */}
      <ExpandableSection title="Mat & Utfodring" emoji="🍽️" badge={`${animal.mat.length} typer`}>
        <div className="space-y-3">
          {animal.mat.map((food, i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-3">
              <div className="font-medium text-foreground">{food.typ}</div>
              <div className="text-sm text-muted-foreground mt-1 flex gap-4">
                <span>📅 {food.frekvens}</span>
                <span>📊 {food.mängd}</span>
              </div>
            </div>
          ))}
          
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              💧 Vatten
            </h4>
            <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
              <p><strong>Dryck:</strong> {animal.vatten.dryck}</p>
              <p><strong>Behandling:</strong> {animal.vatten.behandling}</p>
            </div>
          </div>
        </div>
      </ExpandableSection>

      {/* Aktivitet & Beteende */}
      <ExpandableSection title="Beteende & Aktivitet" emoji="🐾">
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              🕐 Aktivitetscykel
            </h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center p-2 bg-card rounded">
                <div className="text-muted-foreground text-xs">Vaknar</div>
                <div className="font-medium">{animal.aktivitetscykel.vaknar}</div>
              </div>
              <div className="text-center p-2 bg-card rounded">
                <div className="text-muted-foreground text-xs">Aktiv</div>
                <div className="font-medium">{animal.aktivitetscykel.aktiva_timmar}</div>
              </div>
              <div className="text-center p-2 bg-card rounded">
                <div className="text-muted-foreground text-xs">Sover</div>
                <div className="font-medium">{animal.aktivitetscykel.sover}</div>
              </div>
            </div>
          </div>
          
          <div className="grid gap-3">
            <InfoRow label="Aktivitet" value={animal.beteende.aktivitet} />
            <InfoRow label="Socialt" value={animal.beteende.social} />
            <InfoRow label="Lek" value={animal.beteende.lek} />
          </div>
        </div>
      </ExpandableSection>

      {/* Hälsa & Sjukdomar */}
      <ExpandableSection title="Hälsa & Sjukdomar" emoji="🩺" badge={`${animal.sjukdomar.length} vanliga`}>
        <div className="space-y-4">
          {animal.sjukdomar.map((disease, i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                {disease.namn}
              </h4>
              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Symptom: </span>
                  <span className="text-foreground">{disease.symptom.join(", ")}</span>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded p-2">
                  <span className="font-medium text-amber-800 dark:text-amber-200">Åtgärd: </span>
                  <span className="text-amber-900 dark:text-amber-100">{disease.åtgärd}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ExpandableSection>

      {/* Varningar */}
      <ExpandableSection title="Vanliga misstag & Varningar" emoji="⚠️">
        <div className="space-y-2">
          {animal.varningar.map((warning, i) => (
            <div 
              key={i} 
              className="flex gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm"
            >
              <span className="text-destructive shrink-0">⚠️</span>
              <span className="text-foreground">{warning}</span>
            </div>
          ))}
        </div>
      </ExpandableSection>

      {/* Checklistor */}
      <ExpandableSection title="Inköpslista" emoji="🛒" badge={`${animal.checklistor.inköp.length} saker`}>
        <Checklist type="inköp" items={animal.checklistor.inköp} animalId={animal.id} />
      </ExpandableSection>

      <ExpandableSection title="Dagliga rutiner" emoji="📅">
        <Checklist type="daglig" items={animal.checklistor.daglig} animalId={animal.id} />
      </ExpandableSection>

      <ExpandableSection title="Veckorutiner" emoji="📆">
        <Checklist type="veckovis" items={animal.checklistor.veckovis} animalId={animal.id} />
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
