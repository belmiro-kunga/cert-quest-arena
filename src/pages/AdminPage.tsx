
import React from "react";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { Overview } from "@/components/admin/Overview";
import Students from "@/components/admin/Students";
import Exams from "@/components/admin/Exams";
import { Coupons } from "@/components/admin/Coupons";
import GamificationAdmin from "@/components/admin/GamificationAdmin";
import Payments from "@/components/admin/Payments";
import StudySystem from "@/components/admin/StudySystem";
import { useAdminPage } from "@/hooks/useAdminPage";
import LanguagesPage from "./admin/LanguagesPage";

const AdminPage = () => {
  const { state, actions } = useAdminPage();

  // Render active component based on tab
  const renderActiveTab = () => {
    switch (state.activeTab) {
      case "overview":
        return <Overview />;
      case "students":
        return <Students />;
      case "exams":
        return <Exams exams={state.adminExams} onExamCreated={actions.handleExamCreated} onExamUpdated={actions.handleExamUpdated} onExamDeleted={actions.handleExamDelete} isLoading={state.isLoading} />;
      case "coupons":
        return <Coupons coupons={[]} onSelect={() => Promise.resolve()} onDelete={() => Promise.resolve()} />;
      case "gamification":
        return <GamificationAdmin />;
      case "achievements":
        return <div>Achievements section will be implemented soon</div>;
      case "payments":
        return <Payments />;
      case "study":
        return <StudySystem />;
      case "languages":
        return <LanguagesPage />;
      case "settings":
        return <div>Settings section will be implemented soon</div>;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavigation activeTab={state.activeTab} onTabChange={actions.handleTabChange} />
      <div className="flex-1 p-4">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default AdminPage;
