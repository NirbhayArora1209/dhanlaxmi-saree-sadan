'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { fabricOptions, occasionOptions, patternOptions, priceRanges } from '@/data/mockData';
import { ProductFilters as FilterType } from '@/types';

interface ProductFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  fabricOptions: string[];
  occasionOptions: string[];
  patternOptions: string[];
  priceRanges: { label: string; min: number; max: number }[];
}

export default function ProductFilters({
  filters,
  onFilterChange,
  fabricOptions,
  occasionOptions,
  patternOptions,
  priceRanges
}: ProductFiltersProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    category: true,
    fabric: true,
    occasion: true,
    pattern: true,
    rating: true,
    availability: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key: keyof FilterType, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilter = (key: keyof FilterType) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.price_range) count++;
    if (filters.category && filters.category.length > 0) count += filters.category.length;
    if (filters.fabric && filters.fabric.length > 0) count += filters.fabric.length;
    if (filters.occasion && filters.occasion.length > 0) count += filters.occasion.length;
    if (filters.pattern && filters.pattern.length > 0) count += filters.pattern.length;
    if (filters.rating) count++;
    if (filters.availability && filters.availability !== 'all') count++;
    return count;
  };

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: string; 
    children: React.ReactNode; 
  }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
      >
        {title}
        {expandedSections[section] ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  const CheckboxFilter = ({ label, value, checked, onChange }: { label: string; value: string; checked: boolean; onChange: (value: string) => void }) => (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(value)}
        className="w-4 h-4 text-primary-800 border-gray-300 rounded focus:ring-primary-500"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-primary-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-poppins font-semibold text-lg text-gray-900">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary-800 hover:text-primary-900 font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Price Range */}
        <FilterSection title="Price Range" section="price">
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range.label} className="flex items-center">
                <input
                  type="radio"
                  name="price_range"
                  checked={
                    filters.price_range?.min === range.min &&
                    filters.price_range?.max === range.max
                  }
                  onChange={() => updateFilter('price_range', range)}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
            {filters.price_range && (
              <button
                onClick={() => clearFilter('price_range')}
                className="flex items-center text-xs text-red-600 hover:text-red-800"
              >
                <X className="w-3 h-3 mr-1" />
                Clear price filter
              </button>
            )}
          </div>
        </FilterSection>

        {/* Category */}
        <FilterSection title="Category" section="category">
          <div className="space-y-2">
            {['Silk Sarees', 'Cotton Sarees', 'Designer Sarees', 'Wedding Sarees', 'Party Wear'].map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.category?.includes(category) || false}
                  onChange={(e) => {
                    const currentCategories = filters.category || [];
                    if (e.target.checked) {
                      updateFilter('category', [...currentCategories, category]);
                    } else {
                      updateFilter('category', currentCategories.filter(c => c !== category));
                    }
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{category}</span>
              </label>
            ))}
            {filters.category && filters.category.length > 0 && (
              <button
                onClick={() => clearFilter('category')}
                className="flex items-center text-xs text-red-600 hover:text-red-800"
              >
                <X className="w-3 h-3 mr-1" />
                Clear category filter
              </button>
            )}
          </div>
        </FilterSection>

        {/* Fabric */}
        <FilterSection title="Fabric" section="fabric">
          <div className="space-y-2">
            {fabricOptions.map((fabric) => (
              <label key={fabric} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.fabric?.includes(fabric) || false}
                  onChange={(e) => {
                    const currentFabrics = filters.fabric || [];
                    if (e.target.checked) {
                      updateFilter('fabric', [...currentFabrics, fabric]);
                    } else {
                      updateFilter('fabric', currentFabrics.filter(f => f !== fabric));
                    }
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{fabric}</span>
              </label>
            ))}
            {filters.fabric && filters.fabric.length > 0 && (
              <button
                onClick={() => clearFilter('fabric')}
                className="flex items-center text-xs text-red-600 hover:text-red-800"
              >
                <X className="w-3 h-3 mr-1" />
                Clear fabric filter
              </button>
            )}
          </div>
        </FilterSection>

        {/* Occasion */}
        <FilterSection title="Occasion" section="occasion">
          <div className="space-y-2">
            {occasionOptions.map((occasion) => (
              <label key={occasion} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.occasion?.includes(occasion) || false}
                  onChange={(e) => {
                    const currentOccasions = filters.occasion || [];
                    if (e.target.checked) {
                      updateFilter('occasion', [...currentOccasions, occasion]);
                    } else {
                      updateFilter('occasion', currentOccasions.filter(o => o !== occasion));
                    }
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{occasion}</span>
              </label>
            ))}
            {filters.occasion && filters.occasion.length > 0 && (
              <button
                onClick={() => clearFilter('occasion')}
                className="flex items-center text-xs text-red-600 hover:text-red-800"
              >
                <X className="w-3 h-3 mr-1" />
                Clear occasion filter
              </button>
            )}
          </div>
        </FilterSection>

        {/* Pattern */}
        <FilterSection title="Pattern" section="pattern">
          <div className="space-y-2">
            {patternOptions.map((pattern) => (
              <label key={pattern} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.pattern?.includes(pattern) || false}
                  onChange={(e) => {
                    const currentPatterns = filters.pattern || [];
                    if (e.target.checked) {
                      updateFilter('pattern', [...currentPatterns, pattern]);
                    } else {
                      updateFilter('pattern', currentPatterns.filter(p => p !== pattern));
                    }
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{pattern}</span>
              </label>
            ))}
            {filters.pattern && filters.pattern.length > 0 && (
              <button
                onClick={() => clearFilter('pattern')}
                className="flex items-center text-xs text-red-600 hover:text-red-800"
              >
                <X className="w-3 h-3 mr-1" />
                Clear pattern filter
              </button>
            )}
          </div>
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Rating" section="rating">
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating}
                  onChange={() => updateFilter('rating', rating)}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {rating}+ Stars
                </span>
              </label>
            ))}
            {filters.rating && (
              <button
                onClick={() => clearFilter('rating')}
                className="flex items-center text-xs text-red-600 hover:text-red-800"
              >
                <X className="w-3 h-3 mr-1" />
                Clear rating filter
              </button>
            )}
          </div>
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability" section="availability">
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="availability"
                checked={filters.availability === 'in_stock'}
                onChange={() => updateFilter('availability', 'in_stock')}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="availability"
                checked={filters.availability === 'out_of_stock'}
                onChange={() => updateFilter('availability', 'out_of_stock')}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Out of Stock</span>
            </label>
            {filters.availability && (
              <button
                onClick={() => clearFilter('availability')}
                className="flex items-center text-xs text-red-600 hover:text-red-800"
              >
                <X className="w-3 h-3 mr-1" />
                Clear availability filter
              </button>
            )}
          </div>
        </FilterSection>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-poppins font-semibold text-lg text-gray-900">Filters</h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="w-full mb-4 text-sm text-primary-800 hover:text-primary-900 font-medium"
                >
                  Clear All Filters
                </button>
              )}

              {/* Mobile Filter Content - Same as desktop but with mobile styling */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Sort By</label>
                <select
                  value={filters.sort_by || 'popular'}
                  onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Price Range */}
              <FilterSection title="Price Range" section="price">
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.label} className="flex items-center">
                      <input
                        type="radio"
                        name="price_range"
                        checked={
                          filters.price_range?.min === range.min &&
                          filters.price_range?.max === range.max
                        }
                        onChange={() => updateFilter('price_range', range)}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                  {filters.price_range && (
                    <button
                      onClick={() => clearFilter('price_range')}
                      className="flex items-center text-xs text-red-600 hover:text-red-800"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear price filter
                    </button>
                  )}
                </div>
              </FilterSection>

              {/* Category */}
              <FilterSection title="Category" section="category">
                <div className="space-y-2">
                  {['Silk Sarees', 'Cotton Sarees', 'Designer Sarees', 'Wedding Sarees', 'Party Wear'].map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.category?.includes(category) || false}
                        onChange={(e) => {
                          const currentCategories = filters.category || [];
                          if (e.target.checked) {
                            updateFilter('category', [...currentCategories, category]);
                          } else {
                            updateFilter('category', currentCategories.filter(c => c !== category));
                          }
                        }}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                  {filters.category && filters.category.length > 0 && (
                    <button
                      onClick={() => clearFilter('category')}
                      className="flex items-center text-xs text-red-600 hover:text-red-800"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear category filter
                    </button>
                  )}
                </div>
              </FilterSection>

              {/* Fabric */}
              <FilterSection title="Fabric" section="fabric">
                <div className="space-y-2">
                  {fabricOptions.map((fabric) => (
                    <label key={fabric} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.fabric?.includes(fabric) || false}
                        onChange={(e) => {
                          const currentFabrics = filters.fabric || [];
                          if (e.target.checked) {
                            updateFilter('fabric', [...currentFabrics, fabric]);
                          } else {
                            updateFilter('fabric', currentFabrics.filter(f => f !== fabric));
                          }
                        }}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{fabric}</span>
                    </label>
                  ))}
                  {filters.fabric && filters.fabric.length > 0 && (
                    <button
                      onClick={() => clearFilter('fabric')}
                      className="flex items-center text-xs text-red-600 hover:text-red-800"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear fabric filter
                    </button>
                  )}
                </div>
              </FilterSection>

              {/* Occasion */}
              <FilterSection title="Occasion" section="occasion">
                <div className="space-y-2">
                  {occasionOptions.map((occasion) => (
                    <label key={occasion} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.occasion?.includes(occasion) || false}
                        onChange={(e) => {
                          const currentOccasions = filters.occasion || [];
                          if (e.target.checked) {
                            updateFilter('occasion', [...currentOccasions, occasion]);
                          } else {
                            updateFilter('occasion', currentOccasions.filter(o => o !== occasion));
                          }
                        }}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{occasion}</span>
                    </label>
                  ))}
                  {filters.occasion && filters.occasion.length > 0 && (
                    <button
                      onClick={() => clearFilter('occasion')}
                      className="flex items-center text-xs text-red-600 hover:text-red-800"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear occasion filter
                    </button>
                  )}
                </div>
              </FilterSection>

              {/* Pattern */}
              <FilterSection title="Pattern" section="pattern">
                <div className="space-y-2">
                  {patternOptions.map((pattern) => (
                    <label key={pattern} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.pattern?.includes(pattern) || false}
                        onChange={(e) => {
                          const currentPatterns = filters.pattern || [];
                          if (e.target.checked) {
                            updateFilter('pattern', [...currentPatterns, pattern]);
                          } else {
                            updateFilter('pattern', currentPatterns.filter(p => p !== pattern));
                          }
                        }}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{pattern}</span>
                    </label>
                  ))}
                  {filters.pattern && filters.pattern.length > 0 && (
                    <button
                      onClick={() => clearFilter('pattern')}
                      className="flex items-center text-xs text-red-600 hover:text-red-800"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear pattern filter
                    </button>
                  )}
                </div>
              </FilterSection>

              {/* Rating */}
              <FilterSection title="Rating" section="rating">
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() => updateFilter('rating', rating)}
                        className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {rating}+ Stars
                      </span>
                    </label>
                  ))}
                  {filters.rating && (
                    <button
                      onClick={() => clearFilter('rating')}
                      className="flex items-center text-xs text-red-600 hover:text-red-800"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear rating filter
                    </button>
                  )}
                </div>
              </FilterSection>

              {/* Availability */}
              <FilterSection title="Availability" section="availability">
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      checked={filters.availability === 'in_stock'}
                      onChange={() => updateFilter('availability', 'in_stock')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">In Stock</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      checked={filters.availability === 'out_of_stock'}
                      onChange={() => updateFilter('availability', 'out_of_stock')}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Out of Stock</span>
                  </label>
                  {filters.availability && (
                    <button
                      onClick={() => clearFilter('availability')}
                      className="flex items-center text-xs text-red-600 hover:text-red-800"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear availability filter
                    </button>
                  )}
                </div>
              </FilterSection>

              {/* Apply Filters Button */}
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full bg-primary-800 text-white font-poppins font-semibold py-3 rounded-lg hover:bg-primary-900 transition-colors"
              >
                Apply Filters ({totalProducts} products)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 