import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import teledermLogo from "@/assets/logo/telederm-logo.png";

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetFormData = z.infer<typeof resetSchema>;

const ResetPassword = () => {
  const { user, session, isLoading: authLoading, updatePassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Check if user arrived via password reset link (they'll have a session from the email link)
  useEffect(() => {
    if (!authLoading && !session) {
      // No session means they didn't arrive from email link
      toast({
        variant: "destructive",
        title: "Invalid or expired link",
        description: "Please request a new password reset link.",
      });
      navigate("/auth", { replace: true });
    }
  }, [session, authLoading, navigate, toast]);

  const onSubmit = async (data: ResetFormData) => {
    setIsSubmitting(true);
    const { error } = await updatePassword(data.password);
    setIsSubmitting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      setIsSuccess(true);
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
      });
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate("/patient/dashboard", { replace: true });
      }, 2000);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      {/* Back to home */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to home</span>
      </Link>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 mb-8">
        <img src={teledermLogo} alt="Telederm" className="w-10 h-10 rounded-lg" />
        <span className="font-serif font-bold text-3xl text-foreground">telederm</span>
      </Link>

      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isSuccess ? "Password Updated!" : "Set New Password"}
          </CardTitle>
          <CardDescription>
            {isSuccess 
              ? "You can now log in with your new password." 
              : "Enter your new password below."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <CheckCircle className="h-16 w-16 text-primary" />
              <p className="text-muted-foreground text-center">
                Redirecting to your dashboard...
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Password
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
