/**
 * src/App.js
 * Root — wraps everything in LanguageProvider so any component can call useLang().
 * Only change from the previous version: <LanguageProvider> added at the top.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth }         from './context/AuthContext';
import { LanguageProvider }              from './context/LanguageContext';

import Navbar         from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute     from './components/AdminRoute';

import Home            from './pages/Home';
import Login           from './pages/Login';
import Register        from './pages/Register';
import Products        from './pages/Products';
import AddProduct      from './pages/AddProduct';
import MyProducts      from './pages/MyProducts';
import EditProduct     from './pages/EditProduct';
import PlaceOrder      from './pages/PlaceOrder';
import MyOrders        from './pages/MyOrders';
import FarmerOrders    from './pages/FarmerOrders';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerProfile   from './pages/FarmerProfile';

import AdminDashboard  from './admin/AdminDashboard';
import AdminUsers      from './admin/AdminUsers';
import AdminProducts   from './admin/AdminProducts';
import AdminOrders     from './admin/AdminOrders';
import AdminApprovals  from './admin/AdminApprovals';
import AdminAnalytics  from './admin/AdminAnalytics';
import AdminFinance    from './admin/AdminFinance';
import AdminRoles      from './admin/AdminRoles';
import AdminAuditLogs  from './admin/AdminAuditLogs';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={
          user?.role === 'farmer' ? <Navigate to="/farmer-dashboard" />
          : user?.role === 'admin' ? <Navigate to="/admin" />
          : <Home />
        } />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Buyer / guest */}
        <Route path="/products" element={
          user?.role === 'farmer' ? <Navigate to="/my-products" /> : <Products />
        } />
        <Route path="/place-order/:productId" element={
          <ProtectedRoute role="buyer"><PlaceOrder /></ProtectedRoute>
        } />
        <Route path="/my-orders" element={
          <ProtectedRoute role="buyer"><MyOrders /></ProtectedRoute>
        } />

        {/* Farmer */}
        <Route path="/farmer-dashboard" element={
          <ProtectedRoute role="farmer"><FarmerDashboard /></ProtectedRoute>
        } />
        <Route path="/farmer-profile" element={
          <ProtectedRoute role="farmer"><FarmerProfile /></ProtectedRoute>
        } />
        <Route path="/add-product" element={
          <ProtectedRoute role="farmer"><AddProduct /></ProtectedRoute>
        } />
        <Route path="/my-products" element={
          <ProtectedRoute role="farmer"><MyProducts /></ProtectedRoute>
        } />
        <Route path="/edit-product/:productId" element={
          <ProtectedRoute role="farmer"><EditProduct /></ProtectedRoute>
        } />
        <Route path="/farmer-orders" element={
          <ProtectedRoute role="farmer"><FarmerOrders /></ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin"           element={<AdminRoute><AdminDashboard  /></AdminRoute>} />
        <Route path="/admin/users"     element={<AdminRoute><AdminUsers      /></AdminRoute>} />
        <Route path="/admin/products"  element={<AdminRoute><AdminProducts   /></AdminRoute>} />
        <Route path="/admin/orders"    element={<AdminRoute><AdminOrders     /></AdminRoute>} />
        <Route path="/admin/approvals" element={<AdminRoute><AdminApprovals  /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics  /></AdminRoute>} />
        <Route path="/admin/finance"   element={<AdminRoute><AdminFinance    /></AdminRoute>} />
        <Route path="/admin/roles"     element={<AdminRoute><AdminRoles      /></AdminRoute>} />
        <Route path="/admin/audit"     element={<AdminRoute><AdminAuditLogs  /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}