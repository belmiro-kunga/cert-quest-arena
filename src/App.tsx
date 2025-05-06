
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CertificationsPage from "./pages/CertificationsPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import QuizPage from "./pages/QuizPage";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import CheckoutPage from '@/pages/CheckoutPage';
import CartPage from '@/pages/CartPage';
import PrivateRoute from './components/PrivateRoute';
import { PaymentProvider } from './contexts/PaymentContext';
import { PaymentPage } from './pages/Payment';
import { PaymentResultPage } from './pages/PaymentResult';

const queryClient = new QueryClient();

const App = () => {
  // Console log para depuração
  console.log("App está renderizando");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <PaymentProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/certifications" element={<CertificationsPage />} />
                  <Route path="/exams/:certificationId" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
                  <Route path="/results/:certificationId" element={<ResultPage />} />
                  <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/exams/:examId" element={<ExamPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/payment/success" element={<PaymentResultPage />} />
                  <Route path="/payment/failure" element={<PaymentResultPage />} />
                  <Route path="/payment/pending" element={<PaymentResultPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </PaymentProvider>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
