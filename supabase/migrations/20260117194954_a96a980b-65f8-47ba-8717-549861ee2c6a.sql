
-- Insert Mountain Coatimundi (Nasua nasua montana)
INSERT INTO animals (namn, vetenskapligt_namn, emoji, kategori, svårighet, aktivitet, livslängd_år, beskrivning, theme)
VALUES ('Mountain Coatimundi', 'Nasua nasua montana', '🦝', 'Däggdjur', 'Avancerad', 'Dagaktiv', '14-20', 'Mycket intelligent, social och energisk art som kräver stort utrymme och mental stimulans. Inte ett nybörjardjur - kräver daglig aktivering och kan bli aggressiv om understimulerad.', 'mammal');

INSERT INTO animal_requirements (animal_id, temperatur, fuktighet, belysning, bostad, beteende_aktivitet, beteende_social, beteende_lek)
SELECT id, '20-28°C', '50-70%', 'Naturligt dagsljus eller fullspektrum UVB', 'Mycket stor inomhus/utomhus-voljär med klättermöjligheter. Minst 4x4x3 meter.', 'Extremt aktiv och nyfiken. Behöver daglig mental stimulans och fysisk aktivitet.', 'Mycket social art som trivs bäst i grupp eller med konstant mänsklig interaktion.', 'Älskar att gräva, klättra och utforska. Behöver varierad miljö med gömställen.'
FROM animals WHERE namn = 'Mountain Coatimundi';

INSERT INTO animal_food (animal_id, typ, frekvens, mängd) 
SELECT id, 'Frukt och grönsaker', 'Dagligen', '40% av kosten' FROM animals WHERE namn = 'Mountain Coatimundi';
INSERT INTO animal_food (animal_id, typ, frekvens, mängd) 
SELECT id, 'Protein (ägg, kyckling, insekter)', 'Dagligen', '30% av kosten' FROM animals WHERE namn = 'Mountain Coatimundi';
INSERT INTO animal_food (animal_id, typ, frekvens, mängd) 
SELECT id, 'Kvalitetsfoder för omnivorer', 'Dagligen', '30% av kosten' FROM animals WHERE namn = 'Mountain Coatimundi';

INSERT INTO animal_diseases (animal_id, namn, symptom, åtgärd)
SELECT id, 'Fetma', ARRAY['Övervikt', 'Minskad aktivitet', 'Andningssvårigheter'], 'Justera kost och öka motion. Veterinärkontroll.' FROM animals WHERE namn = 'Mountain Coatimundi';
INSERT INTO animal_diseases (animal_id, namn, symptom, åtgärd)
SELECT id, 'Tandinfektion', ARRAY['Dålig andedräkt', 'Svårt att äta', 'Svullnad i munnen'], 'Veterinärvård krävs. Regelbunden tandkontroll.' FROM animals WHERE namn = 'Mountain Coatimundi';

INSERT INTO animal_warnings (animal_id, varning)
SELECT id, 'Inte ett nybörjardjur - kräver erfarenhet av exotiska djur' FROM animals WHERE namn = 'Mountain Coatimundi';
INSERT INTO animal_warnings (animal_id, varning)
SELECT id, 'Kan bli aggressiv om understimulerad eller felaktigt hanterad' FROM animals WHERE namn = 'Mountain Coatimundi';
INSERT INTO animal_warnings (animal_id, varning)
SELECT id, 'Kräver daglig aktivering och mental stimulans' FROM animals WHERE namn = 'Mountain Coatimundi';

-- Checklistor med korrekta typer: inköp, daglig, veckovis
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'inköp', 'Stor voljär/inhägnad (minst 4x4x3m)', 1 FROM animals WHERE namn = 'Mountain Coatimundi';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'inköp', 'Klättergrenar och plattformar', 2 FROM animals WHERE namn = 'Mountain Coatimundi';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'inköp', 'Gömställen och bon', 3 FROM animals WHERE namn = 'Mountain Coatimundi';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'inköp', 'Matskålar i rostfritt stål', 4 FROM animals WHERE namn = 'Mountain Coatimundi';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'inköp', 'Aktiveringsleksaker', 5 FROM animals WHERE namn = 'Mountain Coatimundi';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'daglig', 'Ge frukost med varierad kost', 1 FROM animals WHERE namn = 'Mountain Coatimundi';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'daglig', 'Aktiv lektid (minst 2 timmar)', 2 FROM animals WHERE namn = 'Mountain Coatimundi';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'daglig', 'Rengör matskålar', 3 FROM animals WHERE namn = 'Mountain Coatimundi';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'daglig', 'Kontrollera vatten', 4 FROM animals WHERE namn = 'Mountain Coatimundi';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'veckovis', 'Storstädning av inhägnad', 1 FROM animals WHERE namn = 'Mountain Coatimundi';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'veckovis', 'Rotera leksaker och berikningsföremål', 2 FROM animals WHERE namn = 'Mountain Coatimundi';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'veckovis', 'Hälsokontroll (vikt, päls, tänder)', 3 FROM animals WHERE namn = 'Mountain Coatimundi';

