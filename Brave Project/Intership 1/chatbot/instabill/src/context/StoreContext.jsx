// src/context/StoreContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateProducts } from '../data/productsData';
import { customersData } from '../data/customersData';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // --- 1. Products / Inventory State ---
  const [products, setProducts] = useState([]);
  
  // --- 2. Customers CRM State ---
  const [customers, setCustomers] = useState([]);
  
  // --- 3. Cart State ---
  const [cart, setCart] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, Cash, Card, NetBanking
  
  // --- 4. Transaction / Invoice History State ---
  const [invoices, setInvoices] = useState([]);
  
  // --- 5. Notifications State ---
  const [notifications, setNotifications] = useState([]);
  
  // --- 6. Dark/Light Mode Theme State ---
  const [darkMode, setDarkMode] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // --- 7. Presentation Mode State ---
  const [demoActive, setDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // --- 8. Core Initialization ---
  useEffect(() => {
    // A. Theme Initialization (Force Dark Mode)
    setDarkMode(true);
    document.documentElement.classList.add('dark');
    localStorage.setItem('instabill_theme', 'dark');

    // B. Products Initialization
    const savedProducts = localStorage.getItem('instabill_products');
    let useGenerated = false;
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        const riceItem = parsed.find(p => p.name === 'Rice');
        if (riceItem && riceItem.image.includes('unsplash.com')) {
          useGenerated = true;
        }
      } catch (e) {
        useGenerated = true;
      }
    } else {
      useGenerated = true;
    }

    if (!useGenerated && savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const generated = generateProducts();
      setProducts(generated);
      localStorage.setItem('instabill_products', JSON.stringify(generated));
    }

    // C. Customers Initialization
    const savedCustomers = localStorage.getItem('instabill_customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      setCustomers(customersData);
      localStorage.setItem('instabill_customers', JSON.stringify(customersData));
    }

    // D. Invoices/Transactions Initialization
    const savedInvoices = localStorage.getItem('instabill_invoices');
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    } else {
      // Seed initial mock invoices for analytics charts
      const seededInvoices = generateMockInvoiceHistory();
      setInvoices(seededInvoices);
      localStorage.setItem('instabill_invoices', JSON.stringify(seededInvoices));
    }

    // E. Initial Notifications Setup
    setNotifications([
      { id: 1, type: 'info', message: 'Welcome to InstaBILL X Pro Retail OS', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
      { id: 2, type: 'warning', message: 'Warning: Rice (GRO-RIC-001) is running low on stock!', timestamp: new Date(Date.now() - 1200000).toISOString(), read: false },
      { id: 3, type: 'info', message: 'Restocked Cooking Oil by 100 units', timestamp: new Date(Date.now() - 600000).toISOString(), read: true },
      { id: 4, type: 'success', message: 'Daily revenue milestone achieved: ₹45,000+', timestamp: new Date(Date.now() - 200000).toISOString(), read: false }
    ]);

  }, []);

  // Sync theme to document class (Force dark mode)
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('instabill_theme', 'dark');
  }, []);

  // --- 9. Helper to generate past transaction history (for charts) ---
  const generateMockInvoiceHistory = () => {
    const list = [];
    const now = new Date();
    // Prepopulate past 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      
      // Let's create 3-5 invoices per day
      const invoicesPerDay = 3 + Math.floor(Math.random() * 4);
      for (let j = 0; j < invoicesPerDay; j++) {
        const hour = 9 + Math.floor(Math.random() * 12); // Between 9 AM and 9 PM
        const invoiceDate = new Date(date);
        invoiceDate.setHours(hour, Math.floor(Math.random() * 60), 0);

        const amount = 300 + Math.floor(Math.random() * 2500);
        const billNumber = `BILL-${invoiceDate.getFullYear()}${pad(invoiceDate.getMonth() + 1, 2)}${pad(invoiceDate.getDate(), 2)}-${pad(list.length + 1001, 4)}`;

        list.push({
          billNumber,
          customerName: j % 2 === 0 ? "Walk-in Customer" : customersData[j % customersData.length].name,
          customerPhone: j % 2 === 0 ? "" : customersData[j % customersData.length].phone,
          cashierName: "Anand Manager",
          gstNumber: "27ANAND9751A1Z0",
          timestamp: invoiceDate.toISOString(),
          subtotal: Math.round(amount * 0.9),
          gstAmount: Math.round(amount * 0.1),
          discountAmount: Math.round(amount * 0.05),
          totalAmount: amount,
          savings: Math.round(amount * 0.08),
          paymentMethod: ['Cash', 'UPI', 'Card'][Math.floor(Math.random() * 3)],
          loyaltyPointsEarned: Math.floor(amount / 100)
        });
      }
    }
    return list;
  };

  const pad = (num, size) => {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  };

  // --- 10. Notification Management ---
  const addNotification = (type, message) => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        type,
        message,
        timestamp: new Date().toISOString(),
        read: false
      },
      ...prev
    ]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // --- 11. Cart Actions ---
  const addToCart = (product, qty = 1) => {
    if (product.quantity === 0) {
      addNotification('error', `Cannot add ${product.name} - Out of Stock`);
      return;
    }
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + qty;
        if (newQty > product.quantity) {
          addNotification('warning', `Requested quantity for ${product.name} exceeds available stock (${product.quantity})`);
          return prevCart;
        }
        return prevCart.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevCart, { product, quantity: qty }];
    });
  };

  const updateCartQty = (productId, qty) => {
    const targetProduct = products.find(p => p.id === productId);
    if (!targetProduct) return;

    if (qty > targetProduct.quantity) {
      addNotification('warning', `Only ${targetProduct.quantity} units of ${targetProduct.name} available in inventory.`);
      qty = targetProduct.quantity;
    }

    if (qty <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev => prev.map(item =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // --- 12. Checkout Order Submission ---
  const checkout = (customerPhone = '', customerName = 'Walk-in Customer') => {
    return new Promise((resolve, reject) => {
      if (cart.length === 0) {
        reject(new Error("Cart is empty!"));
        return;
      }

      // Calculate totals
      let subtotal = 0;
      let totalGst = 0;
      let totalDiscount = 0;

      cart.forEach(item => {
        const baseItemVal = item.product.sellingPrice * item.quantity;
        const discVal = baseItemVal * ((item.product.discount || 0) / 100);
        const itemSubtotal = baseItemVal - discVal;
        const gstVal = itemSubtotal * ((item.product.gst || 0) / 100);
        
        subtotal += itemSubtotal;
        totalGst += gstVal;
        totalDiscount += discVal;
      });

      let subTotalFinal = Math.round(subtotal);
      let gstFinal = Math.round(totalGst);
      let rawTotal = subTotalFinal + gstFinal;

      // Apply checkout coupons
      let couponDiscount = 0;
      if (appliedCoupon === 'SAVE10') {
        couponDiscount = Math.round(rawTotal * 0.1);
      } else if (appliedCoupon === 'ANAND20') {
        couponDiscount = Math.round(rawTotal * 0.2);
      }
      
      const finalAmount = rawTotal - couponDiscount;
      const estimatedSavings = Math.round(totalDiscount + couponDiscount);
      const loyaltyPointsEarned = Math.floor(finalAmount / 100);

      // Create new transaction invoice record
      const date = new Date();
      const invoiceNumber = `BILL-${date.getFullYear()}${pad(date.getMonth() + 1, 2)}${pad(date.getDate(), 2)}-${pad(invoices.length + 1001, 4)}`;

      const invoiceData = {
        billNumber: invoiceNumber,
        customerName: customerName || 'Walk-in Customer',
        customerPhone: customerPhone || '',
        cashierName: 'Anand Manager',
        gstNumber: '27ANAND9751A1Z0',
        timestamp: date.toISOString(),
        subtotal: subTotalFinal,
        gstAmount: gstFinal,
        discountAmount: couponDiscount,
        totalAmount: finalAmount,
        savings: estimatedSavings,
        paymentMethod,
        loyaltyPointsEarned,
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
          sellingPrice: item.product.sellingPrice,
          quantity: item.quantity,
          discount: item.product.discount,
          gst: item.product.gst,
          total: Math.round((item.product.sellingPrice * (1 - item.product.discount/100)) * item.quantity * (1 + item.product.gst/100))
        }))
      };

      // 1. Deduct quantity from products list
      const updatedProducts = products.map(p => {
        const cartItem = cart.find(item => item.product.id === p.id);
        if (cartItem) {
          const nextQty = Math.max(0, p.quantity - cartItem.quantity);
          const isLow = nextQty <= p.reorderPoint && nextQty > 0;
          const isOut = nextQty === 0;

          if (isOut) {
            addNotification('error', `ALERT: Product ${p.name} is now OUT OF STOCK!`);
          } else if (isLow) {
            addNotification('warning', `ALERT: Product ${p.name} has dropped below reorder threshold (${nextQty} left).`);
          }

          return {
            ...p,
            quantity: nextQty,
            lowStock: isLow,
            outOfStock: isOut
          };
        }
        return p;
      });

      setProducts(updatedProducts);
      localStorage.setItem('instabill_products', JSON.stringify(updatedProducts));

      // 2. Add invoice to history
      const updatedInvoices = [invoiceData, ...invoices];
      setInvoices(updatedInvoices);
      localStorage.setItem('instabill_invoices', JSON.stringify(updatedInvoices));

      // 3. Update customer CRM profiles
      if (customerPhone) {
        const updatedCustomers = customers.map(c => {
          if (c.phone === customerPhone) {
            const newPoints = c.loyaltyPoints + loyaltyPointsEarned;
            let nextTier = c.tier;
            if (newPoints >= 2000) nextTier = 'Platinum';
            else if (newPoints >= 1000) nextTier = 'Gold';
            else if (newPoints >= 400) nextTier = 'Silver';

            if (nextTier !== c.tier) {
              addNotification('success', `CUSTOMER LOYALTY UPGRADE: ${c.name} upgraded to ${nextTier} tier!`);
            }

            return {
              ...c,
              loyaltyPoints: newPoints,
              tier: nextTier,
              avgBillValue: Math.round((c.avgBillValue * c.purchaseHistory.length + finalAmount) / (c.purchaseHistory.length + 1)),
              purchaseHistory: [
                { date: date.toISOString().split('T')[0], billNo: invoiceNumber, amount: finalAmount, itemsCount: cart.length },
                ...c.purchaseHistory
              ]
            };
          }
          return c;
        });

        // If customer is brand new, seed them
        const exists = customers.some(c => c.phone === customerPhone);
        if (!exists) {
          const colors = ["from-teal-500 to-emerald-500", "from-blue-500 to-cyan-500", "from-purple-500 to-indigo-500", "from-pink-500 to-rose-500"];
          const newCust = {
            id: customers.length + 1,
            name: customerName || 'New Customer',
            phone: customerPhone,
            email: `${(customerName || 'customer').toLowerCase().replace(/\s+/g, '')}@example.com`,
            loyaltyPoints: loyaltyPointsEarned,
            tier: loyaltyPointsEarned >= 400 ? 'Silver' : 'Regular',
            joinedDate: date.toISOString().split('T')[0],
            spendingScore: 50,
            avgBillValue: finalAmount,
            preferredCategory: cart[0]?.product.category || 'Groceries',
            purchaseHistory: [
              { date: date.toISOString().split('T')[0], billNo: invoiceNumber, amount: finalAmount, itemsCount: cart.length }
            ],
            avatarColor: colors[Math.floor(Math.random() * colors.length)]
          };
          updatedCustomers.push(newCust);
          addNotification('success', `CRM: Registered new customer profile for ${customerName}`);
        }

        setCustomers(updatedCustomers);
        localStorage.setItem('instabill_customers', JSON.stringify(updatedCustomers));
      }

      // Add transaction notification
      addNotification('success', `Bill ${invoiceNumber} generated successfully. Total: ₹${finalAmount}`);
      
      // Clear cart
      clearCart();
      resolve(invoiceData);
    });
  };

  // --- 13. Product Management (Admin panel adjustments) ---
  const updateProductStock = (productId, newQty) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const qtyInt = parseInt(newQty) || 0;
        const isLow = qtyInt <= p.reorderPoint && qtyInt > 0;
        const isOut = qtyInt === 0;
        
        if (qtyInt > p.quantity) {
          addNotification('success', `Stock replenished: ${p.name} updated to ${qtyInt} units.`);
        }

        return {
          ...p,
          quantity: qtyInt,
          lowStock: isLow,
          outOfStock: isOut
        };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('instabill_products', JSON.stringify(updated));
  };

  const addProduct = (newProduct) => {
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const finalProduct = {
      id: nextId,
      sku: newProduct.sku || `PRO-${Date.now().toString().slice(-4)}`,
      barcode: newProduct.barcode || Math.floor(Math.random() * 1000000000000).toString(),
      qrCode: `https://instabill.pro/verify/${newProduct.sku}`,
      rating: parseFloat(newProduct.rating) || 4.5,
      ...newProduct,
      quantity: parseInt(newProduct.quantity) || 0,
      costPrice: parseFloat(newProduct.costPrice) || 0,
      sellingPrice: parseFloat(newProduct.sellingPrice) || 0,
      discount: parseFloat(newProduct.discount) || 0,
      gst: parseFloat(newProduct.gst) || 18,
      reorderPoint: parseInt(newProduct.reorderPoint) || 15,
      fastMoving: false,
      lowStock: (parseInt(newProduct.quantity) || 0) <= (parseInt(newProduct.reorderPoint) || 15) && (parseInt(newProduct.quantity) || 0) > 0,
      outOfStock: (parseInt(newProduct.quantity) || 0) === 0
    };

    const updated = [finalProduct, ...products];
    setProducts(updated);
    localStorage.setItem('instabill_products', JSON.stringify(updated));
    addNotification('success', `New product catalogued: ${finalProduct.name}`);
  };

  const editProduct = (productId, updatedProduct) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const qty = parseInt(updatedProduct.quantity) || 0;
        const reorder = parseInt(updatedProduct.reorderPoint) || 15;
        return {
          ...p,
          ...updatedProduct,
          quantity: qty,
          costPrice: parseFloat(updatedProduct.costPrice) || 0,
          sellingPrice: parseFloat(updatedProduct.sellingPrice) || 0,
          discount: parseFloat(updatedProduct.discount) || 0,
          gst: parseFloat(updatedProduct.gst) || 18,
          reorderPoint: reorder,
          lowStock: qty <= reorder && qty > 0,
          outOfStock: qty === 0
        };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('instabill_products', JSON.stringify(updated));
    const match = products.find(p => p.id === productId);
    addNotification('success', `Product details updated: ${match ? match.name : ''}`);
  };


  // --- 14. Demo Stepper Navigation ---
  const DEMO_STEPS = [
    { title: "Authentication Login", path: "/login", desc: "Unlock command controls securely." },
    { title: "AI Retail Command Center", path: "/dashboard", desc: "Monitor executive statistics & Retail Digital Twin simulation." },
    { title: "Smart Inventory Engine", path: "/inventory", desc: "Inspect SKU aging charts & inventory health health logs." },
    { title: "Enterprise Product Catalog", path: "/products", desc: "Examine 100 realistic catalogs with multi-faceted search filter systems." },
    { title: "POS Checkout System", path: "/billing", desc: "Add goods, scan codes, coupon rebates, and complete cashout." },
    { title: "Supermarket Invoices", path: "/billing?viewReceipt=true", desc: "Verify receipts formatting and download PDF papers." },
    { title: "Executive Business Analytics", path: "/analytics", desc: "Audit data heatmaps, hourly charts, and customer retentions." },
    { title: "Customer Intelligence System", path: "/admin", desc: "Review customer profiles, loyalty tiers, and CRM dashboards." }
  ];

  const nextDemoStep = () => {
    setDemoStep((prev) => (prev < DEMO_STEPS.length - 1 ? prev + 1 : prev));
  };

  const prevDemoStep = () => {
    setDemoStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        customers,
        cart,
        appliedCoupon,
        setAppliedCoupon,
        paymentMethod,
        setPaymentMethod,
        invoices,
        notifications,
        darkMode,
        setDarkMode,
        drawerOpen,
        setDrawerOpen,
        demoActive,
        setDemoActive,
        demoStep,
        setDemoStep,
        demoSteps: DEMO_STEPS,
        nextDemoStep,
        prevDemoStep,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        checkout,
        updateProductStock,
        addProduct,
        editProduct,
        addNotification,
        markNotificationAsRead,
        clearNotifications
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
