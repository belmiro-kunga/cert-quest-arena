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
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Menu, X, User, Settings, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useCart();
  const itemCount = items.length;
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderAuthButton = () => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.photo} alt={user.name} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
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
            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
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
          onClick={() => setIsLoginOpen(true)}
        >
          Login
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setIsRegisterOpen(true)}
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
              {renderAuthButton()}
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
              {user ? (
                <>
                  <div className="flex items-center space-x-2 px-2 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photo} alt={user.name} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-700 font-medium">{user.name}</span>
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
                    Perfil
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 w-full"
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Dashboard
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
                    Sair
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
