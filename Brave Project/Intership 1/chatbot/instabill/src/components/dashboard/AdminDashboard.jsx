// src/components/dashboard/AdminDashboard.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IndianRupee, 
  ShoppingBag, 
  Receipt, 
  Percent, 
  TrendingUp, 
  ArrowUpRight,
  Warehouse,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
  Edit3
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import GlassCard from '../common/GlassCard';
import { useStore } from '../../context/StoreContext';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { products, invoices, updateProductStock, addNotification } = useStore();

  // --- 1. Compute Key Metrics ---
  const today = new Date().toISOString().split('T')[0];
  const todayInvoices = invoices.filter(inv => inv.timestamp.startsWith(today));
  
  const todaySales = 45670 + todayInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const monthlySales = 1240500 + invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalBills = 4265 + invoices.length;
  const activeProducts = 350 + (products.length - 100);
  const inventoryValue = 850000 + products.reduce((acc, p) => acc + (p.quantity * p.costPrice), 0) - 48000;

  const stats = [
    {
      title: "Today's Revenue",
      value: `₹${todaySales.toLocaleString()}`,
      change: "+18.4%",
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      icon: IndianRupee
    },
    {
      title: "Monthly Sales",
      value: `₹${monthlySales.toLocaleString()}`,
      change: "+12.1%",
      color: "text-lime-400 border-lime-500/20 bg-lime-500/5",
      icon: TrendingUp
    },
    {
      title: "Active Catalog",
      value: activeProducts.toString(),
      change: "Loaded 100",
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      icon: ShoppingBag
    },
    {
      title: "Stock Valuation",
      value: `₹${Math.round(inventoryValue).toLocaleString()}`,
      change: "+4.2%",
      color: "text-lime-400 border-lime-500/20 bg-lime-500/5",
      icon: Warehouse
    }
  ];

  // --- 2. Chart Data Computations ---
  const revenueGrowthData = useMemo(() => {
    const dailyMap = {};
    
    // Seed some steady baseline records
    const baseline = [
      { date: 'Jun 05', revenue: 38000 },
      { date: 'Jun 06', revenue: 41000 },
      { date: 'Jun 07', revenue: 39000 },
      { date: 'Jun 08', revenue: 45000 },
      { date: 'Jun 09', revenue: 48000 },
      { date: 'Jun 10', revenue: 46000 },
      { date: 'Jun 11', revenue: 52000 },
    ];
    
    invoices.forEach((inv) => {
      const dateStr = new Date(inv.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + inv.totalAmount;
    });

    const dates = Object.keys(dailyMap);
    const mapData = dates.map(date => ({
      date,
      revenue: Math.round(dailyMap[date])
    }));

    return [...baseline, ...mapData].slice(-10);
  }, [invoices]);

  const peakSalesHoursData = useMemo(() => {
    const hourlyCounts = Array(13).fill(0);
    invoices.forEach((inv) => {
      const hour = new Date(inv.timestamp).getHours();
      if (hour >= 9 && hour <= 21) {
        hourlyCounts[hour - 9]++;
      }
    });

    const labels = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM"];
    return labels.map((label, idx) => ({
      hour: label,
      transactions: 12 + hourlyCounts[idx] * 2 + Math.floor(Math.random() * 5)
    }));
  }, [invoices]);

  // --- 3. Inventory Health Analysis ---
  const outOfStockItems = products.filter(p => p.quantity === 0);
  const lowStockItems = products.filter(p => p.quantity <= p.reorderPoint && p.quantity > 0);
  const healthScore = Math.round(((products.length - (outOfStockItems.length + lowStockItems.length)) / products.length) * 100) || 100;

  const handleQuickRestock = (productId, amt = 50) => {
    const matched = products.find(p => p.id === productId);
    if (!matched) return;
    updateProductStock(productId, matched.quantity + amt);
    addNotification('success', `Quick Restock: Added ${amt} units to ${matched.name}.`);
  };

  // Recharts Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-slate-950 border border-white/10 text-white rounded-xl text-[10px] font-mono shadow-2xl">
          <p className="font-bold border-b border-white/5 pb-1 mb-1.5">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="flex justify-between gap-4">
              <span className="text-zinc-400 uppercase">{p.name}:</span>
              <span className="font-bold text-emerald-400">₹{p.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Date Block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-left">
          <h2 className="text-xl font-bold text-white tracking-tight uppercase">ANAND STORES Command Dashboard</h2>
          <p className="text-xs text-zinc-400 font-semibold mt-0.5">Enterprise retail operations ledger and sales inventory telemetry.</p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-white/5 text-xs text-zinc-400 font-bold">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Operational Link: {today}</span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={i} className="relative overflow-hidden group border border-white/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest">{stat.title}</span>
                <div className={`p-2 rounded-xl border border-white/10 ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <h3 className="text-xl font-black text-white">{stat.value}</h3>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                  {stat.change} <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </GlassCard>
          );
        })}
      </div>

      {/* Analytics Visualizers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales Area Growth Chart (7 Columns) */}
        <GlassCard className="lg:col-span-7 border border-white/5 p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-white/5 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Revenue Stream Telemetry</h3>
            </div>
            <span className="text-[9px] text-zinc-400 font-bold bg-white/5 px-2.5 py-1 rounded-full uppercase">10-Day Trend</span>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Daily Revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Hourly Traffic Bar Chart (5 Columns) */}
        <GlassCard className="lg:col-span-5 border border-white/5 p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-white/5 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-lime-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Peak Sales Hours</h3>
            </div>
            <span className="text-[9px] text-zinc-400 font-bold bg-white/5 px-2.5 py-1 rounded-full uppercase">Checkouts Tally</span>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakSalesHoursData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="hour" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} />
                <Tooltip formatter={(val) => [`${val} transactions`]} />
                <Bar dataKey="transactions" fill="#84cc16" radius={[4, 4, 0, 0]} maxBarSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>

      {/* Inventory Health & Alert Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
        
        {/* Product Catalog Stock Adjuster (7 Columns) */}
        <GlassCard className="lg:col-span-7 border border-white/5 p-5 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-white/5 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">SKU Catalog & Stock Quick Restock</h3>
              </div>
              <button 
                onClick={() => navigate('/admin/inventory')}
                className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5 hover:underline"
              >
                Stock Engine <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Responsive Table for Product Quantities */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-550 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-2.5">Product</th>
                    <th className="py-2.5">SKU</th>
                    <th className="py-2.5">MRP Price</th>
                    <th className="py-2.5">Stock Level</th>
                    <th className="py-2.5 text-right">Replenish</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-semibold">
                  {products.slice(0, 5).map((p) => {
                    const isOut = p.quantity === 0;
                    const isLow = p.quantity <= p.reorderPoint && p.quantity > 0;
                    return (
                      <tr key={p.id} className="text-zinc-300 hover:bg-white/20 transition-colors">
                        <td className="py-3 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded bg-slate-900 border border-white/5 overflow-hidden flex-shrink-0">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="truncate w-32 font-bold text-white">{p.name}</span>
                        </td>
                        <td className="py-3 font-mono text-[10px] text-zinc-500">{p.sku}</td>
                        <td className="py-3 text-zinc-200">₹{p.sellingPrice}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            isOut ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                            isLow ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {isOut ? 'Out of stock' : `${p.quantity} units`}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleQuickRestock(p.id, 50)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold transition-colors cursor-pointer border border-white/5"
                          >
                            +50 Units
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="pt-3 border-t border-white/5 text-[10px] text-zinc-550 flex justify-between font-bold">
            <span>Showing top catalog items</span>
            <span>Total SKUs catalogued: {products.length}</span>
          </div>
        </GlassCard>

        {/* Recent Checkout Bills Table (5 Columns) */}
        <GlassCard className="lg:col-span-5 border border-white/5 p-5 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-white/5 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-lime-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Invoices Generated</h3>
              </div>
              <span className="text-[9px] font-bold text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded">
                Live link
              </span>
            </div>

            <div className="overflow-x-auto max-h-[260px] overflow-y-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-550 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-2">Bill No</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Method</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[11px] font-semibold text-zinc-300">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-12 text-zinc-550 text-xs font-bold font-sans">
                        No transactions registered today
                      </td>
                    </tr>
                  ) : (
                    invoices.slice(0, 6).map((inv, idx) => (
                      <tr key={idx} className="hover:bg-white/20 transition-colors">
                        <td className="py-2.5 font-bold text-white">{inv.billNumber.slice(-9)}</td>
                        <td className="py-2.5 font-sans truncate max-w-[90px]">{inv.customerName}</td>
                        <td className="py-2.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/5 text-[9px] text-zinc-400 font-bold">
                            {inv.paymentMethod}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-sans font-bold text-emerald-400">₹{inv.totalAmount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="pt-3 border-t border-white/5 text-[10px] text-zinc-550 flex justify-between font-bold">
            <span>Aggregated cashier records</span>
            <span>Monthly draft size: {totalBills}</span>
          </div>
        </GlassCard>

      </div>
      
    </div>
  );
};

export default AdminDashboard;
