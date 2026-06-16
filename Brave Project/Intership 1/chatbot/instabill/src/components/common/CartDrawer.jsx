// src/components/common/CartDrawer.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Percent, 
  Tag, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    cart, 
    updateCartQty, 
    removeFromCart, 
    clearCart,
    appliedCoupon,
    setAppliedCoupon,
    drawerOpen,
    setDrawerOpen,
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
    const formattedCode = couponCode.toUpperCase().trim();
    if (formattedCode === 'SAVE10') {
      setAppliedCoupon('SAVE10');
      addNotification('success', 'Coupon SAVE10 applied! 10% overall rebate.');
      setCouponCode('');
    } else if (formattedCode === 'ANAND20') {
      setAppliedCoupon('ANAND20');
      addNotification('success', 'Coupon ANAND20 applied! 20% manager discount.');
      setCouponCode('');
    } else {
      addNotification('error', 'Invalid Coupon. Try SAVE10 or ANAND20.');
    }
  };

  const handleProceedToBilling = () => {
    setDrawerOpen(false);
    if (location.pathname !== '/billing') {
      navigate('/billing');
    }
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass-dark flex flex-col justify-between shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Checkout Cart</h3>
                  <p className="text-[10px] text-zinc-400 font-semibold">{cart.reduce((acc, item) => acc + item.quantity, 0)} Items Added</p>
                </div>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content View */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center text-zinc-500">
                  <ShoppingBag className="w-12 h-12 stroke-1 mb-4 text-zinc-600 animate-bounce" />
                  <h4 className="font-bold text-sm text-zinc-400 uppercase tracking-wider">Your Cart is Empty</h4>
                  <p className="text-xs text-zinc-500 max-w-xs mt-1.5">
                    Click "Add to Cart" on catalog products to initialize checkout.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => {
                    const discountedPrice = Math.round(item.product.sellingPrice * (1 - (item.product.discount || 0) / 100));
                    return (
                      <div 
                        key={item.product.id}
                        className="p-3 rounded-xl bg-slate-900/40 border border-white/5 flex items-center justify-between gap-3"
                      >
                        {/* Image & details */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/5 flex-shrink-0 bg-slate-950 flex items-center justify-center">
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-white truncate w-36 sm:w-44">{item.product.name}</h5>
                            <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                              ₹{discountedPrice} {item.product.discount > 0 && <span className="text-[9px] text-amber-500 font-bold">({item.product.discount}% off)</span>}
                            </p>
                          </div>
                        </div>

                        {/* Adjust quantities */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="font-mono text-xs font-bold text-white w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Calculations and Actions Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-white/5 bg-slate-950/40 space-y-4">
                {/* Coupon input */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                      <Percent className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      placeholder="Coupon (SAVE10, ANAND20)..."
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-900 border border-white/5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/5 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/5 border border-dashed border-emerald-500/20 p-2 rounded-xl">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> 
                      Promo Applied: {appliedCoupon}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setAppliedCoupon(null)} 
                      className="text-rose-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Billing Summary */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-2 text-xs font-semibold text-zinc-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-zinc-200">₹{Math.round(subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (Tax)</span>
                    <span className="text-zinc-200">₹{Math.round(gstAmount).toLocaleString()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Promo Discount</span>
                      <span>-₹{Math.round(couponDiscount).toLocaleString()}</span>
                    </div>
                  )}
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-emerald-400 text-[10px] font-bold">
                      <span>Estimated Savings</span>
                      <span>Save ₹{Math.round(totalSavings).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-white/5 pt-2 text-sm font-bold text-white">
                    <span>Net Total</span>
                    <span className="text-base text-amber-500">₹{Math.round(finalAmount).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="flex-grow py-3 rounded-xl border border-white/5 bg-slate-900 hover:bg-slate-800 text-zinc-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={handleProceedToBilling}
                    className="flex-grow flex items-center justify-center gap-1.5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer hover:shadow-lg hover:shadow-amber-500/10 active:scale-[0.98]"
                  >
                    <span>Proceed to Billing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
