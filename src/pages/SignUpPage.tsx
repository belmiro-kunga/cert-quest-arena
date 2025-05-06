
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import RegisterForm from '@/components/RegisterForm';
import Footer from '@/components/Footer';

const SignUpPage = () => {
  const navigate = useNavigate();
  
  const handleSignUpSuccess = () => {
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
            <p className="text-gray-600 mt-2">Crie sua conta para acessar os simulados</p>
          </div>

          <RegisterForm onSuccess={handleSignUpSuccess} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;
