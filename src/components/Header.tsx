import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Header: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-cert-blue flex items-center justify-center">
            <span className="text-white font-bold">CQ</span>
          </div>
          <span className="text-xl font-bold text-cert-darkblue">CertQuest</span>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-600 hover:text-cert-blue font-medium">Home</a>
          <a href="#certifications" className="text-gray-600 hover:text-cert-blue font-medium">Certificações</a>
          <a href="#features" className="text-gray-600 hover:text-cert-blue font-medium">Recursos</a>
          <a href="#pricing" className="text-gray-600 hover:text-cert-blue font-medium">Preços</a>
          <a href="#testimonials" className="text-gray-600 hover:text-cert-blue font-medium">Depoimentos</a>
          <a href="#about" className="text-gray-600 hover:text-cert-blue font-medium">Sobre</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Login</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Login</DialogTitle>
              </DialogHeader>
              <LoginForm onSuccess={() => setIsLoginOpen(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cert-blue hover:bg-cert-darkblue">Cadastrar</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar conta</DialogTitle>
              </DialogHeader>
              <RegisterForm onSuccess={() => setIsRegisterOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
