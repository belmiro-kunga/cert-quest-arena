import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

const Header: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { items, toggleCart } = useCart();
  const itemCount = items.length;
  const navigate = useNavigate();

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
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-cert-blue text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
