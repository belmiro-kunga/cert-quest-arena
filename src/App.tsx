import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from '@/contexts/CartContext';
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
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
            <Route path="/cart" element={<CartPage />} />
            <Route path="/exams/:examId" element={<ExamPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
