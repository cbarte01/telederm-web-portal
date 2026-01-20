import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, LogOut, UserPlus, Loader2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import teledermLogo from "@/assets/logo/telederm-logo.png";

const createDoctorSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type CreateDoctorFormData = z.infer<typeof createDoctorSchema>;

interface Doctor {
  id: string;
  full_name: string | null;
  created_at: string;
  user_id: string;
}

const AdminDashboard = () => {
  const { t } = useTranslation("auth");
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);

  const form = useForm<CreateDoctorFormData>({
    resolver: zodResolver(createDoctorSchema),
    defaultValues: { email: "", fullName: "", password: "" },
  });

  const fetchDoctors = async () => {
    try {
      // Get all doctor role entries
      const { data: doctorRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, created_at")
        .eq("role", "doctor");

      if (rolesError) throw rolesError;

      if (!doctorRoles || doctorRoles.length === 0) {
        setDoctors([]);
        setIsLoadingDoctors(false);
        return;
      }

      // Get profiles for these doctors
      const userIds = doctorRoles.map((r) => r.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const doctorsList = doctorRoles.map((role) => {
        const profile = profiles?.find((p) => p.id === role.user_id);
        return {
          id: role.user_id,
          user_id: role.user_id,
          full_name: profile?.full_name || "Unknown",
          created_at: role.created_at,
        };
      });

      setDoctors(doctorsList);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const onSubmit = async (data: CreateDoctorFormData) => {
    setIsSubmitting(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("create-doctor-account", {
        body: {
          email: data.email,
          password: data.password,
          fullName: data.fullName,
        },
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      toast({
        title: t("dashboard.admin.doctorCreated"),
        description: `Doctor account created for ${data.email}`,
      });

      form.reset();
      fetchDoctors();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create doctor account";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">{t("dashboard.admin.welcome")}</h1>
          </div>
          <p className="text-muted-foreground">{t("dashboard.admin.subtitle")}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Create Doctor Form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                {t("dashboard.admin.createDoctor")}
              </CardTitle>
              <CardDescription>Create new doctor accounts for your platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("dashboard.admin.doctorName")}</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("dashboard.admin.doctorEmail")}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="doctor@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("dashboard.admin.doctorPassword")}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("dashboard.admin.createButton")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Doctors List */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>{t("dashboard.admin.doctorsList")}</CardTitle>
              <CardDescription>All registered doctors on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingDoctors ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : doctors.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4">
                  No doctors registered yet. Create your first doctor account above.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">{doctor.full_name}</TableCell>
                        <TableCell>
                          {new Date(doctor.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
