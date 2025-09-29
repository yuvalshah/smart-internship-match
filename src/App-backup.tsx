import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import RoleSelection from "./pages/RoleSelection";
import AdminDashboard from "./pages/AdminDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import InternshipSearch from "./pages/InternshipSearch";
import AboutPage from "./pages/AboutPage";
import FeaturesPage from "./pages/FeaturesPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminStudents from "./pages/admin/AdminStudents";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

// Company pages - integrated into main dashboard

// Student pages
import StudentBrowseInternships from "./pages/student/StudentBrowseInternships";
import StudentApplicationStatus from "./pages/student/StudentApplicationStatus";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/role-selection" element={
              <ProtectedRoute>
                <RoleSelection />
              </ProtectedRoute>
            } />
            <Route path="/admin-dashboard" element={
              <ProtectedRoute requiredUserType="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/company-dashboard" element={
              <ProtectedRoute requiredUserType="company">
                <CompanyDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student-dashboard" element={
              <ProtectedRoute requiredUserType="student">
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/internships" element={
              <ProtectedRoute requiredUserType="student">
                <InternshipSearch />
              </ProtectedRoute>
            } />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/students" element={
              <ProtectedRoute requiredUserType="admin">
                <AdminStudents />
              </ProtectedRoute>
            } />
            <Route path="/admin/companies" element={
              <ProtectedRoute requiredUserType="admin">
                <AdminCompanies />
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute requiredUserType="admin">
                <AdminAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requiredUserType="admin">
                <AdminSettings />
              </ProtectedRoute>
            } />
            
            {/* Company Routes - integrated into main dashboard */}
            
            {/* Student Routes */}
            <Route path="/student/browse-internships" element={
              <ProtectedRoute requiredUserType="student">
                <StudentBrowseInternships />
              </ProtectedRoute>
            } />
            <Route path="/student/application-status" element={
              <ProtectedRoute requiredUserType="student">
                <StudentApplicationStatus />
              </ProtectedRoute>
            } />
            
            {/* Temporary test route - remove after testing */}
            <Route path="/test-internships" element={<StudentBrowseInternships />} />
            <Route path="/test-simple" element={<div className="p-8"><h1 className="text-4xl">Test Page Works!</h1></div>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
