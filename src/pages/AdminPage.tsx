import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Overview } from "@/components/admin/Overview";
import { Students } from "@/components/admin/Students";
import SimuladoAdmin from '@/components/admin/simulado/SimuladoAdmin';
import { Coupons } from "@/components/admin/Coupons";
import { GamificationAdmin } from "@/components/admin/GamificationAdmin";
import { StudySystem } from "@/components/admin/StudySystem";
import { EmailTemplates } from "@/components/admin/EmailTemplates";
import { useAdminPage } from "@/hooks/useAdminPage";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { AffiliateRequests } from "@/components/admin/AffiliateRequests";
import LanguagesPage from "./admin/LanguagesPage";
import SettingsPage from "./admin/settings/SettingsPage";
import CurrenciesPage from "./admin/settings/CurrenciesPage";
import MarketplaceAffiliateSettings from "./admin/MarketplaceAffiliateSettings";
import MarketplaceSalesMetrics from "./admin/MarketplaceSalesMetrics";
import MarketplaceSalesPolicies from "./admin/MarketplaceSalesPolicies";
import PacotesAdmin from "./admin/PacotesAdmin";
import AuthSettings from "./admin/settings/AuthSettings";
import LegalPoliciesPage from "./admin/settings/LegalPoliciesPage";
import StudentsPage from "./admin/StudentsPage";
import { Routes, Route } from "react-router-dom";
import PWAManagement from "./admin/PWAManagement";
import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PaymentSettings from '@/components/admin/settings/PaymentSettings';

const AdminPage = () => {
  const { state, actions } = useAdminPage();
  const { adminUser, isAuthenticated, adminSignOut } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticação apenas uma vez na montagem do componente
    // usando uma verificação direta em vez de chamar a função isAuthenticated
    const isAdmin = adminUser !== null;
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [adminUser, navigate]);

  if (!adminUser) {
    return null;
  }

  const handleSignOut = () => {
    adminSignOut();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 border-b bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar..."
                className="pl-9 bg-gray-50 border-gray-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                <AvatarFallback className="bg-blue-600 text-white">A</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{adminUser.name}</span>
              <Button variant="ghost" onClick={handleSignOut}>
                Sair
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/dashboard" element={<Overview />} />
            
            {/* Students Routes */}
            <Route path="/students" element={<StudentsPage />} />
            <Route 
              path="/students/old" 
              element={
                <Students 
                  students={state.students}
                  onCreateStudent={actions.handleCreateStudent}
                  onUpdateStudent={actions.handleUpdateStudent}
                  onDeleteStudent={actions.handleDeleteStudent}
                  onEnrollExam={actions.handleEnrollExam}
                  availableExams={state.adminExams}
                />
              } 
            />
            <Route 
              path="/students/new" 
              element={
                <Students 
                  students={state.students}
                  onCreateStudent={actions.handleCreateStudent}
                  onUpdateStudent={actions.handleUpdateStudent}
                  onDeleteStudent={actions.handleDeleteStudent}
                  onEnrollExam={actions.handleEnrollExam}
                  availableExams={state.adminExams}
                />
              } 
            />

            {/* Simulados Routes */}
            <Route 
              path="/exams" 
              element={<SimuladoAdmin />} 
            />
            <Route 
              path="/exams/new" 
              element={<SimuladoAdmin />} 
            />

            {/* Pacotes Routes */}
            <Route path="/pacotes" element={<PacotesAdmin />} />

            {/* Coupons Routes */}
            <Route 
              path="/coupons" 
              element={
                <Coupons 
                  coupons={state.coupons}
                  onSelect={actions.handleCouponSelect}
                  onDelete={actions.handleCouponDelete}
                />
              } 
            />
            <Route 
              path="/coupons/new" 
              element={
                <Coupons 
                  coupons={state.coupons}
                  onSelect={actions.handleCouponSelect}
                  onDelete={actions.handleCouponDelete}
                />
              } 
            />

            {/* Study System Routes */}
            <Route path="/study" element={<StudySystem />} />
            <Route path="/study/flashcards" element={<StudySystem />} />
            <Route path="/study/materials" element={<StudySystem />} />
            <Route path="/study/objectives" element={<StudySystem />} />

            {/* Other Routes */}
            <Route path="/gamification" element={<GamificationAdmin />} />
            <Route path="/achievements" element={<div>Achievements section will be implemented soon</div>} />
            <Route path="/settings/languages" element={<LanguagesPage />} />
            <Route path="/settings/currencies" element={<CurrenciesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/auth" element={<AuthSettings />} />
            <Route path="/admin/settings/legal" element={<LegalPoliciesPage />} />
            <Route path="/admin/pwa" element={<PWAManagement />} />
            <Route path="/email-templates" element={<EmailTemplates />} />
            <Route path="/marketplace/sales-metrics" element={<MarketplaceSalesMetrics />} />
            <Route path="/marketplace/sales-policies" element={<MarketplaceSalesPolicies />} />
            <Route path="/marketplace/affiliate-settings" element={<MarketplaceAffiliateSettings />} />
            <Route path="/marketplace/affiliate-requests" element={<AffiliateRequests />} />
            <Route path="/affiliate-requests" element={<AffiliateRequests />} />
            <Route path="/payments" element={<PaymentSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
