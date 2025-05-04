
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { items } = useCart();
  const itemCount = items.length;
  const navigate = useNavigate();

  return (
    <header className="bg-solarized-base03/95 shadow-cert sticky top-0 z-10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-solarized-blue/95">
            CertQuest Arena
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-solarized-base0 hover:text-solarized-base2 transition-colors">
              Home
            </Link>
            <Link to="/exams" className="text-solarized-base0 hover:text-solarized-base2 transition-colors">
              Exams
            </Link>
            <Link to="/about" className="text-solarized-base0 hover:text-solarized-base2 transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              className="relative border-solarized-base01/70 hover:bg-solarized-base02/60"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5 text-solarized-base1" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-solarized-blue/90 text-solarized-base2 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              className="text-solarized-base1 hover:text-solarized-base2 hover:bg-solarized-base02/60"
              onClick={() => setIsLoginOpen(true)}
            >
              Sign In
            </Button>
            <Button
              className="bg-solarized-blue/90 hover:bg-solarized-blue text-solarized-base2"
              onClick={() => setIsRegisterOpen(true)}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md bg-solarized-base03/95 border-solarized-base01/70 backdrop-blur-md">
          <LoginForm />
        </DialogContent>
      </Dialog>

      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="sm:max-w-md bg-solarized-base03/95 border-solarized-base01/70 backdrop-blur-md">
          <RegisterForm onSuccess={() => setIsRegisterOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
