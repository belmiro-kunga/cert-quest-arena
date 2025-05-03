
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Certifications from '@/components/Certifications';
import PricingSection from '@/components/PricingSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Certifications />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