-- Insert Asiatisk Kortkloutter (Aonyx cinereus)
INSERT INTO animals (namn, vetenskapligt_namn, emoji, kategori, svårighet, aktivitet, livslängd_år, beskrivning, theme)
VALUES ('Asiatisk Kortkloutter', 'Aonyx cinereus', '🦦', 'Däggdjur', 'Avancerad', 'Dagaktiv', '10-15', 'Mycket social och extremt intelligent halv-akvatisk art. Får ALDRIG hållas ensam - kräver konstant stimulans och sällskap.', 'mammal');

INSERT INTO animal_requirements (animal_id, temperatur, fuktighet, belysning, bostad, vatten_dryck, vatten_behandling, beteende_aktivitet, beteende_social)
SELECT id, '22-30°C', '60-80%', 'Naturligt dagsljus, UVB rekommenderas', 'Stort vattenområde (minst 2000 liter) + landområde. Filtrerat och uppvärmt vatten krävs.', 'Rent filtrerat vatten för simning och drickning', 'Kraftigt filtersystem krävs. Vattentemperatur 24-28°C.', 'Extremt aktiv och lekfull. Behöver konstant stimulans och aktiviteter.', 'Måste hållas i grupp om minst 2-3 individer. Får ALDRIG hållas ensam.'
FROM animals WHERE namn = 'Asiatisk Kortkloutter';

INSERT INTO animal_food (animal_id, typ, frekvens, mängd) 
SELECT id, 'Fisk (varierade sorter)', 'Dagligen', '60% av kosten' FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO animal_food (animal_id, typ, frekvens, mängd) 
SELECT id, 'Kräftdjur och skaldjur', 'Dagligen', '20% av kosten' FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO animal_food (animal_id, typ, frekvens, mängd) 
SELECT id, 'Insekter och små däggdjur', '2-3 ggr/vecka', '20% av kosten' FROM animals WHERE namn = 'Asiatisk Kortkloutter';

INSERT INTO animal_diseases (animal_id, namn, symptom, åtgärd)
SELECT id, 'Hudinfektioner', ARRAY['Håravfall', 'Klåda', 'Rodnad'], 'Veterinärvård. Kontrollera vattenkvalitet.' FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO animal_diseases (animal_id, namn, symptom, åtgärd)
SELECT id, 'Luftvägsinfektioner', ARRAY['Hosta', 'Nysningar', 'Slöhet'], 'Omedelbar veterinärvård krävs.' FROM animals WHERE namn = 'Asiatisk Kortkloutter';

INSERT INTO animal_warnings (animal_id, varning)
SELECT id, 'Får ALDRIG hållas ensam - kräver sällskap av artfränder' FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO animal_warnings (animal_id, varning)
SELECT id, 'Extremt krävande vattensystem med filtrering' FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO animal_warnings (animal_id, varning)
SELECT id, 'Kräver specialiserad veterinärvård' FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO animal_warnings (animal_id, varning)
SELECT id, 'Inte lagligt att hålla i alla länder - kontrollera lokala lagar' FROM animals WHERE namn = 'Asiatisk Kortkloutter';

INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'inköp', 'Stort akvarium/pool (minst 2000L)', 1 FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'inköp', 'Kraftigt filtersystem', 2 FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'inköp', 'Vattenvärmare', 3 FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'inköp', 'Landområde med gömställen', 4 FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'inköp', 'Vattenleksaker', 5 FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'daglig', 'Kontrollera vattentemperatur', 1 FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'daglig', 'Utfodring med varierad kost', 2 FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'daglig', 'Aktiv lektid i vattnet', 3 FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'daglig', 'Kontrollera filterpump', 4 FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'veckovis', 'Vattenbyte (30-50%)', 1 FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'veckovis', 'Rengör filter', 2 FROM animals WHERE namn = 'Asiatisk Kortkloutter';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'veckovis', 'Kontrollera vattenkvalitet (pH, ammoniak)', 3 FROM animals WHERE namn = 'Asiatisk Kortkloutter';

-- Insert Iller (Mustela putorius furo)
INSERT INTO animals (namn, vetenskapligt_namn, emoji, kategori, svårighet, aktivitet, livslängd_år, beskrivning, theme)
VALUES ('Iller', 'Mustela putorius furo', '🐾', 'Däggdjur', 'Medel', 'Skymningsaktiv', '6-10', 'Lekfull, nyfiken och social. Kräver sällskap och daglig fri roaming. Kan tugga på farliga föremål - djursäkra hemmet!', 'mammal');

