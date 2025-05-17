import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import APIStatusNotification from "@/components/APIStatusNotification";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { PaymentConfigProvider } from '@/contexts/PaymentConfigContext';

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import LegalPage from "./pages/LegalPage";
import Dashboard from "./pages/Dashboard";
import QuizPage from "./pages/QuizPage";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import CheckoutPage from '@/pages/CheckoutPage';
import CartPage from '@/pages/CartPage';
import SimuladosPage from './pages/SimuladosPage';
import SimuladoDetailPage from './pages/SimuladoDetailPage';
import Pacotes from './pages/Pacotes';
import PacoteDetalhes from './pages/PacoteDetalhes';
import SimuladoRunningPage from './pages/SimuladoRunningPage';
import SimuladoResultPage from './pages/SimuladoResultPage';
import StudyPage from './pages/StudyPage';
import AuthSettingsPage from './pages/admin/AuthSettingsPage';
import TestApiPage from './pages/TestApiPage';

// Components
import PrivateRoute from './components/PrivateRoute';
import { CurrencyProvider } from './contexts/CurrencyContext';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <APIStatusNotification />
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <AdminAuthProvider>
              <PaymentConfigProvider>
                <CartProvider>
                  <CurrencyProvider>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/registro" element={<SignUpPage />} />
                      <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/simulados" element={<SimuladosPage />} />
                      <Route path="/simulados/:id" element={<SimuladoDetailPage />} />
                      <Route path="/termos" element={<TermsOfServicePage />} />
                      <Route path="/privacidade" element={<PrivacyPolicyPage />} />
                      <Route path="/cookies" element={<CookiePolicyPage />} />
                      <Route path="/legal" element={<LegalPage />} />
                      <Route path="/sobre" element={<AboutPage />} />
                      <Route path="/contato" element={<ContactPage />} />
                      <Route path="/simulados/:id/start" element={<SimuladoRunningPage />} />
                      <Route path="/simulados/:id/resultado" element={<SimuladoResultPage />} />
                      <Route path="/test-api" element={<TestApiPage />} />
                      
                      {/* Rotas de Pacotes */}
                      <Route path="/pacotes" element={<Pacotes />} />
                      <Route path="/pacotes/:id" element={<PacoteDetalhes />} />

                      {/* Rotas de Estudo */}
                      <Route path="/study" element={<StudyPage />} />
                      <Route path="/study/flashcards" element={<StudyPage />} />

                      {/* Protected User Routes */}
                      <Route 
                        path="/exams/:certificationId" 
                        element={
                          <PrivateRoute>
                            <QuizPage />
                          </PrivateRoute>
                        } 
                      />
                      <Route path="/results/:certificationId" element={<ResultPage />} />
                      <Route 
                        path="/dashboard" 
                        element={
                          <PrivateRoute>
                            <Dashboard />
                          </PrivateRoute>
                        } 
                      />
                      <Route 
                        path="/profile" 
                        element={
                          <PrivateRoute>
                            <ProfilePage />
                          </PrivateRoute>
                        } 
                      />


                      {/* Admin Routes */}
                      <Route path="/admin/login" element={<AdminLoginPage />} />
                      <Route path="/admin/*" element={<AdminPage />} />
                      <Route path="/admin/settings/auth" element={<AuthSettingsPage />} />

                      {/* Payment Routes */}
                      <Route path="/exams/:examId" element={<ExamPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />

                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </CurrencyProvider>
                </CartProvider>
              </PaymentConfigProvider>
            </AdminAuthProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
