import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Clock, Zap, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ConsultationDraft } from "@/types/consultation";

interface PlanSelectionProps {
  draft: ConsultationDraft;
  updateDraft: (updates: Partial<ConsultationDraft>) => void;
  onNext: () => void;
}

type PricingPlan = 'standard' | 'urgent';

interface PricingData {
  standard_price: number;
  urgent_price: number;
}

const PlanSelection = ({ draft, updateDraft, onNext }: PlanSelectionProps) => {
  const { t, i18n } = useTranslation("consultation");
  const lang = i18n.language === "de" ? "de" : "en";
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | undefined>(draft.pricingPlan);
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pricing - either from referred doctor or group settings via edge function
  useEffect(() => {
    const fetchPricing = async () => {
      setIsLoading(true);
      try {
        // If we have a referred doctor, get their pricing from profiles
        if (draft.referredDoctorId) {
          const { data: doctorProfile, error: doctorError } = await supabase
            .from("profiles")
            .select("standard_price, urgent_price")
            .eq("id", draft.referredDoctorId)
            .maybeSingle();

          if (!doctorError && doctorProfile) {
            setPricing({
              standard_price: doctorProfile.standard_price ?? 49,
              urgent_price: doctorProfile.urgent_price ?? 74,
            });
            setIsLoading(false);
            return;
          }
        }

        // Fetch group pricing via public edge function (bypasses admin_settings RLS)
        const { data, error } = await supabase.functions.invoke("get-current-pricing");

        if (!error && data) {
          setPricing({
            standard_price: data.standard_price ?? 49,
            urgent_price: data.urgent_price ?? 74,
          });
        } else {
          console.error("Error fetching group pricing:", error);
          setPricing({ standard_price: 49, urgent_price: 74 });
        }
      } catch (error) {
        console.error("Error fetching pricing:", error);
        setPricing({ standard_price: 49, urgent_price: 74 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricing();
  }, [draft.referredDoctorId]);

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    const price = plan === 'standard' ? pricing?.standard_price : pricing?.urgent_price;
    updateDraft({ 
      pricingPlan: plan,
      consultationPrice: price ?? (plan === 'standard' ? 49 : 74)
    });
  };

  const handleContinue = () => {
    if (selectedPlan) {
      onNext();
    }
  };

  const plans = [
    {
      key: 'standard' as PricingPlan,
      icon: Clock,
      price: pricing?.standard_price ?? 49,
      responseTime: lang === "de" ? "48 Stunden" : "48 hours",
      popular: false,
      name: lang === "de" ? "Standard-Anfrage" : "Standard Request",
      description: lang === "de" 
        ? "Ein Hautproblem ist kürzlich aufgetreten und Sie möchten eine professionelle Einschätzung und Empfehlung?"
        : "A skin concern has recently appeared and you want a professional assessment and recommendation?",
      features: lang === "de" ? [
        "Antwort innerhalb von 48 Stunden (Werktage)",
        "Rezept bei medizinischer Notwendigkeit",
        "Lieferung der Medikamente nach Hause"
      ] : [
        "Response within 48 hours (weekdays)",
        "Prescription if medically necessary",
        "Home delivery of medication"
      ]
    },
    {
      key: 'urgent' as PricingPlan,
      icon: Zap,
      price: pricing?.urgent_price ?? 74,
      responseTime: lang === "de" ? "24 Stunden" : "24 hours",
      popular: true,
      name: lang === "de" ? "Dringliche Anfrage" : "Urgent Request",
      description: lang === "de"
        ? "Brauchen Sie eine dringende Einschätzung? Erhalten Sie eine Antwort innerhalb von 24 Stunden — auch am Wochenende!"
        : "Need an urgent assessment? Get a response within 24 hours — even on weekends!",
      features: lang === "de" ? [
        "Antwort innerhalb von 24 Stunden (auch Wochenende)",
        "Rezept bei medizinischer Notwendigkeit",
        "Lieferung der Medikamente nach Hause",
        "Eine Nachfrage inklusive"
      ] : [
        "Response within 24 hours (including weekends)",
        "Prescription if medically necessary",
        "Home delivery of medication",
        "One follow-up question included"
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {lang === "de" ? "Wählen Sie Ihren Plan" : "Choose Your Plan"}
        </h1>
        <p className="text-muted-foreground">
          {lang === "de" 
            ? "Wählen Sie die Dringlichkeitsstufe für Ihre Anfrage"
            : "Select the urgency level for your consultation"}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.key;
          return (
            <button
              key={plan.key}
              type="button"
              onClick={() => handleSelectPlan(plan.key)}
              className={`relative text-left bg-card rounded-xl p-6 transition-all duration-200 border-2 ${
                isSelected
                  ? "border-primary shadow-lg ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50 hover:shadow-md"
              } ${plan.popular ? "md:-translate-y-1" : ""}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                    {lang === "de" ? "Empfohlen" : "Recommended"}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                  plan.popular ? "bg-primary" : "bg-primary/10"
                }`}>
                  <plan.icon className={`w-6 h-6 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-4 pb-4 border-b border-border/60">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">€{plan.price}</span>
                  <span className="text-muted-foreground text-sm">
                    {lang === "de" ? "einmalig" : "one-time"}
                  </span>
                </div>
                <p className="text-sm text-primary font-medium mt-1">
                  {lang === "de" ? `Antwort innerhalb von ${plan.responseTime}` : `Response within ${plan.responseTime}`}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.popular ? "bg-primary" : "bg-primary/10"
                    }`}>
                      <Check className={`w-2.5 h-2.5 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Insurance Note */}
      <p className="text-xs text-muted-foreground text-center">
        {lang === "de"
          ? "*Viele Krankenversicherungen erstatten Telemedizin-Konsultationen — informieren Sie sich bei Ihrer Versicherung."
          : "*Many health insurance plans reimburse telemedicine consultations — check with your provider."}
      </p>

      <Button
        onClick={handleContinue}
        disabled={!selectedPlan}
        className="w-full"
        size="lg"
      >
        {lang === "de" ? "Weiter" : "Continue"}
      </Button>
    </div>
  );
};

export default PlanSelection;
