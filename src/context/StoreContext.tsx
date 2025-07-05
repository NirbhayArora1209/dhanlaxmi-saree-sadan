"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';

// Types
export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const cartData = localStorage.getItem('cart');
      const wishlistData = localStorage.getItem('wishlist');
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
      if (wishlistData) {
        const parsedWishlist = JSON.parse(wishlistData);
        if (Array.isArray(parsedWishlist)) {
          setWishlist(parsedWishlist);
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);
  
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      }
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlist]);

  // Cart functions
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product._id === product._id);
      if (existing) {
        return prev.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product._id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev =>
      prev.map(item =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Wishlist functions
  const addToWishlist = (product: Product) => {
    setWishlist(prev =>
      prev.some(item => item._id === product._id) ? prev : [...prev, product]
    );
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item._id !== productId));
  };

  const clearWishlist = () => setWishlist([]);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
} 