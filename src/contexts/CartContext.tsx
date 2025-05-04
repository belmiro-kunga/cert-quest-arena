import React, { createContext, useContext, useState } from 'react';
import { CartItem } from '@/components/ShoppingCart';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (item: CartItem) => {
    // Check if item already exists
    if (!items.some((i) => i.id === item.id)) {
      setItems([...items, item]);
      setIsOpen(true); // Open cart when adding item
    }
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    setIsOpen(false);
  };

  const closeCart = () => {
    setIsOpen(false);
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addItem,
        removeItem,
        clearCart,
        closeCart,
        toggleCart,
        itemCount: items.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
