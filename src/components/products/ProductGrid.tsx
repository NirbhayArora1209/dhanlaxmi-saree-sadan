import React from 'react';
import { Product } from '@/types';

type ProductGridProps = {
  products: Product[];
};

const ProductGrid: React.FC<ProductGridProps> = ({ products = [] }) => (
  <div style={{ border: '1px dashed #ccc', padding: '1rem', minHeight: '100px' }}>
    <div>ProductGrid (Placeholder)</div>
    <ul>
      {products.map((p, i) => <li key={i}>{p.name || 'Product'}</li>)}
    </ul>
  </div>
);

export default ProductGrid; 