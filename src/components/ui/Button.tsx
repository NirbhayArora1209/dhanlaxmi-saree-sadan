import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'premium';
  size?: 'small' | 'default' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'default', 
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    disabled,
    children,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      fullWidth && 'w-full',
      className
    );

    const variantClasses = {
      primary: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1',
      secondary: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1',
      accent: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1',
      outline: 'border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white shadow-md hover:shadow-lg transform hover:-translate-y-1',
      ghost: 'text-amber-500 hover:bg-amber-50 hover:text-amber-600',
      premium: 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-500 hover:via-orange-600 hover:to-red-600 text-white font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-2'
    };

    const sizeClasses = {
      small: 'px-4 py-2 text-sm rounded-lg',
      default: 'px-6 py-3 text-base rounded-xl',
      large: 'px-8 py-4 text-lg rounded-2xl'
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size]
    );

    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        {...props}
      >
        {loading && (
          <motion.div
            className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        
        <span className={cn(
          'flex items-center',
          loading && 'opacity-0'
        )}>
          {children}
        </span>
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button; 