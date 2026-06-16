// src/pages/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { TopNavbar } from '../components/common/TopNavbar';
import { useStore } from '../context/StoreContext';
import CartDrawer from '../components/common/CartDrawer';
import { 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles,
  X
} from 'lucide-react';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    demoActive, 
    setDemoActive, 
    demoStep, 
    setDemoStep, 
    demoSteps,
    nextDemoStep,
    prevDemoStep,
    addNotification,
    setDrawerOpen
  } = useStore();

  // Listen for ?drawer=true in the URL parameters to open the drawer
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('drawer') === 'true') {
      setDrawerOpen(true);
      // Clean up search query parameter
      navigate(location.pathname, { replace: true });
    }
  }, [location, setDrawerOpen, navigate]);

  // Listen to active tab shifts from demo state during presentation tour
  useEffect(() => {
    if (demoActive && demoSteps[demoStep]) {
      const stepPath = demoSteps[demoStep].path;
      
      // Map demo steps to their route paths
      let targetPath = stepPath;
      if (stepPath === '/admin') {
        targetPath = '/admin/customers';
      } else if (stepPath === '/billing') {
        targetPath = '/billing';
      } else if (stepPath === '/billing?viewReceipt=true') {
        targetPath = '/billing'; // POSCheckout handles receipt query parameters
      } else if (stepPath.startsWith('/')) {
        // If it starts with slash but isn't prefixed with /admin, prefix it if it is a protected view
        if (['/dashboard', '/inventory', '/analytics'].includes(stepPath)) {
          targetPath = `/admin${stepPath}`;
        }
      }
      
      navigate(targetPath);
    }
  }, [demoStep, demoActive, demoSteps, navigate]);

  const currentStep = demoSteps[demoStep];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 transition-colors duration-300">
      
      {/* Sidebar navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      {/* Main viewport canvas */}
      <div 
        className={`
          transition-all duration-300 min-h-screen flex flex-col justify-between
          ${sidebarOpen ? 'pl-64' : 'pl-20'}
        `}
      >
        {/* Sticky top header */}
        <TopNavbar 
          sidebarOpen={sidebarOpen} 
        />

        {/* View contents loaded via React Router Outlet */}
        <main className="p-6 flex-grow max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          <Outlet />
        </main>

        {/* Cart Drawer sliding view */}
        <CartDrawer />

        {/* Footer info */}
        <footer className="p-6 border-t border-zinc-200/50 dark:border-zinc-800/50 text-center text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest bg-white/20 dark:bg-zinc-950/20">
          <span>ANAND STORES – Smart Retail Operating System © 2026. All rights reserved.</span>
        </footer>
      </div>

      {/* PERSISTENT FLOATING DEMO STEPS OVERLAY */}
      {demoActive && currentStep && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4">
          <div className="glass-light dark:glass-dark border border-purple-500/30 p-4 rounded-2xl shadow-[0_10px_40px_rgba(168,85,247,0.2)] backdrop-blur-xl animate-in slide-in-from-bottom-6 duration-300">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-zinc-800 dark:text-white">
                  Presentation Tour: Step {demoStep + 1} of {demoSteps.length}
                </h4>
              </div>
              <button 
                onClick={() => {
                  setDemoActive(false);
                  addNotification('info', 'Presentation tour exited.');
                }}
                className="p-0.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-450 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-extrabold text-purple-500">{currentStep.title}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                {currentStep.desc}
              </p>
            </div>

            {/* Steps Progress Indicator */}
            <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${((demoStep + 1) / demoSteps.length) * 100}%` }}
              />
            </div>

            {/* Navigation Steppers */}
            <div className="flex items-center justify-between mt-3.5">
              <button
                onClick={prevDemoStep}
                disabled={demoStep === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-550 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-3 h-3" /> Back
              </button>

              <div className="flex gap-1">
                {demoSteps.map((_, idx) => (
                  <span 
                    key={idx} 
                    onClick={() => setDemoStep(idx)}
                    className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${
                      idx === demoStep ? 'bg-purple-500 w-3' : 'bg-zinc-305 dark:bg-zinc-700'
                    }`} 
                  />
                ))}
              </div>

              {demoStep === demoSteps.length - 1 ? (
                <button
                  onClick={() => {
                    setDemoActive(false);
                    addNotification('success', 'Presentation completed! Excellent retail flow verified.');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500 text-white text-[10px] font-bold hover:bg-purple-400 transition-colors cursor-pointer"
                >
                  Complete <Check className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={nextDemoStep}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500 text-white text-[10px] font-bold hover:bg-purple-400 transition-colors cursor-pointer"
                >
                  Next <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MainLayout;
