export interface FoodItem {
  typ: string;
  frekvens: string;
  mängd: string;
}

export interface Disease {
  namn: string;
  symptom: string[];
  åtgärd: string;
}

export interface Animal {
  id: string;
  namn: string;
  vetenskapligt_namn: string;
  emoji: string;
  kategori: "Reptil" | "Däggdjur" | "Fågel" | "Groddjur" | "Kräftdjur" | "Fisk";
  svårighet: "Nybörjare" | "Medel" | "Avancerad";
  aktivitet: "Dagaktiv" | "Nattaktiv" | "Skymningsaktiv";
  livslängd_år: string;
  beskrivning: string;
  theme: "gecko" | "turtle" | "hamster" | "rabbit" | "fish" | "bird";
  skötsel: {
    temperatur: string;
    fuktighet: string;
    belysning: string;
    substrat: string;
    bostad: string;
  };
  mat: FoodItem[];
  vatten: {
    dryck: string;
    behandling: string;
  };
  beteende: {
    aktivitet: string;
    social: string;
    lek: string;
  };
  aktivitetscykel: {
    vaknar: string;
    sover: string;
    aktiva_timmar: string;
  };
  sjukdomar: Disease[];
  varningar: string[];
  checklistor: {
    inköp: string[];
    daglig: string[];
    veckovis: string[];
  };
}

