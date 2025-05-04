import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Start for Free</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Try our platform at no cost and pay only for the exams you want.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Freemium</h3>
              <p className="text-gray-600 mb-6">Basic access to the platform</p>
              <div className="text-4xl font-bold mb-6">
                $0
                <span className="text-base font-normal text-gray-600">/always</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Access to free exams</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Customizable profile</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Community ranking</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Individual exam purchase</span>
              </li>
            </ul>

            <Button className="w-full" size="lg">
              Start Now
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
