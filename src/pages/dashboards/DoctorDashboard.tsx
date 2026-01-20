import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut, Calendar, Users, Clock } from "lucide-react";
import teledermLogo from "@/assets/logo/telederm-logo.png";

const DoctorDashboard = () => {
  const { t } = useTranslation("auth");
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(data);
    };
    fetchProfile();
  }, [user]);

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Doctor";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={teledermLogo} alt="Telederm" className="w-8 h-8 rounded-lg" />
            <span className="font-serif font-bold text-xl text-foreground">telederm</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                {t("common.viewProfile")}
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="gap-2" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              {t("common.logout")}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {t("dashboard.doctor.welcome")} {displayName}
          </h1>
          <p className="text-muted-foreground mt-2">{t("dashboard.doctor.subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Pending Consultations */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Pending Requests
              </CardTitle>
              <CardDescription>Consultations awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                No pending consultation requests.
              </p>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Schedule
              </CardTitle>
              <CardDescription>Your appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                No appointments scheduled for today.
              </p>
            </CardContent>
          </Card>

          {/* Patients */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                My Patients
              </CardTitle>
              <CardDescription>Patients you've consulted</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                No patients yet. Patient records will appear here.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