export const animals: Animal[] = [
  {
    id: "leopardgecko",
    namn: "Leopardgecko",
    vetenskapligt_namn: "Eublepharis macularius",
    emoji: "🦎",
    kategori: "Reptil",
    svårighet: "Nybörjare",
    aktivitet: "Nattaktiv",
    livslängd_år: "15-20",
    beskrivning: "En populär och lättskött gecko med vackra mönster. Perfekt för nybörjare inom reptilhållning.",
    theme: "gecko",
    skötsel: {
      temperatur: "28-32°C dag, 24°C natt",
      fuktighet: "30-40%",
      belysning: "UVB-lampa 10-12h/dag",
      substrat: "Sandfri, hygienisk (reptilmatta eller pappershandduk)",
      bostad: "Terrarium 60x30x30 cm (minimum)",
    },
    mat: [
      { typ: "Insekter", frekvens: "Dagligen", mängd: "3-5 st per dag" },
      { typ: "Syrsor", frekvens: "Varannan dag", mängd: "3 st" },
      { typ: "Mjölmaskar", frekvens: "1 gång/vecka", mängd: "5 st" },
    ],
    vatten: {
      dryck: "Liten skål med friskt vatten",
      behandling: "Byt vatten dagligen, ingen klorbehandling behövs",
    },
    beteende: {
      aktivitet: "Nattaktiv, mest aktiv efter solnedgång",
      social: "Solitär, kan bli stressad av andra geckos",
      lek: "Gräver, utforskar, jagar insekter",
    },
    aktivitetscykel: {
      vaknar: "Kväll (ca 18:00)",
      sover: "Morgon (ca 06:00)",
      aktiva_timmar: "18:00-06:00",
    },
    sjukdomar: [
      {
        namn: "Metabolisk bensjukdom (MBD)",
        symptom: ["Mjuka ben", "Deformerade lemmar", "Svaghet", "Dålig aptit"],
        åtgärd: "Kontakta reptilveterinär omedelbart. Öka kalcium- och D3-tillskott. Kontrollera UVB-belysning.",
      },
      {
        namn: "Parasiter",
        symptom: ["Diarré", "Viktnedgång", "Tappar aptit", "Slöhet"],
        åtgärd: "Avmaska enligt veterinärs anvisningar. Rengör terrariet noggrant.",
      },
    ],
    varningar: [
      "Använd ALDRIG löst sandsubstrat - risk för impaktation",
      "Undvik att mata för stora insekter (max lika breda som geckons huvud)",
      "Håll aldrig flera hanar tillsammans",
      "Kontrollera temperaturen dagligen med digital termometer",
    ],
    checklistor: {
      inköp: [
        "Terrarium 60x30x30 cm",
        "Värmematta med termostat",
        "Digital termometer/hygrometer",
        "UVB-lampa (5.0)",
        "Gömställe (varm sida)",
        "Gömställe (sval sida)",
        "Fuktkammare",
        "Vattenkopp",
        "Reptilmatta eller pappershandduk",
        "Kalcium med D3",
        "Kalcium utan D3",
        "Vitaminpulver",
        "Insektsburk med lock",
        "Pincett för matning",
      ],
      daglig: [
        "Kontrollera temperatur (varm zon 28-32°C)",
        "Kontrollera fuktighet (30-40%)",
        "Byt vatten i skålen",
        "Mata (om matdag)",
        "Ta bort avföring",
        "Kontrollera att geckon verkar frisk",
      ],
      veckovis: [
        "Rengör vattenkopp ordentligt",
        "Kontrollera fuktkammaren",
        "Väg geckon",
        "Kontrollera UVB-lampans funktion",
        "Rengör terrariet ytligt",
        "Pudra insekter med kalcium",
      ],
    },
  },
  {
    id: "skoldpadda",
    namn: "Grekisk landsköldpadda",
    vetenskapligt_namn: "Testudo graeca",
    emoji: "🐢",
    kategori: "Reptil",
    svårighet: "Medel",
    aktivitet: "Dagaktiv",
    livslängd_år: "50+",
    beskrivning: "En långlivad sköldpadda som kräver ordentlig planering. Kan leva längre än sin ägare!",
    theme: "turtle",
    skötsel: {
      temperatur: "22-28°C dag, 18°C natt",
      fuktighet: "50-70%",
      belysning: "UVB-lampa 12h/dag (stark 10.0 eller 12.0)",
      substrat: "Jord- och sandblandning, cypressmulch",
      bostad: "Inomhus: 120x60 cm. Utomhus: inhägnad minst 2x2m",
    },
    mat: [
      { typ: "Bladgrönsaker", frekvens: "Dagligen", mängd: "50-100g" },
      { typ: "Ogräs (maskros, klöver)", frekvens: "Dagligen", mängd: "En näve" },
      { typ: "Grönsaker", frekvens: "Varannan dag", mängd: "30g" },
      { typ: "Frukt", frekvens: "1 gång/vecka", mängd: "10g (som godis)" },
    ],
    vatten: {
      dryck: "Stor, grund skål för drickning och bad",
      behandling: "Klorfritt vatten, byt dagligen. Bad 1-2 ggr/vecka.",
    },
    beteende: {
      aktivitet: "Dagaktiv, solar gärna",
      social: "Kan bo med andra men vakta hanars aggression",
      lek: "Gräver, utforskar, klättrar",
    },
    aktivitetscykel: {
      vaknar: "Morgon (ca 07:00)",
      sover: "Kväll (ca 19:00)",
      aktiva_timmar: "07:00-19:00",
    },
    sjukdomar: [
      {
        namn: "Skalröta",
        symptom: ["Mjuka fläckar på skalet", "Missfärgning", "Lukt"],
        åtgärd: "Håll torrt och rent. Kontakta reptilveterinär för behandling.",
      },
      {
        namn: "Respiratorisk infektion",
        symptom: ["Bubblor vid näsan", "Tunga andetag", "Gapande mun", "Slöhet"],
        åtgärd: "Höj temperaturen. Kontakta veterinär omedelbart.",
      },
    ],
    varningar: [
      "Planera för 50+ års ansvar innan köp",
      "Vintervila (hibernering) kräver kunskap och förberedelse",
      "Undvik isbergssallad och spenat (blockerar kalcium)",
      "Aldrig för fuktig miljö - risk för skalröta",
      "Stark UVB är absolut nödvändigt",
    ],
    checklistor: {
      inköp: [
        "Stort terrarium/bord (120x60 cm)",
        "Stark UVB-lampa (10.0 eller 12.0)",
        "Värmelampa med reflektor",
        "Termostat",
        "Termometer/hygrometer",
        "Substrat (jord/sand/cypressmulch)",
        "Stor grund vattenskål",
        "Gömställe",
        "Kalciumblock",
        "Sepiaskal",
      ],
      daglig: [
        "Kontrollera temperatur",
        "Erbjud färska grönsaker",
        "Byt dricksvatten",
        "Ta bort matrester och avföring",
        "Kontrollera att lampor fungerar",
        "Observera beteende och aptit",
      ],
      veckovis: [
        "Bad i ljummet vatten (15-20 min)",
        "Rengör vattenskål ordentligt",
        "Väg sköldpaddan",
        "Kontrollera skalets kondition",
        "Djuprengör del av inhägnad",
      ],
    },
  },
  {
    id: "hamster",
    namn: "Guldhamster",
    vetenskapligt_namn: "Mesocricetus auratus",
    emoji: "🐹",
    kategori: "Däggdjur",
    svårighet: "Nybörjare",
    aktivitet: "Nattaktiv",
    livslängd_år: "2-3",
    beskrivning: "En söt och aktiv nattlevande gnagare. Kräver större bur än många tror!",
    theme: "hamster",
    skötsel: {
      temperatur: "20-24°C",
      fuktighet: "40-60%",
      belysning: "Naturligt dagsljus, ingen extra lampa behövs",
      substrat: "Minst 20cm strö för grävning (papper/spån)",
      bostad: "Minimum 100x50 cm (större är bättre)",
    },
    mat: [
      { typ: "Hamsterpellets/mix", frekvens: "Dagligen", mängd: "1-2 matskedar" },
      { typ: "Färska grönsaker", frekvens: "Varannan dag", mängd: "Liten bit" },
      { typ: "Protein (ägg, mjölmask)", frekvens: "1-2 ggr/vecka", mängd: "Litet" },
    ],
    vatten: {
      dryck: "Vattenflaska med pipett",
      behandling: "Byt vatten dagligen, rengör flaskan varje vecka",
    },
    beteende: {
      aktivitet: "Nattaktiv, springer i hjul på natten",
      social: "Strikt solitär - ALDRIG håll flera tillsammans",
      lek: "Springer i hjul, gräver, hamstrar mat",
    },
    aktivitetscykel: {
      vaknar: "Kväll (ca 19:00-21:00)",
      sover: "Morgon till eftermiddag",
      aktiva_timmar: "21:00-06:00",
    },
    sjukdomar: [
      {
        namn: "Våt svans (Wet tail)",
        symptom: ["Diarré", "Våt bakkropp", "Slöhet", "Aptitlöshet"],
        åtgärd: "AKUT veterinärfall! Kan vara dödligt inom 48h.",
      },
      {
        namn: "Tandproblem",
        symptom: ["Äter inte", "Dreglar", "Övervuxna tänder"],
        åtgärd: "Veterinär kan klippa tänderna. Ge mer tuggmaterial.",
      },
    ],
    varningar: [
      "Guldhamstrar är ALLTID solitära - håll aldrig två tillsammans",
      "Väck aldrig en sovande hamster (kan bitas)",
      "Små burar orsakar stereotypa beteenden",
      "Hamsterbollar är stressande och farliga",
      "Undvik bomull som bobyggnads - risk för strypning",
    ],
    checklistor: {
      inköp: [
        "Stor bur (minst 100x50 cm)",
        "Hjul (minst 28 cm diameter för guldhamster)",
        "Djupt strölager (papper eller spån)",
        "Vattenflaska",
        "Matskål",
        "Gömställe/hus",
        "Tunnlar och rör",
        "Sandbad",
        "Tuggpinnar/tuggmaterial",
        "Hamsterfoder (pellets eller mix)",
      ],
      daglig: [
        "Kontrollera vattenflaskan",
        "Fyll på mat",
        "Ta bort färsk mat som inte ätits",
        "Kontrollera att hjulet snurrar",
        "Punktrengör toalettområde",
        "Observera beteende",
      ],
      veckovis: [
        "Delrengör buren (byt 1/3 av ströet)",
        "Rengör vattenflaskan",
        "Kontrollera att inget gömda mat möglar",
        "Väg hamstern",
        "Kolla päls och ögon",
        "Byt sand i sandbadet",
      ],
    },
  },
  {
    id: "kanin",
    namn: "Kanin",
    vetenskapligt_namn: "Oryctolagus cuniculus",
    emoji: "🐰",
    kategori: "Däggdjur",
    svårighet: "Medel",
    aktivitet: "Skymningsaktiv",
    livslängd_år: "8-12",
    beskrivning: "Sociala och intelligenta djur som behöver sällskap och mycket utrymme.",
    theme: "rabbit",
    skötsel: {
      temperatur: "15-22°C (tål inte värme över 25°C)",
      fuktighet: "40-60%",
      belysning: "Naturligt dagsljus",
      substrat: "Hö, halm eller pappersströ",
      bostad: "Minimum 2x3 meter löputrymme + sovlåda",
    },
    mat: [
      { typ: "Hö", frekvens: "Obegränsat", mängd: "Kroppsstorleks-hög dagligen" },
      { typ: "Pellets", frekvens: "Dagligen", mängd: "1 msk per kg kroppsvikt" },
      { typ: "Bladgrönsaker", frekvens: "Dagligen", mängd: "1 kopp per kg" },
      { typ: "Frukt/morot", frekvens: "Sällan", mängd: "Som godis endast" },
    ],
    vatten: {
      dryck: "Stor skål eller flaska med färskt vatten",
      behandling: "Byt dagligen, rengör skålen ofta",
    },
    beteende: {
      aktivitet: "Mest aktiv gryning och skymning",
      social: "Starkt sociala - bör hållas i par",
      lek: "Hoppar, springer, gräver, utforskar",
    },
    aktivitetscykel: {
      vaknar: "Gryning (ca 05:00-07:00)",
      sover: "Mitt på dagen och natten",
      aktiva_timmar: "05:00-09:00 och 17:00-22:00",
    },
    sjukdomar: [
      {
        namn: "Magstopp (GI stasis)",
        symptom: ["Slutar äta", "Ingen avföring", "Uppsvälld mage", "Smärta"],
        åtgärd: "AKUT! Kontakta veterinär omedelbart. Ge vatten, försiktig magmassage.",
      },
      {
        namn: "Snuva (Pasteurellos)",
        symptom: ["Nysningar", "Flytning från näsa", "Tårflöde"],
        åtgärd: "Veterinärbesök för antibiotika. Håll rent och torrt.",
      },
    ],
    varningar: [
      "Kaniner dör av ensamhet - håll alltid minst två (kastrerade)",
      "HÖ är livsviktigt - 80% av kosten ska vara hö",
      "Små burar orsakar benproblem och depression",
      "Vaccination mot kaningulsot rekommenderas",
      "Tål INTE värme - risk för värmeslag över 25°C",
    ],
    checklistor: {
      inköp: [
        "Stor inhägnad eller kaninrum",
        "Sovlåda/hus",
        "Höhäck",
        "Vattenskål (stor)",
        "Matskål för pellets",
        "Toalåda med strö",
        "Leksaker (tunnlar, bollar)",
        "Borste för pälsvård",
        "Kvalitetshö (timothy eller ängs-)",
        "Pellets (utan socker/godis)",
        "Transport-bur för veterinärbesök",
      ],
      daglig: [
        "Fyll på hö (obegränsat)",
        "Ge pellets (rätt mängd)",
        "Ge färska grönsaker",
        "Byt vatten",
        "Rengör toalådan",
        "Kontrollera avföring (mängd och form)",
        "Umgås och observera beteende",
      ],
      veckovis: [
        "Väg kaninen",
        "Borsta pälsen",
        "Kontrollera klor",
        "Rengör inhägnaden grundligt",
        "Kontrollera tänder och öron",
        "Byt allt strö",
      ],
    },
  },
  {
    id: "mysksköldpadda",
    namn: "Mysksköldpadda",
    vetenskapligt_namn: "Sternotherus odoratus",
    emoji: "🐢",
    kategori: "Reptil",
    svårighet: "Medel",
    aktivitet: "Dagaktiv",
    livslängd_år: "30-50",
    beskrivning: "Liten vattensköldpadda som får sitt namn av den muskliknande doften den avger vid stress.",
    theme: "turtle",
    skötsel: {
      temperatur: "Vatten: 22-26°C, Basking: 28-30°C",
      fuktighet: "N/A (akvatisk)",
      belysning: "UVB-lampa 10-12h/dag över basking-plats",
      substrat: "Sand eller slätt grus (eller bar botten)",
      bostad: "Akvarium minst 80L för en vuxen, 120L+ rekommenderas",
    },
    mat: [
      { typ: "Sköldpaddspellets", frekvens: "Dagligen", mängd: "Huvudets storlek" },
      { typ: "Fisk/räkor", frekvens: "2-3 ggr/vecka", mängd: "Liten bit" },
      { typ: "Sniglar/insekter", frekvens: "1-2 ggr/vecka", mängd: "2-3 st" },
      { typ: "Vattenväxter", frekvens: "Tillgängligt", mängd: "Efter behag" },
    ],
    vatten: {
      dryck: "Lever i vattnet - rent akvarium",
      behandling: "Kraftigt filter, vattenbyten 25% veckovis, klorbehandla nytt vatten",
    },
    beteende: {
      aktivitet: "Huvudsakligen i vattnet, badar sällan",
      social: "Kan hållas ensam, försiktig med flera",
      lek: "Simmar, utforskar botten, jagar",
    },
    aktivitetscykel: {
      vaknar: "Morgon",
      sover: "Natt",
      aktiva_timmar: "08:00-18:00",
    },
    sjukdomar: [
      {
        namn: "Skalröta",
        symptom: ["Vita fläckar", "Mjuka områden", "Dålig lukt"],
        åtgärd: "Förbättra vattenkvalitet. Torrlägg och behandla med antiseptisk lösning. Veterinär vid allvarliga fall.",
      },
      {
        namn: "Respiratorisk infektion",
        symptom: ["Flyter snett", "Bubblor vid näsan", "Gapande mun"],
        åtgärd: "Höj vattentemperaturen något. Kontakta reptilveterinär.",
      },
    ],
    varningar: [
      "Avger illaluktande sekret vid stress - hantera försiktigt",
      "Kraftigt filter KRÄVS - smutsigt vatten orsakar sjukdom",
      "Kan bita hårt trots liten storlek",
      "Basking-plats måste finnas även om de sällan använder den",
    ],
    checklistor: {
      inköp: [
        "Akvarium 80-120L",
        "Kraftigt filter (för 2x akvariumvolymen)",
        "Vattenvärmare med termostat",
        "Termometer för vatten",
        "Basking-plattform",
        "UVB-lampa",
        "Värmelampa för basking",
        "Vattenberedningsmedel (klorborttagare)",
        "Sköldpaddspellets",
        "Dekorationer/gömställen",
      ],
      daglig: [
        "Kontrollera vattentemperatur (22-26°C)",
        "Mata (rätt mängd)",
        "Ta bort matrester",
        "Kontrollera filter fungerar",
        "Observera sköldpaddans beteende",
        "Kontrollera basking-lampans funktion",
      ],
      veckovis: [
        "Vattenbyte 25-30%",
        "Testa vattenkvalitet (ammoniak, nitrit, nitrat)",
        "Rengör filtermedier (i akvariets vatten)",
        "Kontrollera skalets kondition",
        "Dammsugg botten",
      ],
    },
  },
];

export const categories = [
  { id: "all", namn: "Alla", emoji: "🐾" },
  { id: "reptil", namn: "Reptiler", emoji: "🦎" },
  { id: "däggdjur", namn: "Däggdjur", emoji: "🐹" },
  { id: "fågel", namn: "Fåglar", emoji: "🦜" },
  { id: "groddjur", namn: "Groddjur", emoji: "🐸" },
  { id: "fisk", namn: "Fiskar", emoji: "🐟" },
  { id: "kräftdjur", namn: "Kräftdjur", emoji: "🦀" },
];
