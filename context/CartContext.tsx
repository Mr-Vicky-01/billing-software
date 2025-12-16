'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem } from '@/lib/types';
import { getCart, saveCart, clearCart } from '@/lib/storage';
import { saveTransaction } from '@/lib/api';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  payNow: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedCart = getCart();
    setCart(savedCart);
  }, []);

  useEffect(() => {
    if (mounted) {
      saveCart(cart);
    }
  }, [cart, mounted]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        showToast(`${item.name} quantity updated in cart`, 'success', 3000);
        return prev.map(c =>
          c.item.id === item.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      showToast(`${item.name} added to cart`, 'success', 3000);
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const item = prev.find(c => c.item.id === itemId);
      if (item) {
        showToast(`${item.item.name} removed from cart`, 'info', 3000);
      }
      return prev.filter(c => c.item.id !== itemId);
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(c => (c.item.id === itemId ? { ...c, quantity } : c))
    );
  };

  const clearCartHandler = () => {
    setCart([]);
    clearCart();
    showToast('Cart cleared successfully', 'info', 3000);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  };

  const payNow = async () => {
    if (cart.length === 0) return;

    const total = getTotal();
    const transaction = {
      id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      items: cart,
      total,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
    };

    try {
      await saveTransaction(transaction);
      clearCartHandler();
      showToast(`Payment successful! ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'success', 5000);
    } catch (error) {
      console.error('Error saving transaction:', error);
      showToast('Payment failed. Please try again.', 'error', 5000);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart: clearCartHandler,
        getTotal,
        payNow,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
