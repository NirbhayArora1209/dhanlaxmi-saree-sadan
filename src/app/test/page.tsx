'use client';

import React, { useState, useEffect } from 'react';
import { productsApi, categoriesApi } from '@/lib/client-api';

export default function TestPage() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [productsStatus, setProductsStatus] = useState<any>(null);
  const [categoriesStatus, setCategoriesStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testHealth = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealthStatus({ success: true, data });
    } catch (error) {
      setHealthStatus({ success: false, error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  const testProducts = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getFeaturedProducts();
      setProductsStatus({ success: true, data });
    } catch (error) {
      setProductsStatus({ success: false, error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  const testCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesApi.getCategories();
      setCategoriesStatus({ success: true, data });
    } catch (error) {
      setCategoriesStatus({ success: false, error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
      
      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Health Check</h2>
          <button 
            onClick={testHealth}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Test Health API
          </button>
          {healthStatus && (
            <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
              {JSON.stringify(healthStatus, null, 2)}
            </pre>
          )}
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Products API</h2>
          <button 
            onClick={testProducts}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Test Products API
          </button>
          {productsStatus && (
            <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
              {JSON.stringify(productsStatus, null, 2)}
            </pre>
          )}
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Categories API</h2>
          <button 
            onClick={testCategories}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Test Categories API
          </button>
          {categoriesStatus && (
            <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
              {JSON.stringify(categoriesStatus, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
} 