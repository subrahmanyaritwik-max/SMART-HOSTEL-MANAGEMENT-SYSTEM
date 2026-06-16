// src/pages/Cart.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, Calculator, Tag, Percent, ArrowRight, ShoppingBag } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { useStore } from '../context/StoreContext';

export const Cart = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    updateCartQty, 
    removeFromCart, 
    clearCart,
    appliedCoupon,
    setAppliedCoupon,
    addNotification
  } = useStore();

  const [couponCode, setCouponCode] = useState('');

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => {
    const discountedPrice = item.product.sellingPrice * (1 - (item.product.discount || 0) / 100);
    return acc + (discountedPrice * item.quantity);
  }, 0);

  const gstAmount = cart.reduce((acc, item) => {
    const discountedPrice = item.product.sellingPrice * (1 - (item.product.discount || 0) / 100);
    const itemSubtotal = discountedPrice * item.quantity;
    return acc + (itemSubtotal * ((item.product.gst || 0) / 100));
  }, 0);

  const rawTotal = subtotal + gstAmount;
  
  let couponDiscount = 0;
  if (appliedCoupon === 'SAVE10') {
    couponDiscount = rawTotal * 0.1;
  } else if (appliedCoupon === 'ANAND20') {
    couponDiscount = rawTotal * 0.2;
  }

  const finalAmount = Math.max(0, rawTotal - couponDiscount);
  const totalSavings = cart.reduce((acc, item) => {
    const baseVal = item.product.sellingPrice * item.quantity;
    const discountedPrice = item.product.sellingPrice * (1 - (item.product.discount || 0) / 100);
    return acc + (baseVal - (discountedPrice * item.quantity));
  }, 0) + couponDiscount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'SAVE10') {
      setAppliedCoupon('SAVE10');
      addNotification('success', 'Coupon SAVE10 applied! 10% overall rebate.');
      setCouponCode('');
    } else if (couponCode.toUpperCase() === 'ANAND20') {
      setAppliedCoupon('ANAND20');
      addNotification('success', 'Coupon ANAND20 applied! 20% store manager discount.');
      setCouponCode('');
    } else {
      addNotification('error', 'Invalid Coupon Code. Try SAVE10 or ANAND20.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="text-left space-y-1">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-amber-500" />
          <span>Shopping Cart</span>
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Verify your items and quantities before submitting payment bills.</p>
      </div>

      {cart.length === 0 ? (
        <GlassCard className="border border-zinc-200/50 dark:border-zinc-800/50 text-center py-20">
          <ShoppingCart className="w-12 h-12 text-zinc-400 mx-auto mb-4 stroke-1" />
          <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Your Cart is Vacant</h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 mb-6">
            You have not catalogued any products into your checkout drawer yet.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors mx-auto cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Go to Catalog</span>
          </button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cart Items (7 columns) */}
          <div className="lg:col-span-7 space-y-3">
            {cart.map((item) => {
              const discountedPrice = Math.round(item.product.sellingPrice * (1 - (item.product.discount || 0) / 100));
              return (
                <GlassCard
                  key={item.product.id}
                  className="border border-zinc-200/50 dark:border-zinc-800/50 p-4 flex items-center justify-between gap-4"
                  hoverEffect={false}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-zinc-800 dark:text-white truncate w-32 sm:w-56">{item.product.name}</p>
                      <p className="text-[11px] text-zinc-400 font-semibold mt-0.5">
                        ₹{discountedPrice} {item.product.discount > 0 && <span className="text-[10px] text-amber-500">({item.product.discount}% off)</span>}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and actions */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                        className="p-1 rounded bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5 text-zinc-650 dark:text-zinc-400" />
                      </button>
                      <span className="font-mono font-bold w-6 text-center text-xs text-zinc-800 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                        className="p-1 rounded bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-zinc-650 dark:text-zinc-400" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              );
            })}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => navigate('/products')}
                className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Continue Shopping
              </button>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Empty Entire Cart
              </button>
            </div>
          </div>

          {/* Checkout pricing panel (5 columns) */}
          <div className="lg:col-span-5 space-y-4">
            <GlassCard className="border border-zinc-200/50 dark:border-zinc-800/50 p-5 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800/60 mb-4">
                Financial Summary
              </h3>

              <div className="space-y-4">
                {/* Coupon application form */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                      <Percent className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      placeholder="Coupon Code (SAVE10, ANAND20)..."
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-850 dark:bg-zinc-900 dark:border dark:border-zinc-800 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/5 border border-dashed border-emerald-500/30 p-2.5 rounded-xl">
                    <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Activated Discount: {appliedCoupon}</span>
                    <button type="button" onClick={() => setAppliedCoupon(null)} className="text-rose-500 hover:underline">Remove</button>
                  </div>
                )}

                {/* Subtotals list */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 space-y-2.5 text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Cart Subtotal</span>
                    <span className="text-zinc-805 dark:text-zinc-200">₹{Math.round(subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (Tax Valuation)</span>
                    <span className="text-zinc-805 dark:text-zinc-200">₹{Math.round(gstAmount).toLocaleString()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-505 dark:text-emerald-400 font-bold">
                      <span>Promo Rebate Discount</span>
                      <span>-₹{Math.round(couponDiscount).toLocaleString()}</span>
                    </div>
                  )}
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-emerald-505 dark:text-emerald-400 text-[10px] font-bold">
                      <span>Estimated Savings</span>
                      <span>Save ₹{Math.round(totalSavings).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-zinc-205 dark:border-zinc-800/60 pt-2.5 text-sm font-bold text-zinc-800 dark:text-white">
                    <span>Net Consolidated Total</span>
                    <span className="text-lg text-amber-500">₹{Math.round(finalAmount).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/billing')}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all cursor-pointer shadow-lg shadow-amber-500/15 hover:shadow-amber-500/20 active:scale-[0.98]"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Proceed to POS Billing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
