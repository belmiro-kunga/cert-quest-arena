import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Certifications from '@/components/Certifications';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  
  // Redirecionar para o dashboard se estiver logado
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <div className="container mx-auto py-10 text-center">
          <Button 
            className="bg-cert-blue hover:bg-cert-darkblue text-lg px-8 py-6 mr-4"
            onClick={() => navigate('/login')}
          >
            Comece Agora
          </Button>
          <Button 
            variant="outline"
            className="text-lg px-8 py-6 mr-4"
            onClick={() => navigate('/profile')}
          >
            Ver Perfil
          </Button>
          <Button 
            variant="outline"
            className="text-lg px-8 py-6"
            onClick={() => navigate('/admin')}
          >
            Painel Admin
          </Button>
        </div>
        <Features />
        <Certifications />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
