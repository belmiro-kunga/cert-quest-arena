import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileText,
  Ticket,
  Settings,
  BarChart,
  Trophy,
  Bell,
  Languages,
  GraduationCap,
  Star,
  CreditCard,
} from 'lucide-react';

export function AdminNavigation() {
  const { t } = useTranslation();
  const location = useLocation();

  const menuItems = [
    {
      label: t('common.overview'),
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: t('common.students'),
      href: '/admin/students',
      icon: Users,
      subItems: [
        {
          label: 'Lista de Alunos',
          href: '/admin/students',
          icon: Users,
        },
        {
          label: 'Novo Aluno',
          href: '/admin/students/new',
          icon: Users,
        },
      ],
    },
    {
      label: t('common.exams'),
      href: '/admin/exams',
      icon: FileText,
      subItems: [
        {
          label: 'Lista de Exames',
          href: '/admin/exams',
          icon: FileText,
        },
        {
          label: 'Novo Exame',
          href: '/admin/exams/new',
          icon: FileText,
        },
      ],
    },
    {
      label: t('common.coupons'),
      href: '/admin/coupons',
      icon: Ticket,
      subItems: [
        {
          label: 'Lista de Cupons',
          href: '/admin/coupons',
          icon: Ticket,
        },
        {
          label: 'Novo Cupom',
          href: '/admin/coupons/new',
          icon: Ticket,
        },
      ],
    },
    {
      label: t('common.study'),
      href: '/admin/study',
      icon: GraduationCap,
      subItems: [
        {
          label: 'Flashcards',
          href: '/admin/study/flashcards',
          icon: GraduationCap,
        },
        {
          label: 'Materiais',
          href: '/admin/study/materials',
          icon: GraduationCap,
        },
        {
          label: 'Objetivos',
          href: '/admin/study/objectives',
          icon: GraduationCap,
        },
      ],
    },
    {
      label: t('common.gamification'),
      href: '/admin/gamification',
      icon: Star,
    },
    {
      label: t('common.achievements'),
      href: '/admin/achievements',
      icon: Trophy,
    },
    {
      label: t('common.payments'),
      href: '/admin/payments',
      icon: CreditCard,
    },
    {
      label: t('common.settings'),
      href: '/admin/settings',
      icon: Settings,
      subItems: [
        {
          label: t('admin.languages.title'),
          href: '/admin/settings/languages',
          icon: Languages,
        },
      ],
    },
    {
      label: t('common.analytics'),
      href: '/admin/analytics',
      icon: BarChart,
    },
    {
      label: t('common.notifications'),
      href: '/admin/notifications',
      icon: Bell,
    },
  ];

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <nav className="flex items-center space-x-4 lg:space-x-6">
          {menuItems.map((item) => (
            <div key={item.href} className="relative group">
              <Link
                to={item.href}
                className={cn(
                  'flex items-center text-sm font-medium transition-colors hover:text-primary',
                  location.pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
              {item.subItems && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        className={cn(
                          'flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100',
                          location.pathname === subItem.href && 'bg-gray-100'
                        )}
                      >
                        <subItem.icon className="mr-2 h-4 w-4" />
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
