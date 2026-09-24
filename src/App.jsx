import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CafeProvider } from './context/CafeContext';
import { CartProvider } from './context/CartContext';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { SuperAdminLayout } from './layouts/SuperAdminLayout';

// Public & Auth Pages
import { LandingPage } from './pages/public/LandingPage';
import { CustomerAuthPage } from './pages/auth/CustomerAuthPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { SuperAdminLoginPage } from './pages/auth/SuperAdminLoginPage';
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
import { AdminItemsPage } from './pages/admin/AdminItemsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminPickupVerificationPage } from './pages/admin/AdminPickupVerificationPage';

// Super Admin Pages
import { SuperAdminDashboardPage } from './pages/super-admin/SuperAdminDashboardPage';
import { SuperAdminOrdersPage } from './pages/super-admin/SuperAdminOrdersPage';
import { SuperAdminReportsPage } from './pages/super-admin/SuperAdminReportsPage';
import { SuperAdminUsersPage } from './pages/super-admin/SuperAdminUsersPage';

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

                {/* 2. Admin Login Routes */}
                <Route path="/jeccafe/admin/login" element={<AdminLoginPage />} />
                <Route path="/jecbytes/admin/login" element={<AdminLoginPage />} />

                {/* 3. Super Admin Governance Routes */}
                <Route path="/super-admin/login" element={<SuperAdminLoginPage />} />
                <Route path="/superadmin/login" element={<Navigate to="/super-admin/login" replace />} />
                <Route path="/super-admin" element={<SuperAdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<SuperAdminDashboardPage />} />
                  <Route path="orders" element={<SuperAdminOrdersPage />} />
                  <Route path="reports" element={<SuperAdminReportsPage />} />
                  <Route path="users" element={<SuperAdminUsersPage />} />
                </Route>
                <Route path="/superadmin" element={<Navigate to="/super-admin/dashboard" replace />} />

                {/* 3. Admin Protected Routes with Café Tenant Isolation */}
                <Route path="/:cafeSlug/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="combos" element={<AdminCombosPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="items" element={<AdminItemsPage />} />
                  <Route path="reports" element={<AdminReportsPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                  <Route path="verify-pickup/:orderId" element={<AdminPickupVerificationPage />} />
                </Route>
                <Route path="/admin/verify-pickup/:orderId" element={<AdminPickupVerificationPage />} />

                {/* 4. Customer Journey & Ordering Routes */}
                <Route element={<CustomerLayout />}>
                  {/* Café Menus */}
                  <Route path="/jeccafe" element={<CafeMenuPage />} />
                  <Route path="/jecbytes" element={<CafeMenuPage />} />
                  <Route path="/jec-bytes" element={<Navigate to="/jecbytes" replace />} />
                  <Route path="/jec-bytest" element={<Navigate to="/jecbytes" replace />} />
                  <Route path="/bytes" element={<Navigate to="/jecbytes" replace />} />
                  <Route path="/cafe/:cafeSlug" element={<CafeMenuPage />} />

                  {/* Ordering & Checkout Flow */}
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/payment/:orderId" element={<Navigate to="/my-orders" replace />} />
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
