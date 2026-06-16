// src/components/common/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Calculator, 
  Database, 
  TrendingUp, 
  Users, 
  Info, 
  Hexagon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Products Catalog', icon: ShoppingBag, path: '/products' },
    { label: 'POS Billing', icon: Calculator, path: '/billing' },
    { label: 'Inventory Engine', icon: Database, path: '/admin/inventory' },
    { label: 'Analytics Dashboard', icon: TrendingUp, path: '/admin/analytics' },
    { label: 'Customers CRM', icon: Users, path: '/admin/customers' },
    { label: 'About App', icon: Info, path: '/about' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside 
      className={`
        fixed top-0 left-0 h-screen z-30
        transition-all duration-300 ease-in-out
        border-r border-zinc-200/50 dark:border-zinc-800/50
        ${isOpen ? 'w-64' : 'w-20'}
        background-blur-md
        bg-white/80 dark:bg-zinc-950/80
        flex flex-col justify-between
      `}
    >
      {/* Sidebar Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Hexagon className="w-5 h-5 fill-white/10" />
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="font-bold text-sm text-zinc-900 dark:text-white tracking-wide">ANAND STORES</span>
                <span className="text-[10px] font-semibold text-amber-500 tracking-wider">InstaBILL X Pro</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-medium text-xs
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/25' 
                    : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-white'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'scale-110 text-zinc-950' : 'text-zinc-405 dark:text-zinc-500'}`} />
                    {isOpen && (
                      <span className="truncate flex-grow">{item.label}</span>
                    )}
                    {isActive && isOpen && (
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-zinc-200/50 dark:border-zinc-800/50">
        {isOpen && user && (
          <div className="mb-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider">Active Admin</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-250 dark:border-zinc-800">
                <img src={user.avatar} alt="admin-avatar" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{user.name}</p>
                <p className="text-[9px] text-zinc-400 font-semibold truncate">{user.email}</p>
              </div>
            </div>
            <p className="text-[9px] text-emerald-500 font-semibold flex items-center gap-1 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online Guard
            </p>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-semibold text-xs
            text-rose-600 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200 cursor-pointer
          `}
        >
          <LogOut className="w-4.5 h-4.5" />
          {isOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
