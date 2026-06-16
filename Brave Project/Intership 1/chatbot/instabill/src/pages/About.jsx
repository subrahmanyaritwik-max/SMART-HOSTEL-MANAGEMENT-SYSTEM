// src/pages/About.jsx
import React from 'react';
import { 
  Hexagon, 
  Terminal, 
  Settings, 
  FileText, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Heart 
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

export const About = () => {
  return (
    <div className="space-y-6">
      
      {/* Platform Branding Intro Hero */}
      <GlassCard className="relative overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 p-8 text-center md:text-left flex flex-col md:flex-row items-center gap-6">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-[40px]" />
        
        <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white shrink-0 border border-amber-400/20 animate-float">
          <Hexagon className="w-8 h-8 fill-white/10" />
        </div>

        <div className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">InstaBILL X Pro</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 max-w-fit mx-auto md:mx-0">
              Retail Operating System v4.2.1
            </span>
          </div>
          
          <p className="text-xs text-amber-500 font-bold tracking-wider uppercase">
            Smart Retail Billing & Inventory Management Platform – ANAND STORES
          </p>
          
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl font-medium">
            InstaBILL X Pro is a next-generation enterprise-grade operating system designed for modern hypermarkets and supermarkets. It aggregates high-speed touchscreen Point-Of-Sale checkouts, live cyber-physical shelf simulations, smart inventory reordering alerts, CRM customer intelligence directories, and executive business analytics into a unified client dashboard.
          </p>
        </div>
      </GlassCard>

      {/* Specifications grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* POS checkout engine specs */}
        <GlassCard className="border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
            <Terminal className="w-4.5 h-4.5 text-amber-500" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-white">POS Checkout Engine</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Integrates a dual-mode cashier panel (Touch-Keys + catalog filters) and keyboard shortcuts. Supports barcode/QR scanners, CRM loyalty lookups, coupon code configurations, auto-calculated GST tax values, and supermarket-standard PDF invoice generation.
          </p>
        </GlassCard>

        {/* Cyber physical store twin specs */}
        <GlassCard className="border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
            <Activity className="w-4.5 h-4.5 text-amber-500" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-white">Store Digital Twin</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Constructs a top-down physical shelf map of the supermarket floor with real-time order-routing particle animations and status-check LEDs. Feeds a scrolling telemetry terminal log representing live store orders and replenishment activities.
          </p>
        </GlassCard>

        {/* Smart Inventory specifications */}
        <GlassCard className="border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
            <Settings className="w-4.5 h-4.5 text-amber-500" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-white">Smart Inventory & AI</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Tracks a pre-loaded catalog of 100 products across 10 categories, complete with batch codes, expiry dates, locations, and low/out stock alarms. AI Business Assistant details predictive stock outs and pricing clearance markdown strategies.
          </p>
        </GlassCard>

      </div>

      {/* Verification & Tech Compliance banner */}
      <GlassCard className="border border-zinc-200/50 dark:border-zinc-800/50 p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-50/20 dark:bg-zinc-900/10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <div>
            <p className="text-xs font-bold text-zinc-800 dark:text-white">Terminal Compliance Audit: Certified</p>
            <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Session operator: anandstores@123 verified via AuthContext guard.</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
          <span>React 19</span>
          <span className="w-1 h-1 rounded-full bg-zinc-400" />
          <span>Tailwind v4</span>
          <span className="w-1 h-1 rounded-full bg-zinc-400" />
          <span>Framer Motion</span>
          <span className="w-1 h-1 rounded-full bg-zinc-400" />
          <span>Recharts</span>
        </div>
      </GlassCard>

    </div>
  );
};

export default About;
