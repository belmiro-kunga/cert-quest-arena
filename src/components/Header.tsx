
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useCart();
  const itemCount = items.length;
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <header className="bg-white/95 shadow sticky top-0 z-10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            CertQuest Arena
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link to="/exams" className="text-gray-600 hover:text-gray-900 transition-colors">
              Exams
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              className="relative border-gray-200 hover:bg-gray-100"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* Desktop Authentication Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsLoginOpen(true)}
              >
                Sign In
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsRegisterOpen(true)}
              >
                Sign Up
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4 mb-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-900 transition-colors px-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/exams" 
                className="text-gray-600 hover:text-gray-900 transition-colors px-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Exams
              </Link>
              <Link 
                to="/about" 
                className="text-gray-600 hover:text-gray-900 transition-colors px-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
            </nav>
            <div className="flex flex-col space-y-2 px-2">
              <Button
                variant="ghost"
                className="justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 w-full"
                onClick={() => {
                  setIsLoginOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign In
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                onClick={() => {
                  setIsRegisterOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md bg-white border-gray-200 backdrop-blur-md">
          <LoginForm onSuccess={() => setIsLoginOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="sm:max-w-md bg-white border-gray-200 backdrop-blur-md">
          <RegisterForm onSuccess={() => setIsRegisterOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
