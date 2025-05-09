import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { PaymentConfigProvider } from '@/contexts/PaymentConfigContext';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CertificationsPage from "./pages/CertificationsPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage"; // Add the new SignUpPage
import Dashboard from "./pages/Dashboard";
import QuizPage from "./pages/QuizPage";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminRoute from "./components/auth/AdminRoute";
import CheckoutPage from '@/pages/CheckoutPage';
import CartPage from '@/pages/CartPage';
import PrivateRoute from './components/PrivateRoute';
import { PaymentProvider } from './contexts/PaymentContext';
import { PaymentPage } from './pages/Payment';
import { PaymentResultPage } from './pages/PaymentResult';
import { initializeDefaultUsers } from './utils/supabaseAdmin';
import AchievementsPage from './app/achievements/page';

const queryClient = new QueryClient();

const App = () => {
  // Adding useEffect for additional debugging
  useEffect(() => {
    console.log("App component mounted");
    
    // Log current route
    const currentPath = window.location.pathname;
    console.log("Current route path:", currentPath);
    
    // Initialize default users (admin and regular user)
    const setupUsers = async () => {
      try {
        console.log("Setting up default users...");
        await initializeDefaultUsers();
        console.log("Default users setup completed");
      } catch (err) {
        console.error("Error setting up default users:", err);
      }
    };
    
    setupUsers();
    
    return () => {
      console.log("App component unmounted");
    };
  }, []);
  
  console.log("App rendering with all providers and routes");
  
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
                  <PaymentProvider>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignUpPage />} />
                      <Route path="/certifications" element={<CertificationsPage />} />
                      <Route path="/exams/:certificationId" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
                      <Route path="/results/:certificationId" element={<ResultPage />} />
                      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                      <Route path="/achievements" element={<PrivateRoute><AchievementsPage /></PrivateRoute>} />
                      <Route path="/admin/login" element={<AdminLoginPage />} />
                      <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/exams/:examId" element={<ExamPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/payment" element={<PaymentPage />} />
                      <Route path="/payment/success" element={<PaymentResultPage />} />
                      <Route path="/payment/failure" element={<PaymentResultPage />} />
                      <Route path="/payment/pending" element={<PaymentResultPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </PaymentProvider>
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
