import * as React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LanguageSelector } from '../LanguageSelector';

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
  const { t } = useTranslation();

  // Admin menu items with icons
  const menuItems = [
    { value: "overview", label: t('common.overview'), icon: LayoutDashboard },
    { value: "students", label: t('common.students'), icon: Users },
    { value: "exams", label: t('common.exams'), icon: FileText },
    { value: "coupons", label: t('common.coupons'), icon: Percent },
    { value: "study", label: t('common.study'), icon: GraduationCap },
    { value: "gamification", label: t('common.gamification'), icon: Star },
    { value: "achievements", label: t('common.achievements'), icon: Award },
    { value: "payments", label: t('common.payments'), icon: CreditCard },
    { value: "settings", label: t('common.settings'), icon: Settings }
  ];

  return (
    <div className="flex items-center justify-between border-b">
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
      <div className="px-4">
        <LanguageSelector />
      </div>
    </div>
  );
}
