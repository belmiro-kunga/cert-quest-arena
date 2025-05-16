import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import { ShieldAlert } from 'lucide-react';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { adminUser } = useAdminAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Redirecionar para o painel administrativo se já estiver autenticado como admin
  useEffect(() => {
    // Verificar apenas uma vez na montagem do componente
    if (adminUser) {
      navigate('/admin');
    }
    setCheckingAuth(false);
  }, [adminUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center mb-6">
        <ShieldAlert className="h-8 w-8 text-primary mr-2" />
        <h1 className="text-3xl font-bold">Cert Quest Arena</h1>
      </div>
      
      <div className="w-full max-w-md">
        <AdminLoginForm />
      </div>
      
      <p className="mt-8 text-center text-sm text-gray-500">
        Área restrita a administradores do sistema.
      </p>
    </div>
  );
};

export default AdminLoginPage;
