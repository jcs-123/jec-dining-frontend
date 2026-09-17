import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CafeProvider } from './context/CafeContext';
import { CartProvider } from './context/CartContext';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public & Auth Pages
import { LandingPage } from './pages/public/LandingPage';
import { CustomerAuthPage } from './pages/auth/CustomerAuthPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Customer Pages
import { CafeMenuPage } from './pages/customer/CafeMenuPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { PaymentPage } from './pages/customer/PaymentPage';
import { OrderSuccessPage } from './pages/customer/OrderSuccessPage';
import { MyOrdersPage } from './pages/customer/MyOrdersPage';
import { OrderDetailPage } from './pages/customer/OrderDetailPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCombosPage } from './pages/admin/AdminCombosPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminPickupVerificationPage } from './pages/admin/AdminPickupVerificationPage';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CafeProvider>
            <CartProvider>
              <Routes>
                {/* 1. Public Landing Page */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<CustomerAuthPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* 2. Admin Login Routes for each Café */}
                <Route path="/jeccafe/admin/login" element={<AdminLoginPage />} />
                <Route path="/jec-bytest/admin/login" element={<AdminLoginPage />} />
                <Route path="/jec-bytes/admin/login" element={<Navigate to="/jec-bytest/admin/login" replace />} />

                {/* 3. Admin Protected Routes with Café Tenant Isolation */}
                <Route path="/:cafeSlug/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="combos" element={<AdminCombosPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="reports" element={<AdminReportsPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                  <Route path="verify-pickup/:orderId" element={<AdminPickupVerificationPage />} />
                </Route>
                <Route path="/admin/verify-pickup/:orderId" element={<AdminPickupVerificationPage />} />

                {/* 4. Customer Journey & Ordering Routes */}
                <Route element={<CustomerLayout />}>
                  {/* Café Menus */}
                  <Route path="/jeccafe" element={<CafeMenuPage />} />
                  <Route path="/jec-bytest" element={<CafeMenuPage />} />
                  <Route path="/jec-bytes" element={<Navigate to="/jec-bytest" replace />} />
                  <Route path="/cafe/:cafeSlug" element={<CafeMenuPage />} />

                  {/* Ordering & Checkout Flow */}
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/payment/:orderId" element={<PaymentPage />} />
                  <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                  <Route path="/my-orders" element={<MyOrdersPage />} />
                  <Route path="/order/:orderId" element={<OrderDetailPage />} />

                  {/* 404 within layout */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </CartProvider>
          </CafeProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
