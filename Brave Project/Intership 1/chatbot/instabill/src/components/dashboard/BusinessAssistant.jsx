// src/components/dashboard/BusinessAssistant.jsx
import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  TrendingUp, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import GlassCard from '../common/GlassCard';
import { useStore } from '../../context/StoreContext';

export const BusinessAssistant = () => {
  const { products, invoices } = useStore();
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'assistant', text: "Hello! I am your AI Business Assistant. Ask me about sales figures, inventory alerts, or pricing strategies." }
  ]);

  const defaultInsights = [
    { text: "Rice sales increased by 18% this week.", type: "trend-up", icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { text: "Restock Cooking Oil within 3 days to avoid stockouts.", type: "alert", icon: AlertTriangle, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { text: "Milk inventory is below threshold (4 units remaining).", type: "alert", icon: AlertTriangle, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
    { text: "Snacks generated the highest category revenue (28% of total).", type: "trend-up", icon: Sparkles, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
    { text: "Customer loyalty enrollment increased by 12% this month.", type: "trend-up", icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" }
  ];

  const handleChatSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput.toLowerCase().trim();
    const userMsg = { role: 'user', text: chatInput };
    setChatLog(prev => [...prev, userMsg]);
    setChatInput('');

    // Formulate a smart response based on local state
    setTimeout(() => {
      let responseText = "I couldn't find a direct correlation in the current local data. Try asking about 'low stock', 'best seller', or 'revenue stats'.";

      if (query.includes('low') || query.includes('stock') || query.includes('replenish')) {
        const lowStockList = products.filter(p => p.quantity <= p.reorderPoint && p.quantity > 0).slice(0, 3);
        const outOfStockList = products.filter(p => p.quantity === 0).slice(0, 2);
        
        let reply = "Here are the urgent stock directives: \n";
        if (outOfStockList.length) {
          reply += `🚨 OUT OF STOCK: ${outOfStockList.map(p => p.name).join(', ')}. \n`;
        }
        if (lowStockList.length) {
          reply += `⚠️ LOW STOCK: ${lowStockList.map(p => `${p.name} (${p.quantity} units left)`).join(', ')}. \n`;
        }
        if (!outOfStockList.length && !lowStockList.length) {
          reply = "All products are currently stocked above reorder points! Inventory health is at 100%.";
        }
        responseText = reply;
      } 
      else if (query.includes('revenue') || query.includes('sales') || query.includes('money')) {
        const totalRev = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0) + 1240500;
        responseText = `This month's consolidated revenue is ₹${totalRev.toLocaleString()}. Daily revenue is currently averaging ₹45,670 across 3 active terminals.`;
      } 
      else if (query.includes('rice')) {
        responseText = "Premium Basmati Rice sales are up 18% week-on-week. Current selling price is ₹110 with a cost price of ₹85, returning a healthy 22.7% margin.";
      } 
      else if (query.includes('best') || query.includes('popular') || query.includes('selling')) {
        responseText = "Our top performing items this week: \n1. Basmati Rice (Groceries)\n2. Cheddar Cheese (Dairy)\n3. Chocolate Chip Cookies (Bakery)\n4. Coffee Beans (Beverages). Snacks are currently leading in total transactions.";
      }
      else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
        responseText = "Hello! I am ready to process business telemetry queries. Type a query like 'which items are low on stock?' to begin.";
      }

      setChatLog(prev => [...prev, { role: 'assistant', text: responseText }]);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
      
      {/* AI Insights Directives (2 Cols) */}
      <GlassCard className="lg:col-span-2 flex flex-col justify-between border border-zinc-200/50 dark:border-zinc-800/50">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-zinc-800 dark:text-white">AI Product Intelligence</h3>
          </div>
          
          <div className="space-y-3">
            {defaultInsights.map((insight, i) => {
              const Icon = insight.icon;
              return (
                <div 
                  key={i} 
                  className={`p-3 rounded-xl border flex items-start gap-3 transition-transform hover:scale-[1.01] ${insight.color}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold leading-relaxed">{insight.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Small AI summary footer */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400 font-medium">
          <span>Updates every 10 min</span>
          <span className="text-amber-500 font-bold flex items-center gap-0.5 hover:underline cursor-pointer">
            Explore pricing strategies <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </GlassCard>

      {/* AI Chat Sandbox (3 Cols) */}
      <GlassCard className="lg:col-span-3 flex flex-col justify-between border border-zinc-200/50 dark:border-zinc-800/50 h-[340px] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-2">
            {/* Pulsing AI sphere */}
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-white">InstaBILL AI Terminal</h3>
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Model: Retail-v4.1</span>
        </div>

        {/* Chat Logs viewport */}
        <div className="flex-grow my-4 overflow-y-auto space-y-3 pr-1 text-xs scrollbar-thin">
          {chatLog.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  p-3 rounded-2xl max-w-[85%] whitespace-pre-line leading-relaxed
                  ${msg.role === 'user' 
                    ? 'bg-amber-500 text-zinc-950 font-semibold rounded-tr-none' 
                    : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-700 dark:text-zinc-300 rounded-tl-none'
                  }
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input form */}
        <form onSubmit={handleChatSend} className="relative mt-2">
          <input
            type="text"
            placeholder="Ask AI: 'show low stock products' or 'revenue stats'..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors shadow shadow-amber-500/10 active:scale-95"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>
      </GlassCard>

    </div>
  );
};

export default BusinessAssistant;
