
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-12 md:py-16 bg-gray-100 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-gray-900">Premium Access</h2>
          <p className="text-lg md:text-xl text-gray-600">Get unlimited access to all certification exams</p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md p-5 md:p-8 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">Premium</h3>
              <p className="text-gray-600 mb-4 md:mb-6">Full access to all premium features</p>
              <div className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-blue-600">
                $49.99
                <span className="text-sm md:text-base font-normal text-gray-500">/month</span>
              </div>
            </div>

            <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm md:text-base">Unlimited exam access</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm md:text-base">Detailed explanations</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm md:text-base">Performance analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm md:text-base">Study guides</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm md:text-base">Priority support</span>
              </li>
            </ul>


          </div>
        </div>

        <div className="mt-8 md:mt-12 text-center">


        </div>
      </div>
    </section>
  );
};

export default PricingSection;
