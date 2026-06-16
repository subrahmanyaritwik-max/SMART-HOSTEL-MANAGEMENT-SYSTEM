// src/components/inventory/ProductCatalog.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  ArrowUpDown, 
  AlertCircle, 
  Zap, 
  CheckCircle, 
  XCircle,
  Tag,
  Plus
} from 'lucide-react';
import GlassCard from '../common/GlassCard';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';


export const ProductCatalog = () => {
  const { products, addToCart, setDrawerOpen } = useStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  
  // --- Filter states ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedStock, setSelectedStock] = useState('All'); // All, In Stock, Low Stock, Out of Stock
  const [priceRange, setPriceRange] = useState(2500); // Max price slider
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popularity'); // popularity, price-asc, price-desc, rating
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique categories & brands for filters
  const categories = useMemo(() => {
    return ['All', ...new Set(products.map(p => p.category))];
  }, [products]);

  const brands = useMemo(() => {
    return ['All', ...new Set(products.map(p => p.brand))];
  }, [products]);

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
        
        let matchesStock = true;
        if (selectedStock === 'in-stock') matchesStock = product.quantity > product.reorderPoint;
        else if (selectedStock === 'low-stock') matchesStock = product.quantity <= product.reorderPoint && product.quantity > 0;
        else if (selectedStock === 'out-of-stock') matchesStock = product.quantity === 0;

        const matchesPrice = product.sellingPrice <= priceRange;
        const matchesRating = product.rating >= minRating;

        return matchesSearch && matchesCategory && matchesBrand && matchesStock && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.sellingPrice - b.sellingPrice;
        if (sortBy === 'price-desc') return b.sellingPrice - a.sellingPrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        // default 'popularity': fast-moving items first, then higher ratings
        const valA = (a.fastMoving ? 10 : 0) + a.rating;
        const valB = (b.fastMoving ? 10 : 0) + b.rating;
        return valB - valA;
      });
  }, [products, searchTerm, selectedCategory, selectedBrand, selectedStock, priceRange, minRating, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Search Bar & Primary Actions */}
      <GlassCard className="border border-zinc-200/50 dark:border-zinc-800/50 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 dark:text-zinc-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by product name, SKU, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>

          {/* Secondary Actions */}
          <div className="flex w-full md:w-auto items-center gap-3 justify-end">
            {isAuthenticated && (
              <button
                onClick={() => navigate('/admin/add-product')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all cursor-pointer shadow active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            )}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all
                ${showFilters 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Advanced Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-zinc-700 dark:text-zinc-300 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="popularity">Sort: Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Sort: Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Advanced Filters Expandable Grid */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Category Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
              >
                {brands.map((b, idx) => (
                  <option key={idx} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Stock status */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Stock Level</label>
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="w-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
              >
                <option value="All">All Stock Levels</option>
                <option value="in-stock">Healthy Stock (&gt; 15 units)</option>
                <option value="low-stock">Low Stock (1 - 15 units)</option>
                <option value="out-of-stock">Out of Stock (0 units)</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Min Rating</label>
              <div className="flex items-center gap-1.5 mt-1">
                {[0, 4.0, 4.2, 4.5, 4.7].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars)}
                    className={`flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all
                      ${minRating === stars
                        ? 'bg-amber-500 text-zinc-950 border-amber-500'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:border-zinc-300'
                      }`}
                  >
                    {stars === 0 ? 'All' : <>{stars} <Star className="w-2.5 h-2.5 fill-current" /></>}
                  </button>
                ))}
              </div>
            </div>

            {/* Price slider */}
            <div className="lg:col-span-4 space-y-1 mt-2">
              <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <span>Maximum Price Threshold</span>
                <span className="text-amber-500">₹{priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="15"
                max="2500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>
        )}
      </GlassCard>

      {/* Grid Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const outOfStock = product.quantity === 0;
          const lowStock = product.quantity <= product.reorderPoint && product.quantity > 0;
          
          return (
            <GlassCard 
              key={product.id} 
              className="relative flex flex-col justify-between overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 hover:border-amber-500/30 transition-all duration-300 group"
              hoverEffect={true}
            >
              {/* Top badges bar */}
              <div className="absolute top-3 inset-x-3 flex justify-between z-10">
                {product.discount > 0 ? (
                  <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-zinc-950 shadow shadow-amber-500/10">
                    <Tag className="w-2.5 h-2.5" />
                    {product.discount}% OFF
                  </span>
                ) : <span />}

                <div className="flex flex-col gap-1 items-end">
                  {product.fastMoving && (
                    <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/90 text-white shadow shadow-purple-500/10">
                      <Zap className="w-2.5 h-2.5 fill-white" />
                      FAST
                    </span>
                  )}
                  {lowStock && (
                    <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/90 text-white shadow shadow-rose-500/10">
                      <AlertCircle className="w-2.5 h-2.5" />
                      LOW STOCK
                    </span>
                  )}
                  {outOfStock && (
                    <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-zinc-600/90 text-white shadow">
                      OUT OF STOCK
                    </span>
                  )}
                </div>
              </div>

              {/* Product image container */}
              <div className="h-40 w-full rounded-xl overflow-hidden relative mb-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Info area */}
              <div className="space-y-1.5 flex-grow">
                <div className="flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500 font-bold">
                  <span>{product.brand}</span>
                  <span className="font-mono text-zinc-500">{product.sku}</span>
                </div>

                <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate group-hover:text-amber-500 transition-colors">
                  {product.name}
                </h4>

                {/* Rating and price row */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-0.5 text-amber-500 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                  
                  <div className="flex items-baseline gap-1.5">
                    {product.discount > 0 && (
                      <span className="text-xs text-zinc-400 line-through font-medium">
                        ₹{product.sellingPrice}
                      </span>
                    )}
                    <span className="text-base font-bold text-zinc-800 dark:text-white">
                      ₹{Math.round(product.sellingPrice * (1 - product.discount/100))}
                    </span>
                  </div>
                </div>

                {/* Inventory quantity tracker */}
                <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-500">
                  <span className="font-medium">Stock Availability</span>
                  <div className="flex items-center gap-1 font-bold">
                    {outOfStock ? (
                      <span className="text-rose-500 flex items-center gap-0.5"><XCircle className="w-3 h-3" /> Sold Out</span>
                    ) : lowStock ? (
                      <span className="text-rose-400 flex items-center gap-0.5"><AlertCircle className="w-3 h-3" /> {product.quantity} left</span>
                    ) : (
                      <span className="text-emerald-500 flex items-center gap-0.5"><CheckCircle className="w-3 h-3" /> {product.quantity} units</span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-900 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      outOfStock ? 'w-0' : lowStock ? 'bg-rose-500 w-1/5' : 'bg-emerald-500 w-3/4'
                    }`} 
                  />
                </div>
              </div>

              {/* Action bar */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    addToCart(product, 1);
                    setDrawerOpen(true);
                  }}
                  disabled={outOfStock}
                  className={`
                    flex-grow py-2.5 rounded-xl text-xs font-bold transition-all duration-205
                    ${outOfStock 
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 border border-zinc-200 dark:border-zinc-800/60 cursor-not-allowed' 
                      : 'bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border dark:border-zinc-800/80 hover:dark:border-zinc-700/80 text-white hover:shadow-lg active:scale-[0.98]'
                    }
                  `}
                >
                  {outOfStock ? 'Sold Out' : 'Add to Cart'}
                </button>

                {isAuthenticated && (
                  <button
                    onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                    className="px-3 py-2.5 rounded-xl text-xs font-bold border border-amber-500/35 text-amber-500 hover:bg-amber-500/10 transition-all cursor-pointer"
                    title="Edit Product"
                  >
                    Edit
                  </button>
                )}
              </div>

            </GlassCard>
          );
        })}
      </div>

      {/* Zero results screen */}
      {filteredProducts.length === 0 && (
        <GlassCard className="border border-dashed border-zinc-300 dark:border-zinc-800 text-center py-16">
          <AlertCircle className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-300">No matching products found</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
            Try adjusting your search keywords, narrowing your price slider, or expanding category constraints.
          </p>
        </GlassCard>
      )}

    </div>
  );
};

export default ProductCatalog;
