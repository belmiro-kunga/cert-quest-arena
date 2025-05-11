import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  CreditCard,
  Settings,
  Users,
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Meus Cursos',
    href: '/my-courses',
    icon: BookOpen,
  },
  {
    title: 'Certificados',
    href: '/certificates',
    icon: Trophy,
  },
  {
    title: 'Programa de Afiliados',
    href: '/affiliate',
    icon: Users,
  },
  {
    title: 'Pagamentos',
    href: '/payments',
    icon: CreditCard,
  },
  {
    title: 'Configurações',
    href: '/settings',
    icon: Settings,
  },
];

const UserSidebar = () => {
  const location = useLocation();

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  location.pathname === item.href ? 'bg-accent' : 'transparent'
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
