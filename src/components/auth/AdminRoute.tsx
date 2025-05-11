import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { adminUser, isAuthenticated } = useAdminAuth();

  if (!adminUser || !isAuthenticated()) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

export default AdminRoute;
