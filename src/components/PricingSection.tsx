
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingSection: React.FC = () => {
  return (
    <section className="py-16 bg-solarized-base02/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-solarized-base2">Premium Access</h2>
          <p className="text-xl text-solarized-base1">Get unlimited access to all certification exams</p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md p-8 bg-solarized-base03/90 rounded-lg shadow-cert-lg border border-solarized-base01/50">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 text-solarized-base2">Premium</h3>
              <p className="text-solarized-base0 mb-6">Full access to all premium features</p>
              <div className="text-4xl font-bold mb-6 text-solarized-blue/95">
                $49.99
                <span className="text-base font-normal text-solarized-base1">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-solarized-green/90 mr-2" />
                <span className="text-solarized-base1">Unlimited exam access</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-solarized-green/90 mr-2" />
                <span className="text-solarized-base1">Detailed explanations</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-solarized-green/90 mr-2" />
                <span className="text-solarized-base1">Performance analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-solarized-green/90 mr-2" />
                <span className="text-solarized-base1">Study guides</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-solarized-green/90 mr-2" />
                <span className="text-solarized-base1">Priority support</span>
              </li>
            </ul>

            <Button className="w-full bg-solarized-blue/90 hover:bg-solarized-blue text-solarized-base2">
              Get Premium
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-solarized-base0">
            Premium exams starting at <span className="font-bold text-solarized-base2">$19.99</span>
          </p>
          <p className="text-sm text-solarized-base01 mt-2">
            Prices may vary by certification
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
