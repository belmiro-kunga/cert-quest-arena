import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart as CartIcon, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface CartItem {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  preco_usd?: number;
  preco_eur?: number;
}

interface ShoppingCartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveItem: (id: string) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  isOpen,
  onClose,
  onRemoveItem,
}) => {
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + (item.discountPrice || item.price), 0);
  const savings = items.reduce(
    (sum, item) => sum + (item.discountPrice ? item.price - item.discountPrice : 0),
    0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative w-full max-w-lg mx-4 max-h-[90vh] flex flex-col bg-white shadow-xl sm:rounded-xl rounded-t-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <CartIcon className="h-5 w-5" />
            Cart ({items.length})
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto py-6 px-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <CartIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-500 mt-1">Add some exams to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <div className="mt-2">
                      {item.discountPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-cert-blue">${item.discountPrice.toFixed(2)}</span>
                          <span className="text-sm text-gray-500 line-through">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            Save ${(item.price - item.discountPrice).toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-cert-blue">${item.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 -mt-1"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {items.length > 0 && (
          <CardFooter className="flex flex-col space-y-4 border-t pt-6 bg-gray-50">
            <div className="w-full space-y-2">
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
            <div className="flex flex-col gap-2 w-full">
              <Button
                className="w-full bg-cert-blue hover:bg-cert-blue/90"
                onClick={() => {
                  onClose();
                  navigate('/checkout');
                }}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ShoppingCart;
