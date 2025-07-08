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
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
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
        wishlist: state.wishlist.filter(item => item.id !== action.payload),
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
      const response = await cartApi.addToCart(product._id, quantity);
      if (response.success) {
        dispatch({ type: 'SET_CART', payload: response.data.items });
      } else {
        dispatch({ type: 'SET_ERROR', payload: { key: 'cart', value: response.message || 'Cart error' } });
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: { key: 'cart', value: error.message || 'API Error' } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'cart', value: false } });
    }
  };

  const removeFromCart = async (productId: string) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'cart', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'cart', value: null } });
    try {
      const response = await cartApi.removeFromCart(productId);
      if (response.success) {
        dispatch({ type: 'SET_CART', payload: response.data.items });
      } else {
        dispatch({ type: 'SET_ERROR', payload: { key: 'cart', value: response.message || 'Cart error' } });
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: { key: 'cart', value: error.message || 'API Error' } });
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
      console.error('Failed to update cart item:', error);
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
      const response = await wishlistApi.addToWishlist(product._id);
      if (response.success) {
        dispatch({ type: 'SET_WISHLIST', payload: response.data.items });
      } else {
        dispatch({ type: 'SET_ERROR', payload: { key: 'wishlist', value: response.message || 'Wishlist error' } });
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: { key: 'wishlist', value: error.message || 'Wishlist API Error' } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'wishlist', value: false } });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'wishlist', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'wishlist', value: null } });
    try {
      const response = await wishlistApi.removeFromWishlist(productId);
      if (response.success) {
        dispatch({ type: 'SET_WISHLIST', payload: response.data.items });
      } else {
        dispatch({ type: 'SET_ERROR', payload: { key: 'wishlist', value: response.message || 'Wishlist error' } });
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: { key: 'wishlist', value: error.message || 'Wishlist API Error' } });
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
    return state.wishlist.some(item => item.product_id === productId);
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
        console.log('🔄 StoreContext: Fetching categories...');
        await fetchCategories();
        
        console.log('🔄 StoreContext: Fetching featured products...');
        await fetchFeaturedProducts();
        
        console.log('🔄 StoreContext: Loading user data...');
        // Load cart and wishlist data
        const loadUserData = async () => {
          try {
            console.log('🔄 StoreContext: Loading cart and wishlist...');
            const [cartData, wishlistData] = await Promise.all([
              cartApi.getCart(),
              wishlistApi.getWishlist(),
            ]);
            
            console.log('✅ StoreContext: Cart data:', cartData);
            console.log('✅ StoreContext: Wishlist data:', wishlistData);
            
            dispatch({ type: 'SET_CART', payload: cartData.items || [] });
            dispatch({ type: 'SET_WISHLIST', payload: wishlistData.items || [] });
          } catch (error) {
            console.warn('⚠️ StoreContext: Failed to load user data:', error);
            // Don't fail the entire load process for user data
          }
        };
        
        await loadUserData();
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