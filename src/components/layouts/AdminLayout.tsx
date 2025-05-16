import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  FileText, 
  Package, 
  LogOut,
  KeyRound
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Verificar se o usuário é administrador
  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.email !== 'admin@certquest.com')) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', path: '/admin' },
    { icon: <FileText className="h-5 w-5" />, label: 'Simulados', path: '/admin/simulados' },
    { icon: <Package className="h-5 w-5" />, label: 'Pacotes', path: '/admin/pacotes' },
    { icon: <Users className="h-5 w-5" />, label: 'Usuários', path: '/admin/usuarios' },
    { icon: <KeyRound className="h-5 w-5" />, label: 'Autenticação', path: '/admin/settings/auth' },
    { icon: <Settings className="h-5 w-5" />, label: 'Configurações', path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Cert Quest</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Painel de Administração</p>
        </div>
        
        <nav className="mt-4">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start px-4 py-2 text-left ${
                    window.location.pathname === item.path
                      ? 'bg-gray-100 dark:bg-gray-700 text-primary'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name || 'Administrador'}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email || 'admin@certquest.com'}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
