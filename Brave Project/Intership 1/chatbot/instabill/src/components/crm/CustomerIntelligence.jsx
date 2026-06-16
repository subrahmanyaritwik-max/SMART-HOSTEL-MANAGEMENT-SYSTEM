// src/components/crm/CustomerIntelligence.jsx
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Award, 
  Coins, 
  TrendingUp, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Heart
} from 'lucide-react';
import GlassCard from '../common/GlassCard';
import { useStore } from '../../context/StoreContext';

export const CustomerIntelligence = () => {
  const { customers } = useStore();
  const [crmSearch, setCrmSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  // Compute CRM KPIs dynamically
  const totalCRMCount = customers.length;
  const avgCRMPoints = Math.round(customers.reduce((acc, c) => acc + c.loyaltyPoints, 0) / totalCRMCount);
  const avgCRMBill = Math.round(customers.reduce((acc, c) => acc + c.avgBillValue, 0) / totalCRMCount);
  
  const highValCount = customers.filter(c => c.spendingScore >= 80).length;

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(crmSearch.toLowerCase()) || 
                            c.phone.includes(crmSearch) || 
                            c.email.toLowerCase().includes(crmSearch.toLowerCase());
      const matchesTier = selectedTier === 'All' || c.tier === selectedTier;
      return matchesSearch && matchesTier;
    });
  }, [customers, crmSearch, selectedTier]);

  const toggleExpandCustomer = (id) => {
    if (expandedCustomer === id) setExpandedCustomer(null);
    else setExpandedCustomer(id);
  };

  return (
    <div className="space-y-6">
      
      {/* CRM Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total CRM Profiles */}
        <GlassCard className="flex flex-col justify-between border border-zinc-200/50 dark:border-zinc-800/50 p-5">
          <div className="flex items-center justify-between text-zinc-400 dark:text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Loyalty Pool</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-white">{totalCRMCount}</h3>
            <p className="text-[10px] text-zinc-400 font-medium mt-1">Consolidated active profiles</p>
          </div>
          <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-900 rounded-full mt-2">
            <div className="h-full bg-amber-500 rounded-full w-3/4" />
          </div>
        </GlassCard>

        {/* Avg Points pool */}
        <GlassCard className="flex flex-col justify-between border border-zinc-200/50 dark:border-zinc-800/50 p-5">
          <div className="flex items-center justify-between text-zinc-400 dark:text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Average Points balance</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-white">{avgCRMPoints} pts</h3>
            <p className="text-[10px] text-zinc-400 font-medium mt-1">Average rewards outstanding</p>
          </div>
          <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-900 rounded-full mt-2">
            <div className="h-full bg-emerald-500 rounded-full w-2/3" />
          </div>
        </GlassCard>

        {/* Avg Ticket Size */}
        <GlassCard className="flex flex-col justify-between border border-zinc-200/50 dark:border-zinc-800/50 p-5">
          <div className="flex items-center justify-between text-zinc-400 dark:text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Customer Bill</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-white">₹{avgCRMBill}</h3>
            <p className="text-[10px] text-zinc-400 font-medium mt-1">Consolidated shopping average</p>
          </div>
          <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-900 rounded-full mt-2">
            <div className="h-full bg-blue-500 rounded-full w-1/2" />
          </div>
        </GlassCard>

        {/* Platinum + Gold count */}
        <GlassCard className="flex flex-col justify-between border border-zinc-200/50 dark:border-zinc-800/50 p-5">
          <div className="flex items-center justify-between text-zinc-400 dark:text-zinc-500">
            <span className="text-xs font-bold uppercase tracking-wider">High-Value VIPs</span>
            <Award className="w-4 h-4 text-purple-500 animate-float" />
          </div>
          <div className="my-3">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-white">{highValCount} members</h3>
            <p className="text-[10px] text-zinc-400 font-medium mt-1">Spend score &gt; 80% thresholds</p>
          </div>
          <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-900 rounded-full mt-2">
            <div className="h-full bg-purple-500 rounded-full w-4/5" />
          </div>
        </GlassCard>

      </div>

      {/* CRM Console List and filters */}
      <GlassCard className="border border-zinc-200/50 dark:border-zinc-800/50">
        
        {/* Search header controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/60 mb-6">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search CRM registry by name, phone, email..."
              value={crmSearch}
              onChange={(e) => setCrmSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs">
            <span className="text-zinc-400 font-semibold">Tier filter:</span>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-transparent text-zinc-700 dark:text-zinc-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="All">All Loyalty Tiers</option>
              <option value="Platinum">Platinum (&gt; 2000 pts)</option>
              <option value="Gold">Gold (1000 - 1999 pts)</option>
              <option value="Silver">Silver (400 - 999 pts)</option>
              <option value="Regular">Regular (0 - 399 pts)</option>
            </select>
          </div>
        </div>

        {/* CRM Customers list */}
        <div className="space-y-4">
          {filteredCustomers.map((c) => {
            const isExpanded = expandedCustomer === c.id;
            
            return (
              <div 
                key={c.id}
                className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white/20 dark:bg-zinc-950/20 rounded-2xl overflow-hidden transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-800/90"
              >
                {/* Summary Row */}
                <div 
                  onClick={() => toggleExpandCustomer(c.id)}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer text-xs"
                >
                  {/* Customer Identity */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-zinc-800 dark:text-white">{c.name}</p>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider
                          ${c.tier === 'Platinum' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 
                            c.tier === 'Gold' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                            c.tier === 'Silver' ? 'bg-zinc-100 text-zinc-500 border border-zinc-200' : 
                            'bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600'
                          }
                        `}>
                          {c.tier}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3" /> {c.phone} | <Mail className="w-3 h-3" /> {c.email}
                      </p>
                    </div>
                  </div>

                  {/* Customer Core Stats */}
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase">Loyalty Points</p>
                      <p className="font-bold text-zinc-800 dark:text-white mt-0.5">{c.loyaltyPoints} pts</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase">Avg Purchase</p>
                      <p className="font-bold text-zinc-800 dark:text-white mt-0.5">₹{c.avgBillValue}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-zinc-400 uppercase">VIP Index</p>
                      <p className={`font-bold mt-0.5 ${c.spendingScore >= 80 ? 'text-purple-500' : 'text-zinc-600 dark:text-zinc-400'}`}>
                        {c.spendingScore}%
                      </p>
                    </div>
                  </div>

                  {/* Expand Chevron */}
                  <div className="flex justify-end">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/10 space-y-4 animate-in fade-in duration-200">
                    
                    {/* CRM Details Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Calendar className="w-4 h-4 text-zinc-400" />
                        <span>Registered Since: {c.joinedDate}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-zinc-500">
                        <ShoppingBag className="w-4 h-4 text-zinc-400" />
                        <span>Preferred Category: {c.preferredCategory}</span>
                      </div>

                      <div className="flex items-center gap-2 text-zinc-500">
                        <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
                        <span>VIP Tier Status: Valid Administrator Link</span>
                      </div>
                    </div>

                    {/* Purchase History Table */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Purchase History (Recent First)</p>
                      
                      <div className="rounded-xl border border-zinc-200/40 dark:border-zinc-800/40 overflow-hidden divide-y divide-zinc-200/40 dark:divide-zinc-800/40">
                        {c.purchaseHistory.map((invoice, idx) => (
                          <div 
                            key={idx} 
                            className="p-2.5 flex items-center justify-between text-[10px] bg-white dark:bg-zinc-950/40"
                          >
                            <div className="space-y-0.5">
                              <p className="font-bold text-zinc-800 dark:text-zinc-200">{invoice.billNo}</p>
                              <p className="text-[9px] text-zinc-400 font-semibold">{invoice.date}</p>
                            </div>

                            <div className="text-right">
                              <p className="font-bold text-zinc-800 dark:text-zinc-100">₹{invoice.amount}</p>
                              <p className="text-[9px] text-zinc-400 font-semibold">{invoice.itemsCount} items purchased</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>

      </GlassCard>

    </div>
  );
};

export default CustomerIntelligence;
