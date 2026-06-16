// src/components/common/TopNavbar.jsx
import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { 
  Bell, 
  ShoppingBag, 
  Sun, 
  Moon, 
  ChevronDown, 
  LogOut, 
  Trash2,
  PlayCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

export const TopNavbar = ({ sidebarOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { 
    cart, 
    notifications, 
    markNotificationAsRead, 
    clearNotifications, 
    setDrawerOpen,
    demoActive,
    setDemoActive
  } = useStore();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header 
      className={`
        sticky top-0 right-0 z-20 h-16
        transition-all duration-300
        glass-navbar-dark
        flex items-center justify-between px-6
      `}
    >
      {/* Brand Label */}
      <div className="flex items-center gap-4">
        <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
          <span>ANAND STORES</span>
          <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            InstaBILL X Pro
          </span>
        </h1>
        
        {user && (
          <span className="hidden lg:block text-xs font-semibold text-zinc-400 border-l border-zinc-800 pl-4">
            Welcome, <span className="text-amber-400 font-bold">{user.name}</span>
          </span>
        )}

        {/* Quick Demo Mode Trigger in Topbar */}
        <button
          onClick={() => setDemoActive(!demoActive)}
          className={`
            hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-all duration-300 cursor-pointer
            ${demoActive 
              ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-md shadow-purple-500/5 animate-pulse' 
              : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }
          `}
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>{demoActive ? 'Demo Active' : 'Start Demo Tour'}</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        
        {/* Cart Quick Badge (Triggers Drawer) */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="relative p-2 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-405 hover:bg-zinc-850 hover:text-white transition-colors cursor-pointer"
          title="Open Cart"
        >
          <ShoppingBag className="w-4 h-4 text-zinc-300" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-lg shadow-amber-500/20">
              {cartItemsCount}
            </span>
          )}
        </button>

        {/* Notifications Center */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="relative p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 text-zinc-550 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 text-zinc-650 dark:text-zinc-300" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl p-4 z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/60 mb-2">
                <span className="font-bold text-xs text-zinc-850 dark:text-white">Alerts Center</span>
                {notifications.length > 0 && (
                  <button 
                    onClick={clearNotifications}
                    className="text-xs text-rose-500 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                )}
              </div>
              
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-center text-zinc-500 py-6">No recent alerts</p>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`
                        p-2.5 rounded-xl border text-xs cursor-pointer transition-all
                        ${notif.read 
                          ? 'bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-100 dark:border-zinc-800/30 text-zinc-500' 
                          : 'bg-amber-500/5 dark:bg-amber-500/5 border-amber-500/20 text-zinc-800 dark:text-zinc-200 font-medium'
                        }
                        hover:border-zinc-300 dark:hover:border-zinc-700
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <p className="flex-grow pr-2">{notif.message}</p>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <span className="text-[9px] text-zinc-400 mt-1 block">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {user ? (
              <div className="w-6 h-6 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <img src={user.avatar} alt="admin-avatar" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
                U
              </div>
            )}
            <span className="text-xs font-bold text-zinc-750 dark:text-zinc-300 hidden md:block">
              {user ? user.name : 'User'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          </button>

          {profileOpen && user && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl p-2 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-zinc-100 dark:border-zinc-800/60 mb-1">
                <p className="text-[10px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider">{user.role}</p>
                <p className="text-sm font-bold text-zinc-800 dark:text-white truncate mt-0.5">{user.name}</p>
                <p className="text-[10px] text-amber-500 font-bold mt-0.5">{user.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-rose-655 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default TopNavbar;
