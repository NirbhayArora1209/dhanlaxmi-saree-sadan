import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void | Promise<void>;
  showHomeButton?: boolean;
  className?: string;
}

export default function ErrorMessage({
  title = "Something went wrong",
  message = "We encountered an error while loading this content. Please try again.",
  onRetry,
  showHomeButton = true,
  className = ""
}: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertTriangle size={48} className="text-red-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">{message}</p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Try Again
          </Button>
        )}
        
        {showHomeButton && (
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2"
          >
            <Home size={16} />
            Go Home
          </Button>
        )}
      </div>
    </motion.div>
  );
}