import { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, HelpCircle, ShoppingCart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Animal } from "@/data/animals";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  selectedAnimal?: Animal | null;
  animals: Animal[];
}

const quickActions = [
  { icon: HelpCircle, label: "Vanliga misstag", prompt: "Vilka är de vanligaste misstagen?" },
  { icon: ShoppingCart, label: "Inköpslista", prompt: "Skapa en inköpslista" },
  { icon: AlertTriangle, label: "Vad saknas?", prompt: "Vad kan saknas i min setup?" },
  { icon: Sparkles, label: "Tips för nybörjare", prompt: "Ge tips för nybörjare" },
];

export function AIChat({ selectedAnimal, animals }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (selectedAnimal) {
      // Animal-specific responses
      if (lowerMessage.includes("inköp") || lowerMessage.includes("lista") || lowerMessage.includes("köpa")) {
        return `🛒 **Inköpslista för ${selectedAnimal.namn}:**\n\n${selectedAnimal.checklistor.inköp.map((item, i) => `${i + 1}. ${item}`).join('\n')}\n\n💡 Kom ihåg att alltid kontrollera kvaliteten på utrustningen innan köp!`;
      }
      
      if (lowerMessage.includes("misstag") || lowerMessage.includes("fel") || lowerMessage.includes("undvik")) {
        return `⚠️ **Vanliga misstag med ${selectedAnimal.namn}:**\n\n${selectedAnimal.varningar.map(w => `• ${w}`).join('\n')}\n\n❤️ Genom att undvika dessa misstag ger du din ${selectedAnimal.namn} ett bra liv!`;
      }
      
      if (lowerMessage.includes("temperatur") || lowerMessage.includes("värme")) {
        return `🌡️ **Temperatur för ${selectedAnimal.namn}:**\n\n${selectedAnimal.skötsel.temperatur}\n\n💡 Tips: Använd alltid en digital termometer för exakt avläsning. Kontrollera både dag- och natttemperatur.`;
      }
      
      if (lowerMessage.includes("mat") || lowerMessage.includes("foder") || lowerMessage.includes("äta")) {
        const matLista = selectedAnimal.mat.map(m => `• **${m.typ}**: ${m.mängd} (${m.frekvens})`).join('\n');
        return `🍽️ **Matguide för ${selectedAnimal.namn}:**\n\n${matLista}\n\n💧 **Vatten:** ${selectedAnimal.vatten.dryck}`;
      }
      
      if (lowerMessage.includes("sjuk") || lowerMessage.includes("hälsa") || lowerMessage.includes("symptom")) {
        const sjukdomar = selectedAnimal.sjukdomar.map(s => 
          `**${s.namn}**\nSymptom: ${s.symptom.join(', ')}\nÅtgärd: ${s.åtgärd}`
        ).join('\n\n');
        return `🩺 **Vanliga hälsoproblem hos ${selectedAnimal.namn}:**\n\n${sjukdomar}\n\n⚠️ Vid allvarliga symptom, kontakta alltid veterinär!`;
      }
      
      if (lowerMessage.includes("nybörjare") || lowerMessage.includes("tips") || lowerMessage.includes("börja")) {
        return `🌟 **Tips för nya ${selectedAnimal.namn}-ägare:**\n\n1. **Förbered allt först** - Ha boende, mat och tillbehör redo innan djuret kommer hem\n\n2. **Lär dig artens behov** - ${selectedAnimal.beskrivning}\n\n3. **Rätt temperatur** - ${selectedAnimal.skötsel.temperatur}\n\n4. **Regelbundna rutiner** - Följ dagliga och veckovisa checklistor\n\n5. **Ha tålamod** - Det tar tid för djuret att vänja sig vid sitt nya hem\n\n📚 Svårighetsgrad: ${selectedAnimal.svårighet}`;
      }
      
      // Default animal-specific response
      return `Jag hjälper dig gärna med din ${selectedAnimal.namn}! 🐾\n\nDu kan fråga mig om:\n• Mat och utfodring\n• Temperatur och miljö\n• Vanliga sjukdomar\n• Inköpslista\n• Tips för nybörjare\n\nVad vill du veta mer om?`;
    } else {
      // General responses
      if (lowerMessage.includes("djur")) {
        const djurLista = animals.map(a => `${a.emoji} ${a.namn} (${a.svårighet})`).join('\n');
        return `🐾 **Djur i databasen:**\n\n${djurLista}\n\nVälj ett djur i flikarna ovan för att få detaljerad information!`;
      }
      
      if (lowerMessage.includes("nybörjare") || lowerMessage.includes("lätt")) {
        const nybörjarDjur = animals.filter(a => a.svårighet === "Nybörjare");
        return `🌟 **Nybörjarvänliga djur:**\n\n${nybörjarDjur.map(a => `${a.emoji} **${a.namn}**\n${a.beskrivning}`).join('\n\n')}\n\nDessa djur är bra för dig som är ny inom djurhållning!`;
      }
      
      return `Hej! Jag är din AI-assistent för djurvård. 🤖\n\nJag kan hjälpa dig med:\n• Information om specifika djur\n• Skötselråd och rutiner\n• Inköpslistor\n• Hälsofrågor\n\n💡 **Tips:** Välj ett djur i flikarna ovan för mer detaljerad hjälp!`;
    }
  };

  const handleSubmit = async (message: string = input) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = generateResponse(message);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[600px] bg-card rounded-2xl border border-border overflow-hidden shadow-card">
      {/* Header */}
      <div className="bg-primary/10 border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              {selectedAnimal ? `${selectedAnimal.emoji} ${selectedAnimal.namn}-experten` : "🐾 Djurvårds-AI"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {selectedAnimal 
                ? `Fråga mig om ${selectedAnimal.namn}!` 
                : "Fråga mig om alla djur i databasen"}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <div className="p-4 border-b border-border">
          <p className="text-sm text-muted-foreground mb-3">Snabbfrågor:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => handleSubmit(action.prompt)}
                className="text-xs"
              >
                <action.icon className="w-3 h-3 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">
              {selectedAnimal 
                ? `Ställ en fråga om ${selectedAnimal.namn}!`
                : "Välj ett djur eller ställ en allmän fråga"}
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "chat-bubble animate-scale-in",
              message.role === "user" ? "user" : "assistant"
            )}
          >
            <div className="whitespace-pre-wrap text-sm">
              {message.content.split('\n').map((line, i) => {
                // Simple markdown-like formatting
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <strong key={i}>{line.slice(2, -2)}<br /></strong>;
                }
                if (line.includes('**')) {
                  const parts = line.split(/\*\*(.*?)\*\*/g);
                  return (
                    <span key={i}>
                      {parts.map((part, j) => 
                        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                      )}
                      <br />
                    </span>
                  );
                }
                return <span key={i}>{line}<br /></span>;
              })}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="chat-bubble assistant animate-pulse">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedAnimal ? `Fråga om ${selectedAnimal.namn}...` : "Ställ en fråga..."}
            className="flex-1"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
