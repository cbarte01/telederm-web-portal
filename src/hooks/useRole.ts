import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "patient" | "doctor" | "admin";

interface UseRoleReturn {
  role: AppRole | null;
  isLoading: boolean;
  hasRole: (requiredRole: AppRole) => boolean;
  refetch: () => Promise<void>;
}

export const useRole = (): UseRoleReturn => {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRole = async () => {
    if (!user) {
      setRole(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching role:", error);
        setRole(null);
      } else {
        setRole(data?.role as AppRole | null);
      }
    } catch (err) {
      console.error("Error fetching role:", err);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, [user]);

  const hasRole = (requiredRole: AppRole): boolean => {
    return role === requiredRole;
  };

  return { role, isLoading, hasRole, refetch: fetchRole };
};
