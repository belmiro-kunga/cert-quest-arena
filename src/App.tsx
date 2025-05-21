import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { CartProvider } from './contexts/CartContext';
import { PaymentConfigProvider } from './contexts/PaymentConfigContext';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from './components/ui/toaster';
import PrivateRoute from './components/PrivateRoute';
import PWAPrompt from './components/PWAPrompt';

// Pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CartPage from './pages/CartPage';
import SimuladosPage from './pages/SimuladosPage';
import SimuladoDetailPage from './pages/SimuladoDetailPage';
import SimuladoRunningPage from './pages/SimuladoRunningPage';
import SimuladoResultPage from './pages/SimuladoResultPage';
import TestApiPage from './pages/TestApiPage';
import Pacotes from './pages/Pacotes';
import PacoteDetalhes from './pages/PacoteDetalhes';
import StudyPage from './pages/StudyPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import ExamPage from './pages/ExamPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import TestPWAPage from './pages/TestPWAPage';

const queryClient = new QueryClient();

const App = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Verifica se o navegador suporta PWA
    const supportsPWA = 'serviceWorker' in navigator && 
                       'beforeinstallprompt' in window;

    if (!supportsPWA) {
      return;
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Verifica se já está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuário aceitou a instalação');
        // Limpa o deferredPrompt após a instalação
        setDeferredPrompt(null);
      } else {
        console.log('Usuário recusou a instalação');
      }
      setShowInstallPrompt(false);
    });
  };

  const handleCancel = () => {
    setShowInstallPrompt(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CurrencyProvider>
          <AuthProvider>
            <AdminAuthProvider>
              <CartProvider>
                <PaymentConfigProvider>
                  <TooltipProvider>
                    <Toaster />
                    {showInstallPrompt && (
                      <PWAPrompt onInstall={handleInstall} onCancel={handleCancel} />
                    )}
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/registro" element={<SignUpPage />} />
                      <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/simulados" element={<SimuladosPage />} />
                      <Route path="/simulados/:id" element={<SimuladoDetailPage />} />
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

                      {/* Payment Routes */}
                      <Route path="/exams/:examId" element={<ExamPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/test-pwa" element={<TestPWAPage />} />

                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </TooltipProvider>
                </PaymentConfigProvider>
              </CartProvider>
            </AdminAuthProvider>
          </AuthProvider>
        </CurrencyProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
