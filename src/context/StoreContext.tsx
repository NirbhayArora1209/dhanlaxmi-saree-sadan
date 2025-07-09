"use client";
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, Category } from '@/types';
import { productsApi, categoriesApi, cartApi, wishlistApi } from '@/lib/client-api';

// State types
interface StoreState {
  products: Product[];
  categories: Category[];
  cart: any[];
  wishlist: any[];
  loading: {
    products: boolean;
    categories: boolean;
    cart: boolean;
    wishlist: boolean;
  };
  error: {
    products: string | null;
    categories: string | null;
    cart: string | null;
    wishlist: string | null;
  };
}

// Action types
type StoreAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_CART'; payload: any[] }
  | { type: 'SET_WISHLIST'; payload: any[] }
  | { type: 'SET_LOADING'; payload: { key: keyof StoreState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof StoreState['error']; value: string | null } }
  | { type: 'ADD_TO_CART'; payload: any }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'ADD_TO_WISHLIST'; payload: any }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string };

// Initial state
const initialState: StoreState = {
  products: [],
  categories: [],
  cart: [],
  wishlist: [],
  loading: {
    products: false,
    categories: false,
    cart: false,
    wishlist: false,
  },
  error: {
    products: null,
    categories: null,
    cart: null,
    wishlist: null,
  },
};

// Reducer
function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.payload };
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value },
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: { ...state.error, [action.payload.key]: action.payload.value },
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product_id !== action.payload),
      };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product_id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item._id !== action.payload),
      };
    default:
      return state;
  }
}

// Context
interface StoreContextType extends StoreState {
  // Products
  fetchProducts: (params?: any) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  getProduct: (id: string) => Promise<Product | null>;
  
  // Categories
  fetchCategories: () => Promise<void>;
  
  // Cart
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  
  // Wishlist
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => void;
  
  // Utility
  isInCart: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  getCartItemQuantity: (productId: string) => number;
  getCartTotal: () => number;
  getCartCount: () => number;
  getWishlistCount: () => number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Provider component
interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  const fetchInProgress = React.useRef(false);
  const initialDataLoaded = React.useRef(false);

