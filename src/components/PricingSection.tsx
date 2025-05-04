import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Premium Access</h2>
          <p className="text-xl text-gray-600">Get unlimited access to all certification exams</p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-gray-600 mb-6">Full access to all premium features</p>
              <div className="text-4xl font-bold mb-6">
                $49.99
                <span className="text-base font-normal text-gray-600">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Unlimited exam access</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Detailed explanations</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Performance analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Study guides</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Priority support</span>
              </li>
            </ul>

            <Button className="w-full bg-cert-blue hover:bg-cert-blue/90">
              Get Premium
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Premium exams starting at <span className="font-bold">$19.99</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Prices may vary by certification
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
