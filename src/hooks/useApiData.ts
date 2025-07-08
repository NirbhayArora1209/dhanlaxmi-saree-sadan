'use client';

import { useState, useEffect } from 'react';

interface UseApiDataOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
  refetchInterval?: number;
}

interface UseApiDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isStale: boolean;
}

export function useApiData<T>(
  fetchFn: () => Promise<T>,
  options: UseApiDataOptions<T> = {}
): UseApiDataReturn<T> {
  const {
    initialData = null,
    onSuccess,
    onError,
    enabled = true,
    refetchInterval,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState(false);

  const fetchData = async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
      setIsStale(false);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [enabled]);

  useEffect(() => {
    if (!refetchInterval) return;

    const interval = setInterval(() => {
      setIsStale(true);
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [refetchInterval]);

  const refetch = async () => {
    await fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch,
    isStale,
  };
}

// Specialized hooks for common data types
export function useProducts() {
  return useApiData(
    async () => {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data.data || [];
    },
    {
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    }
  );
}

export function useCategories() {
  return useApiData(
    async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      return data.data || [];
    },
    {
      refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    }
  );
} 