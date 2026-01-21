import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import teledermLogo from "@/assets/logo/telederm-logo.png";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const PatientAuth = () => {
  const { t } = useTranslation("auth");
  const { user, signIn, signUp, resetPasswordRequest, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (user && !authLoading) {
      navigate("/patient/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const onLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    const { error } = await signIn(data.email, data.password);
    setIsSubmitting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: t("errors.invalidCredentials"),
        description: error.message,
      });
    }
  };

  const onForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail.trim()) return;
    
    setIsSubmitting(true);
    const { error } = await resetPasswordRequest(forgotPasswordEmail);
    setIsSubmitting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      setForgotPasswordSent(true);
      toast({
        title: "Email sent",
        description: "Check your inbox for the password reset link.",
      });
    }
  };

  const onSignup = async (data: SignupFormData) => {
    setIsSubmitting(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setIsSubmitting(false);

    if (error) {
      const errorMessage = error.message.includes("already registered")
        ? t("errors.emailInUse")
        : error.message;
      toast({
        variant: "destructive",
        title: t("errors.generic"),
        description: errorMessage,
      });
    } else {
      toast({
        title: t("signup.title"),
        description: "Account created successfully!",
      });
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
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t("login.submit")}</TabsTrigger>
            <TabsTrigger value="signup">{t("signup.submit")}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t("login.title")}</CardTitle>
              <CardDescription>{t("login.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("login.email")}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("login.password")}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("login.submit")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>

          <TabsContent value="signup">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t("signup.title")}</CardTitle>
              <CardDescription>{t("signup.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("signup.fullName")}</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("signup.email")}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("signup.password")}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("signup.confirmPassword")}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("login.submit")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>

          <TabsContent value="signup">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t("signup.title")}</CardTitle>
              <CardDescription>{t("signup.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("signup.fullName")}</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("signup.email")}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("signup.password")}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("signup.confirmPassword")}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("signup.submit")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                {forgotPasswordSent 
                  ? "Check your email for the reset link." 
                  : "Enter your email and we'll send you a reset link."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {forgotPasswordSent ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    We've sent an email to <strong>{forgotPasswordEmail}</strong>. 
                    Click the link in the email to reset your password.
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordSent(false);
                      setForgotPasswordEmail("");
                    }}
                  >
                    Back to Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={onForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="forgot-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="you@example.com"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordEmail("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Reset Link
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Doctor login link */}
      <p className="mt-6 text-sm text-muted-foreground">
        Are you a doctor?{" "}
        <Link to="/auth/doctor" className="text-primary hover:underline font-medium">
          Doctor Login
        </Link>
      </p>
    </div>
  );
};

export default PatientAuth;
