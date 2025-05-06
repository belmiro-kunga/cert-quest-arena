
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, adminOnly = false }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  
  console.log("PrivateRoute check:", { 
    user: user?.id || "none", 
    isAdmin: profile?.role === 'admin' || profile?.plan_type === 'enterprise',
    loading,
    adminOnly
  });
  
  // Show loading state if we're still checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cert-blue mx-auto"></div>
          <p className="mt-4 text-cert-blue font-medium">Carregando...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Check admin access if adminOnly is true
  if (adminOnly && profile?.role !== 'admin' && profile?.plan_type !== 'enterprise') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
