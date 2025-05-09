import React from "react";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Overview } from "@/components/admin/Overview";
import { Students } from "@/components/admin/Students";
import { Exams } from "@/components/admin/Exams";
import { Coupons } from "@/components/admin/Coupons";
import { GamificationAdmin } from "@/components/admin/GamificationAdmin";
import Payments from "@/components/admin/Payments";
import { StudySystem } from "@/components/admin/StudySystem";
import { useAdminPage } from "@/hooks/useAdminPage";
import LanguagesPage from "./admin/LanguagesPage";
import SettingsPage from "./admin/settings/SettingsPage";
import CurrenciesPage from "./admin/settings/CurrenciesPage";
import { Routes, Route } from "react-router-dom";

const AdminPage = () => {
  const { state, actions } = useAdminPage();

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavigation />
        <div className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/" element={<Overview />} />
            
            {/* Students Routes */}
            <Route 
              path="/students" 
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

            {/* Exams Routes */}
            <Route 
              path="/exams" 
              element={
                <Exams 
                  exams={state.adminExams}
                  onSelect={actions.handleExamSelect}
                  onDelete={actions.handleExamDelete}
                  onExamCreated={actions.handleExamCreated}
                  onExamUpdated={actions.handleExamUpdated}
                />
              } 
            />
            <Route 
              path="/exams/new" 
              element={
                <Exams 
                  exams={state.adminExams}
                  onSelect={actions.handleExamSelect}
                  onDelete={actions.handleExamDelete}
                  onExamCreated={actions.handleExamCreated}
                  onExamUpdated={actions.handleExamUpdated}
                />
              } 
            />

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
            <Route path="/payments" element={<Payments />} />
            <Route path="/settings/languages" element={<LanguagesPage />} />
            <Route path="/settings/currencies" element={<CurrenciesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<div>Notifications section will be implemented soon</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
