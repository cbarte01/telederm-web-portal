import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "patient" | "doctor" | "admin";

// Role priority: higher number = higher priority
const ROLE_PRIORITY: Record<AppRole, number> = {
  admin: 3,
  doctor: 2,
  patient: 1,
};

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
      // Fetch all roles for the user (handles multiple roles case)
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching role:", error);
        setRole(null);
      } else if (data && data.length > 0) {
        // Return highest priority role
        const highestRole = data.reduce((highest, current) => {
          const currentRole = current.role as AppRole;
          const highestRoleValue = highest.role as AppRole;
          return ROLE_PRIORITY[currentRole] > ROLE_PRIORITY[highestRoleValue]
            ? current
            : highest;
        });
        setRole(highestRole.role as AppRole);
      } else {
        setRole(null);
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
