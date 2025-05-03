
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CertificationsPage from "./pages/CertificationsPage";
import ExamPage from "./pages/ExamPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/exams/:certificationId" element={<QuizPage />} />
          <Route path="/results/:certificationId" element={<ResultPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
