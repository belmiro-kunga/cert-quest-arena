import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { RegisterForm } from '@/components/RegisterForm';
import { ArrowLeft } from 'lucide-react';

const SignUpPage = () => {
  const navigate = useNavigate();
  
  const handleSignUpSuccess = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cert-gray px-4 relative">
      <Link to="/login" className="absolute top-6 left-6 flex items-center text-white hover:text-gray-200 transition-colors">
        <ArrowLeft className="mr-1 h-4 w-4" />
        <span>Voltar para o Login</span>
      </Link>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-cert-blue flex items-center justify-center">
              <span className="text-white text-2xl font-bold">CQ</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mt-4">CertQuest</h1>
          <p className="text-gray-600 mt-2">Crie sua conta para acessar os simulados</p>
        </div>

        <Card className="border-none shadow-lg">
          <RegisterForm onSuccess={handleSignUpSuccess} />
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