  // Products
  const fetchProducts = async (params?: any) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'products', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'products', value: null } });
    try {
      const response = await productsApi.getProducts(params);
      if (response && response.data) {
        dispatch({ type: 'SET_PRODUCTS', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: { key: 'products', value: 'Failed to fetch products' } });
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: { key: 'products', value: error.message || 'Network error' } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'products', value: false } });
    }
  };

  const fetchFeaturedProducts = async () => {
    // Prevent multiple simultaneous calls
    if (fetchInProgress.current || state.loading.products) {
      console.log('🔄 fetchFeaturedProducts: Already loading, skipping...');
      return;
    }
    
    fetchInProgress.current = true;
    
    try {
      console.log('🔄 fetchFeaturedProducts: Starting...');
      dispatch({ type: 'SET_LOADING', payload: { key: 'products', value: true } });
      dispatch({ type: 'SET_ERROR', payload: { key: 'products', value: null } });
      
      console.log('🔄 fetchFeaturedProducts: Calling productsApi.getFeaturedProducts()...');
      const products = await productsApi.getFeaturedProducts();
      console.log('✅ fetchFeaturedProducts: Received products:', products);
      
      if (products && Array.isArray(products)) {
        dispatch({ type: 'SET_PRODUCTS', payload: products });
        console.log('✅ fetchFeaturedProducts: Products set in state');
      } else {
        console.warn('⚠️ fetchFeaturedProducts: Received invalid products data:', products);
        dispatch({ type: 'SET_PRODUCTS', payload: [] });
      }
    } catch (error: any) {
      console.error('❌ fetchFeaturedProducts: Error:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'products', value: error.message || 'Network error' } });
      dispatch({ type: 'SET_PRODUCTS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'products', value: false } });
      fetchInProgress.current = false;
      console.log('✅ fetchFeaturedProducts: Loading finished');
    }
  };

  const getProduct = async (id: string): Promise<Product | null> => {
    try {
      return await productsApi.getProduct(id);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  };

  // Categories
  const fetchCategories = async () => {
    try {
      console.log('🔄 fetchCategories: Starting...');
      dispatch({ type: 'SET_LOADING', payload: { key: 'categories', value: true } });
      dispatch({ type: 'SET_ERROR', payload: { key: 'categories', value: null } });
      
      const categories = await categoriesApi.getCategories();
      console.log('✅ fetchCategories: Received categories:', categories);
      
      if (categories && Array.isArray(categories)) {
        dispatch({ type: 'SET_CATEGORIES', payload: categories });
        console.log('✅ fetchCategories: Categories set in state');
      } else {
        console.warn('⚠️ fetchCategories: Received invalid categories data:', categories);
        dispatch({ type: 'SET_CATEGORIES', payload: [] });
      }
    } catch (error: any) {
      console.error('❌ fetchCategories: Error:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'categories', value: error.message || 'Network error' } });
      dispatch({ type: 'SET_CATEGORIES', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'categories', value: false } });
      console.log('✅ fetchCategories: Loading finished');
    }
  };

  // Cart
  const addToCart = async (product: Product, quantity: number = 1) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'cart', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'cart', value: null } });
    
    try {
      // Always use localStorage approach for consistent behavior
      console.log('Adding to cart:', product.name, 'Quantity:', quantity);
      console.log('Current cart before:', state.cart);
      
      // Check if item already exists
      const existingItemIndex = state.cart.findIndex(item => item.product_id === product._id);
      
      let updatedCart;
      if (existingItemIndex >= 0) {
        // Update quantity
        updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += quantity;
        console.log('Updated existing item:', updatedCart[existingItemIndex]);
      } else {
        // Add new item
        const newItem = {
          product_id: product._id,
          name: product.name,
          price: product.pricing.selling_price,
          quantity: quantity,
          image: product.images[0]?.url || '/images/products/placeholder.jpg'
        };
        updatedCart = [...state.cart, newItem];
        console.log('Added new item:', newItem);
      }
      
      console.log('Updated cart:', updatedCart);
      dispatch({ type: 'SET_CART', payload: updatedCart });
      
      // Save to localStorage
      try {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        console.log('Saved to localStorage');
      } catch (error) {
        console.warn('Failed to save cart to localStorage:', error);
      }
      
      // Try to sync with API in background (non-blocking)
      try {
        await cartApi.addToCart(product._id, quantity);
      } catch (error) {
        console.warn('API sync failed (non-critical):', error);
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'cart', value: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'cart', value: false } });
    }
  };

  const removeFromCart = async (productId: string) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'cart', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'cart', value: null } });
    try {
      const response = await cartApi.removeFromCart(productId);
      dispatch({ type: 'SET_CART', payload: response.items });
    } catch (error: any) {
      // Fallback to local storage
      console.warn('API failed, using local storage:', error);
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
      try {
        const updatedCart = state.cart.filter(item => item.product_id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } catch (error) {
        console.warn('Failed to save cart to localStorage:', error);
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'cart', value: false } });
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'cart', value: true } });
      const cartData = await cartApi.updateCartItem(productId, quantity);
      dispatch({ type: 'SET_CART', payload: cartData.items });
    } catch (error) {
      // Fallback to local storage
      console.warn('API failed, using local storage:', error);
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { id: productId, quantity } });
      try {
        const updatedCart = state.cart.map(item =>
          item.product_id === productId ? { ...item, quantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      } catch (error) {
        console.warn('Failed to save cart to localStorage:', error);
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'cart', value: false } });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'cart', value: true } });
      await cartApi.clearCart();
      dispatch({ type: 'SET_CART', payload: [] });
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'cart', value: false } });
    }
  };

  // Wishlist
  const addToWishlist = async (product: Product) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'wishlist', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'wishlist', value: null } });
    
    try {
      console.log('Adding to wishlist:', product.name);
      console.log('Current wishlist before:', state.wishlist);
      
      // Check if item already exists
      const existingItem = state.wishlist.find(item => item._id === product._id);
      
      if (!existingItem) {
        const updatedWishlist = [...state.wishlist, product];
        console.log('Added new item to wishlist:', product);
        console.log('Updated wishlist:', updatedWishlist);
        
        dispatch({ type: 'SET_WISHLIST', payload: updatedWishlist });
        
        try {
          localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
          console.log('Saved wishlist to localStorage');
        } catch (error) {
          console.warn('Failed to save wishlist to localStorage:', error);
        }
        
        // Try to sync with API in background (non-blocking)
        try {
          await wishlistApi.addToWishlist(product._id);
        } catch (error) {
          console.warn('API sync failed (non-critical):', error);
        }
      } else {
        console.log('Item already in wishlist');
      }
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'wishlist', value: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'wishlist', value: false } });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'wishlist', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'wishlist', value: null } });
    try {
      const response = await wishlistApi.removeFromWishlist(productId);
      dispatch({ type: 'SET_WISHLIST', payload: response.items });
    } catch (error: any) {
      // Fallback to local storage
      console.warn('API failed, using local storage:', error);
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
      localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'wishlist', value: false } });
    }
  };

  const clearWishlist = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'wishlist', value: true } });
      await wishlistApi.clearWishlist();
      dispatch({ type: 'SET_WISHLIST', payload: [] });
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'wishlist', value: false } });
    }
  };

  // Utility functions
  const isInCart = (productId: string): boolean => {
    return state.cart.some(item => item.product_id === productId);
  };

  const isInWishlist = (productId: string): boolean => {
    return state.wishlist.some(item => item._id === productId);
  };

  const getCartItemQuantity = (productId: string): number => {
    const item = state.cart.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const getCartTotal = (): number => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = (): number => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getWishlistCount = (): number => {
    return state.wishlist.length;
  };

  // Load initial data
  useEffect(() => {
    if (initialDataLoaded.current) {
      console.log('🔄 StoreContext: Initial data already loaded, skipping...');
      return;
    }
    
    console.log('🔄 StoreContext: Loading initial data...');
    console.log('🔄 StoreContext: Current state:', state);
    
    initialDataLoaded.current = true;
    
    const loadData = async () => {
      try {
        console.log('🔄 StoreContext: Loading initial data in parallel...');
        
        // Load essential data in parallel
        const promises = [
          fetchCategories(),
          fetchFeaturedProducts(),
          // Load localStorage data immediately (non-blocking)
          (async () => {
            try {
              const storedCart = localStorage.getItem('cart');
              const storedWishlist = localStorage.getItem('wishlist');
              
              if (storedCart) {
                dispatch({ type: 'SET_CART', payload: JSON.parse(storedCart) });
              }
              if (storedWishlist) {
                dispatch({ type: 'SET_WISHLIST', payload: JSON.parse(storedWishlist) });
              }
            } catch (error) {
              console.warn('⚠️ StoreContext: Failed to load from localStorage:', error);
            }
          })()
        ];
        
        await Promise.allSettled(promises);
        
        // Try to sync with API in background (non-blocking)
        setTimeout(async () => {
          try {
            console.log('🔄 StoreContext: Syncing with API in background...');
            const [cartData, wishlistData] = await Promise.allSettled([
              cartApi.getCart(),
              wishlistApi.getWishlist(),
            ]);
            
            if (cartData.status === 'fulfilled') {
              dispatch({ type: 'SET_CART', payload: cartData.value.items || [] });
            }
            if (wishlistData.status === 'fulfilled') {
              dispatch({ type: 'SET_WISHLIST', payload: wishlistData.value.items || [] });
            }
          } catch (error) {
            console.warn('⚠️ StoreContext: Background API sync failed:', error);
          }
        }, 100);
        
        console.log('✅ StoreContext: Initial data loading completed');
      } catch (error) {
        console.error('❌ StoreContext: Failed to load initial data:', error);
      }
    };
    
    loadData();
  }, []);

  const value: StoreContextType = {
    ...state,
    fetchProducts,
    fetchFeaturedProducts,
    getProduct,
    fetchCategories,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInCart,
    isInWishlist,
    getCartItemQuantity,
    getCartTotal,
    getCartCount,
    getWishlistCount,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// Hook
export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
} 