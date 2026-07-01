import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import SummaryPage from "./pages/SummaryPage";
import QuizPage from "./pages/QuizPage";
import StudyPlanPage from "./pages/StudyPlanPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";      
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import GoogleSuccess from "./pages/GoogleSuccess";
import DeactivateAccountPage from "./pages/DeactivateAccountPage";
const queryClient = new QueryClient();




const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/study-plan" element={<StudyPlanPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/study-plan/:id" element={<StudyPlanPage />} />
          <Route path="/google-success" element={<GoogleSuccess />} />
          <Route path="/deactivate-account" element={<DeactivateAccountPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
