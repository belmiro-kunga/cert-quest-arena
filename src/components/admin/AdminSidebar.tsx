import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Gift,
  Trophy,
  CreditCard,
  BookMarked,
  Settings,
  Languages,
  Coins,
  BarChart,
  Bell,
  Mail,
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Visão Geral',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Estudantes',
    href: '/admin/students',
    icon: Users,
  },
  {
    title: 'Exames',
    href: '/admin/exams',
    icon: BookOpen,
  },
  {
    title: 'Cupons',
    href: '/admin/coupons',
    icon: Gift,
  },
  {
    title: 'Sistema de Estudos',
    href: '/admin/study',
    icon: BookMarked,
  },
  {
    title: 'Gamificação',
    href: '/admin/gamification',
    icon: Trophy,
  },
  {
    title: 'Conquistas',
    href: '/admin/achievements',
    icon: Trophy,
  },
  {
    title: 'Pagamentos',
    href: '/admin/payments',
    icon: CreditCard,
  },
  {
    title: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
    subItems: [
      {
        title: 'Idiomas',
        href: '/admin/settings/languages',
        icon: Languages,
      },
      {
        title: 'Moedas',
        href: '/admin/settings/currencies',
        icon: Coins,
      },
      {
        title: 'Templates de Email',
        href: '/admin/email-templates',
        icon: Mail,
      },
    ],
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart,
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleItem = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">Admin</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <div key={item.href}>
              <Link
                to={item.href}
                onClick={() => item.subItems && toggleItem(item.href)}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  location.pathname === item.href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5",
                  location.pathname === item.href ? "text-blue-700" : "text-gray-400"
                )} />
                {item.title}
              </Link>
              
              {item.subItems && expandedItems.includes(item.href) && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.href}
                      to={subItem.href}
                      className={cn(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        location.pathname === subItem.href
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <subItem.icon className={cn(
                        "mr-3 h-5 w-5",
                        location.pathname === subItem.href ? "text-blue-700" : "text-gray-400"
                      )} />
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Bell className="h-4 w-4" />
          <span>Notificações</span>
        </div>
      </div>
    </div>
  );
};

export { AdminSidebar }; 