// src/components/dashboard/DigitalTwin.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Activity, 
  ShoppingCart, 
  RefreshCcw, 
  ArrowRight, 
  MapPin, 
  Thermometer, 
  Layers 
} from 'lucide-react';
import GlassCard from '../common/GlassCard';

export const DigitalTwin = () => {
  const [telemetry, setTelemetry] = useState([
    { time: "16:10:02", type: "order", message: "Basket #940 routed: Groceries Aisle A-2 to Cashier Terminal 1", status: "success" },
    { time: "16:10:45", type: "stock", message: "Low stock signal: Wheat Flour (GRO-WHE-005) drops to 12", status: "warning" },
    { time: "16:11:15", type: "sensor", message: "Cooler Area C-1 temperature calibrated at 3.4°C", status: "info" },
    { time: "16:12:05", type: "restock", message: "Restock manifest acknowledged for Beverage Rack R-2", status: "info" }
  ]);
  const [activeCounter, setActiveCounter] = useState(1);
  const [scanningBeam, setScanningBeam] = useState(true);
  const scrollRef = useRef(null);

  // Generate random retail activities periodically to simulate a live database stream
  useEffect(() => {
    const events = [
      { type: "order", message: "Self-checkout counter #3 processed transaction: UPI payment of ₹450", status: "success" },
      { type: "stock", message: "Basmati Rice (GRO-BAS-009) depleted: Remaining quantity 5", status: "warning" },
      { type: "sensor", message: "Freezer Section F-3 power cycles; humidity steady at 45%", status: "info" },
      { type: "order", message: "Premium Basket #942 dispatched: Bakery B-Fresh to Cashier Terminal 2", status: "success" },
      { type: "restock", message: "Stock replenished: Greek Yogurt (DAI-GRE-004) quantity updated to +50", status: "success" },
      { type: "order", message: "Customer loyalty points updated: Vikram Malhotra (+42 pts)", status: "success" }
    ];

    const timer = setInterval(() => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const now = new Date();
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      
      setTelemetry((prev) => [
        { time: timeStr, ...randomEvent },
        ...prev.slice(0, 15) // Keep last 15 items
      ]);

      // Alternating active counters
      setActiveCounter((prev) => (prev % 3) + 1);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const pad = (val) => String(val).padStart(2, '0');

  return (
    <GlassCard className="col-span-1 lg:col-span-3 overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-500 animate-spin-slow" />
            <h2 className="text-lg font-bold text-zinc-800 dark:text-white">Store Digital Twin</h2>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mt-1">
            Real-time cyber-physical simulation & order routing telemetry
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 led-blink" />
            LIVE LINK ACTIVE
          </span>
          <button 
            onClick={() => setScanningBeam(!scanningBeam)}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all
              ${scanningBeam 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
                : 'border-zinc-200 dark:border-zinc-800 text-zinc-500'
              }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Scanning Beam</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Simulation, Right Ticker */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mt-6">
        
        {/* SVG Live Simulation (3 Cols) */}
        <div className="xl:col-span-3 border border-zinc-200/40 dark:border-zinc-800/40 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/40 p-4 relative overflow-hidden flex flex-col justify-between min-h-[340px]">
          {/* Scanline beam animation */}
          {scanningBeam && (
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent shadow-[0_0_8px_rgba(245,158,11,0.6)] pointer-events-none animate-scan" />
          )}

          {/* Store Layout Graphic */}
          <div className="relative w-full flex-grow flex items-center justify-center py-6">
            <svg viewBox="0 0 800 300" className="w-full max-w-2xl h-auto drop-shadow-lg overflow-visible">
              {/* Outer Walls */}
              <rect x="10" y="10" width="780" height="280" rx="16" fill="none" stroke="currentColor" className="text-zinc-300 dark:text-zinc-800" strokeWidth="2" strokeDasharray="6 4" />
              
              {/* Aisle Shelves */}
              {/* Aisle A - Groceries */}
              <g className="group cursor-pointer">
                <rect x="60" y="40" width="160" height="50" rx="8" className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800 hover:stroke-amber-500/50 transition-colors" />
                <text x="140" y="70" textAnchor="middle" className="text-[11px] font-bold fill-zinc-500 dark:fill-zinc-400">Aisle A (Groceries)</text>
                <circle cx="80" cy="65" r="3.5" className="fill-emerald-500 led-blink" />
              </g>

              {/* Aisle B - Bakery */}
              <g className="group cursor-pointer">
                <rect x="250" y="40" width="160" height="50" rx="8" className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800 hover:stroke-amber-500/50 transition-colors" />
                <text x="330" y="70" textAnchor="middle" className="text-[11px] font-bold fill-zinc-500 dark:fill-zinc-400">Aisle B (Bakery)</text>
                <circle cx="270" cy="65" r="3.5" className="fill-emerald-500 led-blink animate-pulse" />
              </g>

              {/* Cooler C - Dairy */}
              <g className="group cursor-pointer">
                <rect x="440" y="40" width="160" height="50" rx="8" className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800 hover:stroke-amber-500/50 transition-colors" />
                <text x="520" y="70" textAnchor="middle" className="text-[11px] font-bold fill-zinc-500 dark:fill-zinc-400">Cooler C (Dairy)</text>
                <circle cx="460" cy="65" r="3.5" className="fill-cyan-500 led-blink" />
              </g>

              {/* Aisle D - Snacks */}
              <g className="group cursor-pointer">
                <rect x="60" y="120" width="160" height="50" rx="8" className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800 hover:stroke-amber-500/50 transition-colors" />
                <text x="140" y="150" textAnchor="middle" className="text-[11px] font-bold fill-zinc-500 dark:fill-zinc-400">Aisle D (Snacks & Sodas)</text>
                <circle cx="80" cy="145" r="3.5" className="fill-amber-500 led-blink" />
              </g>

              {/* Freezer F - Frozen */}
              <g className="group cursor-pointer">
                <rect x="250" y="120" width="160" height="50" rx="8" className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800 hover:stroke-amber-500/50 transition-colors" />
                <text x="330" y="150" textAnchor="middle" className="text-[11px] font-bold fill-zinc-500 dark:fill-zinc-400">Freezer F (Frozen Goods)</text>
                <circle cx="270" cy="145" r="3.5" className="fill-cyan-500 led-blink" />
              </g>

              {/* Rack R - Household */}
              <g className="group cursor-pointer">
                <rect x="440" y="120" width="160" height="50" rx="8" className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800 hover:stroke-amber-500/50 transition-colors" />
                <text x="520" y="150" textAnchor="middle" className="text-[11px] font-bold fill-zinc-500 dark:fill-zinc-400">Rack R (Household)</text>
                <circle cx="460" cy="145" r="3.5" className="fill-emerald-500 led-blink" />
              </g>

              {/* Cashiers Terminals */}
              <g className={`transition-all ${activeCounter === 1 ? 'opacity-100' : 'opacity-60'}`}>
                <rect x="120" y="210" width="100" height="60" rx="10" className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800" />
                <text x="170" y="240" textAnchor="middle" className="text-[10px] font-bold fill-zinc-600 dark:fill-zinc-300">Terminal 1</text>
                <text x="170" y="255" textAnchor="middle" className="text-[8px] font-bold fill-emerald-500">Active</text>
                <rect x="160" y="218" width="20" height="12" rx="2" className="fill-amber-500" />
              </g>

              <g className={`transition-all ${activeCounter === 2 ? 'opacity-100' : 'opacity-60'}`}>
                <rect x="260" y="210" width="100" height="60" rx="10" className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800" />
                <text x="310" y="240" textAnchor="middle" className="text-[10px] font-bold fill-zinc-600 dark:fill-zinc-300">Terminal 2</text>
                <text x="310" y="255" textAnchor="middle" className="text-[8px] font-bold fill-emerald-500">Active</text>
                <rect x="300" y="218" width="20" height="12" rx="2" className="fill-amber-500" />
              </g>

              <g className={`transition-all ${activeCounter === 3 ? 'opacity-100' : 'opacity-60'}`}>
                <rect x="400" y="210" width="100" height="60" rx="10" className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800" />
                <text x="450" y="240" textAnchor="middle" className="text-[10px] font-bold fill-zinc-600 dark:fill-zinc-300">Self Checkout</text>
                <text x="450" y="255" textAnchor="middle" className="text-[8px] font-bold fill-amber-500 animate-pulse">Idle</text>
                <rect x="440" y="218" width="20" height="12" rx="2" className="fill-zinc-700" />
              </g>

              {/* Order particles animation line (shelves to checkout) */}
              <path d="M 140 90 L 140 210" fill="none" stroke="rgba(245,158,11,0.2)" strokeWidth="2" strokeDasharray="5 5" />
              <circle cx="140" cy="110" r="4" className="fill-amber-500">
                <animate attributeName="cy" from="90" to="210" dur="4s" repeatCount="indefinite" />
              </circle>

              <path d="M 330 90 L 330 210" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="2" strokeDasharray="5 5" />
              <circle cx="330" cy="160" r="4" className="fill-blue-500">
                <animate attributeName="cy" from="90" to="210" dur="2.5s" repeatCount="indefinite" />
              </circle>

              <path d="M 520 90 L 450 210" fill="none" stroke="rgba(168,85,247,0.2)" strokeWidth="2" strokeDasharray="5 5" />
              <circle cx="520" cy="90" r="4" className="fill-purple-500">
                <animateMotion path="M 520 90 L 450 210" dur="3.5s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
          
          {/* Quick Stats Banner inside map */}
          <div className="grid grid-cols-3 gap-2 border-t border-zinc-200/30 dark:border-zinc-800/30 pt-3 text-center">
            <div>
              <p className="text-[9px] font-bold text-zinc-400 uppercase">Aisle Health</p>
              <p className="text-xs font-bold text-emerald-500">98.4% Normal</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-zinc-400 uppercase">Avg Queue Time</p>
              <p className="text-xs font-bold text-amber-500">&lt; 1.2 min</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-zinc-400 uppercase">Device Links</p>
              <p className="text-xs font-bold text-indigo-500">12 / 12 Active</p>
            </div>
          </div>
        </div>

        {/* Console Activity Logs (2 Cols) */}
        <div className="xl:col-span-2 flex flex-col h-full">
          <div className="flex items-center gap-1.5 pb-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-amber-500" />
            <span>Store Activity Telemetry</span>
          </div>

          <div 
            ref={scrollRef}
            className="flex-grow rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-950 p-4 font-mono text-[10px] space-y-2.5 overflow-y-auto max-h-[320px] shadow-inner"
          >
            {telemetry.map((log, index) => (
              <div 
                key={index} 
                className="pb-2 border-b border-zinc-900 last:border-0 flex items-start gap-2 text-zinc-400 dark:text-zinc-300 animate-in fade-in slide-in-from-left-1 duration-200"
              >
                <span className="text-zinc-600 font-bold">{log.time}</span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                  log.status === 'warning' 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                    : log.status === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {log.type}
                </span>
                <p className="leading-relaxed flex-grow text-zinc-300">
                  {log.message}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </GlassCard>
  );
};

export default DigitalTwin;
