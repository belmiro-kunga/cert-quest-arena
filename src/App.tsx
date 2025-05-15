import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { PaymentConfigProvider } from '@/contexts/PaymentConfigContext';

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CertificationsPage from "./pages/CertificationsPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import QuizPage from "./pages/QuizPage";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import CheckoutPage from '@/pages/CheckoutPage';
import CartPage from '@/pages/CartPage';
import { PaymentPage } from './pages/Payment';
import { PaymentResultPage } from './pages/PaymentResult';
import SimuladosPage from './pages/SimuladosPage';
import SimuladoDetailPage from './pages/SimuladoDetailPage';
import SimuladoRunningPage from './pages/SimuladoRunningPage';
import SimuladoResultPage from './pages/SimuladoResultPage';

// Components
import PrivateRoute from './components/PrivateRoute';
import { PaymentProvider } from './contexts/PaymentContext';
import { CurrencyProvider } from './contexts/CurrencyContext';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <AdminAuthProvider>
              <PaymentConfigProvider>
                <CartProvider>
                  <CurrencyProvider>
                    <PaymentProvider>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignUpPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/simulados" element={<SimuladosPage />} />
                      <Route path="/simulados/:id" element={<SimuladoDetailPage />} />
                      <Route path="/simulados/:id/start" element={<SimuladoRunningPage />} />
                      <Route path="/simulados/:id/resultado" element={<SimuladoResultPage />} />

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

                      {/* Payment Routes */}
                      <Route path="/exams/:examId" element={<ExamPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/payment" element={<PaymentPage />} />
                      <Route path="/payment/success" element={<PaymentResultPage />} />
                      <Route path="/payment/failure" element={<PaymentResultPage />} />
                      <Route path="/payment/pending" element={<PaymentResultPage />} />

                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    </PaymentProvider>
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
