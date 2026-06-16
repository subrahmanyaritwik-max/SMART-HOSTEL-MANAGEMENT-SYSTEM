// src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-sky-400 shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 dark:border-emerald-500/20';
      case 'warning':
        return 'border-amber-500/30 dark:border-amber-500/20';
      case 'error':
        return 'border-rose-500/30 dark:border-rose-500/20';
      case 'info':
      default:
        return 'border-sky-500/30 dark:border-sky-500/20';
    }
  };

  const getGlow = (type) => {
    switch (type) {
      case 'success':
        return 'shadow-emerald-500/10 dark:shadow-emerald-500/5';
      case 'warning':
        return 'shadow-amber-500/10 dark:shadow-amber-500/5';
      case 'error':
        return 'shadow-rose-500/10 dark:shadow-rose-500/5';
      case 'info':
      default:
        return 'shadow-sky-500/10 dark:shadow-sky-500/5';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
              className={`
                pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl
                glass-light dark:glass-dark shadow-2xl transition-all duration-300
                ${getBorderColor(toast.type)} ${getGlow(toast.type)}
              `}
            >
              {getIcon(toast.type)}
              <div className="flex-grow space-y-0.5 min-w-0">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 leading-normal break-words">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 transition-colors p-0.5 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
