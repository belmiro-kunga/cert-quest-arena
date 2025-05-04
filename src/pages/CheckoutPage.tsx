import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, Lock, ShieldCheck } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const subtotal = items.reduce((total, item) => total + (item.discountPrice || item.price), 0);
  const savings = items.reduce((total, item) => total + (item.price - (item.discountPrice || item.price)), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simular processamento do pagamento
    toast({
      title: "Payment Successful",
      description: "Thank you for your purchase! You can now access your exams.",
    });
    
    clearCart();
    navigate('/profile');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-16 px-4">
          <div className="container mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some exams to get started with your certification journey.</p>
            <Button onClick={() => navigate('/')}>Browse Exams</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Order Summary</CardTitle>
                  <CardDescription>Review your order before payment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        <div className="mt-2">
                          {item.discountPrice ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-cert-blue">${item.discountPrice.toFixed(2)}</span>
                              <span className="text-sm text-gray-500 line-through">${item.price.toFixed(2)}</span>
                              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                Save ${(item.price - item.discountPrice).toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-cert-blue">${item.price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Payment Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                  <CardDescription>Enter your payment information securely</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Smith" required className="mt-1" />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" required className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" required className="mt-1" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Lock className="h-4 w-4" />
                      Your payment information is encrypted and secure
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-6">
                    <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                      Back to Cart
                    </Button>
                    <Button type="submit" className="bg-cert-blue hover:bg-cert-blue/90">
                      Complete Purchase
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>

            {/* Order Total */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Total</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Total Savings</span>
                        <span className="text-green-600 font-medium">-${savings.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                      <span>Total</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Secure Checkout</span>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          30-day access to all purchased exams
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          Unlimited practice attempts
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          Detailed performance analytics
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
