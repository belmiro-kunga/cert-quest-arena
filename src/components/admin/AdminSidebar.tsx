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
    ],
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart,
  },
  {
    title: 'Notificações',
    href: '/admin/notifications',
    icon: Bell,
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
    <div className="w-64 bg-white border-r h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Admin</h2>
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <div key={item.href}>
              <Link
                to={item.href}
                onClick={() => item.subItems && toggleItem(item.href)}
                className={cn(
                  'flex items-center px-4 py-2 text-sm font-medium rounded-md',
                  location.pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
              {item.subItems && expandedItems.includes(item.href) && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.href}
                      to={subItem.href}
                      className={cn(
                        'flex items-center px-4 py-2 text-sm font-medium rounded-md',
                        location.pathname === subItem.href
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <subItem.icon className="mr-3 h-5 w-5" />
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export { AdminSidebar }; 