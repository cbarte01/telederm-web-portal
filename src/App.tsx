import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import SkinBlog from "./pages/SkinBlog";
import ConditionsLibrary from "./pages/ConditionsLibrary";
import ForDoctors from "./pages/ForDoctors";
import ForCompanies from "./pages/ForCompanies";
import NotFound from "./pages/NotFound";
import ScrollToHash from "./components/ScrollToHash";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages
import PatientAuth from "./pages/auth/PatientAuth";
import DoctorAuth from "./pages/auth/DoctorAuth";
import AdminLogin from "./pages/auth/AdminLogin";

// Dashboard pages
import PatientDashboard from "./pages/dashboards/PatientDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import ConsultationFlow from "./pages/consultation/ConsultationFlow";

// Profile page
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToHash />
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Index />} />
            <Route path="/skin-blog" element={<SkinBlog />} />
            <Route path="/conditions" element={<ConditionsLibrary />} />
            <Route path="/for-doctors" element={<ForDoctors />} />
            <Route path="/for-companies" element={<ForCompanies />} />
            <Route path="/consultation" element={<ConsultationFlow />} />
            
            {/* Auth pages */}
            <Route path="/auth" element={<PatientAuth />} />
            <Route path="/auth/doctor" element={<DoctorAuth />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected dashboards */}
            <Route path="/patient/dashboard" element={
              <ProtectedRoute requiredRole="patient">
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/doctor/dashboard" element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Shared profile page */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
