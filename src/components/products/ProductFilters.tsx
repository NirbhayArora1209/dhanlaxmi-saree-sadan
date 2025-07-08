import React from 'react';

type Category = {
  _id: string;
  name: string;
  slug: string;
  product_count: number;
};

type ProductFiltersProps = {
  categories?: Category[];
  filters?: Record<string, any>;
  onFilterChange?: () => void;
};

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories = [],
  filters = {},
  onFilterChange = () => {},
}) => (
  <div style={{ border: '1px dashed #ccc', padding: '1rem', minHeight: '100px' }}>
    <div>ProductFilters (Placeholder)</div>
    <ul>
      {categories.map((c, i) => <li key={i}>{c.name || 'Category'}</li>)}
    </ul>
  </div>
);

export default ProductFilters; 