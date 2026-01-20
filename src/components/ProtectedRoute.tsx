import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRole, AppRole } from "@/hooks/useRole";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading: authLoading } = useAuth();
  const { role, isLoading: roleLoading } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || roleLoading) return;

    if (!user) {
      // Redirect to appropriate login page based on required role
      if (requiredRole === "admin") {
        navigate("/admin/login", { replace: true });
      } else if (requiredRole === "doctor") {
        navigate("/auth/doctor", { replace: true });
      } else {
        navigate("/auth", { replace: true });
      }
      return;
    }

    // Check role if required
    if (requiredRole && role !== requiredRole) {
      // Redirect to appropriate dashboard based on their actual role
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "doctor") {
        navigate("/doctor/dashboard", { replace: true });
      } else if (role === "patient") {
        navigate("/patient/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, role, requiredRole, authLoading, roleLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole && role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