INSERT INTO animal_requirements (animal_id, temperatur, fuktighet, belysning, bostad, beteende_aktivitet, beteende_social, beteende_lek)
SELECT id, '15-24°C', '40-60%', 'Normalt rumsljus, känslig för direkt solljus', 'Stor flervåningsbur + daglig fri roaming i djursäkrat utrymme. Minst 4 timmar utanför buren dagligen.', 'Mycket aktiv i perioder, sover 14-18 timmar per dygn. Mest aktiv i gryning och skymning.', 'Social art som trivs bäst i par eller grupp. Behöver daglig interaktion med ägare.', 'Älskar tunnlar, bollar och interaktiva leksaker. Gömmer gärna föremål.'
FROM animals WHERE namn = 'Iller';

INSERT INTO animal_food (animal_id, typ, frekvens, mängd) 
SELECT id, 'Högkvalitativt illerfoder', 'Fri tillgång', 'Huvudföda' FROM animals WHERE namn = 'Iller';
INSERT INTO animal_food (animal_id, typ, frekvens, mängd) 
SELECT id, 'Rått kött (kyckling, kanin)', '2-3 ggr/vecka', 'Komplement' FROM animals WHERE namn = 'Iller';
INSERT INTO animal_food (animal_id, typ, frekvens, mängd) 
SELECT id, 'Ägg (kokt eller rått)', '1-2 ggr/vecka', 'Godis' FROM animals WHERE namn = 'Iller';

INSERT INTO animal_diseases (animal_id, namn, symptom, åtgärd)
SELECT id, 'Binjuresjukdom', ARRAY['Håravfall', 'Klåda', 'Svullen vulva/prostata'], 'Veterinärvård krävs. Vanligt hos äldre illrar.' FROM animals WHERE namn = 'Iller';
INSERT INTO animal_diseases (animal_id, namn, symptom, åtgärd)
SELECT id, 'Insulinom', ARRAY['Slöhet', 'Svaghet', 'Kramper'], 'Omedelbar veterinärvård. Ge honung vid akut attack.' FROM animals WHERE namn = 'Iller';
INSERT INTO animal_diseases (animal_id, namn, symptom, åtgärd)
SELECT id, 'Influensa', ARRAY['Nysningar', 'Rinnande näsa', 'Feber'], 'Vila och värme. Kan smittas från människor!' FROM animals WHERE namn = 'Iller';

INSERT INTO animal_warnings (animal_id, varning)
SELECT id, 'Känslig för värme över 25°C - kan få värmeslag' FROM animals WHERE namn = 'Iller';
INSERT INTO animal_warnings (animal_id, varning)
SELECT id, 'Tuggar gärna på gummi och skumgummi - livsfarligt om det sväljs' FROM animals WHERE namn = 'Iller';
INSERT INTO animal_warnings (animal_id, varning)
SELECT id, 'Kräver sällskap - ensam iller blir deprimerad' FROM animals WHERE namn = 'Iller';
INSERT INTO animal_warnings (animal_id, varning)
SELECT id, 'Kan smittas av mänsklig influensa' FROM animals WHERE namn = 'Iller';

INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'inköp', 'Stor flervåningsbur', 1 FROM animals WHERE namn = 'Iller';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'inköp', 'Hängmatta och sovpåsar', 2 FROM animals WHERE namn = 'Iller';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'inköp', 'Tunnlar och leksaker', 3 FROM animals WHERE namn = 'Iller';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'inköp', 'Toalettlåda med låga kanter', 4 FROM animals WHERE namn = 'Iller';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'inköp', 'Kvalitativt illerfoder', 5 FROM animals WHERE namn = 'Iller';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'inköp', 'Vattenflaske eller skål', 6 FROM animals WHERE namn = 'Iller';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'daglig', 'Fyll på mat och vatten', 1 FROM animals WHERE namn = 'Iller';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'daglig', 'Rengör toalettlåda', 2 FROM animals WHERE namn = 'Iller';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'daglig', 'Fri lektid utanför buren (minst 4h)', 3 FROM animals WHERE namn = 'Iller';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'daglig', 'Interaktiv lek med ägare', 4 FROM animals WHERE namn = 'Iller';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'veckovis', 'Storstädning av bur', 1 FROM animals WHERE namn = 'Iller';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'veckovis', 'Tvätta hängmattor och filtar', 2 FROM animals WHERE namn = 'Iller';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'veckovis', 'Klipp klor vid behov', 3 FROM animals WHERE namn = 'Iller';
INSERT INTO checklist_templates (animal_id, typ, item, sort_order)
SELECT id, 'veckovis', 'Kontrollera öron och tänder', 4 FROM animals WHERE namn = 'Iller';
