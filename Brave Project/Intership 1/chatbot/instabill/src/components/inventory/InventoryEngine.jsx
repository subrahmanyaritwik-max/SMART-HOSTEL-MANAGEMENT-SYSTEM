// src/components/inventory/InventoryEngine.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  TrendingUp, 
  Activity, 
  Archive, 
  Layers, 
  RefreshCw, 
  Plus, 
  Check, 
  Warehouse,
  History,
  AlertTriangle,
  Clock,
  Edit3
} from 'lucide-react';
import GlassCard from '../common/GlassCard';
import { useStore } from '../../context/StoreContext';

export const InventoryEngine = () => {
  const navigate = useNavigate();
  const { products, updateProductStock, addNotification } = useStore();
  const [replenishQtys, setReplenishQtys] = useState({});


  // Compute key inventory metrics dynamically
  const totalItems = products.length;
  const outOfStockItems = products.filter(p => p.quantity === 0);
  const lowStockItems = products.filter(p => p.quantity <= p.reorderPoint && p.quantity > 0);
  
  // Health score = ratio of products that are in healthy stock
  const healthyCount = totalItems - (outOfStockItems.length + lowStockItems.length);
  const healthScore = Math.round((healthyCount / totalItems) * 100);

  // Asset Value Calculation
  const totalAssetCost = products.reduce((acc, p) => acc + (p.quantity * p.costPrice), 0);
  const totalAssetRevenue = products.reduce((acc, p) => acc + (p.quantity * p.sellingPrice), 0);
  const unrealizedProfit = totalAssetRevenue - totalAssetCost;

  // Stock aging (mock categorization based on ID or SKU)
  // Let's divide: Fresh (first 40 items), Medium Aging (next 40), Critical Aging (remaining 20)
  const freshStockVal = products.slice(0, 40).reduce((acc, p) => acc + (p.quantity * p.costPrice), 0);
  const midStockVal = products.slice(40, 80).reduce((acc, p) => acc + (p.quantity * p.costPrice), 0);
  const oldStockVal = products.slice(80, 100).reduce((acc, p) => acc + (p.quantity * p.costPrice), 0);

  const handleQuickRestock = (productId, amt = 50) => {
    updateProductStock(productId, amt);
    addNotification('success', `Quick Restock: Added ${amt} units to inventory.`);
  };

  const handleCustomRestock = (e, productId) => {
    e.preventDefault();
    const qty = parseInt(replenishQtys[productId]) || 0;
    if (qty <= 0) return;
    
    const currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return;

    updateProductStock(productId, currentProduct.quantity + qty);
    setReplenishQtys(prev => ({ ...prev, [productId]: '' }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left space-y-0.5">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-amber-500" />
            <span>Inventory Management Dashboard</span>
          </h2>
          <p className="text-xs text-zinc-400 font-semibold mt-0.5">Monitor asset capital, adjust low levels, and catalog product metadata.</p>
        </div>
        
        <button
          onClick={() => navigate('/admin/add-product')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-amber-500/10 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Catalog New SKU</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Health Score Circular Dial */}
        <GlassCard className="flex flex-col items-center text-center justify-between border border-zinc-200/50 dark:border-zinc-800/50 p-6">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
            Inventory Health Index
          </span>
          <div className="relative flex items-center justify-center my-2">
            {/* SVG circle meter */}
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" className="text-zinc-100 dark:text-zinc-900" strokeWidth="6" fill="transparent" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" 
                className={healthScore > 80 ? "text-emerald-500" : healthScore > 50 ? "text-amber-500" : "text-rose-500"} 
                strokeWidth="6" 
                fill="transparent" 
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * healthScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-zinc-800 dark:text-white">{healthScore}%</span>
              <span className="text-[9px] text-zinc-400 font-bold uppercase">Optimal</span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-2">
            {healthyCount} of {totalItems} SKUs stocked optimally
          </p>
        </GlassCard>

        {/* Inventory Total Capital */}
        <GlassCard className="flex flex-col justify-between border border-zinc-200/50 dark:border-zinc-800/50 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Asset Lock Valuation
            </span>
            <Warehouse className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-3">
            <p className="text-xs text-zinc-400 font-semibold">Cost Valuation</p>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-white">
              ₹{Math.round(totalAssetCost).toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-500 font-semibold mt-1">
              MRP Value: ₹{Math.round(totalAssetRevenue).toLocaleString()}
            </p>
          </div>
          <p className="text-[10px] text-zinc-500">
            Unrealized Margin: ₹{Math.round(unrealizedProfit).toLocaleString()}
          </p>
        </GlassCard>

        {/* Low Stock Count */}
        <GlassCard className="flex flex-col justify-between border border-zinc-200/50 dark:border-zinc-800/50 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Low Stock Warnings
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-white">
              {lowStockItems.length}
            </h3>
            <p className="text-xs text-amber-500 font-semibold mt-1">
              Requires immediate action
            </p>
          </div>
          <p className="text-[10px] text-zinc-500">
            Threshold: Quantity &le; 15 units
          </p>
        </GlassCard>

        {/* Out of Stock Count */}
        <GlassCard className="flex flex-col justify-between border border-zinc-200/50 dark:border-zinc-800/50 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Out Of Stock Errors
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-bold tracking-tight text-rose-500">
              {outOfStockItems.length}
            </h3>
            <p className="text-xs text-rose-500 font-semibold mt-1">
              Sales halt warning active
            </p>
          </div>
          <p className="text-[10px] text-zinc-500">
            Stock availability: 0 units
          </p>
        </GlassCard>

      </div>

      {/* Grid: Aging and Replenishment Console */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Inventory Aging Tracker (1 Col) */}
        <GlassCard className="border border-zinc-200/50 dark:border-zinc-800/50">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
            <Clock className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-white">Inventory Aging Report</h3>
          </div>
          
          <div className="space-y-4">
            
            {/* Shelf Fresh */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-800 dark:text-zinc-200">Fresh Inventory (0 - 3 Months)</span>
                <span className="text-zinc-500">₹{Math.round(freshStockVal).toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(freshStockVal/totalAssetCost)*100}%` }} />
              </div>
              <p className="text-[9px] text-zinc-400 font-semibold">Fast turn items: Dairy, Bread, Fresh snacks.</p>
            </div>

            {/* Shelf Mid */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-800 dark:text-zinc-200">Mid-Shelf Stock (3 - 6 Months)</span>
                <span className="text-zinc-500">₹{Math.round(midStockVal).toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(midStockVal/totalAssetCost)*100}%` }} />
              </div>
              <p className="text-[9px] text-zinc-400 font-semibold">Packaged products, detergents, cooking oil.</p>
            </div>

            {/* Shelf Critical Aging */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-800 dark:text-zinc-200">Slow Moving / Aged (6+ Months)</span>
                <span className="text-rose-400">₹{Math.round(oldStockVal).toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(oldStockVal/totalAssetCost)*100}%` }} />
              </div>
              <p className="text-[9px] text-zinc-400 font-semibold">Vitamins, household materials, baby lotion.</p>
            </div>

          </div>

          <div className="mt-6 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">AI Pricing Suggestion</p>
              <p className="text-[9px] text-zinc-400 mt-0.5">
                Recommend applying a clearance markdown of 15% on aged items under 'Health Products' to stimulate inventory turnover.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Replenishment Operations Center (2 Cols) */}
        <GlassCard className="xl:col-span-2 border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-zinc-800 dark:text-white">Replenishment Operations</h3>
              </div>
              <span className="text-[10px] font-bold text-amber-500 px-2 py-0.5 rounded bg-amber-500/10">
                {outOfStockItems.length + lowStockItems.length} Actions Required
              </span>
            </div>

            {/* Operations list */}
            <div className="max-h-[280px] overflow-y-auto space-y-3 pr-1">
              {[...outOfStockItems, ...lowStockItems].length === 0 ? (
                <div className="text-center py-16 text-zinc-400 text-xs font-semibold">
                  <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  All stock items optimally populated!
                </div>
              ) : (
                [...outOfStockItems, ...lowStockItems].map((product) => (
                  <div 
                    key={product.id}
                    className="p-3.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/20 dark:bg-zinc-900/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    {/* Left: Product label */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-zinc-800 dark:text-white">{product.name}</p>
                          <span className={`text-[8px] px-1 py-0.5 rounded font-bold uppercase ${
                            product.quantity === 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {product.quantity === 0 ? 'out' : `${product.quantity} left`}
                          </span>
                        </div>
                        <p className="text-[9px] text-zinc-400 mt-0.5">{product.brand} | {product.sku} | Location: {product.warehouseLocation}</p>
                      </div>
                    </div>

                    {/* Right: Restock actions */}
                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <button
                        onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                        className="px-2.5 py-1.5 rounded-lg border border-amber-500/25 hover:bg-amber-500/10 text-amber-500 font-semibold transition-colors cursor-pointer"
                      >
                        Edit SKU
                      </button>

                      <button
                        onClick={() => handleQuickRestock(product.id, 50)}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        Quick +50
                      </button>

                      {/* Custom input replenishment form */}
                      <form 
                        onSubmit={(e) => handleCustomRestock(e, product.id)}
                        className="flex items-center gap-1.5"
                      >
                        <input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={replenishQtys[product.id] || ''}
                          onChange={(e) => setReplenishQtys(prev => ({ ...prev, [product.id]: e.target.value }))}
                          className="w-16 px-2 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center font-bold text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors shadow shadow-amber-500/10"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 text-[9px] text-zinc-400 font-semibold flex items-center justify-between">
            <span>Supplier order dispatch requires administrator signatures</span>
            <span className="text-zinc-500 font-mono">Terminal ID: T-501A</span>
          </div>
        </GlassCard>

      </div>

    </div>
  );
};

export default InventoryEngine;
