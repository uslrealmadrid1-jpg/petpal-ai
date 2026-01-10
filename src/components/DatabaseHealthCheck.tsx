import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function DatabaseHealthCheck() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading");
  const [tableCount, setTableCount] = useState<number>(0);
  const [animalCount, setAnimalCount] = useState<number>(0);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      // Test basic connection
      const { error: healthError } = await supabase.from('animals').select('count', { count: 'exact', head: true });
      
      if (healthError) {
        setStatus("error");
        return;
      }

      // Get animal count
      const { count, error: countError } = await supabase
        .from('animals')
        .select('*', { count: 'exact', head: true });

      if (!countError) {
        setAnimalCount(count || 0);
      }

      setStatus("connected");
    } catch (error) {
      console.error("Database health check failed:", error);
      setStatus("error");
    }
  };

  if (status === "loading") {
    return (
      <Alert>
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertTitle>Kontrollerar databas...</AlertTitle>
        <AlertDescription>Vänligen vänta medan vi ansluter till Supabase.</AlertDescription>
      </Alert>
    );
  }

  if (status === "error") {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Databasanslutning misslyckades</AlertTitle>
        <AlertDescription>
          Kunde inte ansluta till Supabase. Kontrollera att:
          <ul className="list-disc ml-4 mt-2">
            <li>Migrationerna har körts i Supabase Dashboard</li>
            <li>.env filen har korrekta värden</li>
            <li>Du har internetanslutning</li>
          </ul>
          <a 
            href="https://supabase.com/dashboard/project/yruiwprgnnxmxnhtgypf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 underline mt-2 block"
          >
            Öppna Supabase Dashboard →
          </a>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      <AlertTitle>Databasanslutning fungerar! ✓</AlertTitle>
      <AlertDescription>
        Ansluten till Supabase. Antal djur i databasen: {animalCount}
        {animalCount === 0 && (
          <div className="mt-2 text-amber-600 dark:text-amber-400">
            ⚠️ Databasen är tom. Kör sample_data.sql för att lägga till exempeldata.
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
