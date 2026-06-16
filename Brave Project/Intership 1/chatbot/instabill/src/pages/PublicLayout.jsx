// src/pages/PublicLayout.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Hexagon, ShieldAlert, ShoppingCart, Info, Home, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import CartDrawer from '../components/common/CartDrawer';

export const PublicLayout = () => {
  const { cart, setDrawerOpen } = useStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Listen for ?drawer=true in the URL parameters to open the drawer
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('drawer') === 'true') {
      setDrawerOpen(true);
      // Clean up search query parameter
      navigate(location.pathname, { replace: true });
    }
  }, [location, setDrawerOpen, navigate]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between">
      {/* Public Navbar */}
      <header className="sticky top-0 right-0 z-20 h-16 glass-navbar-dark flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Hexagon className="w-5 h-5 fill-white/10" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white tracking-wide">ANAND STORES</span>
              <span className="text-[10px] font-semibold text-amber-500 tracking-wider">InstaBILL X Pro</span>
            </div>
          </NavLink>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400">
          <NavLink 
            to="/" 
            className={({ isActive }) => `hover:text-amber-500 transition-colors py-1 ${isActive ? 'text-amber-500 border-b border-amber-500' : ''}`}
          >
            Home
          </NavLink>
          <NavLink 
            to="/products" 
            className={({ isActive }) => `hover:text-amber-500 transition-colors py-1 ${isActive ? 'text-amber-500 border-b border-amber-500' : ''}`}
          >
            Products
          </NavLink>
          <button 
            onClick={() => setDrawerOpen(true)}
            className="hover:text-amber-500 transition-colors py-1 cursor-pointer font-semibold text-xs text-zinc-400"
          >
            Cart
          </button>
          <NavLink 
            to="/billing" 
            className={({ isActive }) => `hover:text-amber-500 transition-colors py-1 ${isActive ? 'text-amber-500 border-b border-amber-500' : ''}`}
          >
            Billing
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => `hover:text-amber-500 transition-colors py-1 ${isActive ? 'text-amber-500 border-b border-amber-500' : ''}`}
          >
            About
          </NavLink>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          
          {/* Cart Quick Badge (Triggers Drawer) */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative p-2 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-305 hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Open Cart"
          >
            <ShoppingBag className="w-4 h-4 text-zinc-300" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-lg shadow-amber-500/20">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Admin Dashboard Entry button */}
          <button
            onClick={() => navigate(isAuthenticated ? '/admin/dashboard' : '/login')}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all cursor-pointer hover:shadow-lg shadow-amber-500/10 active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Portal'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Mobile Hamburger menu */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 p-4 space-y-3 flex flex-col text-xs font-bold">
          <NavLink 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2 hover:bg-zinc-900/60 rounded-xl"
          >
            <Home className="w-4 h-4 text-zinc-400" /> Home
          </NavLink>
          <NavLink 
            to="/products" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2 hover:bg-zinc-900/60 rounded-xl"
          >
            <ShoppingBag className="w-4 h-4 text-zinc-400" /> Products
          </NavLink>
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              setDrawerOpen(true);
            }}
            className="flex items-center gap-2 p-2 hover:bg-zinc-900/60 rounded-xl text-left w-full font-bold text-xs"
          >
            <ShoppingCart className="w-4 h-4 text-zinc-400" /> Cart
          </button>
          <NavLink 
            to="/billing" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2 hover:bg-zinc-900/60 rounded-xl"
          >
            <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M12 8v8M9 11h6" />
            </svg>
            Billing
          </NavLink>
          <NavLink 
            to="/about" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2 hover:bg-zinc-900/60 rounded-xl"
          >
            <Info className="w-4 h-4 text-zinc-400" /> About
          </NavLink>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate(isAuthenticated ? '/admin/dashboard' : '/login');
            }}
            className="flex items-center justify-center gap-1.5 w-full mt-2 py-2.5 rounded-xl text-center bg-amber-500 text-zinc-950 font-extrabold hover:bg-amber-400 transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
            {isAuthenticated ? 'Admin Dashboard' : 'Admin Portal'}
          </button>
        </div>
      )}

      {/* View Contents */}
      <main className="p-6 flex-grow max-w-7xl w-full mx-auto animate-in fade-in duration-300">
        <Outlet />
      </main>

      {/* Cart Drawer sliding view */}
      <CartDrawer />

      {/* Footer Info */}
      <footer className="p-6 border-t border-zinc-800/50 text-center text-[10px] font-bold text-zinc-550 uppercase tracking-widest bg-zinc-950/20">
        <span>ANAND STORES – Smart Retail Operating System © 2026. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default PublicLayout;
