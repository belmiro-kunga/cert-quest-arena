
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/LoginForm';
import Footer from '@/components/Footer';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const handleLoginSuccess = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen flex flex-col bg-cert-gray">
      <div className="flex-grow flex items-center justify-center py-12 px-4">
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

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Login</CardTitle>
            </CardHeader>
            <CardContent>
              <LoginForm onSuccess={handleLoginSuccess} />
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Não tem uma conta? <a href="#" className="text-cert-blue font-medium hover:underline">Cadastre-se</a></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
