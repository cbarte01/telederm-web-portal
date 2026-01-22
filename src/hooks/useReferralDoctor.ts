import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ReferralDoctor {
  id: string;
  fullName: string;
  practiceName?: string;
  welcomeMessage?: string;
}

export const useReferralDoctor = (referralCode: string | null) => {
  const [doctor, setDoctor] = useState<ReferralDoctor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!referralCode) {
        setDoctor(null);
        return;
      }

      // Avoid tight coupling to generated DB types for newly-added columns/tables.
      const db = supabase as any;

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await db
          .from("doctor_public_profiles")
          .select("doctor_id, display_name, practice_name, welcome_message")
          .eq("referral_code", referralCode)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (data) {
          setDoctor({
            id: data.doctor_id,
            fullName: data.display_name || "Doctor",
            practiceName: data.practice_name || undefined,
            welcomeMessage: data.welcome_message || undefined,
          });
        } else {
          setDoctor(null);
          setError("Invalid referral code");
        }
      } catch (err) {
        console.error("Error fetching referral doctor:", err);
        setError("Failed to load doctor information");
        setDoctor(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctor();
  }, [referralCode]);

  return { doctor, isLoading, error };
};
