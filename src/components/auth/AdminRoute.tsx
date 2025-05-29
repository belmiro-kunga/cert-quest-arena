
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  // Mock admin check - replace with actual authentication logic
  const isAdmin = () => {
    // This should check if the user is actually an admin
    // For now, we'll return true to allow access
    return true;
  };

  if (!isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
