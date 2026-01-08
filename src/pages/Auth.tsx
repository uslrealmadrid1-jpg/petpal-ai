import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PawPrint, Loader2, Eye, EyeOff, ArrowLeft, Shield, Check, X } from "lucide-react";
import { z } from "zod";
import { logLoginAttempt, updateLastLogin } from "@/hooks/useLoginLogger";

// Strong password validation for signup
const passwordSchema = z.string()
  .min(12, { message: "Lösenord måste vara minst 12 tecken" })
  .max(72, { message: "Lösenord får vara max 72 tecken" })
  .refine((val) => /[A-ZÅÄÖ]/.test(val), {
    message: "Måste innehålla minst en stor bokstav",
  })
  .refine((val) => /[a-zåäö]/.test(val), {
    message: "Måste innehålla minst en liten bokstav",
  })
  .refine((val) => /[0-9]/.test(val), {
    message: "Måste innehålla minst en siffra",
  })
  .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val), {
    message: "Måste innehålla minst ett specialtecken (!@#$%^&* etc.)",
  });

const authSchema = z.object({
  email: z.string().trim().email({ message: "Ogiltig e-postadress" }).max(255),
  password: z.string().min(6, { message: "Lösenord måste vara minst 6 tecken" }).max(72),
});

const signupSchema = z.object({
  email: z.string().trim().email({ message: "Ogiltig e-postadress" }).max(255),
  password: passwordSchema,
  displayName: z.string().trim().min(2, { message: "Namn måste vara minst 2 tecken" }).max(100).optional(),
});

// Password check indicator component
function PasswordCheck({ passed, text }: { passed: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 ${passed ? 'text-green-600' : 'text-muted-foreground'}`}>
      {passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      <span>{text}</span>
    </div>
  );
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if already authenticated
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    const schema = isLogin ? authSchema : signupSchema;
    const data = isLogin 
      ? { email, password } 
      : { email, password, displayName: displayName || undefined };
    
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  // Password strength indicators
  const passwordChecks = {
    length: password.length >= 12,
    uppercase: /[A-ZÅÄÖ]/.test(password),
    lowercase: /[a-zåäö]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const allChecksPass = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        
        if (error) {
          // Log failed login attempt
          await logLoginAttempt({ email: email.trim(), success: false });
          
          if (error.message.includes("Invalid login credentials")) {
            toast({
              variant: "destructive",
              title: "Inloggning misslyckades",
              description: "Felaktig e-post eller lösenord",
            });
          } else {
            throw error;
          }
          return;
        }
        
        // Log successful login and update last_login
        if (data.user) {
          await logLoginAttempt({ email: email.trim(), success: true, userId: data.user.id });
          await updateLastLogin(data.user.id);
        }
        
        toast({
          title: "Välkommen tillbaka!",
          description: "Du är nu inloggad",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              display_name: displayName.trim() || email.split("@")[0],
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              variant: "destructive",
              title: "Registrering misslyckades",
              description: "E-postadressen är redan registrerad",
            });
          } else {
            throw error;
          }
          return;
        }

        toast({
          title: "Konto skapat!",
          description: "Du kan nu logga in",
        });
      }
      
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Något gick fel",
        description: error instanceof Error ? error.message : "Försök igen senare",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Tillbaka
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 shadow-lg">
              <PawPrint className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              DjurData
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isLogin ? "Logga in på ditt konto" : "Skapa ett nytt konto"}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">Namn</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Ditt namn"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={isLoading}
                    className={errors.displayName ? "border-destructive" : ""}
                  />
                  {errors.displayName && (
                    <p className="text-xs text-destructive">{errors.displayName}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="din@email.se"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Lösenord</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
                
                {/* Password strength indicators for signup */}
                {!isLogin && password.length > 0 && (
                  <div className="mt-3 p-3 bg-muted rounded-lg space-y-2">
                    <p className="text-xs font-medium text-foreground mb-2">Lösenordskrav:</p>
                    <div className="grid grid-cols-1 gap-1.5 text-xs">
                      <PasswordCheck passed={passwordChecks.length} text="Minst 12 tecken" />
                      <PasswordCheck passed={passwordChecks.uppercase} text="En stor bokstav (A-Ö)" />
                      <PasswordCheck passed={passwordChecks.lowercase} text="En liten bokstav (a-ö)" />
                      <PasswordCheck passed={passwordChecks.number} text="En siffra (0-9)" />
                      <PasswordCheck passed={passwordChecks.special} text="Ett specialtecken (!@#$%)" />
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isLogin ? "Loggar in..." : "Skapar konto..."}
                  </>
                ) : (
                  isLogin ? "Logga in" : "Skapa konto"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Har du inget konto?" : "Har du redan ett konto?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                  }}
                  className="ml-1 text-primary hover:underline font-medium"
                  disabled={isLoading}
                >
                  {isLogin ? "Skapa konto" : "Logga in"}
                </button>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Säker inloggning med krypterad anslutning</span>
          </div>
        </div>
      </main>
    </div>
  );
}
