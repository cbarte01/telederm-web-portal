import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import medenaLogo from "@/assets/logo/medena-logo.png";

interface DoctorPublicProfile {
  display_name: string | null;
  practice_name: string | null;
  welcome_message: string | null;
  referral_code: string | null;
}

const translations = {
  de: {
    title: "Online Hautarzt-Beratung",
    subtitle: "mit",
    cta: "Beratung starten",
    poweredBy: "Powered by Medena Care",
    notFound: "Arzt nicht gefunden",
    loading: "Laden...",
  },
  en: {
    title: "Online Dermatology Consultation",
    subtitle: "with",
    cta: "Start Consultation",
    poweredBy: "Powered by Medena Care",
    notFound: "Doctor not found",
    loading: "Loading...",
  },
};

const Widget = () => {
  const { referralCode } = useParams<{ referralCode: string }>();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") === "en" ? "en" : "de";
  const t = translations[lang];

  const [doctor, setDoctor] = useState<DoctorPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!referralCode) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("doctor_public_profiles")
          .select("display_name, practice_name, welcome_message, referral_code")
          .eq("referral_code", referralCode.toUpperCase())
          .maybeSingle();

        if (fetchError || !data) {
          setError(true);
        } else {
          setDoctor(data);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [referralCode]);

  const handleStartConsultation = () => {
    const baseUrl = window.location.origin;
    const consultationUrl = `${baseUrl}/consultation?ref=${referralCode}`;
    window.open(consultationUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="w-full h-full min-h-[180px] flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10">
        <p className="text-muted-foreground text-sm">{t.loading}</p>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="w-full h-full min-h-[180px] flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10">
        <p className="text-muted-foreground text-sm">{t.notFound}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[180px] bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-5 flex flex-col justify-between font-sans">
      {/* Header with logo */}
      <div className="flex items-center gap-2 mb-3">
        <img src={medenaLogo} alt="Medena Care" className="h-6 w-auto" />
        <span className="text-sm font-medium text-foreground">Medena Care</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-base font-semibold text-foreground leading-tight mb-1">
          {t.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t.subtitle}{" "}
          <span className="font-medium text-foreground">
            {doctor.display_name}
          </span>
        </p>
        {doctor.practice_name && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {doctor.practice_name}
          </p>
        )}
      </div>

      {/* CTA Button */}
      <button
        onClick={handleStartConsultation}
        className="w-full mt-3 py-2.5 px-4 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {t.cta} →
      </button>

      {/* Footer */}
      <p className="text-[10px] text-muted-foreground text-center mt-2">
        {t.poweredBy}
      </p>
    </div>
  );
};

export default Widget;
