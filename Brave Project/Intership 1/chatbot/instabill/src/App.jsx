// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import MainLayout from './pages/MainLayout';
import PublicLayout from './pages/PublicLayout';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProtectedRoute from './components/common/ProtectedRoute';

// Views for routes
import ProductCatalog from './components/inventory/ProductCatalog';
import POSCheckout from './components/checkout/POSCheckout';
import InventoryEngine from './components/inventory/InventoryEngine';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import CustomerIntelligence from './components/crm/CustomerIntelligence';
import About from './pages/About';

// Import newly consolidated AdminDashboard component
import AdminDashboard from './components/dashboard/AdminDashboard';

// Guard for login page: Redirects authenticated users to admin dashboard
const LoginRouteGuard = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white font-mono text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-bold tracking-widest text-zinc-400 uppercase">Synchronizing nodes...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Login />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <StoreProvider>
          <BrowserRouter>
            <Routes>
              {/* Public customer facing routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductCatalog />} />
                <Route path="/cart" element={<Navigate to="/products?drawer=true" replace />} />
                <Route path="/billing" element={<POSCheckout />} />
                <Route path="/about" element={<About />} />
              </Route>

              {/* Login route */}
              <Route path="/login" element={<LoginRouteGuard />} />

              {/* Protected admin command console routes */}
              <Route path="/admin" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="edit-product/:id" element={<EditProduct />} />
                <Route path="inventory" element={<InventoryEngine />} />
                <Route path="analytics" element={<AnalyticsDashboard />} />
                <Route path="customers" element={<CustomerIntelligence />} />
                <Route path="about" element={<About />} />
              </Route>

              {/* Wildcard Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </StoreProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
