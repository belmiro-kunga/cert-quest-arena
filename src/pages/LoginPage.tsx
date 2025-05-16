import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from || '/dashboard';
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);
  
  const handleLoginSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cert-gray px-4 relative">
      <Link to="/" className="absolute top-6 left-6 flex items-center text-white hover:text-gray-200 transition-colors">
        <ArrowLeft className="mr-1 h-4 w-4" />
        <span>Voltar à página inicial</span>
      </Link>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-cert-blue flex items-center justify-center">
              <span className="text-white text-2xl font-bold">CQ</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mt-4">CertQuest</h1>
          <p className="text-gray-600 mt-2">Faça login para acessar seu perfil e os simulados</p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm onSuccess={handleLoginSuccess} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
