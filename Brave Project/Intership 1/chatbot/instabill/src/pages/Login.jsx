// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Hexagon, Lock, Mail, AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fill email if remembered
    const rememberedEmail = localStorage.getItem('instabill_remembered_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email format (e.g., name@domain.com).';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Please fix validation errors before submitting.', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, rememberMe);
      addToast('Welcome back! Admin session established.', 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      addToast(err.message || 'Authentication failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    addToast('Forgot Password request triggered (UI Only). A reset link would be dispatched in a live backend.', 'info');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-zinc-950 text-white overflow-hidden p-4">
      {/* Premium Ambient Glow Backgrounds */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-bg-dark opacity-30 pointer-events-none" />

      {/* Login Box */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-dark border border-zinc-800/80 rounded-3xl p-8 backdrop-blur-2xl relative shadow-[0_0_50px_rgba(0,0,0,0.6)]">
          
          {/* Logo Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4 border border-amber-400/20 animate-float">
              <Hexagon className="w-7 h-7 fill-white/10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight text-white">ANAND STORES</h2>
            <p className="text-xs font-semibold text-amber-500 tracking-widest mt-1 uppercase">InstaBILL X Pro</p>
            <p className="text-zinc-400 text-[11px] mt-2 font-medium">Smart Retail Command Terminal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Admin Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="admin@instabill.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/80 border ${errors.email ? 'border-rose-500' : 'border-zinc-850'} text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all`}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Admin Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-900/80 border ${errors.password ? 'border-rose-500' : 'border-zinc-850'} text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between text-[11px] py-1">
              <label className="flex items-center gap-2 text-zinc-400 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-800 text-amber-500 bg-zinc-900 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                Remember Me
              </label>
              
              <a 
                href="#forgot-password" 
                onClick={handleForgotPassword}
                className="text-amber-500 hover:text-amber-400 hover:underline font-semibold"
              >
                Forgot Password?
              </a>
            </div>

            {/* Credentials Tip */}
            <div className="p-3 rounded-xl bg-amber-500/5 border border-dashed border-amber-500/10 text-[10px] text-amber-500 font-bold flex items-start gap-2 leading-relaxed">
              <KeyRound className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="uppercase tracking-wider">Demo Credentials:</p>
                <p className="font-mono mt-0.5">Email: admin@instabill.com / Pwd: admin123</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 rounded-xl font-bold text-xs tracking-wider text-zinc-950 bg-amber-500 hover:bg-amber-400
                transition-all duration-200 shadow-lg shadow-amber-500/15 active:scale-[0.98]
                flex items-center justify-center gap-2 cursor-pointer
                ${loading ? 'opacity-85 cursor-not-allowed' : ''}
              `}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>DECRYPTING CREDENTIALS...</span>
                </>
              ) : (
                <span>ACCESS ADMINISTRATIVE TERMINAL</span>
              )}
            </button>
          </form>

          {/* Public Area link */}
          <div className="mt-6 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <a href="/" className="hover:text-amber-500 transition-colors">← Back to public store</a>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;
