import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUserSettings } from "./useUserSettings";

// Translation definitions
const translations = {
  sv: {
    // Navigation
    "nav.globalAI": "Allmän AI",
    "nav.settings": "Inställningar",
    "nav.admin": "Admin",
    "nav.login": "Logga in",
    "nav.logout": "Logga ut",
    "nav.species": "arter",
    "nav.role": "Roll",
    "nav.user": "Användare",
    
    // App header
    "app.title": "DjurData",
    "app.subtitle": "Din guide till ansvarsfull djurhållning",
    "app.footer": "Säker information för lyckliga husdjur",
    "app.footerWarning": "Kontakta alltid veterinär vid akuta hälsoproblem",
    
    // Search
    "search.placeholder": "Sök bland djur...",
    "search.all": "Alla",
    
    // Settings
    "settings.title": "Dina inställningar",
    "settings.subtitle": "Anpassa språk, tema och se din sparade data.",
    "settings.language": "Språk",
    "settings.languageDesc": "Välj språk för appen",
    "settings.theme": "Tema",
    "settings.themeDesc": "Välj utseende för appen",
    "settings.themeSystem": "System",
    "settings.themeLight": "Ljust",
    "settings.themeDark": "Mörkt",
    "settings.save": "Spara inställningar",
    "settings.saving": "Sparar...",
    "settings.saved": "Inställningar sparade!",
    "settings.error": "Kunde inte spara inställningar",
    "settings.chatHistory": "Dina senaste AI-frågor",
    "settings.chatHistoryDesc": "Endast dina egna frågor visas här",
    "settings.noChatHistory": "Inga AI-frågor ännu",
    "settings.accountInfo": "Kontoinformation",
    "settings.loggedInAs": "Inloggad som",
    "settings.accountId": "Konto-ID",
    "settings.unknown": "Okänd",
    "settings.back": "Tillbaka till djur",
    
    // AI Chat
    "ai.globalTitle": "Allmän Djur-AI",
    "ai.globalSubtitle": "Fråga mig om alla djur, jämför arter och få generella råd",
    "ai.expert": "experten",
    "ai.askAbout": "Fråga mig om",
    "ai.askAnimal": "Fråga om alla djur i databasen",
    "ai.selectOrAsk": "Välj ett djur eller ställ en allmän fråga",
    "ai.askQuestion": "Ställ en fråga...",
    "ai.thinking": "Tänker...",
    "ai.quickQuestions": "Snabbfrågor:",
    "ai.commonMistakes": "Vanliga misstag",
    "ai.shoppingList": "Inköpslista",
    "ai.whatMissing": "Vad saknas?",
    "ai.beginnerTips": "Tips för nybörjare",
    "ai.askAllAnimals": "Fråga mig om alla djur!",
    "ai.generalAdvice": "Jag svarar generellt om alla djur, jämför arter och ger bred kunskap.",
    "ai.chatWith": "Chatta med",
    
    // Animal profile
    "animal.lifespan": "Livslängd",
    "animal.years": "år",
    "animal.temperature": "Temperatur",
    "animal.humidity": "Fuktighet",
    "animal.lighting": "Belysning",
    "animal.housing": "Bostad",
    "animal.importantInfo": "Viktigt att veta",
    
    // Animal sections
    "section.housing": "Boende & Miljö",
    "section.food": "Mat & Utfodring",
    "section.foodTypes": "typer",
    "section.water": "Vatten",
    "section.waterDrink": "Dryck",
    "section.waterTreatment": "Behandling",
    "section.behavior": "Beteende & Aktivitet",
    "section.activityCycle": "Aktivitetscykel",
    "section.wakes": "Vaknar",
    "section.active": "Aktiv",
    "section.sleeps": "Sover",
    "section.activity": "Aktivitet",
    "section.social": "Socialt",
    "section.play": "Lek",
    "section.health": "Hälsa & Sjukdomar",
    "section.common": "vanliga",
    "section.symptoms": "Symptom",
    "section.action": "Åtgärd",
    "section.warnings": "Vanliga misstag & Varningar",
    "section.shoppingList": "Inköpslista",
    "section.items": "saker",
    "section.dailyRoutines": "Dagliga rutiner",
    "section.weeklyRoutines": "Veckorutiner",
    "section.substrate": "Substrat",
    
    // Difficulty levels
    "difficulty.beginner": "Nybörjare",
    "difficulty.medium": "Medel",
    "difficulty.advanced": "Avancerad",
    
    // Admin
    "admin.title": "Adminpanel",
    "admin.users": "Användare",
    "admin.moderation": "Moderation",
    "admin.settings": "Inställningar",
    
    // General
    "general.loading": "Laddar...",
    "general.error": "Fel",
    "general.selectAnimal": "Välj ett djur för att se information",
  },
  en: {
    // Navigation
    "nav.globalAI": "General AI",
    "nav.settings": "Settings",
    "nav.admin": "Admin",
    "nav.login": "Log in",
    "nav.logout": "Log out",
    "nav.species": "species",
    "nav.role": "Role",
    "nav.user": "User",
    
    // App header
    "app.title": "AnimalData",
    "app.subtitle": "Your guide to responsible pet care",
    "app.footer": "Safe information for happy pets",
    "app.footerWarning": "Always contact a vet for acute health issues",
    
    // Search
    "search.placeholder": "Search animals...",
    "search.all": "All",
    
    // Settings
    "settings.title": "Your settings",
    "settings.subtitle": "Customize language, theme and view your saved data.",
    "settings.language": "Language",
    "settings.languageDesc": "Choose app language",
    "settings.theme": "Theme",
    "settings.themeDesc": "Choose app appearance",
    "settings.themeSystem": "System",
    "settings.themeLight": "Light",
    "settings.themeDark": "Dark",
    "settings.save": "Save settings",
    "settings.saving": "Saving...",
    "settings.saved": "Settings saved!",
    "settings.error": "Could not save settings",
    "settings.chatHistory": "Your recent AI questions",
    "settings.chatHistoryDesc": "Only your own questions are shown here",
    "settings.noChatHistory": "No AI questions yet",
    "settings.accountInfo": "Account information",
    "settings.loggedInAs": "Logged in as",
    "settings.accountId": "Account ID",
    "settings.unknown": "Unknown",
    "settings.back": "Back to animals",
    
    // AI Chat
    "ai.globalTitle": "General Animal AI",
    "ai.globalSubtitle": "Ask me about all animals, compare species and get general advice",
    "ai.expert": "expert",
    "ai.askAbout": "Ask me about",
    "ai.askAnimal": "Ask about all animals in the database",
    "ai.selectOrAsk": "Select an animal or ask a general question",
    "ai.askQuestion": "Ask a question...",
    "ai.thinking": "Thinking...",
    "ai.quickQuestions": "Quick questions:",
    "ai.commonMistakes": "Common mistakes",
    "ai.shoppingList": "Shopping list",
    "ai.whatMissing": "What's missing?",
    "ai.beginnerTips": "Beginner tips",
    "ai.askAllAnimals": "Ask me about any animal!",
    "ai.generalAdvice": "I answer generally about all animals, compare species and provide broad knowledge.",
    "ai.chatWith": "Chat with",
    
    // Animal profile
    "animal.lifespan": "Lifespan",
    "animal.years": "years",
    "animal.temperature": "Temperature",
    "animal.humidity": "Humidity",
    "animal.lighting": "Lighting",
    "animal.housing": "Housing",
    "animal.importantInfo": "Important to know",
    
    // Animal sections
    "section.housing": "Housing & Environment",
    "section.food": "Food & Feeding",
    "section.foodTypes": "types",
    "section.water": "Water",
    "section.waterDrink": "Drinking",
    "section.waterTreatment": "Treatment",
    "section.behavior": "Behavior & Activity",
    "section.activityCycle": "Activity cycle",
    "section.wakes": "Wakes",
    "section.active": "Active",
    "section.sleeps": "Sleeps",
    "section.activity": "Activity",
    "section.social": "Social",
    "section.play": "Play",
    "section.health": "Health & Diseases",
    "section.common": "common",
    "section.symptoms": "Symptoms",
    "section.action": "Action",
    "section.warnings": "Common mistakes & Warnings",
    "section.shoppingList": "Shopping list",
    "section.items": "items",
    "section.dailyRoutines": "Daily routines",
    "section.weeklyRoutines": "Weekly routines",
    "section.substrate": "Substrate",
    
    // Difficulty levels
    "difficulty.beginner": "Beginner",
    "difficulty.medium": "Medium",
    "difficulty.advanced": "Advanced",
    
    // Admin
    "admin.title": "Admin Panel",
    "admin.users": "Users",
    "admin.moderation": "Moderation",
    "admin.settings": "Settings",
    
    // General
    "general.loading": "Loading...",
    "general.error": "Error",
    "general.selectAnimal": "Select an animal to see information",
  },
  de: {
    // Navigation
    "nav.globalAI": "Allgemeine KI",
    "nav.settings": "Einstellungen",
    "nav.admin": "Admin",
    "nav.login": "Anmelden",
    "nav.logout": "Abmelden",
    "nav.species": "Arten",
    "nav.role": "Rolle",
    "nav.user": "Benutzer",
    
    // App header
    "app.title": "TierDaten",
    "app.subtitle": "Ihr Leitfaden für verantwortungsvolle Tierhaltung",
    "app.footer": "Sichere Informationen für glückliche Haustiere",
    "app.footerWarning": "Bei akuten Gesundheitsproblemen immer einen Tierarzt kontaktieren",
    
    // Search
    "search.placeholder": "Tiere suchen...",
    "search.all": "Alle",
    
    // Settings
    "settings.title": "Ihre Einstellungen",
    "settings.subtitle": "Sprache, Design anpassen und gespeicherte Daten anzeigen.",
    "settings.language": "Sprache",
    "settings.languageDesc": "App-Sprache wählen",
    "settings.theme": "Design",
    "settings.themeDesc": "App-Aussehen wählen",
    "settings.themeSystem": "System",
    "settings.themeLight": "Hell",
    "settings.themeDark": "Dunkel",
    "settings.save": "Einstellungen speichern",
    "settings.saving": "Speichern...",
    "settings.saved": "Einstellungen gespeichert!",
    "settings.error": "Einstellungen konnten nicht gespeichert werden",
    "settings.chatHistory": "Ihre letzten KI-Fragen",
    "settings.chatHistoryDesc": "Nur Ihre eigenen Fragen werden hier angezeigt",
    "settings.noChatHistory": "Noch keine KI-Fragen",
    "settings.accountInfo": "Kontoinformationen",
    "settings.loggedInAs": "Angemeldet als",
    "settings.accountId": "Konto-ID",
    "settings.unknown": "Unbekannt",
    "settings.back": "Zurück zu Tieren",
    
    // AI Chat
    "ai.globalTitle": "Allgemeine Tier-KI",
    "ai.globalSubtitle": "Fragen Sie mich über alle Tiere, vergleichen Sie Arten",
    "ai.expert": "Experte",
    "ai.askAbout": "Fragen Sie mich über",
    "ai.askAnimal": "Fragen Sie über alle Tiere in der Datenbank",
    "ai.selectOrAsk": "Wählen Sie ein Tier oder stellen Sie eine allgemeine Frage",
    "ai.askQuestion": "Stellen Sie eine Frage...",
    "ai.thinking": "Denken...",
    "ai.quickQuestions": "Schnellfragen:",
    "ai.commonMistakes": "Häufige Fehler",
    "ai.shoppingList": "Einkaufsliste",
    "ai.whatMissing": "Was fehlt?",
    "ai.beginnerTips": "Anfängertipps",
    "ai.askAllAnimals": "Fragen Sie mich über alle Tiere!",
    "ai.generalAdvice": "Ich antworte allgemein über alle Tiere und vergleiche Arten.",
    "ai.chatWith": "Chatten mit",
    
    // Animal profile
    "animal.lifespan": "Lebensdauer",
    "animal.years": "Jahre",
    "animal.temperature": "Temperatur",
    "animal.humidity": "Feuchtigkeit",
    "animal.lighting": "Beleuchtung",
    "animal.housing": "Unterkunft",
    "animal.importantInfo": "Wichtig zu wissen",
    
    // Animal sections
    "section.housing": "Unterkunft & Umgebung",
    "section.food": "Futter & Fütterung",
    "section.foodTypes": "Arten",
    "section.water": "Wasser",
    "section.waterDrink": "Trinken",
    "section.waterTreatment": "Behandlung",
    "section.behavior": "Verhalten & Aktivität",
    "section.activityCycle": "Aktivitätszyklus",
    "section.wakes": "Wacht auf",
    "section.active": "Aktiv",
    "section.sleeps": "Schläft",
    "section.activity": "Aktivität",
    "section.social": "Sozial",
    "section.play": "Spiel",
    "section.health": "Gesundheit & Krankheiten",
    "section.common": "häufig",
    "section.symptoms": "Symptome",
    "section.action": "Maßnahme",
    "section.warnings": "Häufige Fehler & Warnungen",
    "section.shoppingList": "Einkaufsliste",
    "section.items": "Artikel",
    "section.dailyRoutines": "Tägliche Routinen",
    "section.weeklyRoutines": "Wöchentliche Routinen",
    "section.substrate": "Substrat",
    
    // Difficulty levels
    "difficulty.beginner": "Anfänger",
    "difficulty.medium": "Mittel",
    "difficulty.advanced": "Fortgeschritten",
    
    // Admin
    "admin.title": "Admin-Panel",
    "admin.users": "Benutzer",
    "admin.moderation": "Moderation",
    "admin.settings": "Einstellungen",
    
    // General
    "general.loading": "Laden...",
    "general.error": "Fehler",
    "general.selectAnimal": "Wählen Sie ein Tier, um Informationen zu sehen",
  },
  no: {
    // Navigation
    "nav.globalAI": "Generell AI",
    "nav.settings": "Innstillinger",
    "nav.admin": "Admin",
    "nav.login": "Logg inn",
    "nav.logout": "Logg ut",
    "nav.species": "arter",
    "nav.role": "Rolle",
    "nav.user": "Bruker",
    
    // App header
    "app.title": "DyrData",
    "app.subtitle": "Din guide til ansvarlig dyrehold",
    "app.footer": "Sikker informasjon for lykkelige kjæledyr",
    "app.footerWarning": "Kontakt alltid veterinær ved akutte helseproblemer",
    
    // Search
    "search.placeholder": "Søk blant dyr...",
    "search.all": "Alle",
    
    // Settings
    "settings.title": "Dine innstillinger",
    "settings.subtitle": "Tilpass språk, tema og se lagret data.",
    "settings.language": "Språk",
    "settings.languageDesc": "Velg app-språk",
    "settings.theme": "Tema",
    "settings.themeDesc": "Velg app-utseende",
    "settings.themeSystem": "System",
    "settings.themeLight": "Lyst",
    "settings.themeDark": "Mørkt",
    "settings.save": "Lagre innstillinger",
    "settings.saving": "Lagrer...",
    "settings.saved": "Innstillinger lagret!",
    "settings.error": "Kunne ikke lagre innstillinger",
    "settings.chatHistory": "Dine siste AI-spørsmål",
    "settings.chatHistoryDesc": "Bare dine egne spørsmål vises her",
    "settings.noChatHistory": "Ingen AI-spørsmål ennå",
    "settings.accountInfo": "Kontoinformasjon",
    "settings.loggedInAs": "Innlogget som",
    "settings.accountId": "Konto-ID",
    "settings.unknown": "Ukjent",
    "settings.back": "Tilbake til dyr",
    
    // AI Chat  
    "ai.globalTitle": "Generell Dyre-AI",
    "ai.globalSubtitle": "Spør meg om alle dyr, sammenlign arter og få generelle råd",
    "ai.expert": "ekspert",
    "ai.askAbout": "Spør meg om",
    "ai.askAnimal": "Spør om alle dyr i databasen",
    "ai.selectOrAsk": "Velg et dyr eller still et generelt spørsmål",
    "ai.askQuestion": "Still et spørsmål...",
    "ai.thinking": "Tenker...",
    "ai.quickQuestions": "Hurtigspørsmål:",
    "ai.commonMistakes": "Vanlige feil",
    "ai.shoppingList": "Handleliste",
    "ai.whatMissing": "Hva mangler?",
    "ai.beginnerTips": "Tips for nybegynnere",
    "ai.askAllAnimals": "Spør meg om alle dyr!",
    "ai.generalAdvice": "Jeg svarer generelt om alle dyr og sammenligner arter.",
    "ai.chatWith": "Chat med",
    
    // Animal profile
    "animal.lifespan": "Levetid",
    "animal.years": "år",
    "animal.temperature": "Temperatur",
    "animal.humidity": "Fuktighet",
    "animal.lighting": "Belysning",
    "animal.housing": "Bolig",
    "animal.importantInfo": "Viktig å vite",
    
    // Animal sections
    "section.housing": "Bolig & Miljø",
    "section.food": "Mat & Fôring",
    "section.foodTypes": "typer",
    "section.water": "Vann",
    "section.waterDrink": "Drikke",
    "section.waterTreatment": "Behandling",
    "section.behavior": "Atferd & Aktivitet",
    "section.activityCycle": "Aktivitetssyklus",
    "section.wakes": "Våkner",
    "section.active": "Aktiv",
    "section.sleeps": "Sover",
    "section.activity": "Aktivitet",
    "section.social": "Sosial",
    "section.play": "Lek",
    "section.health": "Helse & Sykdommer",
    "section.common": "vanlige",
    "section.symptoms": "Symptomer",
    "section.action": "Tiltak",
    "section.warnings": "Vanlige feil & Advarsler",
    "section.shoppingList": "Handleliste",
    "section.items": "ting",
    "section.dailyRoutines": "Daglige rutiner",
    "section.weeklyRoutines": "Ukentlige rutiner",
    "section.substrate": "Substrat",
    
    // Difficulty levels
    "difficulty.beginner": "Nybegynner",
    "difficulty.medium": "Middels",
    "difficulty.advanced": "Avansert",
    
    // Admin
    "admin.title": "Admin-panel",
    "admin.users": "Brukere",
    "admin.moderation": "Moderering",
    "admin.settings": "Innstillinger",
    
    // General
    "general.loading": "Laster...",
    "general.error": "Feil",
    "general.selectAnimal": "Velg et dyr for å se informasjon",
  },
  fi: {
    // Navigation
    "nav.globalAI": "Yleinen AI",
    "nav.settings": "Asetukset",
    "nav.admin": "Admin",
    "nav.login": "Kirjaudu",
    "nav.logout": "Kirjaudu ulos",
    "nav.species": "lajia",
    "nav.role": "Rooli",
    "nav.user": "Käyttäjä",
    
    // App header
    "app.title": "EläinData",
    "app.subtitle": "Oppaasi vastuulliseen lemmikkien hoitoon",
    "app.footer": "Turvallista tietoa onnellisille lemmikeille",
    "app.footerWarning": "Ota aina yhteyttä eläinlääkäriin akuuteissa terveysongelmissa",
    
    // Search
    "search.placeholder": "Etsi eläimiä...",
    "search.all": "Kaikki",
    
    // Settings
    "settings.title": "Asetuksesi",
    "settings.subtitle": "Muokkaa kieltä, teemaa ja katso tallennettuja tietoja.",
    "settings.language": "Kieli",
    "settings.languageDesc": "Valitse sovelluksen kieli",
    "settings.theme": "Teema",
    "settings.themeDesc": "Valitse sovelluksen ulkoasu",
    "settings.themeSystem": "Järjestelmä",
    "settings.themeLight": "Vaalea",
    "settings.themeDark": "Tumma",
    "settings.save": "Tallenna asetukset",
    "settings.saving": "Tallennetaan...",
    "settings.saved": "Asetukset tallennettu!",
    "settings.error": "Asetuksia ei voitu tallentaa",
    "settings.chatHistory": "Viimeisimmät AI-kysymyksesi",
    "settings.chatHistoryDesc": "Vain omat kysymyksesi näytetään täällä",
    "settings.noChatHistory": "Ei AI-kysymyksiä vielä",
    "settings.accountInfo": "Tilitiedot",
    "settings.loggedInAs": "Kirjautunut",
    "settings.accountId": "Tili-ID",
    "settings.unknown": "Tuntematon",
    "settings.back": "Takaisin eläimiin",
    
    // AI Chat
    "ai.globalTitle": "Yleinen Eläin-AI",
    "ai.globalSubtitle": "Kysy minulta kaikista eläimistä ja vertaile lajeja",
    "ai.expert": "asiantuntija",
    "ai.askAbout": "Kysy minulta",
    "ai.askAnimal": "Kysy kaikista tietokannan eläimistä",
    "ai.selectOrAsk": "Valitse eläin tai esitä yleinen kysymys",
    "ai.askQuestion": "Esitä kysymys...",
    "ai.thinking": "Ajattelen...",
    "ai.quickQuestions": "Pikakysymykset:",
    "ai.commonMistakes": "Yleiset virheet",
    "ai.shoppingList": "Ostoslista",
    "ai.whatMissing": "Mikä puuttuu?",
    "ai.beginnerTips": "Vinkkejä aloittelijoille",
    "ai.askAllAnimals": "Kysy minulta kaikista eläimistä!",
    "ai.generalAdvice": "Vastaan yleisesti kaikista eläimistä ja vertailen lajeja.",
    "ai.chatWith": "Keskustele",
    
    // Animal profile
    "animal.lifespan": "Elinikä",
    "animal.years": "vuotta",
    "animal.temperature": "Lämpötila",
    "animal.humidity": "Kosteus",
    "animal.lighting": "Valaistus",
    "animal.housing": "Asuminen",
    "animal.importantInfo": "Tärkeää tietää",
    
    // Animal sections
    "section.housing": "Asuminen & Ympäristö",
    "section.food": "Ruoka & Ruokinta",
    "section.foodTypes": "tyyppiä",
    "section.water": "Vesi",
    "section.waterDrink": "Juominen",
    "section.waterTreatment": "Käsittely",
    "section.behavior": "Käyttäytyminen & Aktiviteetti",
    "section.activityCycle": "Aktiviteettisykli",
    "section.wakes": "Herää",
    "section.active": "Aktiivinen",
    "section.sleeps": "Nukkuu",
    "section.activity": "Aktiviteetti",
    "section.social": "Sosiaalinen",
    "section.play": "Leikki",
    "section.health": "Terveys & Sairaudet",
    "section.common": "yleistä",
    "section.symptoms": "Oireet",
    "section.action": "Toimenpide",
    "section.warnings": "Yleiset virheet & Varoitukset",
    "section.shoppingList": "Ostoslista",
    "section.items": "tuotetta",
    "section.dailyRoutines": "Päivittäiset rutiinit",
    "section.weeklyRoutines": "Viikoittaiset rutiinit",
    "section.substrate": "Alusta",
    
    // Difficulty levels
    "difficulty.beginner": "Aloittelija",
    "difficulty.medium": "Keskitaso",
    "difficulty.advanced": "Edistynyt",
    
    // Admin
    "admin.title": "Admin-paneeli",
    "admin.users": "Käyttäjät",
    "admin.moderation": "Moderointi",
    "admin.settings": "Asetukset",
    
    // General
    "general.loading": "Ladataan...",
    "general.error": "Virhe",
    "general.selectAnimal": "Valitse eläin nähdäksesi tiedot",
  },
  es: {
    // Navigation
    "nav.globalAI": "IA General",
    "nav.settings": "Configuración",
    "nav.admin": "Admin",
    "nav.login": "Iniciar sesión",
    "nav.logout": "Cerrar sesión",
    "nav.species": "especies",
    "nav.role": "Rol",
    "nav.user": "Usuario",
    
    // App header
    "app.title": "DatosAnimales",
    "app.subtitle": "Tu guía para el cuidado responsable de mascotas",
    "app.footer": "Información segura para mascotas felices",
    "app.footerWarning": "Siempre contacta a un veterinario para problemas de salud agudos",
    
    // Search
    "search.placeholder": "Buscar animales...",
    "search.all": "Todos",
    
    // Settings
    "settings.title": "Tu configuración",
    "settings.subtitle": "Personaliza idioma, tema y ve tus datos guardados.",
    "settings.language": "Idioma",
    "settings.languageDesc": "Elige el idioma de la app",
    "settings.theme": "Tema",
    "settings.themeDesc": "Elige la apariencia de la app",
    "settings.themeSystem": "Sistema",
    "settings.themeLight": "Claro",
    "settings.themeDark": "Oscuro",
    "settings.save": "Guardar configuración",
    "settings.saving": "Guardando...",
    "settings.saved": "¡Configuración guardada!",
    "settings.error": "No se pudo guardar la configuración",
    "settings.chatHistory": "Tus últimas preguntas a la IA",
    "settings.chatHistoryDesc": "Solo se muestran tus propias preguntas aquí",
    "settings.noChatHistory": "Sin preguntas a la IA todavía",
    "settings.accountInfo": "Información de la cuenta",
    "settings.loggedInAs": "Conectado como",
    "settings.accountId": "ID de cuenta",
    "settings.unknown": "Desconocido",
    "settings.back": "Volver a animales",
    
    // AI Chat
    "ai.globalTitle": "IA General de Animales",
    "ai.globalSubtitle": "Pregúntame sobre todos los animales y compara especies",
    "ai.expert": "experto",
    "ai.askAbout": "Pregúntame sobre",
    "ai.askAnimal": "Pregunta sobre todos los animales en la base de datos",
    "ai.selectOrAsk": "Selecciona un animal o haz una pregunta general",
    "ai.askQuestion": "Haz una pregunta...",
    "ai.thinking": "Pensando...",
    "ai.quickQuestions": "Preguntas rápidas:",
    "ai.commonMistakes": "Errores comunes",
    "ai.shoppingList": "Lista de compras",
    "ai.whatMissing": "¿Qué falta?",
    "ai.beginnerTips": "Consejos para principiantes",
    "ai.askAllAnimals": "¡Pregúntame sobre cualquier animal!",
    "ai.generalAdvice": "Respondo generalmente sobre todos los animales y comparo especies.",
    "ai.chatWith": "Chatea con",
    
    // Animal profile
    "animal.lifespan": "Esperanza de vida",
    "animal.years": "años",
    "animal.temperature": "Temperatura",
    "animal.humidity": "Humedad",
    "animal.lighting": "Iluminación",
    "animal.housing": "Vivienda",
    "animal.importantInfo": "Importante saber",
    
    // Animal sections
    "section.housing": "Vivienda y Ambiente",
    "section.food": "Comida y Alimentación",
    "section.foodTypes": "tipos",
    "section.water": "Agua",
    "section.waterDrink": "Bebida",
    "section.waterTreatment": "Tratamiento",
    "section.behavior": "Comportamiento y Actividad",
    "section.activityCycle": "Ciclo de actividad",
    "section.wakes": "Despierta",
    "section.active": "Activo",
    "section.sleeps": "Duerme",
    "section.activity": "Actividad",
    "section.social": "Social",
    "section.play": "Juego",
    "section.health": "Salud y Enfermedades",
    "section.common": "comunes",
    "section.symptoms": "Síntomas",
    "section.action": "Acción",
    "section.warnings": "Errores comunes y Advertencias",
    "section.shoppingList": "Lista de compras",
    "section.items": "artículos",
    "section.dailyRoutines": "Rutinas diarias",
    "section.weeklyRoutines": "Rutinas semanales",
    "section.substrate": "Sustrato",
    
    // Difficulty levels
    "difficulty.beginner": "Principiante",
    "difficulty.medium": "Medio",
    "difficulty.advanced": "Avanzado",
    
    // Admin
    "admin.title": "Panel de Admin",
    "admin.users": "Usuarios",
    "admin.moderation": "Moderación",
    "admin.settings": "Configuración",
    
    // General
    "general.loading": "Cargando...",
    "general.error": "Error",
    "general.selectAnimal": "Selecciona un animal para ver información",
  },
};

type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations.sv;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { settings, saveSettings } = useUserSettings();
  const [language, setLanguageState] = useState<Language>((settings.language as Language) || "sv");

  // Sync with user settings
  useEffect(() => {
    if (settings.language && settings.language !== language) {
      setLanguageState(settings.language as Language);
    }
  }, [settings.language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Also save to user settings if user is logged in
    saveSettings({ language: lang });
  };

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.sv[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Export translations for components that need direct access
export { translations };
export type { Language, TranslationKey };
