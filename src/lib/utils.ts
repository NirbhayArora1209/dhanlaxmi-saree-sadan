import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Premium animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

export const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Premium hover effects
export const hoverLift = {
  whileHover: { 
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

export const hoverScale = {
  whileHover: { 
    scale: 1.05,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

// Premium color gradients
export const gradients = {
  primary: "bg-gradient-to-r from-amber-500 to-orange-500",
  secondary: "bg-gradient-to-r from-red-500 to-pink-500",
  accent: "bg-gradient-to-r from-emerald-500 to-teal-500",
  gold: "bg-gradient-to-r from-yellow-400 to-amber-500",
  premium: "bg-gradient-to-br from-amber-50 via-orange-50 to-red-50",
  dark: "bg-gradient-to-r from-gray-800 to-gray-900"
}

// Premium shadows
export const shadows = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  premium: "shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]",
  glow: "shadow-[0_0_20px_rgba(217,119,6,0.3)]",
  inner: "shadow-inner"
}

// Premium border radius
export const radius = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full"
}

// Premium spacing
export const spacing = {
  xs: "space-y-1",
  sm: "space-y-2",
  md: "space-y-4",
  lg: "space-y-6",
  xl: "space-y-8",
  "2xl": "space-y-12"
}

// Premium typography
export const typography = {
  h1: "text-4xl md:text-6xl font-serif font-bold leading-tight",
  h2: "text-3xl md:text-5xl font-serif font-bold leading-tight",
  h3: "text-2xl md:text-4xl font-serif font-semibold leading-tight",
  h4: "text-xl md:text-3xl font-serif font-semibold leading-tight",
  h5: "text-lg md:text-2xl font-serif font-medium leading-tight",
  h6: "text-base md:text-xl font-serif font-medium leading-tight",
  body: "text-base leading-relaxed",
  bodyLarge: "text-lg leading-relaxed",
  bodySmall: "text-sm leading-relaxed",
  caption: "text-xs leading-relaxed"
}

// Premium button variants
export const buttonVariants = {
  primary: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1",
  secondary: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1",
  outline: "border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white font-medium px-6 py-3 rounded-lg transition-all duration-300",
  ghost: "text-amber-500 hover:bg-amber-50 font-medium px-6 py-3 rounded-lg transition-all duration-300",
  premium: "bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-500 hover:via-orange-600 hover:to-red-600 text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2"
}

// Premium card variants
export const cardVariants = {
  default: "bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
  premium: "bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-amber-100",
  elevated: "bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2",
  glass: "bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
}

// Premium input variants
export const inputVariants = {
  default: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300",
  premium: "w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
}

// Utility functions
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDiscount(originalPrice: number, sellingPrice: number): number {
  return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Premium loading states
export const loadingStates = {
  spinner: "animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500",
  pulse: "animate-pulse bg-gray-200 rounded",
  shimmer: "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
}

// Premium responsive breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
}

// Premium z-index scale
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080
} 