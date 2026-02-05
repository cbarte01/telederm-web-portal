import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export const useSessionRevocation = () => {
  const [isRevoking, setIsRevoking] = useState(false);
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const lang = i18n.language === "de" ? "de" : "en";

  const revokeAllSessions = useCallback(async (targetUserId?: string, reason?: string) => {
    setIsRevoking(true);
    try {
      const { data, error } = await supabase.functions.invoke("revoke-sessions", {
        body: {
          target_user_id: targetUserId,
          reason: reason || "user_requested"
        }
      });

      if (error) {
        console.error("Error revoking sessions:", error);
        toast({
          variant: "destructive",
          title: lang === "de" ? "Fehler" : "Error",
          description: lang === "de" 
            ? "Sitzungen konnten nicht beendet werden." 
            : "Failed to revoke sessions."
        });
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Error revoking sessions:", err);
      toast({
        variant: "destructive",
        title: lang === "de" ? "Fehler" : "Error",
        description: lang === "de" 
          ? "Ein unerwarteter Fehler ist aufgetreten." 
          : "An unexpected error occurred."
      });
      return { success: false, error: err };
    } finally {
      setIsRevoking(false);
    }
  }, [toast, lang]);

  return { revokeAllSessions, isRevoking };
};
