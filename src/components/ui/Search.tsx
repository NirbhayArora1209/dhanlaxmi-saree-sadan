import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { debounce } from '@/lib/utils';

interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  suggestions?: string[];
  className?: string;
  variant?: 'default' | 'premium';
  size?: 'small' | 'default' | 'large';
}

const Search: React.FC<SearchProps> = ({
  placeholder = "Search for sarees...",
  onSearch,
  suggestions = [],
  className,
  variant = 'default',
  size = 'default'
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useCallback(debounce(onSearch, 300), [onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Add a small delay to allow suggestion clicks to register
        setTimeout(() => {
          setIsExpanded(false);
          setShowSuggestions(false);
        }, 200);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(-1); // Reset selection when suggestions change
      // Only trigger debounced search if there are no suggestions or filtered suggestions
      if (filtered.length === 0) {
        debouncedSearch(query);
      }
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [query, suggestions, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        } else if (query.trim()) {
          onSearch(query);
          setShowSuggestions(false);
          setIsExpanded(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setIsExpanded(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    setIsExpanded(false);
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    onSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
      setIsExpanded(false);
    }
  };

  const sizeClasses = {
    small: 'h-10 px-3',
    default: 'h-12 px-4',
    large: 'h-14 px-6'
  };

  const iconSize = {
    small: 16,
    default: 20,
    large: 24
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <motion.div
        className={cn(
          'relative bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-lg transition-all duration-300',
          variant === 'premium' && 'shadow-xl hover:shadow-2xl',
          isExpanded && 'shadow-2xl',
          sizeClasses[size]
        )}
        animate={{
          scale: isExpanded ? 1.02 : 1,
          boxShadow: isExpanded 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
            : variant === 'premium' 
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' 
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit} className="flex items-center h-full">
          <div className="flex items-center flex-1">
            <SearchIcon 
              size={iconSize[size]} 
              className="text-muted-foreground ml-3 mr-2" 
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setIsExpanded(true);
                if (query.trim()) setShowSuggestions(true);
              }}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-muted-foreground focus:ring-0"
            />
          </div>
          
          <div className="flex items-center mr-2">
            {query && (
              <motion.button
                type="button"
                onClick={handleClear}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={iconSize[size] - 4} />
              </motion.button>
            )}
            
            <motion.button
              type="submit"
              className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight size={iconSize[size] - 4} />
            </motion.button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-60 overflow-y-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`px-4 py-3 cursor-pointer transition-colors duration-200 first:rounded-t-2xl last:rounded-b-2xl ${
                  index === selectedIndex 
                    ? 'bg-amber-100 text-amber-900' 
                    : 'hover:bg-amber-50 text-foreground'
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-center">
                  <SearchIcon size={16} className="text-muted-foreground mr-3" />
                  <span>{suggestion}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search; 