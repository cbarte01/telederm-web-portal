import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Home } from "lucide-react";
import teledermLogo from "@/assets/logo/telederm-logo.png";

const PaymentSuccess = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasVerified = useRef(false);

  const lang = i18n.language === "de" ? "de" : "en";
  const sessionId = searchParams.get("session_id");
  const consultationId = searchParams.get("consultation_id");

  useEffect(() => {
    // Don't do anything while auth is still loading
    if (authLoading) return;

    // Prevent multiple verification attempts
    if (hasVerified.current) return;

    const verifyPayment = async () => {
      // Check for required parameters
      if (!sessionId || !consultationId) {
        setStatus("error");
        setErrorMessage(lang === "de" 
          ? "Fehlende Zahlungsinformationen" 
          : "Missing payment information");
        return;
      }

      // Check if user is authenticated
      if (!user) {
        setStatus("error");
        setErrorMessage(lang === "de" 
          ? "Bitte melden Sie sich an, um Ihre Zahlung zu verifizieren" 
          : "Please log in to verify your payment");
        return;
      }

      // Mark as verified to prevent duplicate calls
      hasVerified.current = true;

      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { session_id: sessionId, consultation_id: consultationId },
        });

        if (error) throw error;

        if (data.success) {
          setStatus("success");
          // Clear draft
          sessionStorage.removeItem("telederm_consultation_draft");
          
          toast({
            title: lang === "de" ? "Zahlung erfolgreich!" : "Payment successful!",
            description: lang === "de" 
              ? "Ihre Konsultation wurde eingereicht." 
              : "Your consultation has been submitted.",
          });
        } else {
          setStatus("error");
          setErrorMessage(data.message || (lang === "de" 
            ? "Zahlung konnte nicht verifiziert werden" 
            : "Payment could not be verified"));
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus("error");
        setErrorMessage(lang === "de" 
          ? "Fehler bei der Zahlungsverifizierung" 
          : "Error verifying payment");
      }
    };

    verifyPayment();
  }, [authLoading, user, sessionId, consultationId, lang, toast]);

  // Show loading while auth is being restored
  const isRestoring = authLoading;
  const loadingMessage = isRestoring
    ? (lang === "de" ? "Sitzung wird wiederhergestellt..." : "Restoring session...")
    : (lang === "de" ? "Zahlung wird verifiziert..." : "Verifying payment...");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-4 left-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={teledermLogo} alt="Telederm" className="w-8 h-8 rounded-lg" />
          <span className="font-serif font-bold text-xl text-foreground">telederm</span>
        </Link>
      </div>

      <div className="max-w-md w-full text-center space-y-6">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">
              {loadingMessage}
            </h1>
            <p className="text-muted-foreground">
              {lang === "de" 
                ? "Bitte warten Sie, während wir Ihre Zahlung bestätigen." 
                : "Please wait while we confirm your payment."}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {lang === "de" ? "Vielen Dank!" : "Thank you!"}
            </h1>
            <p className="text-muted-foreground">
              {lang === "de" 
                ? "Ihre Konsultation wurde erfolgreich eingereicht. Ein Dermatologe wird sich in Kürze bei Ihnen melden." 
                : "Your consultation has been successfully submitted. A dermatologist will get back to you shortly."}
            </p>
            <div className="space-y-3 pt-4">
              <Button 
                onClick={() => navigate("/patient/dashboard")} 
                className="w-full"
              >
                {lang === "de" ? "Zum Dashboard" : "Go to Dashboard"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/")} 
                className="w-full gap-2"
              >
                <Home className="h-4 w-4" />
                {lang === "de" ? "Zur Startseite" : "Go to Homepage"}
              </Button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {lang === "de" ? "Zahlung fehlgeschlagen" : "Payment failed"}
            </h1>
            <p className="text-muted-foreground">
              {errorMessage || (lang === "de" 
                ? "Es gab ein Problem mit Ihrer Zahlung." 
                : "There was a problem with your payment.")}
            </p>
            <div className="space-y-3 pt-4">
              <Button 
                onClick={() => navigate("/consultation?step=10")} 
                className="w-full"
              >
                {lang === "de" ? "Erneut versuchen" : "Try again"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/")} 
                className="w-full gap-2"
              >
                <Home className="h-4 w-4" />
                {lang === "de" ? "Zur Startseite" : "Go to Homepage"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
