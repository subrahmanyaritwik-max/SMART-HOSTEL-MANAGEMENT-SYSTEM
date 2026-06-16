// src/pages/AddProduct.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ShoppingBag, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';

export const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useStore();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Groceries',
    brand: '',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200', // default grocery image placeholder
    costPrice: '',
    sellingPrice: '',
    discount: '0',
    gst: '18',
    quantity: '50',
    reorderPoint: '15'
  });

  const [errors, setErrors] = useState({});

  const categories = ['Groceries', 'Household', 'Dairy & Eggs', 'Fresh Produce', 'Beverages', 'Snacks & Sweets', 'Bakery', 'Personal Care', 'Spices & Oils'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU identifier is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand name is required';
    
    const cp = parseFloat(formData.costPrice);
    const sp = parseFloat(formData.sellingPrice);
    
    if (isNaN(cp) || cp <= 0) newErrors.costPrice = 'Cost price must be positive';
    if (isNaN(sp) || sp <= 0) newErrors.sellingPrice = 'Selling price must be positive';
    if (sp < cp) newErrors.sellingPrice = 'Selling price should normally be greater than cost price';
    
    const qty = parseInt(formData.quantity);
    if (isNaN(qty) || qty < 0) newErrors.quantity = 'Stock quantity must be zero or more';
    
    const reorder = parseInt(formData.reorderPoint);
    if (isNaN(reorder) || reorder < 0) newErrors.reorderPoint = 'Reorder threshold must be zero or more';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Please correct validation errors on the form.', 'error');
      return;
    }

    try {
      addProduct({
        name: formData.name,
        sku: formData.sku.toUpperCase(),
        category: formData.category,
        brand: formData.brand,
        image: formData.image,
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        discount: parseFloat(formData.discount) || 0,
        gst: parseFloat(formData.gst) || 18,
        quantity: parseInt(formData.quantity) || 0,
        reorderPoint: parseInt(formData.reorderPoint) || 15
      });

      addToast(`SKU ${formData.sku.toUpperCase()} catalogued successfully!`, 'success');
      navigate('/admin/inventory');
    } catch (err) {
      addToast(err.message || 'Failed to add product.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/inventory')}
          className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-550 dark:text-zinc-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-left space-y-0.5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-500" />
            <span>Catalog New SKU</span>
          </h1>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Store Administration Panel</p>
        </div>
      </div>

      <GlassCard className="border border-zinc-200/50 dark:border-zinc-800/50 p-6 max-w-3xl mx-auto" hoverEffect={false}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Basmati Rice Premium"
                className={`w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border ${errors.name ? 'border-rose-500' : 'border-zinc-200 dark:border-zinc-800'} text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-amber-500`}
              />
              {errors.name && <p className="text-[10px] text-rose-500 font-bold flex items-center gap-0.5"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">SKU Code</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. GRO-RIC-005"
                className={`w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border ${errors.sku ? 'border-rose-500' : 'border-zinc-200 dark:border-zinc-800'} text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-amber-500`}
              />
              {errors.sku && <p className="text-[10px] text-rose-500 font-bold flex items-center gap-0.5"><AlertCircle className="w-3 h-3" /> {errors.sku}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Brand Name</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. India Gate"
                className={`w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border ${errors.brand ? 'border-rose-500' : 'border-zinc-200 dark:border-zinc-800'} text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-amber-500`}
              />
              {errors.brand && <p className="text-[10px] text-rose-500 font-bold flex items-center gap-0.5"><AlertCircle className="w-3 h-3" /> {errors.brand}</p>}
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Product Thumbnail URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-850 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Pricing parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-850/60">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Cost Price (₹)</label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="Cost Price"
                step="0.01"
                className={`w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border ${errors.costPrice ? 'border-rose-500' : 'border-zinc-200 dark:border-zinc-800'} text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-amber-500`}
              />
              {errors.costPrice && <p className="text-[9px] text-rose-500 font-bold">{errors.costPrice}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Selling Price (₹)</label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="Selling Price"
                step="0.01"
                className={`w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border ${errors.sellingPrice ? 'border-rose-500' : 'border-zinc-200 dark:border-zinc-800'} text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-amber-500`}
              />
              {errors.sellingPrice && <p className="text-[9px] text-rose-500 font-bold">{errors.sellingPrice}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="Discount"
                min="0"
                max="100"
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">GST Tax Rate (%)</label>
              <select
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-350 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="0">0% Exempt</option>
                <option value="5">5% Basic</option>
                <option value="12">12% Standard</option>
                <option value="18">18% Standard Plus</option>
                <option value="28">28% Luxury</option>
              </select>
            </div>
          </div>

          {/* Quantities */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-850/60">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Stock Level (Units)</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="In Stock quantity"
                className={`w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border ${errors.quantity ? 'border-rose-500' : 'border-zinc-200 dark:border-zinc-800'} text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-amber-500`}
              />
              {errors.quantity && <p className="text-[9px] text-rose-500 font-bold">{errors.quantity}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Low Reorder Point</label>
              <input
                type="number"
                name="reorderPoint"
                value={formData.reorderPoint}
                onChange={handleChange}
                placeholder="Reorder Threshold"
                className={`w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border ${errors.reorderPoint ? 'border-rose-500' : 'border-zinc-200 dark:border-zinc-800'} text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-amber-500`}
              />
              {errors.reorderPoint && <p className="text-[9px] text-rose-500 font-bold">{errors.reorderPoint}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-850/60">
            <button
              type="button"
              onClick={() => navigate('/admin/inventory')}
              className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-550 dark:text-zinc-400 font-bold text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-extrabold text-xs hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Catalog Product</span>
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default AddProduct;
