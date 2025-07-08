import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface BadgeProps extends HTMLMotionProps<'div'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'success' | 'warning' | 'error';
  size?: 'small' | 'default' | 'large';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
      className
    );

    const variantClasses = {
      primary: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md',
      secondary: 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md',
      accent: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md',
      outline: 'border-2 border-amber-500 text-amber-500 bg-transparent',
      success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md',
      warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md',
      error: 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md'
    };

    const sizeClasses = {
      small: 'px-2 py-0.5 text-xs rounded-full',
      default: 'px-3 py-1 text-sm rounded-full',
      large: 'px-4 py-2 text-base rounded-full'
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size]
    );

    const { style, ...rest } = props;
    return (
      <motion.div
        ref={ref}
        className={classes}
        style={style as any}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge; 