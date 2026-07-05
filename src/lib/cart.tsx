import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from './types';

type CartContextValue = {
  items: { product: Product; quantity: number }[];
  add: (product: Product, qty?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ product: Product; quantity: number }[]>([]);

  const add = (product: Product, qty = 1) => {
    setItems((cur) => {
      const existing = cur.find((i) => i.product._id === product._id);
      if (existing) {
        return cur.map((i) =>
          i.product._id === product._id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...cur, { product, quantity: qty }];
    });
  };

  const remove = (productId: string) =>
    setItems((cur) => cur.filter((i) => i.product._id !== productId));

  const setQuantity = (productId: string, qty: number) =>
    setItems((cur) =>
      cur
        .map((i) => (i.product._id === productId ? { ...i, quantity: Math.max(0, qty) } : i))
        .filter((i) => i.quantity > 0)
    );

  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, setQuantity, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
