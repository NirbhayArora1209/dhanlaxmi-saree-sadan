import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'premium';
  size?: 'small' | 'default' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  error?: string;
  label?: string;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default',
    icon,
    iconPosition = 'left',
    error,
    label,
    fullWidth = false,
    type,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      'flex w-full border-2 bg-white/50 backdrop-blur-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/20 focus-visible:border-amber-500 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50',
      fullWidth && 'w-full',
      error && 'border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500',
      className
    );

    const variantClasses = {
      default: 'border-gray-200 rounded-xl',
      premium: 'border-gray-200 rounded-2xl shadow-lg hover:shadow-xl'
    };

    const sizeClasses = {
      small: 'h-10 px-3 py-2 text-sm',
      default: 'h-12 px-4 py-3 text-base',
      large: 'h-14 px-6 py-4 text-lg'
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size]
    );

    const inputWrapperClasses = cn(
      'relative',
      icon && iconPosition === 'left' && 'pl-10',
      icon && iconPosition === 'right' && 'pr-10'
    );

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        
        <motion.div
          className={inputWrapperClasses}
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          
          <input
            type={type}
            className={classes}
            ref={ref}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
        </motion.div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 