// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Calculator, Database, ShieldAlert, Sparkles, Activity, Star } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { useStore } from '../context/StoreContext';

export const Home = () => {
  const navigate = useNavigate();
  const { products } = useStore();

  // Highlight a few products (first 4 items)
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 p-8 sm:p-12 text-center bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/5 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest mx-auto animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Smart Retail Experience</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
            Modernize Your Retail Billing and Cataloging
          </h1>

          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Experience high-performance Point-Of-Sale terminal checkout, instant digital invoice receipt triggers, real-time inventory monitoring, and executive analytics inside one seamless client ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button
              onClick={() => navigate('/products')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all cursor-pointer hover:shadow-lg shadow-amber-500/20 active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Catalog</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/billing')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-sm transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>POS Billing Terminal</span>
            </button>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Store Operating Features</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Powering store managers and walk-in consumers with high speed tools</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="border border-zinc-200/50 dark:border-zinc-800/50 p-6 flex flex-col justify-between h-56">
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/25 w-fit">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-800 dark:text-white">POS Cashier Checkout</h3>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed font-medium">
                Dual-mode checkout layout supporting manual search tags or high speed SKU barcode laser scanning triggers, calculated coupon rebates, and PDF receipt downloads.
              </p>
            </div>
            <button onClick={() => navigate('/billing')} className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 mt-4 transition-colors">
              Launch POS <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </GlassCard>

          <GlassCard className="border border-zinc-200/50 dark:border-zinc-800/50 p-6 flex flex-col justify-between h-56">
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/25 w-fit">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-800 dark:text-white">Structured Cataloging</h3>
              <p className="text-xs text-zinc-555 dark:text-zinc-400 leading-relaxed font-medium">
                Comprehensive search and filter configurations over groceries, household articles, dairy foods, fresh produce, and beverages. Complete with stock levels.
              </p>
            </div>
            <button onClick={() => navigate('/products')} className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-4 transition-colors">
              Explore Products <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </GlassCard>

          <GlassCard className="border border-zinc-200/50 dark:border-zinc-800/50 p-6 flex flex-col justify-between h-56">
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 w-fit">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-800 dark:text-white">Admin Control Core</h3>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed font-medium">
                Restricted section offering live cyber-physical shelf twins, smart replenishment recommendations, customer loyalty tiers directories, and performance analytics.
              </p>
            </div>
            <button onClick={() => navigate('/login')} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-4 transition-colors">
              Access Core <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </GlassCard>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1 text-left">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Featured Catalog Items</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Top selling items in stock right now</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <GlassCard key={p.id} className="relative flex flex-col justify-between overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 p-4 h-[280px]">
              <div className="h-32 w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-3">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] text-zinc-400 dark:text-zinc-500 font-bold">
                  <span>{p.brand}</span>
                  <span>{p.category}</span>
                </div>
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-150 truncate">{p.name}</h4>
                <div className="flex justify-between items-center pt-1">
                  <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{p.rating}</span>
                  </div>
                  <span className="text-sm font-extrabold text-zinc-805 dark:text-white">₹{p.sellingPrice}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 py-2 rounded-lg text-[10px] font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-white transition-colors"
              >
                Inspect Item
              </button>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
