import React, { useState } from 'react';
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
import { Icons } from '@/components/ui/icons';
import PaymentMethods from '@/components/PaymentMethods';

const CheckoutPage: React.FC = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe');

  const subtotal = items.reduce((total, item) => total + (item.discountPrice || item.price), 0);
  const savings = items.reduce((total, item) => total + (item.price - (item.discountPrice || item.price)), 0);
  const total = subtotal;

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulando processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearCart();
      toast({
        title: "Pagamento realizado com sucesso!",
        description: "Seu pedido foi confirmado.",
      });
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro ao processar seu pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
                  <CardTitle>Pagamento</CardTitle>
                  <CardDescription>Escolha o método de pagamento</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    <PaymentMethods
                      selectedMethod={selectedPaymentMethod}
                      onMethodChange={handlePaymentMethodChange}
                    />

                    {selectedPaymentMethod === 'stripe' && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardName">Nome no cartão</Label>
                          <Input id="cardName" placeholder="Nome como está no cartão" required />
                        </div>
                        <div>
                          <Label htmlFor="cardNumber">Número do cartão</Label>
                          <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Data de expiração</Label>
                            <Input id="expiry" placeholder="MM/AA" required />
                          </div>
                          <div>
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" required />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedPaymentMethod === 'paypal' && (
                      <div className="text-center p-4">
                        <p className="text-sm text-gray-500">
                          Você será redirecionado para o PayPal para concluir o pagamento.
                        </p>
                      </div>
                    )}

                    {selectedPaymentMethod === 'googlePay' && (
                      <div className="text-center p-4">
                        <p className="text-sm text-gray-500">
                          Você será redirecionado para o Google Pay para concluir o pagamento.
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-6">
                    <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                      Back to Cart
                    </Button>
                    <Button type="submit" className="bg-cert-blue hover:bg-cert-blue/90" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        'Finalizar Compra'
                      )}
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
                      <span>${total.toFixed(2)}</span>
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
