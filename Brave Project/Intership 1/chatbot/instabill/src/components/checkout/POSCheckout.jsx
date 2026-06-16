// src/components/checkout/POSCheckout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Barcode, 
  QrCode, 
  Trash2, 
  Plus, 
  Minus, 
  User, 
  Phone, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Sparkles, 
  Calculator,
  Search,
  ShoppingCart,
  Percent,
  Check
} from 'lucide-react';
import GlassCard from '../common/GlassCard';
import { useStore } from '../../context/StoreContext';
import { ReceiptModal } from './ReceiptModal';

export const POSCheckout = () => {
  const { 
    products, 
    cart, 
    addToCart, 
    updateCartQty, 
    removeFromCart, 
    clearCart,
    appliedCoupon,
    setAppliedCoupon,
    paymentMethod,
    setPaymentMethod,
    checkout,
    customers,
    addNotification
  } = useStore();

  const [posMode, setPosMode] = useState('touch'); // touch, search
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [couponCode, setCouponCode] = useState('');
  
  // CRM Customer fields
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPoints, setCustomerPoints] = useState(0);
  const [isKnownCustomer, setIsKnownCustomer] = useState(false);

  // Receipt Modal control
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // Auto look up customer details by phone number
  useEffect(() => {
    if (customerPhone.length === 10) {
      const match = customers.find(c => c.phone === customerPhone);
      if (match) {
        setCustomerName(match.name);
        setCustomerPoints(match.loyaltyPoints);
        setIsKnownCustomer(true);
        addNotification('info', `CRM Match: Loaded profile for ${match.name} (${match.loyaltyPoints} points)`);
      } else {
        setCustomerName('');
        setCustomerPoints(0);
        setIsKnownCustomer(false);
      }
    } else {
      if (customerPhone === '') {
        setCustomerName('Walk-in Customer');
      }
      setIsKnownCustomer(false);
      setCustomerPoints(0);
    }
  }, [customerPhone, customers]);

  // Keyboard Shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // F2 to pay
      if (e.key === 'F2') {
        e.preventDefault();
        handleCheckoutSubmit();
      }
      // F8 to clear
      if (e.key === 'F8') {
        e.preventDefault();
        clearCart();
        addNotification('info', 'Cart cleared via keyboard shortcut.');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, customerPhone, customerName, paymentMethod, appliedCoupon]);

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

  // Filter products for touch/quick selection
  // Special items requested by prompt: Rice, Sugar, Milk, Bread, Salt, Cooking Oil, Tea Powder, Biscuits
  const fastMovingProducts = products.filter(p => p.fastMoving).slice(0, 16);

  // Filter products for search lookup
  const searchedProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  ).slice(0, 8);

  // Simulate Barcode Scanner Entry
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeQuery) return;

    const match = products.find(p => p.barcode === barcodeQuery || p.sku.toLowerCase() === barcodeQuery.toLowerCase());
    if (match) {
      addToCart(match, 1);
      addNotification('success', `Barcode scan beep: Added ${match.name}`);
      setBarcodeQuery('');
    } else {
      addNotification('error', `SKU / Barcode ${barcodeQuery} not recognized`);
    }
  };

  const handleSimulateScan = () => {
    // Pick a random product from inventory and input its barcode
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    setBarcodeQuery(randomProduct.barcode);
    addNotification('info', `Simulating scanner focus: loaded barcode ${randomProduct.barcode}`);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'SAVE10') {
      setAppliedCoupon('SAVE10');
      addNotification('success', 'Coupon SAVE10 applied! 10% overall rebate.');
      setCouponCode('');
    } else if (couponCode.toUpperCase() === 'ANAND20') {
      setAppliedCoupon('ANAND20');
      addNotification('success', 'Coupon ANAND20 applied! 20% executive discount.');
      setCouponCode('');
    } else {
      addNotification('error', 'Invalid Coupon Code');
    }
  };

  const handleCheckoutSubmit = async () => {
    if (cart.length === 0) {
      addNotification('error', 'Cart is empty. Cannot checkout.');
      return;
    }

    try {
      const receipt = await checkout(customerPhone, customerName || 'New Customer');
      setActiveReceipt(receipt);
      setShowReceipt(true);
      
      // Reset POS fields
      setCustomerPhone('');
      setCustomerName('Walk-in Customer');
    } catch (err) {
      addNotification('error', err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      
      {/* LEFT COLUMN: Product Catalog / Touch items (7 Cols) */}
      <div className="xl:col-span-7 space-y-6">
        
        {/* Barcode & Scanner Simulator */}
        <GlassCard className="border border-zinc-200/50 dark:border-zinc-800/50 p-4">
          <form onSubmit={handleBarcodeSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                <Barcode className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Simulate Laser Gun Scanner (Enter SKU or Barcode)..."
                value={barcodeQuery}
                onChange={(e) => setBarcodeQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleSimulateScan}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-500 transition-colors"
              >
                Trigger Gun
              </button>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-900 dark:border dark:border-zinc-800/80 text-white text-xs font-bold transition-all shadow active:scale-95"
            >
              Feed SKU
            </button>
          </form>
        </GlassCard>

        {/* Touch Grid Tab Controls */}
        <GlassCard className="border border-zinc-200/50 dark:border-zinc-800/50 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/60 mb-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-zinc-800 dark:text-white">POS Cashier Hub</h3>
            </div>
            
            {/* View Mode */}
            <div className="flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 bg-zinc-50/50 dark:bg-zinc-900/50">
              <button
                onClick={() => setPosMode('touch')}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all
                  ${posMode === 'touch' 
                    ? 'bg-amber-500 text-zinc-950 shadow' 
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
              >
                Touch Screen Keys
              </button>
              <button
                onClick={() => setPosMode('search')}
                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all
                  ${posMode === 'search' 
                    ? 'bg-amber-500 text-zinc-950 shadow' 
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
              >
                Search List Catalog
              </button>
            </div>
          </div>

          {/* POS VIEWPORTS */}
          {posMode === 'touch' ? (
            /* Touch Screen Mode: Fast selling items */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {fastMovingProducts.map((p) => {
                const isOut = p.quantity === 0;
                return (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p, 1)}
                    disabled={isOut}
                    className={`
                      relative p-3.5 rounded-xl border text-center flex flex-col justify-between items-center h-28 transition-all active:scale-95 group
                      ${isOut
                        ? 'bg-zinc-50/20 border-zinc-100 text-zinc-400 cursor-not-allowed'
                        : 'bg-white/40 dark:bg-zinc-900/40 border-zinc-200/50 dark:border-zinc-800/50 hover:border-amber-500/40 hover:bg-zinc-50 dark:hover:bg-zinc-800/30'
                      }
                    `}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-850 flex-shrink-0 mb-1.5">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-100 truncate w-24">{p.name}</p>
                      <p className="text-[9px] font-bold text-zinc-400">₹{p.sellingPrice}</p>
                    </div>
                    {p.quantity <= p.reorderPoint && !isOut && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 led-blink" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            /* Search List Mode */
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Filter catalog by name, category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="border border-zinc-200/40 dark:border-zinc-800/40 rounded-xl overflow-hidden divide-y divide-zinc-200/40 dark:divide-zinc-800/40">
                {searchedProducts.map((p) => {
                  const isOut = p.quantity === 0;
                  return (
                    <div key={p.id} className="p-3 flex items-center justify-between bg-white/20 dark:bg-zinc-900/10 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded overflow-hidden border border-zinc-100 dark:border-zinc-800">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-800 dark:text-white">{p.name}</p>
                          <p className="text-[10px] text-zinc-400 font-semibold">{p.category} | SKU: {p.sku}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-zinc-800 dark:text-white">₹{p.sellingPrice}</span>
                        <button
                          onClick={() => addToCart(p, 1)}
                          disabled={isOut}
                          className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-100 disabled:text-zinc-400 text-zinc-950 font-bold"
                        >
                          {isOut ? 'Sold Out' : 'Add'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </GlassCard>

        {/* Keyboard Shortcut Guidelines */}
        <div className="flex gap-4 justify-center text-[10px] font-bold text-zinc-500">
          <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border dark:border-zinc-700/80">F2</span> Checkout</span>
          <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border dark:border-zinc-700/80">F8</span> Empty Cart</span>
        </div>

      </div>

      {/* RIGHT COLUMN: Order checkout panel (5 Cols) */}
      <div className="xl:col-span-5 space-y-6">
        
        <GlassCard className="border border-zinc-200/50 dark:border-zinc-800/50 p-5 flex flex-col justify-between min-h-[500px]">
          
          {/* Cart Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-amber-500" />
              <span>Checkout Cart</span>
            </h3>
            <span className="text-[10px] font-bold text-zinc-400 uppercase">
              {cart.length} unique items
            </span>
          </div>

          {/* Cart Items list */}
          <div className="flex-grow my-4 overflow-y-auto max-h-[260px] space-y-2.5 pr-1 text-xs">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                <ShoppingCart className="w-8 h-8 mb-2 stroke-1" />
                <p className="font-semibold text-zinc-500">POS cart is vacant</p>
                <p className="text-[10px] text-zinc-400 mt-1">Scan or tap products to initialize checkout</p>
              </div>
            ) : (
              cart.map((item) => {
                const discountedPrice = Math.round(item.product.sellingPrice * (1 - (item.product.discount || 0) / 100));
                return (
                  <div 
                    key={item.product.id}
                    className="p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 flex-shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-zinc-800 dark:text-white truncate w-24 sm:w-36">{item.product.name}</p>
                        <p className="text-[10px] text-zinc-400 font-semibold">
                          ₹{discountedPrice} {item.product.discount > 0 && <span className="text-[9px] text-amber-500">({item.product.discount}% off)</span>}
                        </p>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button 
                        onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                        className="p-1 rounded bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                      >
                        <Minus className="w-3 h-3 text-zinc-600 dark:text-zinc-400" />
                      </button>
                      <span className="font-mono font-bold w-6 text-center text-zinc-800 dark:text-white">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                        className="p-1 rounded bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                      >
                        <Plus className="w-3 h-3 text-zinc-600 dark:text-zinc-400" />
                      </button>

                      {/* Trash button */}
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Checkout Parameters & Billing */}
          <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800/60 pt-4">
            
            {/* Customer Lookup Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Customer Mobile Number..."
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                  <User className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Customer Name..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none"
                />
              </div>
            </div>

            {/* Loyalty Score details if found */}
            {customerPhone.length === 10 && (
              <div className="p-2.5 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 text-[10px] text-amber-500 font-bold flex justify-between items-center">
                <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> CRM Profile: {isKnownCustomer ? 'Platinum Loyalty Member' : 'New Customer'}</span>
                <span>Balance: {customerPoints} pts</span>
              </div>
            )}

            {/* Coupons Input Form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                  <Percent className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Promo Coupon Code (SAVE10, ANAND20)..."
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:border dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold transition-all"
              >
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div className="flex justify-between items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/5 border border-dashed border-emerald-500/30 p-2 rounded-lg">
                <span>Active Coupon: {appliedCoupon}</span>
                <button onClick={() => setAppliedCoupon(null)} className="text-rose-500 hover:underline">Remove</button>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Payment Channel</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'UPI', label: 'UPI', icon: Smartphone },
                  { id: 'Cash', label: 'Cash', icon: Banknote },
                  { id: 'Card', label: 'Card', icon: CreditCard }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPaymentMethod(item.id)}
                      className={`
                        py-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all
                        ${isSelected
                          ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-md shadow-amber-500/15'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 text-zinc-500 hover:border-zinc-300'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[9px] font-bold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Financial Invoice summary */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 space-y-1.5 text-xs font-medium text-zinc-500">
              <div className="flex justify-between">
                <span>Cart Subtotal</span>
                <span className="text-zinc-800 dark:text-zinc-200">₹{Math.round(subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (Tax Valuation)</span>
                <span className="text-zinc-800 dark:text-zinc-200">₹{Math.round(gstAmount).toLocaleString()}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Promo Discount Rebate</span>
                  <span>-₹{Math.round(couponDiscount).toLocaleString()}</span>
                </div>
              )}
              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-500 text-[10px] font-bold">
                  <span>Loyalty Savings</span>
                  <span>Save ₹{Math.round(totalSavings).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-zinc-200/50 dark:border-zinc-800/50 pt-2 text-sm font-bold text-zinc-800 dark:text-white">
                <span>Consolidated Net Total</span>
                <span className="text-lg text-amber-500">₹{Math.round(finalAmount).toLocaleString()}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={clearCart}
                disabled={cart.length === 0}
                className="py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 text-xs font-bold transition-all disabled:opacity-50"
              >
                Clear Cart
              </button>
              
              <button
                onClick={handleCheckoutSubmit}
                disabled={cart.length === 0}
                className="py-3 rounded-xl bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 text-xs transition-all disabled:opacity-50 shadow-lg shadow-amber-500/15"
              >
                Complete Payment (F2)
              </button>
            </div>

          </div>

        </GlassCard>

      </div>

      {/* Advanced Receipt Modal */}
      {showReceipt && activeReceipt && (
        <ReceiptModal 
          invoice={activeReceipt} 
          isOpen={showReceipt} 
          onClose={() => setShowReceipt(false)} 
        />
      )}

    </div>
  );
};

export default POSCheckout;
