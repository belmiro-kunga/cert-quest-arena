import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Menu, X, User, Settings, LogOut, Gift, ChevronDown, BookOpen } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import CurrencySelector from './CurrencySelector';

import { useTranslation } from 'react-i18next';


const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useCart();
  const itemCount = items.length;
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const renderAuthButton = () => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL || ''} alt={user.name || 'User'} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <>
        <Button
          variant="ghost"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => navigate('/signup')}
        >
          Cadastrar
        </Button>
      </>
    );
  };

  return (
    <header className="bg-white/95 shadow sticky top-0 z-10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-bold text-blue-600">
              CertQuest Arena
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link to="/simulados" className="text-gray-600 hover:text-gray-900 transition-colors">
              Simulados
            </Link>
            <Link to="/study" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span>Modo Estudo</span>
            </Link>
            
            {/* Menu Dropdown de Simulados Gratuitos */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors p-2">
                  <Gift className="h-4 w-4 text-green-600" />
                  <span>Simulados Gratuitos</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={() => navigate('/simulados?free=true')}>
                  <span className="text-green-600 font-medium">Todos Gratuitos</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/simulados?free=true&category=aws')}>
                  AWS
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/simulados?free=true&category=azure')}>
                  Microsoft Azure
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/simulados?free=true&category=gcp')}>
                  Google Cloud
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/simulados?free=true&category=comptia')}>
                  CompTIA
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/simulados?free=true&category=cisco')}>
                  Cisco
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  

                </div>
                {renderAuthButton()}
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <CurrencySelector />
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
                className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/simulados" 
                className="text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Simulados
              </Link>
              <Link 
                to="/study" 
                className="text-gray-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-md hover:bg-blue-50 flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="h-5 w-5 text-blue-500" />
                <span>Modo Estudo</span>
              </Link>
              
              {/* Menu de Simulados Gratuitos para Mobile */}
              <div className="flex flex-col space-y-1 mt-2 mb-2 px-2">
                <div className="flex items-center gap-1 text-green-600 font-medium">
                  <Gift className="h-4 w-4" />
                  <span>Simulados Gratuitos:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pl-6 mt-1">
                  <Link 
                    to="/simulados?free=true" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Todos Gratuitos
                  </Link>
                  <Link 
                    to="/simulados?free=true&category=aws" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    AWS
                  </Link>
                  <Link 
                    to="/simulados?free=true&category=azure" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Microsoft Azure
                  </Link>
                  <Link 
                    to="/simulados?free=true&category=gcp" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Google Cloud
                  </Link>
                  <Link 
                    to="/simulados?free=true&category=comptia" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    CompTIA
                  </Link>
                  <Link 
                    to="/simulados?free=true&category=cisco" 
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Cisco
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-2 px-2">

                <div className="bg-white shadow rounded-md">
                  
                </div>
              </div>
            </nav>
            <div className="flex flex-col space-y-2 px-2">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 px-2 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || ''} alt={user.name || 'User'} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-700 font-medium">{user.name || 'User'}</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 w-full"
                    onClick={() => {
                      navigate('/profile');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Button>

                  <Button
                    variant="ghost"
                    className="justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 w-full"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 w-full"
                    onClick={() => {
                      setIsLoginOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                    onClick={() => {
                      setIsRegisterOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Cadastrar
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md bg-white border-gray-200 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold leading-none tracking-tight">
              Login
            </DialogTitle>
          </DialogHeader>
          <LoginForm onSuccess={() => setIsLoginOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="sm:max-w-md bg-white border-gray-200 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>Criar Conta</DialogTitle>
          </DialogHeader>
          <RegisterForm onSuccess={() => setIsRegisterOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
