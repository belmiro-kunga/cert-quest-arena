
import * as React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// Import icons from lucide-react
import {
  LayoutDashboard,
  Users,
  FileText,
  Percent,
  GraduationCap,
  Star,
  Award,
  CreditCard,
  Settings
} from 'lucide-react';

interface AdminNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function AdminNavigation({ activeTab, onTabChange }: AdminNavigationProps) {
  // Admin menu items with icons
  const menuItems = [
    { value: "overview", label: "Visão Geral", icon: LayoutDashboard },
    { value: "students", label: "Alunos", icon: Users },
    { value: "exams", label: "Simulados", icon: FileText },
    { value: "coupons", label: "Cupons", icon: Percent },
    { value: "study", label: "Sistema de Estudos", icon: GraduationCap },
    { value: "gamification", label: "Gamificação", icon: Star },
    { value: "achievements", label: "Conquistas", icon: Award },
    { value: "payments", label: "Pagamentos", icon: CreditCard },
    { value: "settings", label: "Configurações", icon: Settings }
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="admin-tabs">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <TabsTrigger key={item.value} value={item.value} className="admin-tab">
              <Icon className="h-4 w-4 mr-2" />
              <span>{item.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
