
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

interface PaymentTabProps {
  user: {
    planType: string;
    paymentMethod: {
      type: string;
      lastFour: string;
      expiry: string;
    };
    invoices: Array<{
      id: string;
      date: string;
      amount: string;
      status: string;
    }>;
  };
}

const PaymentTab: React.FC<PaymentTabProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Manage your payment methods and view your billing history.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Current Payment Method</h3>
          <div className="flex items-center space-x-4 p-4 border rounded-md">
            <div className="bg-cert-blue text-white p-2 rounded">
              <CreditCard />
            </div>
            <div>
              <p className="font-medium">•••• •••• •••• {user.paymentMethod.lastFour}</p>
              <p className="text-sm text-gray-500">Valid until {user.paymentMethod.expiry}</p>
            </div>
          </div>
          <div className="mt-3">
            <Button variant="outline" size="sm">Update Card</Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Billing History</h3>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {user.invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-medium mb-2">Current Plan: {user.planType}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentTab;
