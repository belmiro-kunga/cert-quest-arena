
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Premium Access</h2>
          <p className="text-xl text-gray-600">Get unlimited access to all certification exams</p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Premium</h3>
              <p className="text-gray-600 mb-6">Full access to all premium features</p>
              <div className="text-4xl font-bold mb-6 text-blue-600">
                $49.99
                <span className="text-base font-normal text-gray-500">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Unlimited exam access</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Detailed explanations</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Performance analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Study guides</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-gray-600">Priority support</span>
              </li>
            </ul>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Get Premium
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Premium exams starting at <span className="font-bold text-gray-900">$19.99</span>
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
